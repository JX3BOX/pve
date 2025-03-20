<template>
    <div class="m-pz">
        <div class="m-pz-container">
            <div class="m-pz-equip-display">
                <Equip />
            </div>
            <div class="m-pz-equip-select">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="equips">
                        <div slot="title" class="u-title">装备选择</div>
                        <EquipFilter />
                    </el-collapse-item>

                    <el-collapse-item name="enchant" v-if="equip">
                        <div slot="title" class="u-title">装备增强</div>
                        <el-form label-position="left" label-width="100px">
                            <el-form-item label="精炼等级" v-if="canStrong">
                                <Strength />
                            </el-form-item>
                            <el-form-item label="小附魔" v-if="hasEnhance">
                                <Enhance />
                            </el-form-item>
                            <el-form-item label="大附魔" v-if="hasEnchant">
                                <Enchant />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item name="xilian" v-if="showXiLian">
                        <div slot="title" class="u-title">装备熔铸</div>
                        <magic-change />
                    </el-collapse-item>
                    <el-collapse-item name="stones" v-if="hasEmbedding">
                        <div slot="title" class="u-title">装备镶嵌</div>
                        <el-form label-position="left" label-width="100px">
                            <el-form-item label="五行石镶嵌">
                                <Embedding />
                            </el-form-item>
                            <el-form-item label="五彩石镶嵌" v-if="isWeapon">
                                <Stone />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <Attribute />
        </div>
    </div>
</template>

<script>
// depz
import { mapGetters } from "vuex";

// data
import equip_map from "@/assets/data/pz/equip_map.json";

// components
import Stone from "@/components/pz/Stone.vue";
import Embedding from "@/components/pz/Embedding.vue";
import EquipFilter from "@/components/pz/EquipFilter.vue";
import Equip from "@/components/pz/Equip.vue";
import Strength from "@/components/pz/Strength.vue";
import Enhance from "@/components/pz/Enhance.vue";
import Enchant from "@/components/pz/Enchant.vue";
import Attribute from "@/components/pz/Attribute.vue";
import MagicChange from "@/components/pz/MagicChange.vue";

export default {
    name: "Pz",
    data() {
        return {
            activeNames: ["equips", "enchant", "xilian", "stones"],
        };
    },
    computed: {
        ...mapGetters(["activeEquip", "equip", "activeSnapshot", "isWeapon", "schema_client"]),
        // 是否有镶嵌孔
        hasEmbedding: function () {
            return this.activeSnapshot["embedding"]?.length;
        },
        // 可以精炼
        canStrong: function () {
            return !!~~this.equip?.MaxStrengthLevel;
        },
        // 是否有小附魔
        hasEnhance: function () {
            return equip_map[this.activeEquip].enhance[this.schema_client];
        },
        // 是否有大附魔 重制限定
        hasEnchant: function () {
            return equip_map[this.activeEquip].enchant[this.schema_client];
        },
        showXiLian: function () {
            return this.schema_client === "origin";
        },
    },
    methods: {},
    components: {
        Stone,
        Embedding,
        Enhance,
        Enchant,
        Strength,

        EquipFilter,
        Equip,
        Attribute,
        MagicChange,
    },
    beforeDestroy() {
        this.$forceUpdate();
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/pz/pz.less";
</style>
