import { cloneDeep } from "lodash";
/**
 * 去除重制属性
 * @param {Array} attrs 属性
 * @returns
 */
const removeStdAttrs = (attrs) => {
    return cloneDeep(
        attrs.filter((attr) => {
            // return (!attr.includes('Haste') && !attr.includes('SurplusValue') && !attr.endsWith('OvercomePercent')) // lv70
            return !attr.includes("SurplusValue"); // lv80
        })
    );
};
/**
 * 去除缘起属性
 * @param {Array} attrs 属性
 * @returns
 */
const removeOriginAttrs = (attrs) => {
    return cloneDeep(
        attrs.filter((attr) => {
            return !attr.includes("Hit") && !attr.endsWith("Overcome") && !attr.endsWith("ManaReplenish");
        })
    );
};
// 基础属性
const baseCommon = ["Vitality", "Agility", "Spirit", "Spunk", "Strength"];
// 武器伤害
const weaponCommon = ["MeleeWeaponAttackSpeed", "MeleeWeaponDamage", "MeleeWeaponDamageRand"];
// 阴性内功共有属性
const lunarCommon = {
    attack: [
        "LunarAttackPowerBase",
        "LunarAttackPower",
        "LunarHitPercent",
        "LunarCriticalStrikeRate",
        "LunarCriticalStrike",
        "LunarCriticalDamagePowerPercent",
        "LunarCriticalDamagePower",
        "LunarOvercomePercent",
        "LunarOvercome",
        "StrainPercent",
        "HastePercent",
        "SurplusValue",
    ],
    heal: [
        "TherapyPower",
        "LunarCriticalStrikeRate",
        "LunarCriticalStrike",
        "LunarCriticalDamagePowerPercent",
        "LunarCriticalDamagePower",
        "HastePercent",
        "SurplusValue",
        "LunarAttackPowerBase",
        "LunarOvercomePercent",
        "StrainPercent",
    ],
    shield: [
        "MaxHealth",
        "ManaReplenish",
        "PhysicsShieldPercent",
        "LunarShieldPercent",
        "ToughnessDefCriticalPercent",
        "DecriticalDamagePercent",
    ],
};

const solarCommon = {
    attack: [
        "SolarAttackPowerBase",
        "SolarAttackPower",
        "SolarHitPercent",
        "SolarCriticalStrikeRate",
        "SolarCriticalStrike",
        "SolarCriticalDamagePowerPercent",
        "SolarCriticalDamagePower",
        "SolarOvercomePercent",
        "SolarOvercome",
        "StrainPercent",
        "HastePercent",
        "SurplusValue",
    ],
    heal: [
        "TherapyPower",
        "SolarCriticalStrikeRate",
        "SolarCriticalStrike",
        "SolarCriticalDamagePowerPercent",
        "SolarCriticalDamagePower",
        "HastePercent",
        "SurplusValue",
    ],
    shield: [
        "MaxHealth",
        "ManaReplenish",
        "PhysicsShieldPercent",
        "SolarShieldPercent",
        "ToughnessDefCriticalPercent",
        "DecriticalDamagePercent",
    ],
};

const neutralCommon = {
    attack: [
        "NeutralAttackPowerBase",
        "NeutralAttackPower",
        "NeutralHitPercent",
        "NeutralCriticalStrikeRate",
        "NeutralCriticalStrike",
        "NeutralCriticalDamagePowerPercent",
        "NeutralCriticalDamagePower",
        "NeutralOvercomePercent",
        "NeutralOvercome",
        "StrainPercent",
        "HastePercent",
        "SurplusValue",
    ],
    heal: [
        "TherapyPower",
        "NeutralCriticalStrikeRate",
        "NeutralCriticalStrike",
        "NeutralCriticalDamagePowerPercent",
        "NeutralCriticalDamagePower",
        "HastePercent",
        "SurplusValue",
        "SolarAttackPowerBase",
        "NeutralOvercomePercent",
        "StrainPercent",
    ],
    shield: [
        "MaxHealth",
        "ManaReplenish",
        "PhysicsShieldPercent",
        "NeutralShieldPercent",
        "ToughnessDefCriticalPercent",
        "DecriticalDamagePercent",
    ],
};

