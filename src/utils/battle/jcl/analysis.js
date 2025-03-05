/**
 * 这个文件负责分析parse后的logs或者format之后的rows
 * 得出一些顶层结论
 */
import { singleLogFormat, entityFormat, entityName } from "@/utils/battle/jcl/format.js";
import { uniq } from "lodash";

/**
 *  返回一个日志里面的时间参数
 */
export function getLogTime(log) {
    return { s: log.s, f: log.f, m: log.m };
}

/**
 * 有些JCL文件实在是太大了！性能瓶颈在于重复的遍历rows/logs，感觉都不止O(n^2)了
 * 所以需要在一轮遍历中，得到所有需要使用的结果，优化到O(n)
 * 后续分析新的结果/修改逻辑也需要尽量在一轮循环中完成
 * TODO: 需要加一个重要事件列表，用于PVP的时间轴，需要整理好的数据
 */
export function* analysis(logs, start) {
    // 返回的事件记录，用于展示表格
    let rows = [];
    // 返回的单位列表，用于其他功能使用以及单位列表
    let entities = {};
    // 每5s为一个窗口，对单位进行统计
    let entityStat = {
        damage: {}, //输出
        treat: {}, //治疗
        beDamaged: {}, //承伤
        beTreated: {}, //承疗
    };
    // 用于记录单位身上的buff
    let entityBuff = {};
    // 用于记录单位释放技能
    let entitySkill = {};
    let entitySay = {};
    let entityScene = {};
    let entityDeath = {};
    // 资源列表，是从logs获得的/需要解析的资源，包括技能，Buff等
    let resourceList = {
        skill: [],
        buff: [],
    };
    let last_log = logs.at(-1);
    let end = getLogTime(last_log);
    end = {
        s: end.s - start.s,
        f: end.f - start.s,
        m: end.m - start.m,
    };
    let client = "std";
    let map = null;

    // 一堆临时变量
    let _enterSceneCount = {}; //用于同模板NPC出现次数计数
    let _firstAppearTimeUpdated = {}; //用于记录NPC的首次出现时间是否已更新
    let _globalSays = []; //用于暂存全局喊话事件
    // 封装一些方法，防止面条拉太长Orz

    /**
     * 资源统计
     */
    const addResource = (row) => {
        if (row.content.t == "skill") resourceList.skill.push(row.content.v);
        if (row.content.t == "buff") resourceList.buff.push(row.content.v);
    };

    /**
     * 刷新一个单位的buff列表
     */
    const updateEntityBuff = (entityID, row) => {
        if (!entityBuff[entityID]) entityBuff[entityID] = {};
        // 结算一遍当前单位身上的所有buff
        for (let buffIndex in entityBuff[entityID]) {
            let buff = entityBuff[entityID][buffIndex];
            if (buff.cur && buff.cur.end < row.micro) {
                // 已经超过时间，cur里面清掉，丢进logs
                buff.logs.push(buff.cur);
                buff.cur = null;
            }
        }
        if (row.content?.t != "buff") return;
        let buffIndex = row.content.v;
        let stack = row.content.n;
        if (!entityBuff[entityID][buffIndex]) entityBuff[entityID][buffIndex] = { cur: null, logs: [] };
        let eb = entityBuff[entityID][buffIndex];
        let detail = row.__log;
        if (!detail.d) {
            //如果是给BUFF
            let endMicro = ((detail.e - start.f) / 16) * 1000;
            if (!eb.cur) {
                //如果身上没有这个BUFF
                let source = entities[row.source?.v];
                let newBuff = {
                    source: entityName(source),
                    deleteBy: null,
                    start: row.micro,
                    end: endMicro,
                    shouldEnd: endMicro,
                    id: buffIndex,
                    stack: stack,
                    stackLogs: { [row.micro]: stack },
                };
                eb.cur = newBuff;
            } else {
                //如果身上已经有这个buff
                eb.cur.end = endMicro;
                eb.cur.shouldEnd = endMicro;
                if (stack != eb.cur.stack) {
                    eb.cur.stack = stack;
                    eb.cur.stackLogs[row.micro] = stack;
                }
            }
        } else {
            //如果是卸除BUFF
            if (!eb.cur) return;
            let buff = eb.cur;
            let source = entities[row.source?.v];
            buff.end = row.micro;
            buff.deleteBy = entityName(source);
            eb.logs.push(buff);
            eb.cur = null;
        }
    };
    /**
     * 分析结束，把单位身上buff的cur里面的东西丢进logs
     */
    const endEntityBuff = () => {
        for (let eid in entityBuff) {
            for (let bid in entityBuff[eid]) {
                let buff = entityBuff[eid][bid];
                if (buff.cur) {
                    buff.cur.end = end.m;
                    buff.logs.push(buff.cur);
                    buff.cur = null;
                }
            }
        }
    };
    /**
     * 清除过期buff之后，获取一个单位身上的buff，返回值为一个字符串列表
     */
    const getEntityBuff = (entityID, nowMicro) => {
        // 如果目标身上没有buff，直接返回空列表
        if (!entityBuff[entityID]) return [];
        // 获取BUFF之前先更新一下角色的BUFF列表
        updateEntityBuff(entityID, { micro: nowMicro });
        // 以 id*层数 的形式
        let result = [];
        for (let buffIndex in entityBuff[entityID]) {
            if (entityBuff[entityID][buffIndex].cur) {
                result.push(`${buffIndex}*${entityBuff[entityID][buffIndex].cur.stack}`);
            }
        }
        return result;
    };
    /**
     * 更新一个单位的一项统计，并且以5s一个窗口搓一个伤害的展示图
     */
    const updateEntityStatItem = (entityID, row, type) => {
        let _entityStat = entityStat[type];
        if (!_entityStat[entityID]) {
            _entityStat[entityID] = {
                all: {
                    value: 0,
                    count: 0,
                    criticalCount: 0,
                    time: 0,
                    max: Number.MIN_SAFE_INTEGER,
                    min: Number.MAX_SAFE_INTEGER,
                    details: [],
                },
                windows: {},
            };
            if (type == "treat") {
                _entityStat[entityID].all.total = 0; //治疗总量（虚条）
            }
        }
        // ========= 先准备好要用的数据，避免后面重复计算导致代码长度++ ==========
        let log = row.__log;
        let value;
        let total = 0; //治疗总量
        if (type == "damage" || type == "beDamaged") {
            value = log.v[13];
        } else if (type == "treat" || type == "beTreated") {
            value = log.v[14];
            total = log.v[6];
        }
        // 技能效果的ID
        let effectID = `${log.T == 1 ? "skill" : "buff"}:${log.i}_${log.l}`;

        // 本次统计的细节
        let detail = {
            c: row.__log.c, //来源
            t: row.__log.t, //目标
            v: value, //伤害值
            b: getEntityBuff(entityID, row.micro), //当前单位身上的BUFF
            C: row.__log.C ? 1 : 0, //是否暴击
            m: row.micro, //当前毫秒数
            e: effectID, //伤害效果的ID
        };
        if (type == "treat") detail.T = total; // 统计治疗虚条
        // ========= 以下是更新统计，太乱了，而且很长，很不优雅Orz =========
        // ====== 更新总统计
        let _all = _entityStat[entityID].all;
        _all.value += value;
        _all.count += 1;
        _all.time = row.micro;
        _all.max = Math.max(_all.max, value);
        _all.min = Math.min(_all.min, value);
        if (log.C) _all.criticalCount += 1;
        _all.details.push(detail);
        if (type == "treat") _all.total += total; // 统计治疗虚条
        // ====== 更新窗口统计
        let windowId = Math.ceil(row.micro / 5000) * 5;
        if (!_entityStat[entityID].windows[windowId]) {
            // 如果这个窗口还没有，就新建一个
            _entityStat[entityID].windows[windowId] = {
                max: Number.MIN_SAFE_INTEGER,
                min: Number.MAX_SAFE_INTEGER,
                value: 0,
                count: 0,
                criticalCount: 0,
                details: [],
            };
            if (type == "treat") _entityStat[entityID].windows[windowId].total = total; // 统计治疗虚条
        }
        let _window = _entityStat[entityID].windows[windowId];
        _window.value += value;
        _window.count += 1;
        _window.max = Math.max(_window.max, value);
        _window.min = Math.min(_window.min, value);
        if (log.C) _window.criticalCount += 1;
        _window.details.push(detail);
        if (type == "treat") _window.total += total; // 统计治疗虚条
    };
    /**
     * 传入一个row，更新跟row有关的所有单位的统计数据（dps/伤害/承伤/承疗等）
     */
    const updateEntityStat = (row) => {
        if (row.__log.v.hasOwnProperty(13) && row.__log.v[13] != 0) {
            updateEntityStatItem(row.__log.c, row, "damage"); // 更新打人的伤害统计
            updateEntityStatItem(row.__log.t, row, "beDamaged"); // 更新被打的承伤统计
        }
        if (row.__log.v.hasOwnProperty(6) && row.__log.v[6] != 0) {
            updateEntityStatItem(row.__log.c, row, "treat"); // 更新奶人的人治疗统计
            if (row.__log.v[14] != 0) {
                updateEntityStatItem(row.__log.t, row, "beTreated"); // 更新被奶的承疗统计，仅在有效治疗时统计
            }
        }
    };
    /**
     * 更新某一个单位的技能统计
     */
    const updateEntitySkillCount = (entityID, row) => {
        if (row.content.t == "buff") return; // BUFF造成的伤害不参与统计
        // 如果没有记录过该单位放的技能就先初始化对象
        if (!entitySkill[entityID]) {
            entitySkill[entityID] = {
                skills: {},
                logs: [],
            };
        }
        let data = entitySkill[entityID];
        const typeMap = {
            19: "cast",
            24: "miss",
        };
        const type = typeMap[row.type] || "hit";
        const id = row.content.v;
        const micro = row.micro;
        const target = row.target.v;
        // 如果这个技能还没有记录过，就初始化一个
        if (!data.skills[id]) {
            data.skills[id] = {
                last: {
                    hit: null,
                    cast: null,
                    miss: null,
                },
            };
        }
        let skillData = data.skills[id];
        // 如果上一次同类型的事件发生在1s内，认为是同一次事件的AOE/闪避之类的触发的事件，不计数
        if (skillData.last[type] && Math.abs(skillData.last[type].time * 1000 - micro) < 1000) {
            skillData.last[type].count += 1;
            skillData.last[type].targets.push(target);
            return;
        }
        // 如果不是同一次事件，就另起一个对象，并且技能计数+1；
        // 这个对象会同时放进logs里面以及作为skills里的last
        const log = {
            time: micro / 1000,
            type,
            id,
            targets: [target],
            count: 1,
        };
        skillData.last[type] = log;
        data.logs.push(log);
    };
    /**
     * 更新某一个单位的死亡/击杀
     */
    const updateEntityDeath = (row) => {
        let entityID = row.__log.i;
        let killer = row.__log.k;
        let entity = entities[entityID];
        let killerEntity = entities[killer];
        if (!entityDeath[entityID] && entity) {
            entityDeath[entityID] = {
                kill: 0,
                death: 0,
                logs: [],
            };
        }
        if (!entityDeath[killer] && killerEntity) {
            entityDeath[killer] = {
                kill: 0,
                death: 0,
                logs: [],
            };
        }
        // =============
        if (entity) {
            let _death = entityDeath[entityID];
            _death.death += 1;
            _death.logs.push({
                time: row.micro / 1000,
                type: "death",
                id: killer,
            });
        }
        if (killerEntity) {
            let _killer = entityDeath[killer];
            _killer.kill += 1;
            _killer.logs.push({
                time: row.micro / 1000,
                type: "kill",
                id: entityID,
            });
        }
    };

    /**
     * 更新单位出现/消失的事件列表
     */
    const updateEntityScene = (entityID, row) => {
        if (!entityScene[entityID]) {
            entityScene[entityID] = [];
        }
        entityScene[entityID].push({
            content: [2, 6].includes(row.type) ? "出现" : "消失",
            time: row.micro / 1000,
        });
    };
    /**
     * NPC说话事件/系统提示更新
     */
    const updateEntitySay = (entityID, row) => {
        const typeMap = {
            14: "NPC喊话",
            15: "系统警告框",
            /* 16: '系统提示', */
        };
        if (!entitySay[entityID]) {
            entitySay[entityID] = [..._globalSays];
        }
        let log = {
            type: typeMap[row.type],
            content: row.content.v,
            time: row.micro / 1000,
        };
        entitySay[entityID].push(log);
        // 系统的消息存进全局的
        if (row.type === 15 || row.type === 18) {
            _globalSays.push(log);
        }
    };
    // 更新玩家分队
    const updateEntityTeam = (row) => {
        // 先拿到两个单位
        let source = entities[row.source.v];
        let target = entities[row.target.v];
        // 只有两个单位都拿到了，并且都是玩家，并且其中至少一个人的队伍还不确定才可以判断
        if (
            source &&
            target &&
            source.type == "player" &&
            target.type == "player" &&
            (!source.hasOwnProperty("team") || !target.hasOwnProperty("team"))
        ) {
            // 如果事件来源没有队伍
            if (!source.hasOwnProperty("team")) {
                // 如果事件目标没队伍，需要先给目标一个初始的队伍
                if (!target.hasOwnProperty("team")) {
                    target.team = true;
                }
                // 事件目标有队伍，可以根据伤害判断出来源的队伍
                if (row.value["治疗"] > 0) source.team = target.team;
                if (row.value["有效伤害"] > 0) {
                    source.team = !target.team;
                }
            } else {
                // 事件来源有队伍，只需要判断目标的队伍
                if (row.value["治疗"] > 0) target.team = source.team;
                if (row.value["有效伤害"] > 0) {
                    target.team = !source.team;
                    if (target.id == 536874673) {
                        console.log(row.value, source.team, target.team);
                    }
                }
            }
        }
    };

    // 一轮遍历
    let length = logs.length;
    for (let i = 0; i < length; i++) {
        // 把log转化为表格用的row
        if (i % 1000 === 0) yield (i / length) * 100;
        let log = logs[i];
        let row = singleLogFormat(log);
        rows.push(row);

        // 资源列表处理，如果包含skill/buff资源需要添加进resourceList
        addResource(row);
        // 如果文件是怀旧服的文件，客户端标记成origin/ 用于资源读取
        if (log.t === 1) {
            let _client = log.d.c;
            if (_client === "classic_yq" || _client === "classic_exp") client = "origin";
            if (log.d.i === false) end = getLogTime(log);
            map = log.d.m;
        }
        // 玩家/npc出现事件，如果entity没有就先放进
        if (log.t === 2 || log.t === 6) {
            // 第一次遇到这个ID的出现记录需要刷新首次出现时间
            if (!_firstAppearTimeUpdated[log.d.i]) {
                let time = getLogTime(log);
                _firstAppearTimeUpdated[log.d.i] = time;
                if (entities[log.d.i]) entities[log.d.i].firstAppear = time;
            }
            updateEntityScene(log.d.i, row);
        }
        if (log.t === 3 || log.t === 7) {
            updateEntityScene(log.d.i, row);
        }
        // 玩家信息。需要把信息添加进entities
        if (log.t === 4) {
            if (log.d.m === -1) continue; // 无效的玩家信息,可能是焚影
            if (entities[log.d.i]) {
                // 已经记录的玩家不再记录，但是可以用于刷新原来没有的数据。比如奇穴啥的
                let oldLog = entities[log.d.i];
                let newLog = entityFormat(Object.assign({}, { type: "player" }, log.d));
                if (Object.values(oldLog.talents).length == 0) oldLog.talents = newLog.talents;
                if (!oldLog.equips?.length) oldLog.equips = newLog.equips;
                continue;
            }
            let firstAppear = getLogTime(log);
            let entity = entityFormat(Object.assign({}, { type: "player", firstAppear }, log.d));
            entities[log.d.i] = entity;
        }
        // NPC信息事件。需要把信息添加进entities，并且更新首次出现时间
        if (log.t === 8) {
            let id = log.d.i;
            if (entities[id]) continue; //已经记录的NPC不再记录
            // 如果已经有NPC出现的记录就直接用那个记录的事件，没有的话就用当前事件的事件
            let firstAppear = _firstAppearTimeUpdated[id] ? _firstAppearTimeUpdated[id] : getLogTime(log);
            // 同模板npc出现次序的记录
            let templateID = log.d.t;
            if (_enterSceneCount[templateID] === undefined) _enterSceneCount[templateID] = 0;
            let appearOrder = ++_enterSceneCount[templateID];
            let entity = entityFormat(Object.assign({}, { type: "npc", firstAppear, appearOrder }, log.d));
            entities[id] = entity;
        }
        // buff事件
        if (log.t === 13) {
            // 插入双方事件列表
            updateEntityBuff(log.d.t, row); //统计单位伤害曲线用
        }
        // 技能读条事件
        if (log.t === 19) {
            updateEntitySkillCount(log.d.i, row); //统计技能数用
        }
        // 技能造成影响事件
        if (log.t === 21) {
            updateEntityStat(row); //单位数据统计
            updateEntitySkillCount(log.d.c, row); //单位技能统计
            updateEntityTeam(row); //单位分队统计
        }
        // 命中未命中等乱七八糟的事件
        if ([22, 23, 24, 25, 26].includes(log.t)) {
            updateEntitySkillCount(log.d.c, row); //统计技能数用
        }
        if ([14, 15].includes(log.t)) {
            updateEntitySay(log.d.i, row);
        }
        if ([28].includes(log.t)) {
            updateEntityDeath(row);
        }
    }
    endEntityBuff();
    // 资源列表需要去重
    for (let key in resourceList) {
        resourceList[key] = uniq(resourceList[key]);
    }
    return {
        start,
        end,
        client,
        map,
        rows,
        entities,
        entityBuff,
        entitySkill,
        entitySay,
        entityScene,
        entityStat,
        entityDeath,
        resourceList,
    };
}

