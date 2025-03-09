<template>
    <app-layout slug="baizhan" className="p-baizhan-app">
        <div class="p-baizhan" v-loading="loading" @click="cancelClick">
            <LeftSidebar class="m-baizhan-sidebar">
                <div class="m-baizhan-left">
                    <main-tabs></main-tabs>
                    <keep-alive>
                        <component :is="leftComponent"></component>
                    </keep-alive>
                </div>
            </LeftSidebar>
            <div
                class="m-baizhan-center"
                :class="[isPhone() ? 'is-phone' : '', activeTab !== 'boss' && rightOpen ? '' : 'is-right-close']"
            >
                <BMap v-if="activeTab === 'map'"></BMap>
                <Skills v-if="activeTab === 'skill'"></Skills>
                <Boss v-if="activeTab === 'boss'"></Boss>
            </div>
            <div v-if="hasRight" class="m-baizhan-right" :class="[rightOpen ? 'is-open' : 'is-close']">
                <div v-if="hasInfo || hasSkill" class="m-right-wrap">
                    <template v-if="hasInfo">
                        <BInfo></BInfo>
                        <MapRaider></MapRaider>
                    </template>
                    <SkillInfo v-if="hasSkill"></SkillInfo>
                </div>
                <img v-else src="@/assets/img/fb/baizhan/right_default.svg" svg-inline />
                <span class="c-sidebar-right-toggle" @click="rightOpen = !rightOpen">
                    <i :class="rightOpen ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
                </span>
            </div>
        </div>
    </app-layout>
</template>

<script>
import AppLayout from "@/layouts/fb/AppLayout.vue";
import MainTabs from "@/components/fb/baizhan/main_tabs.vue";
import MapFilter from "@/components/fb/baizhan/map_filter.vue";
import SkillFilter from "@/components/fb/baizhan/skill_filter.vue";
import BossFilter from "@/components/fb/baizhan/boss_filter.vue";

import Skills from "@/components/fb/baizhan/skill_list.vue";
import BMap from "@/components/fb/baizhan/map_index.vue";

import BInfo from "@/components/fb/baizhan/map_level_info.vue";
import SkillInfo from "@/components/fb/baizhan/skill_info.vue";
import MapRaider from "@/components/fb/baizhan/map_raider.vue";
import Boss from "@/components/fb/baizhan/boss_index.vue";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { isPhone } from "@/utils";
import { mapState, mapActions } from "vuex";
export default {
    name: "Baizhan",
    provide: {
        __imgRoot: __imgPath + "pve/baizhan/",
    },
    components: {
        AppLayout,
        MainTabs,
        MapFilter,
        SkillFilter,
        BossFilter,

        Skills,
        BMap,
        BInfo,
        Boss,
        MapRaider,
        SkillInfo,
        // BComment,
    },
    data() {
        return {
            loading: false,
            rightOpen: false,
        };
    },
    computed: {
        ...mapState({
            bosses: (state) => state.baizhan.bosses,
            skills: (state) => state.baizhan.skills,
            // effects: (state) => state.baizhan.effects,
            // maps: (state) => state.baizhan.maps,
            activeTab: (state) => state.baizhan.activeTab,
            currentBoss: (state) => state.baizhan.currentBoss,
            currentSkill: (state) => state.baizhan.currentSkill,
        }),
        leftComponent() {
            if (this.activeTab === "map") {
                return MapFilter;
            }
            if (this.activeTab === "skill") {
                return SkillFilter;
            }
            if (this.activeTab === "boss") {
                return BossFilter;
            }
            return null;
        },
        bossList() {
            const skills = this.skills;
            return this.bosses.map((boss) => {
                return {
                    ...boss,
                    skills: boss.skills
                        ? boss.skills.map((skill) => {
                              const skillObj = skills.find((item) => item.dwInSkillID === skill);
                              return {
                                  skillId: skill,
                                  skillName: skillObj?.szSkillName,
                                  skillColor: skillObj?.nColor,
                              };
                          })
                        : [],
                };
            });
        },
        hasRight() {
            return !isPhone() && this.activeTab !== "boss";
        },
        hasInfo() {
            return this.activeTab === "map" && this.currentBoss?.dwBossID;
        },
        hasSkill() {
            return this.activeTab === "skill" && this.currentSkill?.dwInSkillID;
        },
    },
    watch: {
        activeTab() {
            this.rightOpen = this.activeTab === "skill";
            this.setInit();
        },
        "$route.query": {
            immediate: true,
            handler(query) {
                this.activeTab === "map" && (this.rightOpen = !!query.floor);
            },
        },
    },
    methods: {
        ...mapActions({
            loadBosses: "baizhan/loadBosses",
            loadSkills: "baizhan/loadSkills",
            loadEffects: "baizhan/loadEffects",
            loadMap: "baizhan/loadMap",
            setInit: "baizhan/setInit",
        }),
        isPhone,
        load() {
            const proArr = [];

            const bossPro = this.loadBosses();
            proArr.push(bossPro);

            const skillPro = this.loadSkills();
            proArr.push(skillPro);

            const effectPro = this.loadEffects();
            proArr.push(effectPro);
            this.loading = true;
            Promise.allSettled(proArr).then(() => {
                this.loadMap();
                this.loading = false;
            });
        },
        cancelClick() {
            this.$store.commit("baizhan/setState", {
                key: "currentBoss",
                val: {},
            });
            const query = {};
            const routeQuery = this.$route.query;
            if (routeQuery?.tab) {
                query.tab = routeQuery.tab;
            }
            if (query.tab === "map" && routeQuery.floor) {
                query.floor = routeQuery.floor;
            }
            if (query.tab === "skill" && routeQuery.skill) {
                query.skill = routeQuery.skill;
            }
            if (query.tab === "boss" && routeQuery.boss) {
                query.boss = routeQuery.boss;
            }
            return this.$router.push({ query });
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/baizhan.less";
</style>
