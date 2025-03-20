<template>
    <div class="m-equip-anchor m-mobile-anchor">
        <div class="m-top">
            <ul class="m-left">
                <li
                    class="m-equip-item"
                    v-for="equip in left"
                    :key="'sidebar_' + equip.key"
                    :class="{
                        hide: onlyOneWeapon(equip),
                    }"
                    @click="setActive(equip.key)"
                >
                    <i
                        class="u-icon-box"
                        :class="
                            equip.equip.MaxStrengthLevel == equip.strength
                                ? `quality-${equip.equip.Quality}-max`
                                : `quality-${equip.equip.Quality}`
                        "
                    >
                        <img :src="showDefaultIcon(equip)" class="u-icon" />
                    </i>
                </li>
            </ul>
            <div class="m-mid">
                <slot name="mid"></slot>
            </div>
            <ul class="m-right">
                <li
                    class="m-equip-item"
                    v-for="equip in right"
                    :key="'sidebar_' + equip.key"
                    :class="{
                        active: active === equip.key,
                        hide: onlyOneWeapon(equip),
                    }"
                    @click="setActive(equip.key)"
                >
                    <i
                        class="u-icon-box"
                        :class="
                            equip.equip.MaxStrengthLevel == equip.strength
                                ? `quality-${equip.equip.Quality}-max`
                                : `quality-${equip.equip.Quality}`
                        "
                    >
                        <img :src="showDefaultIcon(equip)" class="u-icon" />
                    </i>
                </li>
            </ul>
        </div>
        <ul class="m-bottom">
            <li
                class="m-equip-item"
                v-for="equip in bottom"
                :key="'sidebar_' + equip.key"
                :class="{
                    active: active === equip.key,
                    hide: onlyOneWeapon(equip),
                }"
                @click="setActive(equip.key)"
            >
                <i
                    class="u-icon-box"
                    :class="
                        equip.equip.MaxStrengthLevel == equip.strength
                            ? `quality-${equip.equip.Quality}-max`
                            : `quality-${equip.equip.Quality}`
                    "
                >
                    <img :src="showDefaultIcon(equip)" class="u-icon" />
                </i>
            </li>
        </ul>

        <!-- 仅查看 -->
        <el-dialog
            :visible.sync="showEquip"
            custom-class="m-pz-dialog"
            style="background: none"
            center
            :show-close="false"
            lock-scroll
            v-if="!is_author"
        >
            <Equip ref="equip" />
        </el-dialog>

        <!-- 装备选择 -->
        <el-dialog
            :visible.sync="showEquip"
            :title="currentEquip"
            custom-class="m-pz-filter-dialog"
            fullscreen
            append-to-body
            v-else
        >
            <el-collapse v-model="activeNames">
                <el-collapse-item name="equips">
                    <div slot="title" class="u-title">装备选择</div>
                    <EquipFilter label-position="top" ref="equipFilter" />
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

            <Equip tip="请在【装备选择】中挑选一件心仪的装备。" />

            <div class="m-pz-actions">
                <el-button @click="handleCancel" round size="small">取消</el-button>
                <el-button type="primary" @click="handleConfirm" round size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import defaultEquips from "@/assets/data/pz/defaultEquips.json";
import { __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { isCangJian } from "@/utils/pz/game.js";
import { mapGetters } from "vuex";
import equipMap from "@/assets/data/pz/equip_map.json";

import Equip from "@/components/pz/Equip.vue";
import EquipFilter from "@/components/pz/EquipFilter.vue";
import Strength from "@/components/pz/Strength.vue";
import Enhance from "@/components/pz/Enhance.vue";
import Enchant from "@/components/pz/Enchant.vue";
import MagicChange from "@/components/pz/MagicChange.vue";
import Embedding from "@/components/pz/Embedding.vue";
export default {
    name: "MobileEquipAnchor",
    components: {
        Equip,
        EquipFilter,
        Strength,
        Enhance,
        Enchant,
        MagicChange,
        Embedding,
    },
    data() {
        return {
            left: [],
            right: [],
            bottom: [],
            active: "",

            // 查看装备
            showEquip: false,
            // 筛选装备
            showFilter: false,

            activeNames: ["equips"],
        };
    },
    computed: {
        ...mapGetters(["mount", "schema_client", "is_author", "activeEquip", "equip", "activeSnapshot", "isWeapon"]),
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        equips: function ({ snapshot }) {
            const equips = [];
            defaultEquips.forEach((equip) => {
                if (snapshot[equip.key]) {
                    const _equip = {
                        ...snapshot[equip.key],
                        ...equip,
                    };
                    equips.push(_equip);
                } else {
                    equips.push(equip);
                }
            });
            return equips;
        },
        currentEquip() {
            return equipMap[this.activeEquip]?.label || "未知";
        },
        // 是否有镶嵌孔
        hasEmbedding: function () {
            return this.activeSnapshot?.["embedding"]?.length;
        },
        // 可以精炼
        canStrong: function () {
            return !!~~this.equip?.MaxStrengthLevel;
        },
        // 是否有小附魔
        hasEnhance: function () {
            return equipMap[this.activeEquip].enhance[this.schema_client];
        },
        // 是否有大附魔 重制限定
        hasEnchant: function () {
            return equipMap[this.activeEquip].enchant[this.schema_client];
        },
        showXiLian: function () {
            return this.schema_client === "origin";
        },
    },
    watch: {
        equips: {
            deep: true,
            immediate: true,
            handler() {
                this.init();
            },
        },
        showEquip(val) {
            if (!val && !this.is_author) {
                this.$nextTick(() => {
                    this.$refs.equip && this.$refs.equip.$el.removeEventListener("click", this.closeEquip);
                });
            }
        },
    },
    methods: {
        init() {
            this.left = this.equips.slice(0, 3);
            this.right = this.equips.slice(4, 10);
            this.bottom = this.equips.slice(10, 13);
        },
        onlyOneWeapon(equip) {
            // 非藏剑门派隐藏第3武器
            return equip.key == "TERTIARY_WEAPON" && !isCangJian(this.mount);
        },
        showDefaultIcon(data) {
            if (data?.equip?._IconID) {
                return iconLink(data.equip._IconID, this.schema_client); //'std'
            } else {
                return require("@/assets/img/pz/equips/" + data.defaultIcon);
            }
        },
        setActive(key) {
            this.$store.commit("SET_STATE", {
                key: "activeEquip",
                value: key,
            });
            this.showEquip = true;

            this.$nextTick(() => {
                this.$refs.equip && this.$refs.equip.$el.addEventListener("click", this.closeEquip);
            });
        },
        closeEquip() {
            this.showEquip = false;
        },
        handleConfirm() {
            this.showEquip = false;
        },
        handleCancel() {
            if (this.$refs.equipFilter) {
                this.$refs.equipFilter.handleEquipChange('');
            }
            this.showEquip = false;
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/equip_anchor.less";
@import "~@/assets/css/pz/mobile/anchor.less";
</style>