/**
 * 用于新功能PVP的播放，思索了一下，如果用原来的方式的话，得把每一个时刻的数据都整理好
 * 感觉有点烧用户内存，所以通过一个generator来实现，每次只返回一定时间段的变化
 * 当然重放需要先得到analysis的一些基础结果，所以需要传入上面的analysis的结果
 * @param {Object} store
 * @param {Number} timeStep
 * @returns {Generator}
 */
export function* replay(store, timeStep) {
    // 先拿到store里的信息
    const { rows, start, client, end, entities } = store ?? {};
    if (!rows) return null;
    // 初始化完毕之后需要返回一份基础的数据
    let initResult = {
        time: 0, // 当前战斗时间数
        entities: {
            111: {
                // 单位ID作为键
                id: "111", // 单位ID
                type: "player", // 单位类型
                name: "咕咕咕", // 单位名称
                mount: 10054, // 单位心法
                position: [0, 0, 0], // 单位位置
                health: [100, 100], // 单位血量
                mana: [100, 100], // 单位蓝量
                buffs: [], // 单位身上的buff
            },
        },
        stats: {
            // 伤害、承伤、治疗、承疗等统计
            damage: {
                111: {
                    total: 100, // 总伤害
                    count: 10, // 总次数
                    criticalCount: 2, // 暴击次数
                    logs: [
                        //...
                    ],
                },
            },
            // ...
        },
        logs: [],
        renderItem: [],
    };
    yield initResult;
    for (let row of rows) {
    }
    return true;
}
