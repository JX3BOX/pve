const equip_attributes = {
    Surplus: "破招",
    Strain: "无双",
    Haste: "加速",
    Critical: "会心",
    CriticalDamage: "会效",
    Overcome: "破防",
    Hit: "命中",
    PhysicsShield: "外防",
    MagicShield: "内防",
    Dodge: "闪避",
    Parry: "招架",
    Toughness: "御劲",
    Decritical: "化劲",
    PVXAllRound: "全能",
};

const primaryAttribute = ["atVitalityBase", "atSpunkBase", "atSpiritBase", "atStrengthBase", "atAgilityBase"];

const xf_subtypes = {
    // mount: subtype 1内2外3坦4奶
    10003: 1, // 易筋经
    10014: 1, // 紫霞功
    10021: 1, // 花间游
    10081: 1, // 冰心诀
    10175: 1, // 毒经
    10627: 1, // 无方
    10225: 1, // 天罗诡道
    10242: 1, // 焚影圣诀
    10447: 1, // 莫问
    10615: 1, // 太玄经
    10015: 2, // 太虚剑意
    10026: 2, // 傲血战意
    10533: 2, // 凌海诀
    10144: 2, // 问水诀
    10145: 2, // 山居剑意
    10224: 2, // 惊羽诀
    10268: 2, // 笑尘诀
    10390: 2, // 分山劲
    10464: 2, // 北傲诀
    10585: 2, // 隐龙诀
    10698: 2, // 孤锋诀
    10756: 2, // 山海心诀
    10786: 1, // 周天功
    10028: 4, // 离经易道
    10080: 4, // 云裳心经
    10176: 4, // 补天诀
    10448: 4, // 相知
    10626: 4, // 灵素
    10002: 3, // 洗髓经
    10062: 3, // 铁牢律
    10243: 3, // 明尊琉璃体
    10389: 3, // 铁骨衣
};

const xf_primary_attributes = {
    10003: "元气", // 易筋经
    10014: "根骨", // 紫霞功
    10021: "元气", // 花间游
    10081: "根骨", // 冰心诀
    10175: "根骨", // 毒经
    10627: "根骨", // 无方
    10225: "元气", // 天罗诡道
    10242: "元气", // 焚影圣诀
    10447: "根骨", // 莫问
    10615: "元气", // 太玄经
    10015: "身法", // 太虚剑意
    10026: "力道", // 傲血战意
    10533: "身法", // 凌海诀
    10144: "身法", // 问水诀
    10145: "身法", // 山居剑意
    10224: "力道", // 惊羽诀
    10268: "力道", // 笑尘诀
    10390: "身法", // 分山劲
    10464: "力道", // 北傲诀
    10585: "身法", // 隐龙诀
    10698: "力道", // 孤锋诀
    10786: "元气", // 周天功
    10028: "根骨", // 离经易道
    10080: "根骨", // 云裳心经
    10176: "根骨", // 补天诀
    10448: "根骨", // 相知
    10626: "根骨", // 灵素
    10002: "体质", // 洗髓经
    10062: "体质", // 铁牢律
    10243: "体质", // 明尊琉璃体
    10389: "体质", // 铁骨衣
    10756: "身法", // 山海心诀
};

const xf_attrs = {
    10003: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10014: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10021: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10081: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10175: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10225: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10242: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10447: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10615: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10015: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10026: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10533: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10144: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10145: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10224: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10268: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10390: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10464: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10585: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10698: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10627: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10756: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10786: ["Critical", "CriticalDamage", "Overcome", "Hit", "Strain", "Haste", "Surplus", "Toughness", "Decritical"],
    10028: ["Critical", "CriticalDamage", "Haste", "Toughness", "Decritical"],
    10080: ["Critical", "CriticalDamage", "Haste", "Toughness", "Decritical"],
    10176: ["Critical", "CriticalDamage", "Haste", "Toughness", "Decritical"],
    10448: ["Critical", "CriticalDamage", "Haste", "Toughness", "Decritical"],
    10626: ["Critical", "CriticalDamage", "Haste", "Toughness", "Decritical"],
    10002: ["PhysicsShield", "MagicShield", "Dodge", "Parry", "Hit", "Surplus", "Haste", "Toughness", "Decritical"],
    10062: ["PhysicsShield", "MagicShield", "Dodge", "Parry", "Hit", "Surplus", "Haste", "Toughness", "Decritical"],
    10243: ["PhysicsShield", "MagicShield", "Dodge", "Parry", "Hit", "Surplus", "Haste", "Toughness", "Decritical"],
    10389: ["PhysicsShield", "MagicShield", "Dodge", "Parry", "Hit", "Surplus", "Haste", "Toughness", "Decritical"],
};

const pv_types = {
    PVE: 1,
    PVP: 2,
    PVX: 3,
};

const equip_from = [
    "套装兑换",
    "名剑大会",
    "副本",
    "商店",
    "生活技能",
    "声望",
    "侠行点",
    "威名点",
    "活动",
    "拍卖",
    "任务",
    "名望",
    "掉落",
];

const equip_quality = {
    std: {
        range: [5600, 6430],
        max: 6430,
        min: 4200,
        step: 5,
    },
    origin: {
        range: [125, 151],
        max: 151,
        min: 90,
        step: 1,
    },
};

const role_types = [
    {
        text: "成男",
        value: 1,
    },
    {
        text: "成女",
        value: 2,
    },
    {
        text: "正太",
        value: 5,
    },
    {
        text: "萝莉",
        value: 6,
    },
];

const equip_camp = {
    2: "浩气盟",
    4: "恶人谷",
};


export {
    equip_attributes,
    xf_subtypes,
    pv_types,
    equip_quality,
    xf_attrs,
    xf_primary_attributes,
    primaryAttribute,
    role_types,
    equip_from, equip_camp,
};
