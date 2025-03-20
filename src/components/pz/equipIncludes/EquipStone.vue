<template>
    <ul class="m-equip-stone">
        <!-- 五彩石镶嵌孔（未镶嵌） -->
        <template v-if="!stone">
            <li class="inactive">
                <img
                    src="@/assets/img/pz/stones/empty-slot.jpg"
                    class="slot"
                    alt=""
                />
                <span>&lt;只能镶嵌五彩石&gt;</span>
            </li>
        </template>

        <!-- 五彩石镶嵌孔（已镶嵌） -->
        <template v-if="stone">
            <li
                v-for="(attribute, index) in stoneAttributes"
                :class="attribute.active ? 'hole-active' : 'inactive'"
                :key="'stone-attribute-' + attribute.attr"
            >
                <img
                    v-if="index === 0"
                    :src="stone.icon | iconLink"
                    class="slot"
                />
                <span v-else class="slot"></span>
                <span>{{stoneAttributeDesc(attribute, stone, index)}}
                </span>
            </li>
        </template>
    </ul>
</template>

<script>
import { mapGetters } from "vuex";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
export default {
    name: "EquipStone",
    data() {
        return {
            attributeDesc
        }
    },
    computed: {
        ...mapGetters(["activeSnapshot", "stoneCounter"]),
        stone: function ({ activeSnapshot }) {
            return activeSnapshot?.stone || null;
        },
        stoneAttributes: function ({ stoneCounter, stone }) {
            if (stone) {
                return [
                    {
                        attr: stone.Attribute1ID,
                        active:
                            stoneCounter.totalCount >= ~~stone.DiamondCount1 &&
                            stoneCounter.totalLevel >=
                                ~~stone.DiamondIntensity1,
                        value: extraSecondaryAttr(stone.Attribute1ID, ~~stone.Attribute1Value1),
                    },
                    {
                        attr: stone.Attribute2ID,
                        active:
                            stoneCounter.totalCount >= ~~stone.DiamondCount2 &&
                            stoneCounter.totalLevel >=
                                ~~stone.DiamondIntensity2,
                        value: extraSecondaryAttr(stone.Attribute2ID, ~~stone.Attribute2Value1),
                    },
                    {
                        attr: stone.Attribute3ID,
                        active:
                            stoneCounter.totalCount >= ~~stone.DiamondCount3 &&
                            stoneCounter.totalLevel >=
                                ~~stone.DiamondIntensity3,
                        value: extraSecondaryAttr(stone.Attribute3ID, ~~stone.Attribute3Value1),
                    },
                ].filter(s => s.attr);
            }
            return [];
        },
    },
    methods: {
        stoneAttributeDesc: function(attribute, stone, index) {
            if(attribute.attr == 'atExecuteScript') {
                return stone[`Attribute${index + 1}Value2`];
            }else {
                return attributeDesc[attribute.attr] + attribute.value;
            }
        }
    }
};
</script>
