import { serializer } from "luadata";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 生成包信息
export const generateMeta = (pkg) => {
    const pkg_meta = pkg?.__meta ?? pkg?.pkg_meta ?? {};
    const lang = pkg?.lang;

    const __meta = {};
    for (const key in pkg_meta) {
        if (pkg_meta[key]) __meta[key] = pkg_meta[key];
    }

    __meta["szLang"] = lang.includes("tr") || pkg_meta?.szLang?.includes("tw") ? "zhtw" : "zhcn";
    __meta["szEdition"] = __meta["szLang"]?.includes("tw") ? "zhtw_hd" : "zhcn_hd";
    __meta["nTimeStamp"] = Math.round(Date.now() / 1000);

    if (pkg.key) __meta["szKey"] = pkg.key;

    return __meta;
};

/**
 * 检查一个payload是否与目标包存在冲突。
 * @param {object} pkg 对比的pkg
 * @param {string} type 对比的szType
 * @param {number} map 对比的dwMapID
 * @param {object} payload 与之对比的元数据payload
 * @returns {boolean | number} 存在则返回冲突的索引，否则返回false
 */
export const checkPayloadConflict = (pkg, type, map, payload) => {
    if (!payload) return;
    const pkg_payloads = pkg?.[type]?.[map];
    if (!pkg_payloads) return false;

    for (let index in pkg_payloads) {
        const pkg_payload = pkg_payloads[index];
        if (["TALK", "CHAT"].includes(type)) {
            if (payload.szContent == pkg_payload.szContent && payload.szTarget == pkg_payload.szTarget) return index;
        } else {
            if (payload.dwID == pkg_payload.dwID && (!pkg_payload.bCheckLevel || payload.nLevel == pkg_payload.nLevel))
                return index;
        }
    }

    return false;
};

/**
 * 直接在minor上操作，将major的payload合并到minor中。
 * 如果出现冲突项，major优先级更高，将覆盖minor中的冲突项。
 * @param {object} major
 * @param {object} minor
 * @returns {void}
 */
export const mergePayload = (major, minor) => {
    for (const type in major) {
        if (type === "__meta") continue;
        if (!minor[type]) minor[type] = {};
        for (const map in major[type]) {
            if (!minor[type][map]) minor[type][map] = [];
            for (let major_item of major[type][map]) {
                const index = checkPayloadConflict(minor, type, map, major_item);
                if (index === false) {
                    minor[type][map].push(major_item);
                    minor.__total_items += 1;
                } else {
                    minor[type][map][index] = major_item;
                }
            }
        }
    }
};

export async function readFile(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    const buffer = await new Promise((resolve) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        };
    });
    return buffer;
}

export function parseLua(content) {
    if (content.startsWith("return ")) {
        content = content.slice(7);
        return serializer.unserialize(content, { dictType: "object" });
    } else {
        return JSON.parse(content);
    }
}

export function getPkgMeta(pkg) {
    const meta = pkg.__meta;
    const count = countItems(pkg);
    const client = getPkgClient(pkg);
    return {
        ...meta,
        count,
        client,
    };
}

export function countItems(pkg) {
    return Object.keys(pkg).reduce((acc, cur) => {
        if (cur === "__meta") return acc;
        for (let map in pkg[cur]) {
            if (!pkg[cur][map]) continue;
            acc += pkg[cur][map].length;
        }
        return acc;
    }, 0);
}

export function getPkgClient(pkg) {
    const meta = pkg.__meta;
    return meta && meta.Lang && meta.Lang.includes("class") ? "origin" : "std";
}

/**
 * 从指定pkg中移除所有跟指定item有关的payload
 * @param {*} pkg
 * @param {*} item
 */
export function removePayloadsAboutItemInPkg(pkg, item) {
    const { type, id } = item;
    if (!pkg[type]) return;
    for (let map in pkg[type]) {
        if (!pkg[type][map]) continue;
        pkg[type][map] = pkg[type][map].filter((i) => i.__item_id !== id);
    }
}

/**
 * 从指定pkg中找到所有跟指定payload具有相同监控项的payload
 * @param {*} pkg
 * @param {*} item
 */
export function findAllPayloadsAboutPayloadInPkg(pkg, type, payload) {
    const result = [];
    for (const map in pkg[type]) {
        if (!pkg[type][map]) continue;
        const target_index = checkPayloadConflict(pkg, type, map, payload);
        if (target_index !== false)
            result.push({ type, map, index: target_index, payload: pkg[type][map][target_index] });
    }
    return result;
}
