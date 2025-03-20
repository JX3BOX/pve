<template>
    <div class="m-equip-header">
        <div class="m-equip-name">
            <span
                class="u-equip-name"
                :class="'isQuality-' + equip.Quality"
            >{{ equip.Name }}</span>
            <span class="u-equip-star">
                <i class="el-icon-star-on" v-for="i in ~~activeSnapshot.strength" :key="i"></i>
            </span>
        </div>

        <span class="u-equip-strength">
            精炼等级:
            {{ activeSnapshot.strength }}
            /
            {{ equip.MaxStrengthLevel }}
        </span>

        <div class="u-equip-position isBasic">
            <div class="name">{{ positionName }}</div>
            <div class="weapon-type" v-if="isWeapon || isSecondaryWeapon">{{ weaponType }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import equip_map from "@/assets/data/pz/equip_map.json";
import weapon_type from "@/assets/data/pz/weapon_type.json";
export default {
    name: "EquipName",
    computed: {
        ...mapGetters([
            "equip",
            "activeEquip",
            "activeSnapshot",
            "mount",
            "isWeapon",
            "isSecondaryWeapon",
        ]),
        toViewItemDetailUrl: function () {
            return getLink(
                "item",
                equip_map[this.activeEquip]["tab_type"] + "_" + this.equip.ID
            );
        },
        positionName: function () {
            return equip_map[this.activeEquip]?.label;
        },
        weaponType: function () {
            return weapon_type[this.equip?.DetailType];
        },
    },
};
</script>
