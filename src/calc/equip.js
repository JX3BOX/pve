import { AddAttribute, GetAttributeValueFromParams } from "./attr.js";
import strengthable from "@/assets/data/pz/strengthable_attrs.json";
import { getStrengthScore } from "@/utils/pz/score.js";
import { getAttributEmbedValue } from "@/utils/pz/embedding.js";

export function AddEquipEnhanceAttributes(equipSlot, attrs) {
    const enhance = equipSlot?.enhance;
    if (enhance) {
        const enhanceAttributeSlot = enhance.Attribute1ID;
        const enhanceAttributeValue = ~~enhance.Attribute1Value1 || ~~enhance.Attribute1Value2;
        if (!attrs[enhanceAttributeSlot]) {
            attrs[enhanceAttributeSlot] = 0;
        }
        attrs[enhanceAttributeSlot] += enhanceAttributeValue;
    }
}

/**
 * 叠加装备镶嵌属性
 * @param {*} equipSlot 装备槽位
 * @param {*} attrs 属性Array
 * @param {*} client 客户端分支
 */
export function AddEquipEmbeddingAttributes(equipSlot, attrs, client) {
    const embedding = equipSlot?.embedding;
    embedding.forEach(embeddingSlot => {
        if (embeddingSlot.level) {
            const slotAttributeSlot = embeddingSlot.raw[0];
            const attributeBaseCoefficient = GetAttributeValueFromParams(embeddingSlot.raw[1], embeddingSlot.raw[3]); // raw[1]为Param1 Max，raw[3]为Param2 Max，用以选取有效Param
            const embeddingLevel = embeddingSlot.level;
            let embeddingAttribDelta = getAttributEmbedValue(attributeBaseCoefficient, embeddingLevel, client);

            AddAttribute(attrs, slotAttributeSlot, embeddingAttribDelta);
        }
    });
}

export function AddEquipAttributes(equipSlot, attrs, client) {
    const baseKeys = ["Base1Type", "Base2Type", "Base3Type"];
    const valKeys = ["Base1Max", "Base2Max", "Base3Max"];

    const equip = equipSlot?.equip;
    const strength = equipSlot.strength;
    const magicChange = equipSlot.magic_change;

    // 内外防 武器伤害 balabala
    baseKeys.forEach((_key, index) => {
        if (equip[valKeys[index]]) {
            AddAttribute(attrs, equip[_key], ~~equip[valKeys[index]]);
        }
    });

    // 主副属性
    for (const pKey in equip) {
        if (pKey.startsWith("_Magic") && equip[pKey]) {
            const attrSlot = equip[pKey]['attr'][0];
            const _val = GetAttributeValueFromParams(equip[pKey]['attr'][1], equip[pKey]['attr'][3]);

            // 怀旧服V80的洗练属性附加,突然混入的下划线命名法让我充满罪恶感
            // _val 是个 const，让我很想改成 let，但是感觉不太好， 于是后买你就有了三个数相加的操作
            let magicChangeVal = 0;
            if (magicChange && attrSlot == magicChange.from)
                magicChangeVal = magicChange.from_value;

            // 计算精炼的增加属性
            let strengthVal = 0;
            if (strengthable.includes(attrSlot)) {
                if (strength)
                    strengthVal = getStrengthScore(_val + magicChangeVal, strength, client, ~~equip.Level);
            }

            AddAttribute(attrs, attrSlot, _val + magicChangeVal + strengthVal)
        }
    }

    //添加完毕装备自带属性之后如果有洗练新增的属性，则计算洗脸新增属性的精炼数值并添加这些属性
    //这段代码或许和上面遍历装备属性进行添加的类似逻辑抽象成一个函数，但是我懒得这么写了！
    if (magicChange) {
        const attrSlot = magicChange.to;
        const _val = magicChange.to_value;
        let strengthVal = 0;
        if (strengthable.includes(attrSlot)) {
            if (strength)
                strengthVal = getStrengthScore(_val, strength, client, ~~equip.Level);
        }
        AddAttribute(attrs, attrSlot, _val + strengthVal);
    }
}


export function AddEquipEnchantAttributes(equipSlot, attrs) {
    const equipEnchantAttrs = equipSlot.enchant._Attrs;
    if (equipEnchantAttrs) {
        equipEnchantAttrs.forEach(enchantAttr => {
            const attrSlot = enchantAttr[0];
            const attrValue = GetAttributeValueFromParams(enchantAttr[1], enchantAttr[2])
            AddAttribute(attrs, attrSlot, attrValue);
        });
    }
}
