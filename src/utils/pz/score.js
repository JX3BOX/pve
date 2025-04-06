// 镶嵌分数
// https://github.com/JX3BOX/jx3-unpkg/issues/1
// 重制和缘起镶嵌分数计算公式完全一致，仅常量不同

// 系数 A 如无例外情况，则默认等于 8.8 （目前重制与缘起均相同）
// 系数 B 在重制与缘起不同，重制为 8.0，缘起为 2.0
// 系数 C 仅和五彩石有关，在重制与缘起不同，重制为 10.0，缘起为 2.5
const C_A = {
    std: 8.800000000000001,
    origin: 8.800000000000001,
};
const C_B = {
    std: 32.0,
    origin: 1.0,
};
const C_C = {
    std: 50.0,
    origin: 1.0,
};

// 怀旧服装备精炼分数随精炼等级系数表
const originStrengthLookup = [0, 0.009, 0.0234, 0.0432, 0.0684, 0.10971, 0.15831, 0.2142, 0.27738, 0.34785, 0.42561];

/**
 * 1.获取五行石分数（装分）数值在src\utils\pz\embedding.js
 * 老算法:
 * 大于 5 级 则是 (五行石等级 * (五行石等级 - 1) * 0.025 + 0.15) * 系数A * 系数B
 * 小于等于 5 级 则是系数A * 系数B * 五行石等级 * 0.15
 * 新算法:
 * https://github.com/JX3BOX/jx3-unpkg/blob/master/docs/装备强化分数相关分析.md
 * @param {*} level （五行石等级）
 * @param {*} client （客户端版本）
 */
function getEmbeddingScore(level, client = "std") {
    if (client === "std") {
        // 重制1.0.0.5389修改镶嵌分数公式
        if (level > 6) {
            return (level * 0.65 - 3.2) * 1.3 * C_A[client] * C_B[client] * 32000 / 27800;
        } else {
            return level * 1.3 * 0.15 * C_A[client] * C_B[client] * 32000 / 27800;
        }
    }
    else {
        // 缘起2024不知道什么版本血战天策 系数修改 dword是8.8 qword是CurrentSeasonEquipBoxStrengthQulity
        /*
        if ( a1 > 6 )
            result = (double)dword_18002DEA8 / 200.0 * ((v2 * 0.55 - 2.48) * *(double *)&qword_18002DED8);
        else
            result = v2 * *(double *)&qword_18002DED8 * 0.15 * ((double)dword_18002DEA8 / 200.0);
        */
        if (level > 6) {
            return (level * 0.55 - 2.48) * C_A[client] * 6.5;
        } else {
            return level * C_A[client] * 0.15 * 6.5;
        }
    }

}

/**
 * 2.五彩石分数
 * 公式：等级 * (系数A * 系数C) * 3.5
 * @param {*} level（五彩石等级）
 * @param {string} client （客户端版本）
 * @return {*}
 */
function getStoneScore(level, client = "std") {
    if (client === "std")
        return level * 1540;
    else
        return level * 123.2;
}

/**
 * 3.精炼成长
 * 此处仅用作精炼对属性的成长值计算，不适用装分
 * @param {*} base 原数值
 * @param {*} strengthLevel 精炼强度1-8
 * @param {*} client 客户端版本
 * @param {*} equipLevel 装备品级
 */

const getStrengthScore = (base, strengthLevel, client = 'std', equipLevel) => {
    // console.log(base, strengthLevel, client, equipLevel)

    const fx = client === 'std' ? strengthLevel * (0.7 + 0.3 * strengthLevel) / 200 : originStrengthLookup[strengthLevel];
    const gx = strengthLevel * (strengthLevel + 3) / 2;

    const z1 = Math.round((base * fx).toFixed(2));

    const z2 = Math.round(base * 942 * gx / (942 * equipLevel - 7320))

    if (client === 'std') return z1
    if (client === 'origin') return Math.max(z1, z2, 1)
};

