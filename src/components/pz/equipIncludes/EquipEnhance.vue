<!-- 小附魔 -->
<template>
    <div class="m-equip-enhance">
        <span class="u-equip-enchane" v-if="enhance">
            <img class="pic" src="@/assets/img/pz/enhance/enhance.png" />
            <span class="text value">{{ enhance.text + enhance.value }}</span>
        </span>
        <span v-else>
            <img class="pic" src="@/assets/img/pz/enhance/enhance-null.png" />
            <span class="text null">未强化</span>
        </span>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
export default {
    name: "EquipEnhance",
    computed: {
        ...mapGetters(["activeSnapshot"]),
        enhance: function ({ activeSnapshot }) {
            if (activeSnapshot.enhance) {
                const attr = activeSnapshot?.enhance?.Attribute1ID
                const val = ~~activeSnapshot?.enhance?.Attribute1Value1 || ~~activeSnapshot?.enhance?.Attribute1Value2
                return {
                    text: val > 0 ? attributeDesc[attr] : attributeDesc[attr] + '降低',
                    value: extraSecondaryAttr(attr, Math.abs(val))
                };
            }
            return ''
        },
    },
};
</script>
