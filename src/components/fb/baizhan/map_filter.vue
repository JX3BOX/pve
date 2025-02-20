<template>
    <div class="w-card m-map-filter">
        <div class="w-card-title">
            <img src="@/assets/img/fb/baizhan/filter.svg" alt="筛选" />
            <span>筛选</span>
        </div>
        <div class="m-section-title m-two-title first-section">常用</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="[mapFilterInit === normal.value ? 'is-active' : '', normal.value === 'init' ? 'is-long' : '']"
                v-for="(normal, index) in normalList"
                :key="index"
                :title="normal.label"
                @click="setNormal(normal.value)"
            >
                {{ normal.label }}
            </div>
        </div>
        <div class="m-section-title">特殊效果</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="activeEffectKey === effect.key && 'is-active'"
                v-for="(effect, index) in effectsFilter"
                :key="index"
                :title="effect.text"
                @click="setEffect(effect)"
            >
                {{ effect.text }}
            </div>
        </div>
        <div class="m-section-title m-two-title">首领</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="currentBossName === bossName && 'is-active'"
                v-for="(bossName, index) in bossNames"
                :key="index"
                :title="bossName"
                @click="setBoss(bossName)"
            >
                {{ bossName }}
            </div>
        </div>
    </div>
</template>

<script>
import { getWeekStartDate, getWeekEndDate } from "@/utils/dateFormat";
import { effectsFilter } from "@/assets/data/fb/baizhan_effects.js";
import { getEffectInfo } from "@/assets/js/baizhan";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
export default {
    name: "BaizhanMainTabs",
    data() {
        return {
            tabs: [
                {
                    label: "百战地图",
                    value: "map",
                },
                {
                    label: "技能列表",
                    value: "skill",
                },
                {
                    label: "首领信息",
                    value: "boss",
                },
            ],
            startDate: getWeekStartDate(),
            endDate: getWeekEndDate(),
            effectsFilter,
            normalList: [
                {
                    label: "特殊效果 & 精英首领",
                    value: "init",
                },
            ],
        };
    },
    computed: {
        ...mapState({
            currentEffect: (state) => state.baizhan.currentEffect,
            activeTab: (state) => state.baizhan.activeTab,
            currentBossName: (state) => state.baizhan.currentBossName,
            mapFilterInit: (state) => state.baizhan.mapFilterInit,
        }),
        bossNames() {
            return this.$store.getters["baizhan/bossNames"];
        },
        activeBossId() {
            return this.currentBoss?.dwBossID || 0;
        },
        activeEffectKey() {
            return this.currentEffect?.key;
        },
    },
    methods: {
        setActiveTab(tab) {
            this.$store.commit("baizhan/setState", {
                key: "activeTab",
                val: tab,
            });
        },
        getEffectInfo,
        setNormal(normal) {
            if (this.mapFilterInit === normal) {
                this.$store.commit("baizhan/setState", {
                    key: "mapFilterInit",
                    val: "",
                });
            } else {
                this.$store.commit("baizhan/setState", {
                    key: "mapFilterInit",
                    val: "init",
                });
                this.$store.commit("baizhan/setState", {
                    key: "currentEffect",
                    val: {},
                });
                this.$store.commit("baizhan/setState", {
                    key: "currentBossName",
                    val: "",
                });
            }
        },
        setEffect(effect) {
            let val = effect;
            if (effect.key === this.currentEffect.key) {
                val = {};
            }
            this.$store.commit("baizhan/setState", {
                key: "currentBossName",
                val: "",
            });
            this.$store.commit("baizhan/setState", {
                key: "currentEffect",
                val: val,
            });
            this.$store.commit("baizhan/setState", {
                key: "mapFilterInit",
                val: "",
            });
        },
        setBoss(bossName) {
            let val = bossName;
            if (bossName === this.currentBossName) {
                val = "";
            }
            this.$store.commit("baizhan/setState", {
                key: "currentEffect",
                val: {},
            });
            this.$store.commit("baizhan/setState", {
                key: "currentBossName",
                val: val,
            });
            this.$store.commit("baizhan/setState", {
                key: "mapFilterInit",
                val: "",
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map_filter.less";
</style>
