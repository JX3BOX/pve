<!-- 大附魔 -->
<template>
    <div class="m-equip-enchant" v-if="enchants">
        <template v-if="enchantWithText">
            <div class="u-equip-enchant" v-for="(enchant, index) in enchants" :key="'enchant' + index">
                <img src="@/assets/img/pz/enhance/enchant.png" class="pic" />
                <span class="value">{{ enchant && enchant.text }}</span>
            </div>
        </template>
        <div class="u-equip-enchant" v-else>
            <img src="@/assets/img/pz/enhance/enchant.png" class="pic" />
            <span class="value">{{ enchants }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { extractTextContent } from "@/utils/pz/stringFormat.js";
export default {
    name: "EquipEnchant",
    computed: {
        ...mapGetters(["activeSnapshot"]),
        enchants: function () {
            const enchant =
                this.activeSnapshot?.enchant?._AttriName ||
                this.activeSnapshot?.enchant?.AttriName;

            const _extra = extractTextContent(enchant)

            // 如果存在两个，则合并
            if (_extra?.length > 1) {
                const text = _extra[0].text + _extra[1].text

                return [{
                    text
                }]
            }

            return _extra?.length && _extra || enchant;
        },
        enchantWithText: function (){
            return Array.isArray(this.enchants) && this.enchants.length
        }
    },
};
</script>
