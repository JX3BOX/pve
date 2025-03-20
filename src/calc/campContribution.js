import contribution from "@/assets/data/pz/camp_contribution.json"
import { AddAttribute } from "./attr";

const levelList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]

/**
 * 叠加战阶基础属性
 * @param {*} attr 属性Array
 * @param {*} client 用不着的客户端版本string
 * @param {*} level 战阶对应等级
 */

export function AddCampContribution(attr, client, level) {
    let levelData = {};
    let roleName = levelList[level]
    levelData = contribution;
    Object.entries(levelData[roleName]).forEach(([attrSlot, attrValue]) => {
        AddAttribute(attr, attrSlot, attrValue);
    });
    // 打印战阶基础属性
    // console.log(levelData[roleName])
}
