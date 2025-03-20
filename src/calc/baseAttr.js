import stdLevelData from "./stdV130/levelData.json"
import originLevelData from "./originV90/levelData.json"
import { AddAttribute } from "./attr";

const roleTypeName = ["m1", "m2", "f2", "m3", "f3", "m1", "f1"];

/**
 * 叠加体型基础属性
 * @param {*} attr 属性Array
 * @param {*} client 客户端版本string
 * @param {*} bodyType 体型值
 */
export function AddBaseAttributes(attr, client, bodyType) {
    let levelData = {};
    let roleName = roleTypeName[bodyType]
    if (client === "origin")
        levelData = originLevelData;
    else
        levelData = stdLevelData;
    Object.entries(levelData[roleName]).forEach(([attrSlot, attrValue]) => {
        AddAttribute(attr, attrSlot, attrValue);
    });
    // 打印体型基础属性
    // console.log(levelData[roleName])
}