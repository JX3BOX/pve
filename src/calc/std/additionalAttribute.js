import { AddAttribute } from "../attr";

// 20211108 重制1.0.0.5468
// Skill.lh 中增加公共额外属性，维护此处即可
const additionalAttrs = {
    "atDecriticalDamagePowerBaseKiloNumRate": 15
};

/**
 * 不吃公共额外属性的心法（公共额外加了又没全加）
 * 未来西山居增加其他公共额外属性不排除调整的可能
 */
const mountNoAdditionalAttrs = [
    "10002",
    "10062",
    "10243",
    "10389"
];

/**
 * 叠加公共额外属性
 * @param {*} attrs 属性Array
 */
export function AddAdditionalAttribute(attrs, mount) {
    if (!(mountNoAdditionalAttrs.indexOf(mount) >= 0)) {
        Object.entries(additionalAttrs).forEach(([attrSlot, attrValue]) => {
            AddAttribute(attrs, attrSlot, attrValue);
        });
    }
}

