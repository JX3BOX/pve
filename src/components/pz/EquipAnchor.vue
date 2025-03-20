<template>
    <div class="m-equip-anchor">
        <ul class="u-list">
            <div
                class="m-equip-item m-equip-anchor-root"
                :class="{ active: isIndex }"
                @click="setActive({ key: '' })"
            >
                <span class="u-title">
                    <i class="el-icon-pie-chart"></i> {{ topName }}
                </span>
                <span class="u-mount">
                    <img class="u-mount-pic" :src="mount | showMountIcon" :alt="mountName" />
                    <span class="u-mount-name">{{ mountName }}</span>
                </span>
            </div>
            <li
                class="m-equip-item"
                v-for="equip in equips"
                :key="'sidebar_' + equip.key"
                :class="{
                    active: active === equip.key,
                    hide: onlyOneWeapon(equip),
                }"
                @click="setActive(equip)"
            >
                <i
                    class="u-icon-box"
                    :class="equip.equip.MaxStrengthLevel == equip.strength ? `quality-${equip.equip.Quality}-max` : `quality-${equip.equip.Quality}`"
                >
                    <img :src="showDefaultIcon(equip)" class="u-icon" />
                </i>
                <span class="u-text">
                    <span
                        class="u-equip-type"
                        :class="{ hasEquip: equip.equip.Name }"
                    >{{ equip.type }}</span>
                    <span class="u-equip-name" v-if="equip.equip.Name">
                        <span class="left">
                            {{ equip.equip.Name }}
                            <small
                                class="u-equip-strength"
                            >({{ equip.strength }}/{{equip.equip.MaxStrengthLevel}})</small>
                        </span>
                        <span class="right">
                            <span class="u-equip-enhance" v-if="equip.enhance">
                                <el-tooltip :content="equip.enhance.Name">
                                    <img width="16" src="@/assets/img/pz/enhance/enhance.png" alt />
                                </el-tooltip>
                            </span>
                            <span class="u-equip-enchant" v-if="equip.enchant">
                                <el-tooltip :content="equip.enchant.Name">
                                    <img width="16" src="@/assets/img/pz/enhance/enchant.png" alt />
                                </el-tooltip>
                            </span>
                        </span>
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import defaultEquips from "@/assets/data/pz/defaultEquips.json";
import { __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { isCangJian } from "@/utils/pz/game.js";

import { mapGetters } from "vuex";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "EquipAnchor",
    data: () => ({
        active: "",
    }),
    computed: {
        ...mapGetters(["mount"]),
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        mountName: function () {
            return xfid[this.mount];
        },
        defaultEquips: function () {
            return defaultEquips;
        },
        equips: function ({ snapshot, defaultEquips }) {
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
        isIndex: function () {
            return !this.$store.state.activeEquip;
        },
        client: function () {
            return this.$store.getters.schema_client;
        },
        data: function () {
            return this.$store.state.schema;
        },
        author_id: function () {
            return this.data.user_id;
        },
        isAuthor: function () {
            return User.getInfo().uid == this.data.user_id;
        },
        isEditMode: function () {
            return this.$route.name == "edit" && this.isAuthor;
        },
        topName: function (){
            return this.isEditMode ? '基本信息' : '配装总览'
        }
    },
    methods: {
        showDefaultIcon: function (data) {
            if (data?.equip?._IconID) {
                return iconLink(data.equip._IconID, this.client); //'std'
            } else {
                return require("@/assets/img/pz/equips/" + data.defaultIcon);
            }
        },
        showQuality: function (data) {
            return "quality-" + data.equip.Quality;
        },
        setActive: function (equip) {
            this.active = equip.key;
            this.$store.commit("SET_STATE", {
                key: "activeEquip",
                value: equip.key,
            });
        },
        checkOverview: function () {
            this.$store.commit("SET_STATE", {
                key: activeEquip,
                val: "",
            });
        },
        onlyOneWeapon: function (equip) {
            // 非藏剑门派隐藏第3武器
            return (
                equip.key == "TERTIARY_WEAPON" &&
                !isCangJian(this.$store.getters.mount)
            );
        },
        init: function () {
            this.$nextTick(() => {});
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/equip_anchor.less";
</style>
