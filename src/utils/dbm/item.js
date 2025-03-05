import item_payload_props from "@/assets/data/dbm/item_payload_props.json";
import item_boolean_props from "@/assets/data/dbm/item_boolean_props.json";
import transform from "./item/transform";
import ignores_default from "./item/ignores_default";

import defaultItem from "@/assets/data/dbm/default_item.js";
import defaultItemPayload from "@/assets/data/dbm/default_item_payload.json";
import defaultItemPanel from "@/assets/data/dbm/default_item_panel.json";

import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getImage } from "@/utils/dbm/common";

import { serializer } from "luadata";
import { cloneDeep, isArray, pick } from "lodash";

export function itemHasProp(type, prop) {
    return item_payload_props[type]?.includes(prop);
}

/**
 * js对象转lua table
 * @param {*} obj 被转换对象
 * @param {*} indent 输出格式，默认带4空格缩进，null则不缩进
 * @returns {string}
 * @throws 转换失败会抛出异常
 */
export function jsonToLua(obj, indent = "    ") {
    try {
        return serializer.serialize(obj, { indent }).replace(/\["(-?\d+)"\]/g, "[$1]");
    } catch (e) {
        throw e;
    }
}

/**
 * 一个item转化为游戏内团队监控的lua之前的预处理
 * 1. 清除无用的字段，尽量精简体积
 * 1.1 去掉该type不存在的字段
 * 1.2 去掉一些值为false的字段，游戏内默认就是false，不需要特地存储
 * 2. 为方便前端编辑，js和lua的数据结构在某些地方是不一样的，需要进行转化
 * @param {*} obj
 * @returns {Object} 一个对象，仅包含一条元数据的payload部分
 */
export function prepToLua(item, forImport = false) {
    const { type, payload, defaultProps, defaultPropsStatus, keepLR } = item;
    const result = {};
    const keys = Object.keys(payload).sort();
    for (let key of keys) {
        const val = payload[key];
        // 不属于这个type的字段删掉
        if (!itemHasProp(type, key)) continue;
        // 如果使用defaultProps的话删掉对应字段，让游戏自动显示默认值
        if (defaultProps.includes(key) && !defaultPropsStatus[key]) continue;
        // 值转换
        if (transform[key]) result[key] = transform[key][0](val);
        else if (!isNaN(key)) result[key] = transform["__event"][0](val);
        else result[key] = transform["__default"][0](val);
        if (result[key] === undefined) delete result[key];
        // 团队面板监控相关项排除
        if (key == "aCataclysmBuff") {
            result[key] = payload[key].map((item) => {
                const new_item = {};
                for (let k in item) {
                    if (Object.keys(defaultItemPanel).includes(k) && item[k] && !["__colors"].includes(k))
                        new_item[k] = item[k];
                }
                if (!new_item["szStackOp"]) delete new_item["nStackNum"];
                return new_item;
            });
            if (!result[key]?.length) {
                delete result[key];
            }
        }
        // 系统喊话处理
        if (type === "CHAT" && key === "szContent" && keepLR && !payload.szContent.endsWith("\\\n"))
            result[key] += "\\\n";
    }
    if (result.szContent) result.szContent = result.szContent.replace(/\\+\n$/, "\\\n");

    if (!forImport) return result;
    const importResult = { [type]: {} };
    for (const map of item.map) {
        importResult[type][map] = [result];
    }
    return importResult;
}

/**
 *  将item转换为lua table
 **/
export function toLuaTable(item) {
    const payload = prepToLua(item);
    try {
        return jsonToLua(payload);
    } catch (e) {
        console.error(e);
        return "return {}";
    }
}

/**
 *  将item转换为提交给数据库的
 **/
export function toPostItem(item, resource, client) {
    const result = cloneDeep(item);
    const { map, allMap } = item;
    // 用payload里的szNote充当描述
    if (!item.desc) item.desc = item.payload.szNote;

    // 全部地图只需要一个-1，不要放太多
    if (allMap || map.includes("-1")) result.map = ["-1"];
    result.map = result.map.map(Number);

    const payload = prepToLua(result);
    const lua = jsonToLua(prepToLua(result, true), null);
    // 用预处理过的payload替换
    result.payload = payload;
    result.lua = lua;

    if (resource) {
        result.icon = item.defaultPropsStatus.nIcon ? item.payload.nIcon : resource.IconID;
        if (!item.title && !item.defaultPropsStatus.szName)
            result.name = resource.Name || resource.BuffName || resource.SkillName;
    }
    result.client = client;

    return pick(result, "title", "desc", "icon", "type", "map", "payload", "lua", "status", "client");
}