/**
 * 装分和品质成长
 * 缘起与重制一致
 * @param {*} base 原装备品质或原装备分数
 * @param {*} strengthLevel 精炼强度1-8
 * @param {*} client 客户端分支
 * @param {*} type 计算的数值类型(quality-品质等级 score-装分)
 * @param {*} equipQuality 装备的品级(颜色)
 * @param {*} equipPosition 装备部位id
 * @param {*} equipLevel 装备等级 装备表内的
 * @returns {number} 如`base`传入装备品质则为品质的精炼提升量，如传入装分则为装分提升量
 */
const getGsStrengthScore = (base, strengthLevel, { client = "std", type, equipQuality, equipPosition, equipLevel } = {}) => {
    if (client === "origin") {
        if (type === "quality") {  // 缘起装备品质使用原有算法 烽火燎原版本品质等级与装备精炼解绑
            // return Math.round(base * originStrengthLookup[strengthLevel]);
            return base * 0;
        }
        // 从装备分数计算装备品质 for 怀旧服新算法
        //const equipQualityLevel = Math.floor(base / equipment_quality_coefficients[equipQuality] / equipment_position_coefficients[equipPosition]);
        const equipQualityLevel = equipLevel;
        // 缘起装分先依据新旧算法取max
        const strengthCoefficientOld = equipQualityLevel * originStrengthLookup[strengthLevel];
        const strengthCoefficientNew = (strengthLevel * (strengthLevel + 3)) * 0.5;

        const finalStrength =   // 根据装分转换表进行对应相乘将品质等级转化为装分
            Math.max(strengthCoefficientOld, strengthCoefficientNew)
            * equipment_quality_coefficients[equipQuality]
            * equipment_position_coefficients[equipPosition];

        return Math.round(finalStrength);
    }
    const strengthCoefficient = (strengthLevel * (0.7 + 0.3 * strengthLevel) / 200).toFixed(6);
    return Math.round(base * strengthCoefficient);
}

// 品质系数
const equipment_quality_coefficients = {
    "1": 0.8, //白
    "2": 1.4, //绿
    "3": 1.6, //蓝
    "4": 1.8, //紫
    "5": 2.5, //橙
};
// 部位系数
const equipment_position_coefficients = {
    "0": 1.2, //武器
    "1": 0.6, //暗器
    "2": 1, //衣服
    "3": 0.9, //帽子
    "4": 0.5, //项链
    "5": 0.5, //戒指
    "6": 0.7, //腰带
    "7": 0.5, //腰坠
    "8": 1, //裤子
    "9": 0.7, //鞋子
    "10": 0.7, //护腕
};

/**
 * 4.装备原始分数
 * 装备分数 = 装等 * 品质系数 * 部位系数
 * @param {*} level 装等
 * @param {*} quality 品质（颜色）
 * @param {*} position 部位
 * @return {*}
 */
function getEquipScore(level, quality, position) {
    return Math.round(level * equipment_quality_coefficients[quality] * equipment_position_coefficients[position]);
}

/**
 * 5.总分计算
 * 装备分数+精炼成长分数+五彩石+五行石
 * @return {*}
 */
function getGlobalScore(total) {
    return parseInt(Math.floor(total + 0.5));
}

/**
 * 6.装分计算
 * 传入格式化装备数据，计算总装分(藏剑双武器/2)
 * @param {*} equipData 传入snapshot进行计算
 */
function getScore(equipData, client) {
    if (equipData) {
        for (let equip in equipData) {
            // let;
        }
    }
    return 0;
}
/** 
* 7.缘起装备升品计算
* 装备分数依据品级计算 属性加成按基础属性*新品级/老品级计算
* @param {*} base 原数值
* @param {*} growthlevel 装备升品
* @param {*} client 客户端版本
* @param {*} equipLevel 装备品级
*/
function getGrowthNewLevel(base, growthlevel, client = 'std', equipLevel) {
    if (client == "std") {
        return 0;
    }
    else {
        return equipLevel = base + growthlevel;
    }
}
function getGrowthNewAttr(base, growthlevel, client = 'std', equipLevel) {
    if (client == "std") {
        return 0;
    }
    else {
        return equipAttr = Math.floor(base * (equipLevel + growthlevel) / growthlevel);
    }
}

export { getEmbeddingScore, getStoneScore, getStrengthScore, getEquipScore, getGlobalScore, getScore, getGsStrengthScore };
