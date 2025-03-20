/**
 * 增加属性
 * 如原属性Array不存在此节点则创建
 * 如原属性Array  存在此节点则对同一节点进行数值加
 * @param {*} attr 属性Array
 * @param {*} attrSlot 属性节点
 * @param {*} attrValue 属性值
 */
export function AddAttribute(attr, attrSlot, attrValue) {
    if (true || attrValue) {
        if (!attr[attrSlot]) {
            attr[attrSlot] = 0;
        }
        attr[attrSlot] += attrValue;
    }
}

/**
 * 选取有效param
 * @param {*} param1
 * @param {*} param2
 * @return {number} 有效属性值
 */
export function GetAttributeValueFromParams(param1, param2) {
    const attributeValue = ~~param1 || ~~param2; // 用以在不确定哪个param有值的情况下选取有效Param
    return attributeValue;
}

/**
 * 西山居式先加后乘运算
 * @param {*} source 原属性值
 * @param {*} add 待相加的值
 * @param {*} addPercent 待相乘的值
 * @returns 先加后乘后的结果
 */
export function AddAndMultiply(source, add, addPercent) {
    const added = source + add;
    const percentPlus1 = 1 + addPercent / 1024;
    return Math.floor(added * percentPlus1);
}

/**
 * 西山居式->千基<-先加后乘运算
 * @param {*} source 原属性值
 * @param {*} add 待相加的值
 * @param {*} addPercent 待相乘的千基值
 * @returns 先加后乘后的结果
 */
 export function AddAndMultiplyByKilo(source, add, addPercent) {
    const added = source + add;
    const percentPlus1 = 1 + addPercent / 1000;
    return Math.floor(added * percentPlus1);
}

/**
 * 安全获取属性节点的值的方法
 * @param {*} attr 属性Array
 * @param {*} attrSlot 属性节点
 * @param {*} isFloat 是否返回浮点值or向下取整值
 * @returns 属性节点存在则返回属性值，否则返回0
 */
 export function GetAttr(attr, attrSlot, isFloat = false) {
    if (attr[attrSlot])
        return isFloat ? attr[attrSlot] : ~~attr[attrSlot];
    else
        return 0;
}

/**
 * 获取属性转换值
 * @param {*} sourceAttrArray 属性Array
 * @param {*} attrFromSlot 源属性节点
 * @param {*} attrCofSlot 转换系数节点
 * @returns 属性转换量
 */
export function GetAttributeConvert(sourceAttrArray, attrFromSlot, cofAttrArray, attrCofSlot) {
    const from = GetAttr(sourceAttrArray, attrFromSlot);
    const cof = GetAttr(cofAttrArray, attrCofSlot, true);
    return Math.floor(from * cof / 1024)
}

/**
 * 叠加 KSkillParse 输出中的属性
 * @param {*} attr 属性Array
 * @param {*} parseResult KSkillParse输出
 */
export function ApplyKSkillParse(attr, parseResult) {
    const skillAttributes = parseResult.skillAttributes;
    skillAttributes.forEach(attrSlot => {
        const calcAttr = ConvertAttribute(attrSlot.ATTRIBUTE_TYPE)
        if (calcAttr) {
            if (calcAttr["isValue"]) {
                const attributeValue = GetAttributeValueFromParams(attrSlot.param1, attrSlot.param2);
                AddAttribute(attr, calcAttr.AttributeSlot, attributeValue);
            }
        }
    });
}