const poisonCommon = {
    attack: [
        "PoisonAttackPowerBase",
        "PoisonAttackPower",
        "PoisonHitPercent",
        "PoisonCriticalStrikeRate",
        "PoisonCriticalStrike",
        "PoisonCriticalDamagePowerPercent",
        "PoisonCriticalDamagePower",
        "PoisonOvercomePercent",
        "PoisonOvercome",
        "StrainPercent",
        "HastePercent",
        "SurplusValue",
    ],
    heal: [
        "TherapyPower",
        "PoisonCriticalStrikeRate",
        "PoisonCriticalStrike",
        "PoisonCriticalDamagePowerPercent",
        "PoisonCriticalDamagePower",
        "HastePercent",
        "SurplusValue",
        "PoisonAttackPowerBase",
        "PoisonOvercomePercent",
        "StrainPercent",
    ],
    shield: [
        "MaxHealth",
        "ManaReplenish",
        "PhysicsShieldPercent",
        "PoisonShieldPercent",
        "ToughnessDefCriticalPercent",
        "DecriticalDamagePercent",
    ],
};

const physicsCommon = {
    attack: [
        "PhysicsAttackPowerBase",
        "PhysicsAttackPower",
        "PhysicsHitPercent",
        "PhysicsCriticalStrikeRate",
        "PhysicsCriticalStrike",
        "PhysicsCriticalDamagePowerPercent",
        "PhysicsCriticalDamagePower",
        "PhysicsOvercomePercent",
        "PhysicsOvercome",
        "StrainPercent",
        "HastePercent",
        "SurplusValue",
    ],
    heal: [
        "TherapyPower",
        "PhysicsCriticalStrikeRate",
        "PhysicsCriticalStrike",
        "PhysicsCriticalDamagePowerPercent",
        "PhysicsCriticalDamagePower",
        "HastePercent",
        "SurplusValue",
    ],
    shield: [
        "MaxHealth",
        "ManaReplenish",
        "PhysicsShieldPercent",
        "LunarShieldPercent",
        "ToughnessDefCriticalPercent",
        "DecriticalDamagePercent",
    ],
};
export const tankCommon = [
    "MaxHealth",
    "ManaReplenish",
    "PhysicsShieldPercent",
    "LunarShieldPercent",
    "ToughnessDefCriticalPercent",
    "DecriticalDamagePercent",
    "DodgePercent",
    "ParryPercent",
    "ParryValue",
    "ActiveThreatCoefficient",
];
export const stdTankCommon = removeOriginAttrs(tankCommon);
export const originTankCommon = removeStdAttrs(tankCommon);
export const otherCommon = [
    "PVXAllRound",
];
export const xf_primary_attributes = {
    10003: "Spunk", // 易筋经
    10014: "Spirit", // 紫霞功
    10021: "Spunk", // 花间游
    10081: "Spirit", // 冰心诀
    10175: "Spirit", // 毒经
    10627: "Spirit", // 无方
    10225: "Spunk", // 天罗诡道
    10242: "Spunk", // 焚影圣诀
    10447: "Spirit", // 莫问
    10615: "Spunk", // 太玄经
    10015: "Agility", // 太虚剑意
    10026: "Strength", // 傲血战意
    10533: "Agility", // 凌海诀
    10144: "Agility", // 问水诀
    10145: "Agility", // 山居剑意
    10224: "Strength", // 惊羽诀
    10268: "Strength", // 笑尘诀
    10390: "Agility", // 分山劲
    10464: "Strength", // 北傲诀
    10585: "Agility", // 隐龙诀
    10698: "Strength", // 孤锋诀
    10756: "Agility", // 山海心诀
    10786: "Spunk", // 周天功
    10028: "Spirit", // 离经易道
    10080: "Spirit", // 云裳心经
    10176: "Spirit", // 补天诀
    10448: "Spirit", // 相知
    10626: "Spirit", // 灵素
    10002: "Vitality", // 洗髓经
    10062: "Vitality", // 铁牢律
    10243: "Vitality", // 明尊琉璃体
    10389: "Vitality", // 铁骨衣
};


