import { xf_primary_attributes } from "./equip_settings";
import { cloneDeep } from "lodash";

const dps_attrs = [
    {
        label: "面板攻击",
        key: "attack",
    },
    {
        label: "基础攻击",
        key: "baseAttack",
    },
    {
        label: "会心",
        key: "critialPercent",
    },
    {
        label: "会心效果",
        key: "criticalDamagePercent",
    },
    {
        label: "加速",
        key: "haste",
    },
    {
        label: "主属性",
        key: "primary",
    },
    {
        label: "破防",
        key: "overcomePercent",
        subKey: "overcome",
    },
    {
        label: "无双",
        key: "strainPercent",
    },
    {
        label: "破招",
        key: "surplus",
    },
    // TODO: 缘起 命中
    {
        label: "命中",
        key: "hitPercent",
    },
    {
        label: "最大气血值",
        key: "life",
    },
    {
        label: "御劲",
        key: "toughnessPercent",
    },
    {
        label: "化劲",
        key: "decriticalDamagePercent",
    },
];

const tank_attrs = [
    {
        label: "体质",
        key: "parimary",
    },
    {
        label: "最大气血值",
        key: "life",
    },
    {
        label: "外防",
        key: "physicsShieldPercent",
    },
    {
        label: "内防",
        key: "magicShieldPercent",
    },
    {
        label: "御劲",
        key: "toughnessPercent",
    },
    {
        label: "化劲",
        key: "decriticalDamagePercent",
        subKey: "decriticalDamage",
    },
    {
        label: "破招",
        key: "surplus",
    },
    // TODO: 缘起 命中
    {
        label: "命中",
        key: "hitPercent",
    },
    {
        label: "无双",
        key: "strainPercent",
    },
    {
        label: "闪避",
        key: "dodgePercent",
    },
    {
        label: "招架",
        key: "parryPercent",
    },
    {
        label: "拆招",
        key: "parryValue",
    },
    {
        label: "加速",
        key: "haste",
    },
];

const heal_attrs = [
    {
        label: "面板治疗量",
        key: "therapy",
    },
    {
        label: "基础治疗量",
        key: "therapyBase",
    },
    {
        label: "会心",
        key: "critialPercent",
    },
    {
        label: "会心效果",
        key: "criticalDamagePercent",
    },
    {
        label: "加速",
        key: "haste",
    },
    {
        label: "主属性",
        key: "primary",
    },
    {
        label: "外防",
        key: "physicsShieldPercent",
    },
    {
        label: "内防",
        key: "magicShieldPercent",
    },
    {
        label: "破招",
        key: "surplus",
    },
    {
        label: "最大气血值",
        key: "life",
    },
    {
        label: "御劲",
        key: "toughnessPercent",
    },
    {
        label: "化劲",
        key: "decriticalDamagePercent",
    },
];

function replacePrimary(mount, mountType = "dps") {
    if (mountType === "heal") {
        return cloneDeep(heal_attrs).map((attr) => {
            if (attr.key === "primary") {
                attr.label = xf_primary_attributes[mount];
            }
            return attr;
        });
    }
    if (mountType === "tank") {
        return cloneDeep(tank_attrs).map((attr) => {
            if (attr.key === "primary") {
                attr.label = xf_primary_attributes[mount];
            }
            return attr;
        });
    }

    return cloneDeep(dps_attrs).map((attr) => {
        if (attr.key === "primary") {
            attr.label = xf_primary_attributes[mount];
        }
        return attr;
    });
}

export const overview_attrs = {
    10003: replacePrimary(10003), // 易筋经
    10014: replacePrimary(10014), // 紫霞功
    10021: replacePrimary(10021), // 花间游
    10081: replacePrimary(10081), // 冰心诀
    10175: replacePrimary(10175), // 毒经
    10627: replacePrimary(10627), // 无方
    10225: replacePrimary(10225), // 天罗诡道
    10242: replacePrimary(10242), // 焚影圣诀
    10447: replacePrimary(10447), // 莫问
    10615: replacePrimary(10615), // 太玄经
    10015: replacePrimary(10015), // 太虚剑意
    10026: replacePrimary(10026), // 傲血战意
    10533: replacePrimary(10533), // 凌海诀
    10144: replacePrimary(10144), // 问水诀
    10145: replacePrimary(10145), // 山居剑意
    10224: replacePrimary(10224), // 惊羽诀
    10268: replacePrimary(10268), // 笑尘诀
    10390: replacePrimary(10390), // 分山劲
    10464: replacePrimary(10464), // 北傲诀
    10585: replacePrimary(10585), // 隐龙诀
    10698: replacePrimary(10698), // 孤锋诀
    10756: replacePrimary(10756), // 山海心诀
    10786: replacePrimary(10786), // 周天功

    10028: replacePrimary(10028, "heal"), // 离经易道
    10080: replacePrimary(10080, "heal"), // 云裳心经
    10176: replacePrimary(10176, "heal"), // 补天诀
    10448: replacePrimary(10448, "heal"), // 相知
    10626: replacePrimary(10626, "heal"), // 灵素

    10002: replacePrimary(10002, "tank"), // 洗髓经
    10062: replacePrimary(10062, "tank"), // 铁牢律
    10243: replacePrimary(10243, "tank"), // 明尊琉璃体
    10389: replacePrimary(10389, "tank"), // 铁骨衣
};
