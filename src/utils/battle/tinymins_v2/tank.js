import { getStatusData} from "./skill";

// 承伤统计分析
export function getBeDamage(raw){
    let data = raw.BE_DAMAGE;

    // 该场战斗所有玩家的数据 {player_id:xxx}
    let exactData = data[4];

    // 遍历每一个玩家的具体情况
    let playerBeDamage = {};

    for (let item in exactData) {
        let _ = exactData[item]; //对应DK_REC.STAT
        playerBeDamage[item] = {
            total: _[2], //总有效伤害（即排除未命中的）
            dps: parseInt(_[2] / raw.TIME_DURING), //计算得出的秒伤
            overview: getStatusData(_[3]), //状态饼图次数统计、对应DK_REC_STAT.DETAIL
            skills: _[4], //技能数据、对应DK_REC_STAT.SKILL
            targets: JSON.stringify({ data: _[5] }), //目标数据（团长用于查打没打小怪）、对应DK_REC_STAT.TARGET
        };
    }

    // 团队伤害总览
    let overview = {
        total: data[3], //团队总伤害
        dps: parseInt(data[3] / raw.TIME_DURING), //团队秒伤
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    };

    return { overview, playerData: playerBeDamage };
}

// 化解统计分析
export function getAbsorb(raw){
    let data = raw.ABSORB;

    // 该场战斗所有玩家的数据 {player_id:xxx}
    let exactData = data[4];

    // 遍历每一个玩家的具体情况
    let playerAbsorb = {};

    for (let item in exactData) {
        let _ = exactData[item]; //对应DK_REC.STAT
        playerAbsorb[item] = {
            total: _[2], //总有效伤害（即排除未命中的）
            dps: parseInt(_[2] / raw.TIME_DURING), //计算得出的秒伤
            overview: getStatusData(_[3]), //状态饼图次数统计、对应DK_REC_STAT.DETAIL
            skills: _[4], //技能数据、对应DK_REC_STAT.SKILL
            targets: JSON.stringify({ data: _[5] }), //目标数据（团长用于查打没打小怪）、对应DK_REC_STAT.TARGET
        };
    }

    // 团队伤害总览
    let overview = {
        total: data[3], //团队总伤害
        dps: parseInt(data[3] / raw.TIME_DURING), //团队秒伤
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    };

    return { overview, playerData: playerAbsorb };
}

// 死亡或掉线分析模块
export function getDeathInfo(raw){
    let data = raw.AWAYTIME

    const nameList = raw.NAME_LIST;

    let result = [];
    let total = 0; // 死亡/离线/掉线 总次数

    // 遍历每一个玩家的具体情况
    // value Object
    Object.entries(data).forEach(([key, value]) => {
        const name = nameList[key];

        const obj = {
            name,
            id: key,
            arr: []
        }

        for (const _key in value) {
            const trigger = value[_key][1]; // 触发时间
            const stop = value[_key][2];
            const type = value[_key][3];

            obj.arr.push({
                trigger,
                stop,
                type
            })
            total++;
        }

        result.push(obj);
    });

    let overview = {
        total,
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    }

    return { overview, playerData: result };
}
