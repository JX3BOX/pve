import { AddMountAttribute } from "../mount.js";
import { AddEquipAttributes, AddEquipEmbeddingAttributes, AddEquipEnhanceAttributes, AddEquipEnchantAttributes } from "@/calc/equip.js";
import { AddBaseAttributes } from "../baseAttr.js"
import { GetPanel } from "./panel.js";
import { AddSystemAttributes } from "../systemAttr.js";
import { AddColorfulStoneAttributes } from "../colorfulStone.js";
import { AddSetAttributes } from "../setAttr.js";
import { AddTalentAttrs } from "./talent.js";
import { AddAdditionalAttribute } from "./additionalAttribute.js";

function calculateAttrib({snapshot, mount, setCollection, schema_client = "std", useHeavy = false, talentCode = []}) {
    // useHeavy = true;
    let attrs = {};
    Object.entries(snapshot).forEach(([key, equipSlot]) => {
        if (equipSlot?.equip) {
            if (!((!useHeavy && key === "TERTIARY_WEAPON") || (useHeavy && key === "PRIMARY_WEAPON"))) {

                // 装备基础属性（白字绿字）
                AddEquipAttributes(equipSlot, attrs, schema_client);

                // embedding/镶嵌
                AddEquipEmbeddingAttributes(equipSlot, attrs, schema_client);

                // enhance/小附魔
                AddEquipEnhanceAttributes(equipSlot, attrs);

                // enchant/大附魔
                AddEquipEnchantAttributes(equipSlot, attrs);
            }
        }
    });
    AddSetAttributes(attrs, setCollection);
    AddColorfulStoneAttributes(snapshot, attrs, useHeavy);
    AddSystemAttributes(attrs, "std");
    AddMountAttribute(mount, "std", attrs, useHeavy);
    AddAdditionalAttribute(attrs, mount); //重制 1.0.0.5468 增加公共额外属性
    AddTalentAttrs(attrs, mount, talentCode);
    AddBaseAttributes(attrs, schema_client, 0) //重制默认0，即M1
    // console.log("计算心法加成后属性：")
    // console.log(attrs);

    return GetPanel(attrs);
}
export {
    calculateAttrib
}


