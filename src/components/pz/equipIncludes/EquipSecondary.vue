<template>
    <div class="m-equip-secondary">
        <template v-for="(second, index) in secondaryAttribute">
            <li
                class="u-equip-magic"
                v-if="second.key !== 'atSkillEventHandler' && second.key !== 'atSetEquipmentRecipe'"
                :key="second.key"
            >
                {{ attributeDesc[second.key] }}{{ second.base }}
                <span class="isStrength" v-if="activeSnapshot.strength > 0 && second.value">
                    (+{{ second.value }})
                </span>
                <span class="u-magic-decrease" v-if="showMagicChangeDown(second.key)">
                    <img src="@/assets/img/pz/magic_change/rankingpanel_21.png" alt="" />
                </span>
                <span
                    class="u-magic-increase"
                    v-if="showMagicChangeUp(second.key)"
                    :style="{ color: magicChangeColor(magic_change_level) }"
                >
                    【<img src="@/assets/img/pz/magic_change/rankingpanel_22.png" alt="" />{{ magic_change_display }}】
                </span>
            </li>
            <li class="u-equip-recipe isEffect" v-if="second.key === 'atSetEquipmentRecipe'" :key="second.key + index">
                {{ second.label }}
            </li>
            <li
                class="u-equip-skillevent isEffect"
                v-if="second.key === 'atSkillEventHandler'"
                :key="second.key + index"
            >
                {{ second.label }}
            </li>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { primaryAttribute } from "@/assets/data/pz/equip_settings.js";

import attributeDesc from "@/assets/data/pz/attr_desc.json";

import { getStrengthScore } from "@/utils/pz/score.js";
import { extractTextContent } from "@/utils/pz/stringFormat.js";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
import strengthable from "@/assets/data/pz/strengthable_attrs.json";
import { magic_change_display } from "@/utils/pz/magic_change.js";

export default {
    name: "EquipSecondary",
    data() {
        return {
            attributeDesc,
        };
    },
    computed: {
        ...mapGetters(["equip", "activeSnapshot", "schema_client"]),
        // 副属性 会心会效 无双 破防...
        secondaryAttribute: function ({ equip, activeSnapshot, schema_client }) {
            // 洗练属性处理
            let magic_change = activeSnapshot.magic_change;
            // ==============
            const _secondaryAttribute = [];
            for (const key in equip) {
                if (key.startsWith("_Magic") && equip[key]) {
                    const _key = equip[key]["attr"][0];
                    if (!primaryAttribute.includes(_key)) {
                        let base = ~~equip[key]["attr"][1] || ~~equip[key]["attr"][3];
                        // 处理缘起装备升品 大概在这
                        if (activeSnapshot?.GrowthLevel > 0) {
                            base = Math.floor((base * (activeSnapshot?.GrowthLevel + equip.Level)) / equip.Level);
                        }
                        // 熔铸属性
                        if (magic_change && magic_change.from == _key) {
                            base += magic_change.from_value;
                        }
                        base = extraSecondaryAttr(_key, base);
                        let value = 0;
                        if (strengthable.includes(_key)) {
                            value = getStrengthScore(base, ~~activeSnapshot.strength, schema_client, ~~equip.Level);
                        }
                        const attr = {
                            key: _key,
                            base,
                            value,
                            label: extractTextContent(equip[key]["label"])[0]?.text,
                        };
                        _secondaryAttribute.push(attr);
                    }
                }
            }
            // 洗练新增属性在最后push进去
            if (magic_change && magic_change.to && !primaryAttribute.includes(magic_change.to)) {
                let key = magic_change.to;
                let base = magic_change.to_value;
                let value = 0;
                if (strengthable.includes(key))
                    value = getStrengthScore(base, ~~activeSnapshot.strength, schema_client, ~~equip.Level);

                _secondaryAttribute.push({
                    key,
                    base,
                    value,
                });
            }
            return _secondaryAttribute;
        },
        magic_change_display: function ({ activeSnapshot }) {
            return magic_change_display(activeSnapshot.magic_change?.level);
        },
        magic_change_level: function () {
            return this.activeSnapshot.magic_change.level;
        },
    },
    methods: {
        showMagicChangeUp: function (key) {
            return this.activeSnapshot.magic_change && this.activeSnapshot.magic_change.to == key;
        },
        showMagicChangeDown: function (key) {
            return this.activeSnapshot.magic_change && this.activeSnapshot.magic_change.from == key;
        },
        magicChangeColor: function (level) {
            switch (level) {
                case 1:
                case 2:
                    return "#b8fab2";
                case 3:
                case 4:
                    return "#85f5dc";
                case 5:
                case 6:
                    return "#7eb2fe";
                case 7:
                case 8:
                    return "#d575e3";
                case 9:
                    return "#ed9d56";
                default:
                    return "";
            }
        },
    },
};
</script>
