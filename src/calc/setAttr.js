import { AddAttribute, GetAttributeValueFromParams } from "./attr";

export function AddSetAttributes(attrs, setCollection) {
    setCollection.forEach(function (setInfo, key, map) {
        const equipActivate = setInfo.count;
        const setAttrList = setInfo.setData;
        if (equipActivate >= 2) {
            for (let index = 2; index <= equipActivate; index++) {
                const attrInfo1 = setAttrList[`${index}_1`];
                if (attrInfo1) {
                    const attrSlot1 = attrInfo1["attr"][0];
                    const attrValue1 = GetAttributeValueFromParams(attrInfo1["attr"][1], attrInfo1["attr"][3]);
                    //console.log(`套装：${attrInfo1} ${attrSlot1} ${attrValue1}`);
                    AddAttribute(attrs, attrSlot1, attrValue1);
                }

                const attrInfo2 = setAttrList[`${index}_2`];
                if (attrInfo2) {
                    const attrSlot2 = attrInfo2["attr"][0];
                    const attrValue2 = GetAttributeValueFromParams(attrInfo2["attr"][1], attrInfo2["attr"][3]);
                    //console.log(`套装：${attrInfo2} ${attrSlot2} ${attrValue2}`);
                    AddAttribute(attrs, attrSlot2, attrValue2);
                }
            }
        }
    });
}