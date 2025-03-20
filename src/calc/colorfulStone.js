import { AddAttribute } from "./attr.js"

export function AddColorfulStoneAttributes(snapshot, attrs, useHeavy = false) {
    const stone = snapshot[useHeavy ? "TERTIARY_WEAPON" : "PRIMARY_WEAPON"]["stone"];
    if (stone) {
        const embedding = CalcStoneEmbedding(snapshot);
        const stoneAttrs = GetClolrfulAttributes(embedding, stone);
        stoneAttrs.forEach(stoneAttrSlot => {
            if (stoneAttrSlot.active) {
                // console.log(`五彩石：属性节点 ${stoneAttrSlot.attr} 属性值 ${stoneAttrSlot.value}`);
                AddAttribute(attrs, stoneAttrSlot.attr, stoneAttrSlot.value);
            }
        });
    }
}

function CalcStoneEmbedding(snapshot) {
    let totalCount = 0;
    let totalLevel = 0;
    Object.values(snapshot).forEach((equip) => {
        (equip?.embedding || []).forEach((ops) => {
            if (ops?.level > 0) {
                totalCount += 1;
                totalLevel += ops.level;
            }
        });
    });

    return {
        totalCount,
        totalLevel,
    };
}

function GetClolrfulAttributes(stoneCounter, stone) {
    if (stone) {
        return [
            {
                attr: stone.Attribute1ID,
                active:
                    stoneCounter.totalCount >= ~~stone.DiamondCount1 &&
                    stoneCounter.totalLevel >=
                    ~~stone.DiamondIntensity1,
                value: ~~stone.Attribute1Value1,
            },
            {
                attr: stone.Attribute2ID,
                active:
                    stoneCounter.totalCount >= ~~stone.DiamondCount2 &&
                    stoneCounter.totalLevel >=
                    ~~stone.DiamondIntensity2,
                value: ~~stone.Attribute2Value1,
            },
            {
                attr: stone.Attribute3ID,
                active:
                    stoneCounter.totalCount >= ~~stone.DiamondCount3 &&
                    stoneCounter.totalLevel >=
                    ~~stone.DiamondIntensity3,
                value: ~~stone.Attribute3Value1,
            },
        ];
    }
    return [];
}