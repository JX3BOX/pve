/**
 * 获取五行石图标
 *
 * @param {*} level（五行石等级）
 * @return {*} 返回一个完整的图标url地址
 */
function getEmbedIcon(level) {
    return require("@/assets/img/pz/embeddings/" + level + ".png");
}

/**
 * 镶嵌激活属性加成值
 * @param {Number} base 属性基数
 * @param {Number} level 镶嵌的五行石等级
 * @param {Number} client 所属客户端版本
 * @returns {Number} 镶嵌激活属性加成值
 */
function getAttributEmbedValue(base, level, client = 'std') {
    let coefficients = 0;
    if (client === "std") {
        if (level > 6) {
            coefficients = (level * 0.65 - 3.2) * 1.3;
        } else {
            coefficients = level * 0.195;
        }
    } else {
        if (level > 6) {
            coefficients = level * 0.55 - 2.48;
        } else {
            coefficients = level * 0.15;
        }
        coefficients *= 1300 / 200;
        // 怀旧服两个赛季均对 coefficients 通过一个统一的系数修正，对应反编译函数为 KGItemInfoList::AttribMountDiamond
        // v13 = v12 * 2.4;
    }

    return Math.floor(Math.floor(base) * coefficients);
}

export { getEmbedIcon, getAttributEmbedValue };