export const mount_display_attributes = {
    std: {
        10080: {
            // 云裳
            base: baseCommon,
            heal: lunarCommon.heal,
            shield: removeOriginAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10081: {
            // 冰心
            base: baseCommon,
            attack: removeOriginAttrs(lunarCommon.attack),
            shield: removeOriginAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["LunarOvercome", "Strain", "Haste"],
        },
        10626: {
            // 灵素
            base: baseCommon,
            heal: poisonCommon.heal,
            shield: removeOriginAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10627: {
            // 无方
            base: baseCommon,
            attack: removeOriginAttrs(poisonCommon.attack),
            shield: removeOriginAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["LunarOvercome", "Strain", "Haste"],
        },
        10003: {
            // 易筋经
            base: baseCommon,
            attack: removeOriginAttrs(solarCommon.attack),
            shield: removeOriginAttrs(solarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["SolarOvercome", "Strain", "Haste"],
        },
        10002: {
            // 洗髓经
            base: baseCommon,
            attack: removeOriginAttrs(solarCommon.attack),
            shield: removeOriginAttrs(tankCommon),
            weapon: weaponCommon,
            otherattrs: otherCommon,
        },
        10015: {
            // 太虚剑意
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10014: {
            // 紫霞功
            base: baseCommon,
            attack: removeOriginAttrs(neutralCommon.attack),
            shield: removeOriginAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
        10021: {
            // 花间游
            base: baseCommon,
            attack: removeOriginAttrs(neutralCommon.attack),
            shield: removeOriginAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
        10028: {
            // 离经易道
            base: baseCommon,
            heal: neutralCommon.heal,
            shield: removeOriginAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10026: {
            // 傲血战意
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10062: {
            // 铁牢律
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(tankCommon),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10175: {
            // 毒经
            base: baseCommon,
            attack: removeOriginAttrs(poisonCommon.attack),
            shield: removeOriginAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PoisonOvercome", "Strain", "Haste"],
        },
        10176: {
            // 补天诀
            base: baseCommon,
            heal: poisonCommon.heal,
            shield: removeOriginAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10224: {
            // 惊羽诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10225: {
            // 天罗诡道
            base: baseCommon,
            attack: [
                "PoisonAttackPowerBase",
                "PoisonAttackPower",
                "PhysicsCriticalStrikeRate",
                "PhysicsCriticalDamagePowerPercent",
                "PoisonOvercomePercent",
                "StrainPercent",
                "HastePercent",
                "SurplusValue",
            ],
            shield: removeOriginAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PoisonOvercome", "Strain", "Haste"],
        },
        10144: {
            // 问水诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10145: {
            // 山居剑意
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10268: {
            // 笑尘诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10242: {
            // 焚影圣诀
            base: baseCommon,
            attack: removeOriginAttrs(solarCommon.attack),
            shield: removeOriginAttrs(solarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["SolarOvercome", "Strain", "Haste"],
        },
        10243: {
            // 明尊琉璃体
            base: baseCommon,
            attack: removeOriginAttrs(solarCommon.attack),
            shield: removeOriginAttrs(tankCommon),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10389: {
            // 铁骨衣
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(tankCommon),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10390: {
            // 分山劲
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs([...physicsCommon.shield, "ParryPercent", "ParryValue"]),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10447: {
            // 莫问
            base: baseCommon,
            attack: removeOriginAttrs(lunarCommon.attack),
            shield: removeOriginAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["LunarOvercome", "Strain", "Haste"],
        },
        10448: {
            // 相知
            base: baseCommon,
            heal: lunarCommon.heal,
            shield: removeOriginAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10464: {
            // 北傲诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10533: {
            // 凌海诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10585: {
            // 隐龙诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10615: {
            // 太玄经
            base: baseCommon,
            attack: removeOriginAttrs(neutralCommon.attack),
            shield: removeOriginAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
        10698: {
            // 孤锋诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10756: {
            // 山海心诀
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10786: {
            // 周天功
            base: baseCommon,
            attack: removeOriginAttrs(neutralCommon.attack),
            shield: removeOriginAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
    },
    origin: {
        10080: {
            // 云裳
            base: baseCommon,
            heal: removeStdAttrs(lunarCommon.heal),
            shield: removeStdAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10081: {
            // 冰心
            base: baseCommon,
            attack: removeStdAttrs(lunarCommon.attack),
            shield: removeStdAttrs(lunarCommon.shield),
            weapon: weaponCommon,
            extra: ["LunarOvercome", "Strain", "Haste"],
        },
        10003: {
            // 易筋经
            base: baseCommon,
            attack: removeStdAttrs(solarCommon.attack),
            shield: removeStdAttrs(solarCommon.shield),
            weapon: weaponCommon,
            extra: ["SolarOvercome", "Strain", "Haste"],
        },
        10002: {
            // 洗髓经
            base: baseCommon,
            attack: removeStdAttrs(solarCommon.attack),
            shield: removeStdAttrs(tankCommon),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10015: {
            // 太虚剑意
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10014: {
            // 紫霞功
            base: baseCommon,
            attack: removeStdAttrs(neutralCommon.attack),
            shield: removeStdAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
        10021: {
            // 花间游
            base: baseCommon,
            attack: removeStdAttrs(neutralCommon.attack),
            shield: removeStdAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            extra: ["NeutralOvercome", "Strain", "Haste"],
        },
        10028: {
            // 离经易道
            base: baseCommon,
            heal: removeStdAttrs(neutralCommon.heal),
            shield: removeStdAttrs(neutralCommon.shield),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10026: {
            // 傲血战意
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10062: {
            // 铁牢律
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(tankCommon),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10144: {
            // 问水诀
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10145: {
            // 山居剑意
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10175: {
            // 毒经
            base: baseCommon,
            attack: removeStdAttrs(poisonCommon.attack),
            shield: removeStdAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            extra: ["PoisonOvercome", "Strain", "Haste"],
        },
        10176: {
            // 补天诀
            base: baseCommon,
            heal: removeStdAttrs(poisonCommon.heal),
            shield: removeStdAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10224: {
            // 惊羽诀
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10225: {
            // 天罗诡道
            base: baseCommon,
            attack: [
                "PoisonAttackPowerBase",
                "PoisonAttackPower",
                "PhysicsHitPercent",
                "PhysicsCriticalStrikeRate",
                "PhysicsCriticalDamagePowerPercent",
                "PoisonOvercomePercent",
                "StrainPercent",
                "HastePercent",
            ],
            shield: removeStdAttrs(poisonCommon.shield),
            weapon: weaponCommon,
            extra: ["PoisonOvercome", "Strain", "Haste"],
        },
        10242: {
            // 焚影圣诀
            base: baseCommon,
            attack: removeStdAttrs(solarCommon.attack),
            shield: removeStdAttrs(solarCommon.shield),
            weapon: weaponCommon,
            extra: ["SolarOvercome", "Strain", "Haste"],
        },
        10243: {
            // 明尊琉璃体
            base: baseCommon,
            attack: removeStdAttrs(solarCommon.attack),
            shield: removeStdAttrs(tankCommon),
            weapon: weaponCommon,
            extra: ["Haste"],
        },
        10268: {
            // 笑尘诀
            base: baseCommon,
            attack: removeStdAttrs(physicsCommon.attack),
            shield: removeStdAttrs(physicsCommon.shield),
            weapon: weaponCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
        10389: {
            // 铁骨衣
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs(tankCommon),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["Haste"],
        },
        10390: {
            // 分山劲
            base: baseCommon,
            attack: removeOriginAttrs(physicsCommon.attack),
            shield: removeOriginAttrs([...physicsCommon.shield, "ParryPercent", "ParryValue"]),
            weapon: weaponCommon,
            otherattrs: otherCommon,
            extra: ["PhysicsOvercome", "Strain", "Haste"],
        },
    },
};
