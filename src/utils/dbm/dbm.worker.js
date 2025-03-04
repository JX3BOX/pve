import { Buffer } from "buffer";
import { cloneDeep, uniq, uniqBy } from "lodash";
import iconv from "iconv-lite";
import dayjs from "dayjs";
import chardet from "chardet";
import { serializer } from "luadata";
import { toJx3dat, readJx3dat } from "@/utils/dbm/jx3dat";

import { types } from "@/assets/data/dbm/types";
import defaultItem from "@/assets/data/dbm/default_item";

import {
    generateMeta,
    mergePayload,
    checkPayloadConflict,
    readFile,
    parseLua,
    getPkgMeta,
    removePayloadsAboutItemInPkg,
    findAllPayloadsAboutPayloadInPkg,
} from "@/utils/dbm/parse";
import { sleep, hashObject } from "@/utils/dbm/common";
import { extendItem, prepToLua } from "@/utils/dbm/item.js";

import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __node } = JX3BOX;

const resolve_type_map = {
    B: "buff",
    N: "npc",
    S: "skill",
    D: "doodad",
};
const type_db_map = {
    BUFF: "buff",
    DEBUFF: "buff",
    CASTING: "skill",
    NPC: "npc",
    DOODAD: "doodad",
};
const type_primary_key_map = {
    BUFF: "BuffID",
    DEBUFF: "BuffID",
    CASTING: "SkillID",
    NPC: "ID",
    DOODAD: "ID",
};
const type_fields_map = {
    BUFF: ["BuffID", "Level", "IconID", "Name", "Remark", "BuffName"],
    DEBUFF: ["BuffID", "Level", "IconID", "Name", "Remark", "BuffName"],
    CASTING: ["SkillID", "Level", "IconID", "Name", "Remark", "SkillName"],
    NPC: ["ID", "Name", "Title"],
    DOODAD: ["ID", "Name", "BarText"],
};

const postProgress = (message, progress, options) => {
    postMessage({
        type: "progress",
        data: {
            message,
            progress,
            options,
        },
    });
};

const postResult = (data, from, ...other) => {
    console.log(`[dbm.worker] return result : `, data);
    postMessage(
        {
            type: "result",
            from,
            data,
        },
        ...other
    );
};

const parse_result = ["", ""];
const parse_pkg = ["", ""];

