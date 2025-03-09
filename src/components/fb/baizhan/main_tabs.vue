<template>
    <div class="m-baizhan-tabs w-card">
        <div class="u-tab-list">
            <div
                class="u-tab"
                :class="[tab.value === activeTab ? 'is-active' : '']"
                v-for="tab in tabs"
                :key="tab.value"
                @click="setActiveTab(tab.value)"
            >
                <img :src="tab.value === activeTab ? tab.icon_active : tab.icon" :alt="tab.label" />
                <div class="u-name">{{ tab.label }}</div>
            </div>
        </div>
        <div class="u-map-info" v-if="activeTab === 'map'">
            <div class="u-map-title">
                <img class="u-title-icon" src="@/assets/img/fb/baizhan/tabs/map_active.svg" alt="" />
                <span>{{ activeTab === "map" ? "地图" : "数据" }}信息</span>
            </div>
            <div class="u-map-update">更新时间：{{ update_time }}</div>
            <div class="u-map-duration">
                <span>持续时间：{{ duration.start }} ~ {{ duration.end }}</span>
                <a
                    v-if="activeTab === 'map'"
                    class="u-download"
                    :class="down_disabled && 'is-disabled'"
                    @click.prevent="toDownImg"
                >
                    <img src="@/assets/img/fb/baizhan/export.svg" svg-inline />
                    <span>{{ downLoading ? "导出中..." : "导出图片" }}</span>
                </a>
            </div>
        </div>
        <div class="u-map-info" v-if="activeTab !== 'map'">
            <img class="u-skill-tab-img" src="@/assets/img/fb/baizhan/baizhan_tab_default.svg" />
        </div>
    </div>
</template>

<script>
import { moment } from "@jx3box/jx3box-common/js/moment";
import { mapState } from "vuex";

export default {
    name: "BaizhanMainTabs",
    data() {
        return {
            tabs: [
                {
                    label: "百战地图",
                    value: "map",
                    icon: require("@/assets/img/fb/baizhan/tabs/map.svg"),
                    icon_active: require("@/assets/img/fb/baizhan/tabs/map_active.svg"),
                },
                {
                    label: "技能列表",
                    value: "skill",
                    icon: require("@/assets/img/fb/baizhan/tabs/skill.svg"),
                    icon_active: require("@/assets/img/fb/baizhan/tabs/skill_active.svg"),
                },
                {
                    label: "首领数据",
                    value: "boss",
                    icon: require("@/assets/img/fb/baizhan/tabs/boss.svg"),
                    icon_active: require("@/assets/img/fb/baizhan/tabs/boss_active.svg"),
                },
            ],
        };
    },
    computed: {
        ...mapState({
            activeTab: (state) => state.baizhan.activeTab,
            maps: (state) => state.baizhan.maps,
            downLoading: (state) => state.baizhan.downLoading,
        }),
        down_disabled() {
            return !this.maps.length || this.downLoading;
        },
        update_moment() {
            return moment(this.$store.state.baizhan.map.updated_at);
        },
        update_time() {
            return this.update_moment.format("YYYY/MM/DD HH:mm:ss");
        },
        duration() {
            return {
                start: this.update_moment.startOf("week").add(1, "day").format("MM/DD"),
                end: this.update_moment.endOf("week").add(1, "day").format("MM/DD"),
            };
        },
    },
    watch: {
        "$route.query": {
            immediate: true,
            deep: true,
            handler(query) {
                const { tab } = query;
                if (tab) {
                    this.setActiveTab(tab);
                } else {
                    if (query?.floor) {
                        this.setActiveTab("map");
                    }
                    if (query?.skill) {
                        this.setActiveTab("skill");
                    }
                    if (query?.boss) {
                        this.setActiveTab("boss");
                    }
                }
            },
        },
    },
    methods: {
        setActiveTab(tab) {
            this.$store.commit("baizhan/setState", {
                key: "activeTab",
                val: tab,
            });
            const query = {
                tab,
            };
            const routeQuery = this.$route.query;
            if (tab === "map" && routeQuery.floor) {
                query.floor = routeQuery.floor;
            }
            if (tab === "skill" && routeQuery.skill) {
                query.skill = routeQuery.skill;
            }
            if (tab === "boss" && routeQuery.boss) {
                query.boss = routeQuery.boss;
            }
            this.$router.push({
                query,
            });
        },
        toDownImg() {
            this.$store.commit("baizhan/setState", {
                key: "downLoading",
                val: true,
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/main_tabs.less";
</style>
