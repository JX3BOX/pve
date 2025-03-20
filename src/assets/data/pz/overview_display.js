// 防御相关公共属性
const shieldOverview = {
    physicsShield: "PhysicsShield", // 外防等级
    physicsShieldPercent: "PhysicsShieldPercent", // 外防
    magicShield: "SolarShield", // 内防等级 目前所有的内防都是一样的
    magicShieldPercent: "SolarShieldPercent", // 内防
    toughness: "Toughness", // 御劲等级
    toughnessPercent: "ToughnessDefCriticalPercent", // 御劲
    decriticalDamage: "DecriticalDamage", // 化劲等级
    decriticalDamagePercent: "DecriticalDamagePercent", // 化劲
};
// 输出 公共属性
const dpsOverview = {
    life: "MaxHealth", // 气血
    surplus: "SurplusValue", // 破招
    haste: "Haste", // 加速等级
    hastePercent: "HastePercent", // 加速率
    strain: "Strain", // 无双等级
    strainPercent: "StrainPercent", // 无双
    ...shieldOverview,
};
// 阳性内功输出 公共属性
const solarOverview = {
    baseAttack: "SolarAttackPowerBase",
    attack: "SolarAttackPower",
    hitPercent: "SolarHitPercent",
    critial: "SolarCriticalStrike",
    critialPercent: "SolarCriticalStrikeRate",
    criticalDamage: "SolarCriticalDamagePower",
    criticalDamagePercent: "SolarCriticalDamagePowerPercent",
    overcome: "SolarOvercome",
    overcomePercent: "SolarOvercomePercent",
};
// 阴性内功输出 公共属性
const lunarOverview = {
    baseAttack: "LunarAttackPowerBase",
    attack: "LunarAttackPower",
    hitPercent: "LunarHitPercent",
    critial: "LunarCriticalStrike",
    critialPercent: "LunarCriticalStrikeRate",
    criticalDamage: "LunarCriticalDamagePower",
    criticalDamagePercent: "LunarCriticalDamagePowerPercent",
    overcome: "LunarOvercome",
    overcomePercent: "LunarOvercomePercent",
};
// 毒性内功输出 公共属性
const poisonOverview = {
    baseAttack: "PoisonAttackPowerBase",
    attack: "PoisonAttackPower",
    hitPercent: "PoisonHitPercent",
    critial: "PoisonCriticalStrike",
    critialPercent: "PoisonCriticalStrikeRate",
    criticalDamage: "PoisonCriticalDamagePower",
    criticalDamagePercent: "PoisonCriticalDamagePowerPercent",
    overcome: "PoisonOvercome",
    overcomePercent: "PoisonOvercomePercent",
};
// 混元内功输出 公共属性
const neutralOverview = {
    baseAttack: "NeutralAttackPowerBase",
    attack: "NeutralAttackPower",
    hitPercent: "NeutralHitPercent",
    critial: "NeutralCriticalStrike",
    critialPercent: "NeutralCriticalStrikeRate",
    criticalDamage: "NeutralCriticalDamagePower",
    criticalDamagePercent: "NeutralCriticalDamagePowerPercent",
    overcome: "NeutralOvercome",
    overcomePercent: "NeutralOvercomePercent",
};
// 外功输出 公共属性
const physicsOverview = {
    baseAttack: "PhysicsAttackPowerBase",
    attack: "PhysicsAttackPower",
    hitPercent: "PhysicsHitPercent",
    critial: "PhysicsCriticalStrike",
    critialPercent: "PhysicsCriticalStrikeRate",
    criticalDamage: "PhysicsCriticalDamagePower",
    criticalDamagePercent: "PhysicsCriticalDamagePowerPercent",
    overcome: "PhysicsOvercome",
    overcomePercent: "PhysicsOvercomePercent",
};

