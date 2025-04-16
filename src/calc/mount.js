/**
 * 心法属性（LuaAttribute）解析
 */

import { ConvertAttribute } from "./lua_attribute_convert.js"
import MountRawAttributesStd from "./stdV130/MountRawAttributes.json"
import MountRawAttributesOrigin from "./originV90/MountRawAttributes.json"
import MountExtraStd from "./stdV130/mount_extra.json"
import MountExtraOrigin from "./originV90/mount_extra.json"
import { AddAttribute, GetAttributeValueFromParams } from "./attr.js"

/**
 * 叠加心法属性
 * @param {string} mount 心法id
 * @param {*} attr 目标属性Array
 */
function AddMountAttribute(mount, version, attr, useHeavy = false) {
    let MountRawAttributes = {};
    let MountExtra = {};
    if (version === "origin"){
        MountRawAttributes = MountRawAttributesOrigin;
        MountExtra = MountExtraOrigin;
    }
    else{
        MountRawAttributes = MountRawAttributesStd;
        MountExtra = MountExtraStd;
    }
    // 对藏剑双心法基础属性不同的特殊处理，使用轻重剑判断心法
    if (mount === "10144" && useHeavy) {
        mount = "10145";
    }
    const mountAttributes = MountRawAttributes[mount].skillAttributes;
    mountAttributes.forEach(attrSlot => {
        const calcAttr = ConvertAttribute(attrSlot.ATTRIBUTE_TYPE)
        if (calcAttr) {
            if (calcAttr["isValue"]) {
                const attributeValue = GetAttributeValueFromParams(attrSlot.param1, attrSlot.param2);
                AddAttribute(attr, calcAttr.AttributeSlot, attributeValue);
            }
        }
    });

    const mountExtraAttrs = MountExtra[mount] || {};
    Object.entries(mountExtraAttrs).forEach(([key, attrArray]) => {
        attrArray.forEach(extraAttr => {
            // console.log(extraAttr);
            AddAttribute(attr, extraAttr.slot, extraAttr.value);
        });
    });
    // 打印当前心法属性
    // console.log(MountRawAttributes[mount])
}
export { AddMountAttribute }