/**
 * 团队监控的数据可能会有多层嵌套，插件处理的时候会把它处理成最精简的样子
 * 为了前端处理的时候不报错需要把他跟默认的全量数据结构对比，把空缺的补上
 * @param {*} payload
 * @param {*} defaultPayload
 * @returns {*}
 */
export function extendPayload(payload, defaultPayload) {
    const newPayload = {};
    for (let key in defaultPayload) {
        if (!payload || payload[key] === undefined) newPayload[key] = defaultPayload[key];
        else if (typeof defaultPayload[key] === "object" && !isArray(defaultPayload[key]))
            newPayload[key] = extendPayload(payload[key], defaultPayload[key]);
        else newPayload[key] = payload[key];
    }
    return newPayload;
}

/**
 *  从数据库拉下来编辑的时候
 *  需要填充一些默认值
 **/
export function extendItem(item, keepPayload) {
    //for (let key in item) if (!defaultItem.hasOwnProperty(key)) delete item[key];
    for (let key in defaultItem) if (!item.hasOwnProperty(key)) item[key] = defaultItem[key];
    // 地图解析成文本
    if (item.map && item.map.length) item.map = item.map.map((m) => m.toString());
    if (item.map.includes("-1")) item.allMap = true;
    let payload = item.payload;
    for (let key in payload) {
        // 布尔值转换
        if (item_boolean_props.includes(key)) payload[key] = !!payload[key];
        // 需解锁字段
        if (defaultItem.defaultProps.includes(key) && payload[key]) item.defaultPropsStatus[key] = true;
        // 缺省值默认值
        if (ignores_default[key]) payload[key] = ignores_default[key](payload[key]);
        // 可能的数值转换
        if (transform[key]) item.payload[key] = transform[key][1](item.payload[key]);
        // 拿到uuid
        if (key === "uuid") {
            item.uuid = payload[key];
            delete payload[key];
        }
        if (key === "pkg") {
            item.pkg = payload[key];
            delete payload[key];
        }
    }
    item.payload = extendPayload(item.payload, defaultItemPayload);

    // 系统喊话处理
    if (item.type === "CHAT" && item.payload.szContent) {
        if (item.payload.szContent.endsWith("\\\n")) {
            item.keepLR = true;
            item.payload.szContent = item.payload.szContent.slice(0, -2);
        } else {
            item.keepLR = false;
        }
    }
    return item;
}

/**
 *  从lua table解析出web编辑用的有冗余字段的item
 **/
export function parseLuaTable(lua, _item) {
    try {
        let item = _item || { ...defaultItem };
        let result = serializer.unserialize(lua, {
            dictType: "object",
        });
        if (!result) throw new Error("解析失败");
        item.payload = result[0] || result;
        for (let key in item.payload) {
            if (transform[key]) item.payload[key] = transform[key][1](item.payload[key]);
        }
        item = extendItem(item);
        return item;
    } catch (e) {
        throw e;
    }
}

/**
 *  元数据显示名称
 **/
export function showName(item) {
    let name;
    if (item.type === "TALK") name = item.payload.szTarget || "系统警告框";
    else if (item.type === "CHAT") name = item.title || "系统消息";
    else name = item.payload.szName || item.title || item.payload.szNote || "#Name";
    if (item.resolves) {
        for (let key in item.resolves) {
            const [_, type, id, level] = key.match(/\{\$(\w)(\d+),?(\d+)?\}/);
            name = name.replaceAll(key, `{$${type}${id}${level ? "," + level : ""}-${item.resolves[key]}}`);
        }
    }
    return name;
}

/**
 *  元数据显示图标
 **/
export function showIcon(item) {
    if (["ALL", "BUFF", "DEBUFF", "CASTING"].includes(item.type))
        return iconLink(item.icon || item.payload?.nIcon || 0);
    if (item.type === "TALK") return iconLink(item.icon || 4835);
    if (item.type === "CHAT") return iconLink(item.icon || 3138);
    if (item.type === "NPC") return getImage("nFrame", item.payload?.nFrame || 47);
    if (item.type === "DOODAD") return iconLink(item.payload?.nIcon || 10909);
    return iconLink();
}

/**
 * 元数据内容
 * */
export function showContent(item) {
    const szContent = item.payload?.szContent;
    if (!szContent) return;
    if (szContent.endsWith("\\\n") && item.type === "CHAT") {
        return szContent.slice(0, -2);
    } else {
        return szContent;
    }
}
