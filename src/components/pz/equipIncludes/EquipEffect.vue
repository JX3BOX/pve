<!-- 主动技能 -->
<template>
    <div class="m-equip-effect" v-if="effects">
        <div
            class="u-equip-effect"
            v-for="(effect, index) in effects"
            :key="index"
            :class="'isFont-' + effect.font"
        >
            {{ effect.text }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { extractTextContent } from "@/utils/pz/stringFormat.js";
export default {
    name: "EquipEffect",
    computed: {
        ...mapGetters(["equip"]),
        effects: function ({ equip }) {
            let effects = [];
            if (equip._SkillDesc) {
                effects = extractTextContent(equip._SkillDesc);
            }
            return effects;
        },
    },
    methods: {},
};
</script>
