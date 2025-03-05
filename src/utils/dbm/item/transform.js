import { isArray, isEqual, cloneDeep } from "lodash";
import focusSample from "@/assets/data/dbm/default_item_payload_focus.json";

const col = [
    // json->lua: "rgb(r, g, b)" => {r, g, b}
    (val) => {
        if (!val) return undefined;
        if (isArray(val)) return val;
        const colors = val
            .replace(/\s/g, "")
            .replace(/rgb\((.+)\)/, "$1")
            .split(",")
            .map(Number);
        return colors.length ? colors : undefined;
    },
    // lua -> json: {r, g, b} => "rgb(r, g, b)"
    (val) => {
        if (typeof val === "string" && val.match(/rgb\((.+)\)/)) return val;
        if (!val || !isArray(val)) return "";
        return `rgb(${val.join(",")})`;
    },
];
// buff，skill
const event = [
    // payload -> lua
    (val) => {
        const event = { ...val };
        if (event.tMark && Object.values(event.tMark).every((v) => !v)) delete event.tMark;
        for (let key in event) if (!event[key]) delete event[key];
        if (event.szVoice === undefined) {
            delete event.bVoiceOfficial;
            delete event.bVoiceSelfOnly;
        }
        return Object.keys(event).length ? event : undefined;
    },
    (val) => val,
];

/**
 * 该对象存储了一些payload与lua某些字段互相转化的规则定义
 * {字段名称: [json->lua的转化方式，lua->json的转化方式]}
 */
export default {
    __default: [(val) => val || undefined, (val) => val],
    __event: event,
    col,
    nLevel: [(val) => val, (val) => val],
    tKungFu: [
        // payload -> lua: ['mount1','mount2'] => {'SKILL#mount1': true, 'SKILL#mount2': true}
        (val) => {
            if (!val || !val.length) return undefined;
            return val.reduce((acc, cur) => {
                acc[`SKILL#${cur}`] = true;
                return acc;
            }, {});
        },
        // lua -> payload: {'SKILL#mount1': true, 'SKILL#mount2': true} => ['mount1','mount2']
        (val) => {
            if (!val) return [];
            return Object.keys(val).map((key) => key.split("#").pop());
        },
    ],
    tCountdown: [
        // payload -> lua
        (val) => {
            for (let countdown of val) {
                for (let key in countdown) {
                    if (countdown[key] === "" || countdown[key] === null) {
                        delete countdown[key];
                    }
                }
            }
            val = val.filter((countdown) => Object.keys(countdown).length);
            if (!val.length) return undefined;
            return val;
        },
        // lua -> payload
        (val) => val,
    ],
    aCataclysmBuff: [
        // payload -> lua
        (val) => {
            if (!val || !val.length) return undefined;
            for (let key in val) if (!val[key]) delete val[key];
            return val;
        },
        // lua -> payload
        (val) => val,
    ],
    aFocus: [
        (val) => {
            if (val.length > 0) {
                const newVal = val.map((v) => {
                    if (isEqual(v, focusSample)) return {};
                    return v;
                });
                return newVal;
            } else {
                return undefined;
            }
        },
        (val) => {
            if (val.length > 0) {
                return val.map((v) => {
                    if (Object.keys(v).length === 0) {
                        return cloneDeep(focusSample);
                    } else {
                        return v;
                    }
                });
            } else {
                return val;
            }
        },
    ],
};
