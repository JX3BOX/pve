/**
 * 将LuaAttribute与实际计算属性节点进行转换
 * 对照关系：https://github.com/JX3BOX/jx3-unpkg/blob/master/docs/数值与属性/lua_attribute_convert.json
 */

import convertMapping from "@/assets/data/pz/lua_attribute_convert.json"

/**
 * Lua属性节点转换为通用属性节点
 * @param {*} luaAttribute lua属性节点
 * @return {*} 转换结果的属性对象，见转换对照表
 */
function ConvertAttribute(luaAttribute) {
    return convertMapping[luaAttribute];
}

export { ConvertAttribute }
