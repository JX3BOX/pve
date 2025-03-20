<template>
    <ul class="m-equip-baseinfo isBasic">
        <!-- 白字防御 -->
        <template v-for="(base, index) in baseAttributes">
            <li class="u-equip-defence" :key="index">{{ attributeDesc[base.key] }}{{ base.value }}</li>
        </template>

        <!-- 武器白字 -->
        <template v-if="isWeapon || isSecondaryWeapon">
            <li class="u-equip-weapon-base">
                <span
                    class="damage"
                >{{isWeapon ? '近身':'远程'}}伤害提高 {{ damageRangeDesc(baseAttributes) }}</span>
                <span class="speed">速度 {{ getSpeed(baseAttributes) }}</span>
            </li>
            <li class="u-equip-weapon-add">每秒伤害 {{ damagePerSecond(baseAttributes) }}</li>
        </template>
    </ul>
</template>

<script>
import { mapGetters } from "vuex";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { damageRangeDesc, getSpeed, damagePerSecond } from "@/utils/pz/display.js";
export default {
    name: "EquipBaseAttr",
    computed: {
        ...mapGetters([
            "equip",
            "activeEquip",
            "isWeapon",
            "isSecondaryWeapon",
        ]),
        // 白值属性 内功防御 外功防御 近身武器伤害 武器速度 每秒伤害...
        baseAttributes: function ({ equip }) {
            const baseKeys = ["Base1Type", "Base2Type", "Base3Type"];
            const valKeys = ["Base1Max", "Base2Max", "Base3Max"];

            let baseAttributes = [];

            baseKeys.forEach((key, index) => {
                if (equip[valKeys[index]]) {
                    const base = {
                        key: equip[key],
                        value: equip[valKeys[index]],
                    };

                    baseAttributes.push(base);
                }
            });

            if (this.isWeapon || this.isSecondaryWeapon) {
                baseAttributes = baseAttributes.map((b) => ~~b.value);
            }

            return baseAttributes;
        },
    },
    data() {
        return {
            attributeDesc,
        };
    },
    methods: {
        damageRangeDesc,
        getSpeed,
        damagePerSecond,
    },
};
</script>
