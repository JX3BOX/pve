<template>
    <div class="m-equip-misc">
        <div v-if="requireLevel" class="u-equip-level isBasic">需要等级{{ requireLevel }}</div>
        <div v-if="requireSchool" class="u-equip-level isBasic">需要门派{{ requireSchool }}</div>
        <div v-if="requireGender" class="u-equip-level isBasic">仅{{ requireGender }}可穿戴</div>
        <div v-if="requireCamp" class="u-equip-level isBasic">需要{{ requireCamp }}</div>

        <div class="u-equip-durability isBasic" v-if="~~equip.MaxDurability">
            耐久度：{{ equip.MaxDurability }}/{{ equip.MaxDurability }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import forceid from "@jx3box/jx3box-data/data/xf/forceid.json";

export default {
    name: "EquipMisc",
    computed: {
        ...mapGetters(["equip"]),
        requireLevel() {
            for (let i = 1; i <= 6; i++) {
                if (this.equip[`Require${i}Type`] == 5) {
                    return this.equip[`Require${i}Value`];
                }
            }
            return false;
        },
        requireSchool() {
            for (let i = 1; i <= 6; i++) {
                if (this.equip[`Require${i}Type`] == 6) {
                    const forceID = this.equip[`Require${i}Value`];
                    return forceid[forceID];
                }
            }
            return false;
        },
        requireGender() {
            for (let i = 1; i <= 6; i++) {
                if (this.equip[`Require${i}Type`] == 7) {
                    return this.equip[`Require${i}Value`] == "1" ? "男性" : "女性";
                }
            }
            return false;
        },
        requireCamp() {
            for (let i = 1; i <= 6; i++) {
                if (this.equip[`Require${i}Type`] == 100) {
                    switch (this.equip[`Require${i}Value`]) {
                        case 1:
                            return "中立";
                        case 2:
                        case 3:
                            return "浩气盟";
                        case 4:
                        case 5:
                            return "恶人谷";
                        case 6:
                            return "浩气盟，或恶人谷";
                        default:
                            return false;
                    }
                }
            }
            return false;
        },
    },
};
</script>