const parse = async ({ file, buffer }, index = 0) => {
    postProgress("🧭 读取文件...", 0);
    if (!buffer) buffer = Buffer.from(await readFile(file));
    else buffer = Buffer.from(buffer);
    postProgress("done", 10, { append: true });

    postProgress("👩🏼‍💻 编码转换...");
    let content;
    // 尝试使用jx3dat解析
    try {
        content = readJx3dat(buffer).content;
    } catch (e) {}
    // 如果没有结果说明不是jx3dat，尝试直接解析
    if (!content) {
        const encoding_det = chardet.detect(buffer.subarray(0, 1024 * 128));
        const encoding = encoding_det.startsWith("UT") ? "utf8" : "gbk";
        content = iconv.decode(buffer, encoding);
    }
    postProgress("done", 15, { append: true });
    postProgress("🔬 解析文件...", 10);
    const data = parseLua(content);
    parse_pkg[index ?? 0] = data;
    postProgress("done", 20, { append: true });

    postProgress("🧬 整理元数据...");
    const meta = getPkgMeta(data);

    if (meta) {
        postProgress(`🧬 Author：${meta.szAuthor}`);
        postProgress(`🧬 Lang：${meta.szEdition}`);
        postProgress(`🧬 Server：${meta.szServer}`);
        if (meta.nTimeStamp)
            postProgress(`🧬 Timestamp：${dayjs(meta.nTimeStamp * 1000).format("YYYY-MM-DD HH:mm:ss")}`);
        if (meta.szOfficialVoicePacketUUID) postProgress(`🧬 OfficeVoicePacket：${meta.szOfficialVoicePacketUUID}`);
        if (meta.szCustomVoicePacketUUID) postProgress(`🧬 CustomVoicePacket：${meta.nTimeStamp}`);
    }
    const { client, count } = meta;
    postProgress(`📦 共计${count}条数据...`, 25);
    postProgress(`📦 整理数据条目...`);

    const result = {};
    const resources = {};
    let current_count = 0;
    let circle_count = 0;
    // 解析item + 获取资源
    for (let type in data) {
        if (type === "__meta") continue;
        if (!result[type]) result[type] = [];
        const resolve_ids = [];
        let item_id = -1;
        // 取出所有条目
        for (let map in data[type]) {
            for (let payload of data[type][map]) {
                // 导出json的问题，可能会存在null值。
                if (!payload) {
                    continue;
                }

                // 分析进度报告，总共只报告200次，保证流畅
                current_count++;
                circle_count++;
                if (circle_count > count / 200) {
                    postProgress(undefined, 25 + (current_count / count) * 50);
                    circle_count = 0;
                }

                // 从payload生成item
                let item = cloneDeep(defaultItem);
                item.type = type;
                item.payload = payload;
                if (map == -1) {
                    item.allMap = true;
                    item.map = ["-1"];
                } else {
                    item.map = [String(map)];
                }
                item = extendItem(item);
                item["__payload"] = prepToLua(item);
                item["__payload_hash"] = hashObject(item["__payload"]);

                // 同一个type下payload相同只是map不同的话算作一个元数据。
                const duplicate_item = result[type].find((i) => i.__payload_hash === item.__payload_hash);
                if (duplicate_item && duplicate_item.uuid === item.uuid) {
                    duplicate_item.map = uniq([...duplicate_item.map, ...item.map]);
                    duplicate_item["__map"] = duplicate_item.map
                        .map(Number)
                        .sort((a, b) => a - b)
                        .join(",");
                    if (duplicate_item.map.includes("-1")) {
                        duplicate_item.allMap = true;
                    }
                    payload.__item_id = duplicate_item.id;
                    continue;
                }

                // 如果确定需要一条新的元数据，给元数据一个ID
                item.id = --item_id;
                item["__map"] = item.map
                    .map(Number)
                    .sort((a, b) => a - b)
                    .join(",");
                // 给原本的payload一个item_id，方便后续可能存在的对比环节找到item
                payload.__item_id = item.id;

                // 尝试解析形如{$N114514,1919}的表达式，这里只是顺便记录一下可能用到的数据id
                // 后面才会统一拉取/整理
                if (payload.szName) {
                    const resolve_match = payload.szName.match(/\{\$\w(\d+),?(\d+)?\}/);
                    if (resolve_match) {
                        const [_, id, level] = resolve_match;
                        const resource_id = level === undefined ? id : `${id}_${level}`;
                        resolve_ids.push(resource_id);
                    }
                }

                result[type].push(item);
            }
        }

        postProgress(`📦 ${type} 条目整理完毕，共 ${result[type].length} 条...`);
        // 整理涉及到的ID
        const db = type_db_map[type];
        if (!db) continue;
        const ids = uniq([
            ...result[type]
                .map((item) => {
                    const payload = item.payload;
                    return payload.dwID;
                })
                .filter((id) => id),
            ...resolve_ids,
        ]);
        const fields = type_fields_map[type];
        // 向node请求相关资源
        try {
            const response = await (
                await fetch(`${__node}resource/${client}/${db}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ids, fields }),
                })
            ).json();
            const list = response.length ? response : [response];
            if (!resources[db]) resources[db] = [];
            resources[db] = [...resources[db], ...list];
            postProgress(`📦 ${type} 资源获取成功，共 ${list.length} 条...`);
        } catch (e) {
            postProgress(`⚠ ${type} 资源获取失败，跳过...`);
            console.error(`[jx3box-node/resource] 获取${db}数据失败`, e);
        }
    }
    // 将资源与条目整合到一起
    for (let type in data) {
        if (type === "__meta") continue;
        if (!result[type]) result[type] = [];
        const db = type_db_map[type];
        if (!db) continue;
        postProgress(`📦 整合${type}条目与资源...`);
        for (let item of result[type]) {
            const payload = item.payload;
            const { dwID, nLevel } = payload;
            // 找到id符合的数据，分别取出 等级符合的资源 和 有描述的资源。
            if (!resources[db]) continue;
            const resources_id = resources[db].filter((item) => item[type_primary_key_map[type]] === dwID);
            if (!resources_id.length) continue;
            const resource_level = resources_id.find((item) => item.Level === nLevel) || {};
            const resource_desc =
                resources_id.length === 1
                    ? resources_id[0]
                    : resources_id.find((item) => item.Name && item.IconID) || {};
            // 填充名字/图标等
            if (!payload.nIcon) payload.nIcon = resource_level.IconID || resource_desc.IconID;
            item.icon = payload.nIcon;
            // resolve string e.g. {$B114514}
            if (payload.szName) {
                const szName = payload.szName;
                // 解析表达式
                const matches = szName.match(/\{\$\w(\d+),?(\d+)?\}/g);
                if (matches) {
                    const resolves = {};
                    for (let match of matches) {
                        const [_, _resolve_type, id, level] = match.match(/\{\$(\w)(\d+),?(\d+)?\}/);
                        const resolve_type = resolve_type_map[_resolve_type];
                        if (resources[resolve_type]) {
                            const resolve_resource = resources[resolve_type].find(
                                (item) =>
                                    (item.SkillID == id || item.BuffID == id || item.ID == id) &&
                                    (!level || item.Level === level)
                            );
                            if (resolve_resource) {
                                const resolve_name =
                                    resolve_resource.Name ||
                                    resolve_resource.BuffName ||
                                    resolve_resource.SkillName ||
                                    resolve_resource.Remark;
                                resolves[match] = resolve_name;
                            }
                        }
                    }
                    item.resolves = resolves;
                }
                item.title = payload.szName;
            } else {
                item.title =
                    resource_level.Name ||
                    resource_desc.Name ||
                    resource_level.BuffName ||
                    resource_desc.BuffName ||
                    resource_level.SkillName ||
                    resource_desc.SkillName ||
                    resource_level.Remark ||
                    resource_desc.Remark ||
                    payload.szNote ||
                    payload.szTarget ||
                    payload.Remark ||
                    String(payload.dwID) ||
                    "元数据标题";
            }
            item.resource = resource_desc;
        }
        postProgress(`done`, undefined, { append: true });
    }
    postProgress(`📦 解析完成...`, 100);
    if (!index) postResult(result, "parse");
    parse_result[index ?? 0] = result;
};

const compare = async ({ buffer }) => {
    postProgress("解析云数据包", undefined, { from: "compare", status: 0 });
    await parse({ buffer }, 1);
    postProgress("解析云数据包", 45, { from: "compare", status: 1 });
    // 开始比对
    const [current_items, target_items] = cloneDeep(parse_result);
    for (let type in types) {
        if (!current_items[type]) current_items[type] = [];
        if (!target_items[type]) target_items[type] = [];
    }
    const [current_pkg, target_pkg] = cloneDeep(parse_pkg);
    const result = [];
    let batch = 0;
    /**
     * 名词：
     * item 元数据
     * payload 元数据的payload，未经过extend的
     * 规律：
     * 1. 云端拉下来的文件的元数据必然是带有uuid的，用户上传的则不一定。
     * 2. buff/skill/npc/doodad 可以根据id和level来判断是否是同一个目标。talk/chat可以根据szContent和szTarget
     * 3. item的三要素 type map payload
     * 变动类型:
     * 1. MODIFY 修改
     * 2. ADD 新增
     * 3. DELETE 删除
     * 大概流程:
     * 1 从current，即这一次解析器选择的文件的解析结果开始遍历，对于每一个item:
     * 1.1 如果有uuid，尝试查找target中是否有相同uuid的item，如果有，对比type, map, payload:
     * 1.1.1 如果存在不同的项，记录为 MODIFY
     * 1.1.1 如果没有找到，该item标记为 ADD
     * 1.2 如果没有uuid，尝试找到type，map, payload都一致的item:
     * 1.2.1 如果有，直接跳过
     * 1.2.2 如果没有，找到该item对应的所有payload。用这些payload去找到target中有相同监控项的payload，再找到这些payload对应的item:
     * 1.2.2.1 如果没有找到对应的target_item，该item标记为 ADD
     * 1.2.2.2 如果找到了对应的target_item，全都标记为MODIFY
     * 1.3 删除这一轮遍历相关的所有payload以及item（包括current和target里面的），避免逻辑混乱，提高效率。
     * 2 从target，即比对目标文件，拉下来的旧版本文件开始遍历。
     * 2.1 target中的item必然会有uuid，在前面的遍历中没有被找到，标记为 DELETE
     */
    postProgress("对比选择数据包与目标数据包", 45, { from: "compare", status: 0 });
    for (const type in types) {
        for (const item of current_items[type] ?? []) {
            batch++;
            if (item.uuid) {
                // 如果上传的元数据有uuid，尝试查找目标元数据中是否有相同uuid的元数据
                if (!target_items[type]) {
                    // 处理目标数据 该类型不存在的情况
                    result.push({ type: "ADD", cur: item, tar: null, uuid: null, guess: false, batch });
                    removePayloadsAboutItemInPkg(current_pkg, item);
                    continue;
                }
                // 找到目标元数据中相同uuid的元数据
                let target_item = null;
                if (["BUFF", "DEBUFF"].includes(type)) {
                    target_item =
                        target_items["BUFF"].find((i) => i.uuid === item.uuid) ||
                        target_items["DEBUFF"].find((i) => i.uuid === item.uuid) ||
                        null;
                } else {
                    target_item = target_items[type]?.find((i) => i.uuid === item.uuid);
                }
                if (!target_item) {
                    // 找不到，则标记为 ADD
                    result.push({ type: "ADD", cur: item, tar: null, uuid: null, guess: false, batch });
                    removePayloadsAboutItemInPkg(current_pkg, item);
                    continue;
                }
                if (!["type", "__map", "__payload_hash"].every((key) => item[key] === target_item[key])) {
                    // 如果有任何一项不一致，标记为MODIFY
                    result.push({
                        type: "MODIFY",
                        cur: item,
                        tar: target_item,
                        uuid: item.uuid,
                        guess: false,
                        pkg: target_item.pkg,
                        batch,
                    });
                }
                removePayloadsAboutItemInPkg(current_pkg, item);
                removePayloadsAboutItemInPkg(target_pkg, target_item);
                target_items[type] = target_items[type].filter((i) => i.id !== target_item.id);
            } else {
                // 先找找target是不是有完全一致的item，有的话直接跳过
                const target_item = (target_items[type] || []).find(
                    (i) => i.__map === item.__map && i.__payload_hash === item.__payload_hash
                );
                if (target_item) {
                    removePayloadsAboutItemInPkg(current_pkg, item);
                    removePayloadsAboutItemInPkg(target_pkg, target_item);
                    target_items[type] = target_items[type].filter((i) => i.id !== target_item.id);
                    continue;
                }

                // 如果没找到完全一致的：如果上传的元数据中不包含uuid。则需要根据payload来找到目标元数据中的对应项
                const _tar_items = [];
                for (const map in current_pkg[type]) {
                    // 插件导出JSON可能为null的适配
                    if (!current_pkg[type][map]) continue;
                    // 遍历所有对应当前item的payload
                    const cur_payload_index = current_pkg[type][map].findIndex(
                        (payload) => payload.__item_id === item.id
                    );
                    if (cur_payload_index === -1) continue;
                    const cur_payload = current_pkg[type][map][cur_payload_index];
                    // 找到所有目标元数据中 相同监控项的 payload，进而找出target item
                    const tar_payloads = findAllPayloadsAboutPayloadInPkg(target_pkg, type, cur_payload);
                    const tar_item_ids = uniq(
                        tar_payloads.map((payload) => {
                            return payload.payload?.__item_id;
                        })
                    );
                    _tar_items.push(...target_items[type].filter((i) => tar_item_ids.includes(i.id)));
                }
                const tar_items = uniqBy(_tar_items, "id");
                if (!tar_items.length) {
                    // 如果没有找到，标记为 ADD
                    result.push({ type: "ADD", cur: item, tar: null, uuid: null, guess: true, batch });
                } else if (tar_items.length === 1) {
                    // 如果仅找到一个，检查是否有不同，有则标记为 MODIFY
                    if (item.__payload_hash !== tar_items[0].__payload_hash || item.__map !== tar_items[0].__map) {
                        result.push({
                            type: "MODIFY",
                            cur: item,
                            tar: tar_items[0],
                            uuid: tar_items[0].uuid,
                            guess: true,
                            pkg: tar_items[0].pkg,
                            batch,
                        });
                    }
                    removePayloadsAboutItemInPkg(target_pkg, tar_items[0]);
                    target_items[type] = target_items[type].filter((i) => i.id !== tar_items[0].id);
                } else {
                    // 如果相同监控项有多个item，看看能不能找到一样的
                    const same_item = tar_items.find(
                        (i) => i.__map === item.__map && i.__payload_hash === item.__payload_hash
                    );
                    if (same_item) {
                        // 如果有一致的剩下的部分全都标记为DELETE
                        tar_items.splice(tar_items.indexOf(same_item), 1);
                    } else {
                        // 如果没有完全一致的，优先找到map一致的item
                        const map_same_item = tar_items.find((i) => i.__map === item.__map);
                        if (map_same_item) {
                            // 如果存在， 标记为 MODIFY
                            result.push({
                                type: "MODIFY",
                                cur: item,
                                tar: map_same_item,
                                uuid: map_same_item.uuid,
                                guess: true,
                                pkg: map_same_item.pkg,
                                batch,
                            });
                            removePayloadsAboutItemInPkg(target_pkg, map_same_item);
                            target_items[type] = target_items[type].filter((i) => i.id !== map_same_item.id);
                            tar_items.splice(tar_items.indexOf(map_same_item), 1);
                        } else {
                            // 如果不存在，当前 item 标记为 ADD
                            result.push({ type: "ADD", cur: item, tar: null, uuid: null, guess: true, batch });
                        }
                    }
                }
                removePayloadsAboutItemInPkg(current_pkg, item);
            }
        }

        for (const item of target_items[type] ?? []) {
            batch++;
            // 遍历目标元数据中剩余的元数据，标记为 DELETE
            const result_item = { type: "DELETE", cur: null, tar: item, guess: false, batch };
            if (item.uuid) result_item.uuid = item.uuid;
            if (item.pkg) result_item.pkg = item.pkg;
            result.push(result_item);
            removePayloadsAboutItemInPkg(target_pkg, item);
        }
    }
    postProgress("对比选择数据包与目标数据包", 90, { from: "compare", status: 1 });

    // 记录一个修改批次，用于后续分组

    for (let res of result) {
        const item = res.cur || res.tar;
        res.item_type = item.type;
        if (item.type === "CHAT") res.content = item.payload?.szContent;
        else if (item.type === "TALK") {
            const szContent = item.payload?.szContent;
            res.content = szContent ? (szContent.endsWith("\\\n") ? szContent.slice(0, -2) : szContent) : "";
        } else {
            let content = "";
            content += item.payload?.dwID;
            if (item.payload?.bCheckLevel) content += ` - ${item.payload?.nLevel}`;
            res.content = content;
        }
    }
    result.sort((a, b) => {
        const a_item = a.cur || a.tar;
        const b_item = b.cur || b.tar;
        if (a_item.__map != b_item.__map) {
            return a_item.__map > b_item.__map ? 1 : -1;
        } else if (a_item.type != b_item.type) {
            return a_item.__map > b_item.__map ? 1 : -1;
        } else {
            return a.content > b.content ? 1 : -1;
        }
    });

    let last_batch = 0;
    let index = 0;
    for (let res of result) {
        if (res.batch === last_batch) {
            res.batch = index;
        } else {
            last_batch = res.batch;
            index++;
            res.batch = index;
        }
    }

    postResult(result, "compare");
};

const build = async ({ pkg, items: items_data = [], modules = [], delay = true }) => {
    const result = { __meta: generateMeta(pkg), __total_items: 0 };
    postProgress("包信息写入...", 40);
    if (delay) await sleep(233);
    // 模块整合

    const merge_progress_step = 25 / modules.length;
    for (let index in modules) {
        const module = modules[index];
        const buffer = Buffer.from(module.raw);
        let module_str;
        // 尝试使用jx3dat解析
        try {
            module_str = readJx3dat(buffer).content.slice(6);
        } catch (e) {}
        // 如果没有结果说明不是jx3dat，尝试直接解析
        if (!module_str) {
            const encoding_det = chardet.detect(buffer.subarray(0, 1024 * 128));
            const encoding = encoding_det.startsWith("UT") ? "utf8" : "gbk";
            module_str = iconv.decode(buffer, encoding).slice(6);
        }

        const module_pkg = serializer.unserialize(module_str, {
            dictType: "object",
        });
        const count_str = `${Number(index) + 1}/${modules.length}`;
        mergePayload(module_pkg, result);
        if (delay) await sleep(233);
        postProgress(`依赖包合并${count_str}：`, 50 + (merge_progress_step * Number(index) + 1));
    }

    const invalid_items = items_data.filter((item) => !item.item).map((item) => item.item_id);
    const items_filtered = items_data.filter((item) => item.item);
    let tips = `元数据构建...有效条目 ${items_filtered.length} 条`;
    if (invalid_items) tips += `，移除失效条目 ${invalid_items.length} 条`;
    postProgress(tips, 65);
    const items_pkg = {};
    const items_snapshot = {};

    for (let item_data of items_filtered) {
        const item = item_data.item;
        if (!items_pkg[item.type]) items_pkg[item.type] = {};
        if (!items_snapshot[item.type]) items_snapshot[item.type] = [];

        for (let map of item.map) {
            if (!items_pkg[item.type][map]) items_pkg[item.type][map] = [];
            const index = checkPayloadConflict(items_pkg, item.type, map, item.payload);
            const payload = { ...item.payload, uuid: item.uuid };
            if (pkg.id && pkg.id > 0) payload.pkg = pkg.id;
            if (index === false) {
                items_pkg[item.type][map].push(payload);
                items_snapshot[item.type].push(item_data.item_id);
            } else {
                items_pkg[item.type][map][index] = payload;
                items_snapshot[item.type][index] = item_data.item_id;
            }
        }
    }

    // 去重items_snapshot
    for (let type in items_snapshot) {
        items_snapshot[type] = [...new Set(items_snapshot[type])];
    }

    if (delay) await sleep(512);
    postProgress("元数据构建...合并...", 70);
    mergePayload(items_pkg, result);
    if (delay) await sleep(233);
    postProgress("元数据合并...合并...Done！", 80);

    const total_items = result.__total_items;
    delete result.__total_items;
    const lua = `return ${serializer.serialize(result, { indent: null })}`.replace(/\["(-?\d+)"\]/g, "[$1]");
    const encoding = result.__meta.szEdition == "zhtw_hd" ? "utf8" : "gbk";
    const buffer = toJx3dat(lua, { encoding });
    const arraybuffer = buffer.buffer;

    postResult(
        {
            buffer: arraybuffer,
            total_items,
            invalid_items,
            items_snapshot,
        },
        "build",
        [arraybuffer]
    );
};

const CMD_MAP = {
    parse,
    compare,
    build,
};

onmessage = async function (e) {
    try {
        const { cmd, data } = e.data;
        console.log(`[dbm.worker] dispatch event: `, e.data);
        if (!CMD_MAP[cmd]) postResult("未知命令");
        await CMD_MAP[cmd](data);
    } catch (e) {
        console.log(`[dbm.worker] error : `, e);
        postProgress(e.message, -1);
    }
};
