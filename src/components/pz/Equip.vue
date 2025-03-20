<template>
    <div class="m-equip-view">
        <template v-if="equip">
            <!-- 装备名称 -->
            <EquipName />

            <div class="m-equip-body">
                <!-- 白字防御 -->
                <EquipBaseAttr />

                <!-- 主属性 -->
                <EquipPrimary />

                <!-- 副属性 -->
                <EquipSecondary />

                <!-- 装备镶嵌孔 -->
                <EquipEmbed />

                <!-- 五彩石 -->
                <EquipStone v-if="isWeapon" />

                <!-- 杂项 -->
                <EquipMisc />

                <!-- 小附魔 -->
                <EquipEnhance />

                <!-- 大附魔 -->
                <EquipEnchant />

                <!-- 装备使用特效 -->
                <EquipEffect />

                <!-- 装备套装 -->
                <EquipSet />
            </div>

            <div class="m-equip-footer">
                <!-- 装分信息 -->
                <EquipScore />

                <!-- 物品百科跳转 -->
                <a class="m-equip-wiki" :href="toViewItemDetailUrl" target="_blank">
                    <i class="el-icon-link"></i> 查看装备百科词条
                </a>
            </div>
        </template>
        <template v-else>
            <div class="m-equip-null">
               <p><i class="el-icon-warning-outline"></i> 暂未选择装备</p>
               <p class="u-tip">{{ tip }}</p>
            </div>
        </template>
    </div>
</template>

<script>
import { getEmbedIcon } from "@/utils/pz/embedding.js";
import equip_map from "@/assets/data/pz/equip_map.json";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { mapGetters } from "vuex";
import { getLink } from "@jx3box/jx3box-common/js/utils";

// components
import EquipName from "./equipIncludes/EquipName.vue";
import EquipBaseAttr from "./equipIncludes/EquipBaseAttr.vue";
import EquipPrimary from "./equipIncludes/EquipPrimary.vue";
import EquipSecondary from "./equipIncludes/EquipSecondary.vue";
import EquipEmbed from "./equipIncludes/EquipEmbed.vue";
import EquipEffect from "./equipIncludes/EquipEffect.vue";
import EquipSet from "./equipIncludes/EquipSet.vue";
import EquipEnhance from "./equipIncludes/EquipEnhance.vue";
import EquipEnchant from "./equipIncludes/EquipEnchant.vue";
import EquipMisc from "./equipIncludes/EquipMisc.vue";
import EquipScore from "./equipIncludes/EquipScore.vue";
import EquipStone from "./equipIncludes/EquipStone.vue";

export default {
    name: "Equip",
    props: {
        tip: {
            type:String,
            default: '请在右侧【装备选择】中挑选一件心仪的装备。'
        }
    },
    data() {
        return {
            attributeDesc,
        };
    },
    components: {
        EquipName,
        EquipBaseAttr,
        EquipPrimary,
        EquipSecondary,
        EquipEmbed,
        EquipEffect,
        EquipStone,
        EquipSet,
        EquipEnhance,
        EquipEnchant,
        EquipMisc,
        EquipScore,
    },
    computed: {
        ...mapGetters(["equip", "activeEquip", "isWeapon"]),
        toViewItemDetailUrl: function () {
            return getLink(
                "item",
                equip_map[this.activeEquip]["tab_type"] + "_" + this.equip.ID
            );
        },
    },
    methods: {
        initEmbeds: function () {
            const { equip } = this;
            const diamonds = [];
            for (const key in equip) {
                if (key.includes("_DiamondAttributeID") && equip[key]) {
                    const _key = equip[key][0];

                    diamonds.push(_key);
                }
            }
        },
    },
    filters: {
        getEmbedIcon,
    },
    watch: {
        equip: {
            deep: true,
            handler() {
                this.initEmbeds();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/equip.less";
</style>
