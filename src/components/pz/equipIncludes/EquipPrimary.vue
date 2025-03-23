<template>
    <ul class="m-equip-primary isBasic">
        <template v-for="primary in primaryAttribute">
            <li class="u-equip-primary" :key="primary.key">
                <span class="default-value">{{ primaryAttributeDesc[primary.key] }}{{ primary.base }}</span>
                <span class="grow-value isStrength" v-if="activeSnapshot.strength > 0"> (+{{ primary.value }}) </span>
                <span class="u-magic-decrease" v-if="showMagicChangeDown(primary.key)">
                    <img src="@/assets/img/pz/magic_change/rankingpanel_21.png" alt="" />
                </span>
            </li>
        </template>
    </ul>
</template>

<script>
import { mapGetters } from "vuex";
import { primaryAttribute } from "@/assets/data/pz/equip_settings.js";

import primaryAttributeDesc from "@/assets/data/pz/attr_desc_primary.json";

import { getStrengthScore } from "@/utils/pz/score.js";
export default {
    name: "EquipPrimary",
    computed: {
        ...mapGetters(["equip", "activeSnapshot", "schema_client"]),
        // 主属性 体质 元气 根骨 身法 力道...
        primaryAttribute: function ({ equip, activeSnapshot, schema_client }) {
            // 洗练属性处理
            let magic_change = activeSnapshot.magic_change;
            // ==============
            const _primaryAttribute = [];
            for (const key in equip) {
                if (key.startsWith("_Magic") && equip[key]) {
                    const _key = equip[key]["attr"][0];
                    let base = ~~equip[key]["attr"][1];
                    // 处理缘起装备升品 大概在这
                    if (activeSnapshot?.GrowthLevel > 0) {
                        base = Math.floor((base * (activeSnapshot?.GrowthLevel + equip.Level)) / equip.Level);
                    }
                    // 熔铸属性需要base减一下
                    if (magic_change && magic_change.from == _key) {
                        base += magic_change.from_value;
                    }
                    if (primaryAttribute.includes(_key)) {
                        const primary = {
                            key: _key,
                            base,
                            value: getStrengthScore(base, ~~activeSnapshot.strength, schema_client, ~~equip.Level),
                        };
                        _primaryAttribute.push(primary);
                    }
                }
            }
            return _primaryAttribute;
        },
    },
    data() {
        return {
            primaryAttributeDesc,
        };
    },
    methods: {
        showMagicChangeDown: function (key) {
            return this.activeSnapshot.magic_change && this.activeSnapshot.magic_change.from == key;
        },
    },
};
</script>