// 坦克 公共属性
const tankOverview = {
    life: "MaxHealth", // 气血
    parimary: "Vitality", // 体质
    surplus: "SurplusValue", // 破招
    haste: "Haste", // 加速等级
    hastePercent: "HastePercent", // 加速率
    strain: "Strain", // 无双等级
    strainPercent: "StrainPercent", // 无双
    dodge: "Dodge", // 闪躲等级
    dodgePercent: "DodgePercent", // 闪躲
    parry: "Parry", // 招架等级
    parryPercent: "ParryPercent", // 招架
    parryValue: "ParryValue", // 拆招
    ...shieldOverview,
};
// 治疗 公共属性
const healOverview = {
    life: "MaxHealth", // 气血
    parimary: "Vitality", // 体质
    therapyBase: "TherapyPowerBase", // 基础治疗
    therapy: "TherapyPower", // 面板治疗
    surplus: "SurplusValue", // 破招
    haste: "Haste", // 加速等级
    hastePercent: "HastePercent", // 加速率
    ...shieldOverview,
};

const overviewDisplay = {
    "10003": {
        // 易筋经
        primary: "Spunk",
        ...solarOverview,
        ...dpsOverview,
    },
    "10014": {
        // 紫霞功
        primary: "Spirit",
        ...neutralOverview,
        ...dpsOverview,
    },
    "10021": {
        // 花间游
        primary: "Spunk",
        ...neutralOverview,
        ...dpsOverview,
    },
    "10081": {
        // 冰心诀
        primary: "Spirit",
        ...lunarOverview,
        ...dpsOverview,
    },
    "10175": {
        // 毒经
        primary: "Spirit",
        ...poisonOverview,
        ...dpsOverview,
    },
    "10627": {
        // 无方
        primary: "Spirit",
        ...poisonOverview,
        ...dpsOverview,
    },
    "10225": {
        // 天罗诡道
        primary: "Spunk",
        baseAttack: "PoisonAttackPowerBase",
        attack: "PoisonAttackPower",
        critial: "PhysicsCriticalStrike",
        critialPercent: "PhysicsCriticalStrikeRate",
        criticalDamage: "PhysicsCriticalDamagePower",
        criticalDamagePercent: "PhysicsCriticalDamagePowerPercent",
        hitPercent: "PhysicsHitPercent",
        overcome: "PoisonOvercome",
        overcomePercent: "PoisonOvercomePercent",
        ...dpsOverview,
    },
    "10242": {
        // 焚影圣诀
        primary: "Spunk",
        ...solarOverview,
        ...dpsOverview,
    },
    "10447": {
        // 莫问
        primary: "Spirit",
        ...lunarOverview,
        ...dpsOverview,
    },
    "10615": {
        // 太玄经
        primary: "Spunk",
        ...neutralOverview,
        ...dpsOverview,
    },
    "10015": {
        // 太虚剑意
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10026": {
        // 傲血战意
        primary: "Strength",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10533": {
        // 凌海诀
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10144": {
        // 问水诀
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10145": {
        // 山居剑意
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10224": {
        // 惊羽诀
        primary: "Strength",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10268": {
        // 笑尘诀
        primary: "Strength",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10390": {
        // 分山劲
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10464": {
        // 北傲诀
        primary: "Strength",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10585": {
        // 隐龙诀
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10698": {
        // 孤锋诀
        primary: "Strength",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10756": {
        // 山海心诀
        primary: "Agility",
        ...physicsOverview,
        ...dpsOverview,
    },
    "10786": {
        // 周天功
        primary: "Spunk",
        ...neutralOverview,
        ...dpsOverview,
    },
    "10028": {
        // 离经易道
        primary: "Spirit",
        critial: "NeutralCriticalStrike",
        critialPercent: "NeutralCriticalStrikeRate",
        criticalDamage: "NeutralCriticalDamagePower",
        criticalDamagePercent: "NeutralCriticalDamagePowerPercent",
        ...healOverview,
    },
    "10080": {
        // 云裳心经
        primary: "Spirit",
        critial: "LunarCriticalStrike",
        critialPercent: "LunarCriticalStrikeRate",
        criticalDamage: "LunarCriticalDamagePower",
        criticalDamagePercent: "LunarCriticalDamagePowerPercent",
        ...healOverview,
    },
    "10176": {
        // 补天诀
        primary: "Spirit",
        critial: "PoisonCriticalStrike",
        critialPercent: "PoisonCriticalStrikeRate",
        criticalDamage: "PoisonCriticalDamagePower",
        criticalDamagePercent: "PoisonCriticalDamagePowerPercent",
        ...healOverview,
    },
    "10448": {
        // 相知
        primary: "Spirit",
        critial: "LunarCriticalStrike",
        critialPercent: "LunarCriticalStrikeRate",
        criticalDamage: "LunarCriticalDamagePower",
        criticalDamagePercent: "LunarCriticalDamagePowerPercent",
        ...healOverview,
    },
    "10626": {
        // 灵素
        primary: "Spirit",
        critial: "PoisonCriticalStrike",
        critialPercent: "PoisonCriticalStrikeRate",
        criticalDamage: "PoisonCriticalDamagePower",
        criticalDamagePercent: "PoisonCriticalDamagePowerPercent",
        ...healOverview,
    },
    "10002": {
        // 洗髓经
        ...tankOverview,
        ...dpsOverview,
        overcomePercent: "SolarOvercomePercent",
        hitPercent: "SolarHitPercent",
    },
    "10062": {
        // 铁牢律
        ...tankOverview,
        ...dpsOverview,
        overcomePercent: "PhysicsOvercomePercent",
        hitPercent: 'PhysicsHitPercent',
    },
    "10243": {
        // 明尊琉璃体
        ...tankOverview,
        ...dpsOverview,
        overcomePercent: "SolarOvercomePercent",
        hitPercent: "SolarHitPercent",
    },
    "10389": {
        // 铁骨衣
        ...tankOverview,
        ...dpsOverview,
        overcomePercent: "PhysicsOvercomePercent",
        hitPercent: 'PhysicsHitPercent',
    },
};

