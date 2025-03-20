import { AddAttribute } from "../attr";

// 20220723 缘起1.0.0.2501部分门派开始使用额外属性
// Skill.lh 中增加公共额外属性，维护此处即可
const additionalAttrs1 = {
    // $KGPakFSRoot/scripts/include/skill.lh
    //化劲文件里是10% 不知道为什么算两次 注意别改！！！
    atDecriticalDamagePowerBaseKiloNumRate: 200,
    atMagicShield: 200,
    atPhysicsShieldBase: 200,
};

/**
 * 不吃公共额外属性的心法，沿用重制版4T心法不吃（当前只有2T心法，估计未来增加T也不吃）
 * 未来西山居增加其他公共额外属性不排除调整的可能
 */
const mountNoAdditionalAttrs1 = ["10002", "10062", "10243", "10389"];

/**
 * 没被kskillparse解出来的特殊处理
 * if r0_1.dwLevel == r0_1.dwMaxLevel then
 *   r0_1.AddAttribute(ATTRIBUTE_EFFECT_MODE.EFFECT_TO_SELF_AND_ROLLBACK, ATTRIBUTE_TYPE.VITALITY_TO_PHYSICS_ATTACK_POWER_COF, 51, 0)
 * end
 */
const additionalAttrs2 = {
    atVitalityToPhysicsAttackPowerCof: 51,
};
/**
 * 没被kskillparse解出来的部分，按吃公共额外属性的心法特殊处理
 */
const mountNoAdditionalAttrs2 = ["10002", "10062", "10243", "10389"];

/**
 * 叠加公共额外属性
 * @param {*} attrs 属性Array
 */
export function AddAdditionalAttribute(attrs, mount) {
    if (!(mountNoAdditionalAttrs1.indexOf(String(mount)) >= 0)) {
        Object.entries(additionalAttrs1).forEach(([attrSlot, attrValue]) => {
            AddAttribute(attrs, attrSlot, attrValue);
        });
    }
    if (mountNoAdditionalAttrs2.indexOf(String(mount)) >= 0) {
        Object.entries(additionalAttrs2).forEach(([attrSlot, attrValue]) => {
            AddAttribute(attrs, attrSlot, attrValue);
        });
    }
}
