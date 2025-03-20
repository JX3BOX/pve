import { AddAttribute } from "../attr";

// 20220723 缘起1.0.0.2501部分门派开始使用额外属性
// Skill.lh 中增加公共额外属性，维护此处即可
const additionalAttrs = {
    // $KGPakFSRoot/scripts/include/skill.lh
    "atDecriticalDamagePowerBaseKiloNumRate": 200,
    "atMagicShield": 200,
    "atPhysicsShieldBase": 200,
};

/**
 * 不吃公共额外属性的心法，沿用重制版4T心法不吃（当前只有2T心法，估计未来增加T也不吃）
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
    if (!(mountNoAdditionalAttrs.indexOf(String(mount)) >= 0)) {
        Object.entries(additionalAttrs).forEach(([attrSlot, attrValue]) => {
            AddAttribute(attrs, attrSlot, attrValue);
        });
    }
}