export const compareAttrs = {
    primary: "主属性",
    baseAttack: "基础攻击",
    attack: "攻击",
    therapyBase: "基础治疗量",
    therapy: "治疗量",
    critial: "会心等级",
    critialPercent: "会心",
    criticalDamage: "会效等级",
    criticalDamagePercent: "会效",
    overcome: "破防等级",
    overcomePercent: "破防",
    haste: "加速等级",
    hastePercent: "加速",
    strain: "无双等级",
    strainPercent: "无双",
    surplus: "破招",
    life: "气血值",
    physicsShield: "外功防御等级",
    physicsShieldPercent: "外功防御",
    magicShield: "内功防御等级",
    magicShieldPercent: "内功防御",
    toughness: "御劲",
    toughnessPercent: "御劲",
    decriticalDamage: "化劲等级",
    decriticalDamagePercent: "化劲",
    dodge: "闪躲等级",
    dodgePercent: "闪躲",
    parry: "招架等级",
    parryPercent: "招架",
    parryValue: "拆招",
};

export const sortedCompareAttrs = {
    std: [
        "primary",
        "baseAttack",
        "therapyBase",
        "therapy",
        "attack",
        // "critial",
        "critialPercent",
        // "criticalDamage",
        "criticalDamagePercent",
        // "overcome",
        "overcomePercent",
        // "haste",
        "hastePercent",
        // "strain",
        "strainPercent",
        "surplus",
        "life",
        // "physicsShield",
        "physicsShieldPercent",
        // "magicShield",
        "magicShieldPercent",
        // "toughness",
        "toughnessPercent",
        // "decriticalDamage",
        "decriticalDamagePercent",
        // "dodge",
        "dodgePercent",
        // "parry",
        "parryPercent",
        "parryValue",
    ],
    origin: [
        "primary",
        "baseAttack",
        "therapyBase",
        "therapy",
        "attack",
        // "critial",
        "critialPercent",
        // "criticalDamage",
        "criticalDamagePercent",
        "overcome",
        // "overcomePercent",
        // "haste",
        "hastePercent",
        // "strain",
        "strainPercent",
        "surplus",
        "life",
        // "physicsShield",
        "physicsShieldPercent",
        // "magicShield",
        "magicShieldPercent",
        // "toughness",
        "toughnessPercent",
        // "decriticalDamage",
        "decriticalDamagePercent",
        // "dodge",
        "dodgePercent",
        // "parry",
        "parryPercent",
        "parryValue",
    ]
};

export default overviewDisplay;
