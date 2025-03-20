import { AddMountAttribute } from "../mount.js";
import { AddEquipAttributes, AddEquipEmbeddingAttributes, AddEquipEnhanceAttributes } from "@/calc/equip.js";
import { AddBaseAttributes } from "../baseAttr.js"
import { GetPanel } from "./panel.js";
import { AddSystemAttributes } from "../systemAttr.js";
import { AddColorfulStoneAttributes } from "../colorfulStone.js";
import { AddSetAttributes } from "../setAttr.js";
import { AddTalentAttrs } from "./talent.js";

function calculateAttrib({snapshot, mount, setCollection, schema_client = "origin", useHeavy = false, talentCode = [], bodyType = 0}) {
    // useHeavy = true;
    // console.log('collection',setCollection);
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
            }
        }
    });
    AddSetAttributes(attrs, setCollection);
    AddColorfulStoneAttributes(snapshot, attrs, useHeavy);
    AddSystemAttributes(attrs, "origin");
    AddMountAttribute(mount, "origin", attrs, useHeavy);
    AddTalentAttrs(attrs, mount, talentCode);
    AddBaseAttributes(attrs, schema_client, bodyType)
    // console.log("计算心法加成后属性：")
    // console.log(attrs);

    return GetPanel(attrs);
}
export {
    calculateAttrib
}


