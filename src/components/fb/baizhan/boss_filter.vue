<template>
    <div class="w-card m-map-filter">
        <div class="w-card-title">
            <img src="@/assets/img/fb/baizhan/filter.svg" alt="筛选" />
            <span>快速选择</span>
        </div>
        <div class="m-skill-search first-section">
            <el-input v-model="search" placeholder="输入关键词搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <div class="m-section-title m-three-title">BOSS</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="[currentBossName === bossName ? 'is-active' : '', bossName === search ? 'is-search' : '']"
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
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
export default {
    name: "BaizhanMainTabs",
    data() {
        return {
            search: "",
        };
    },
    computed: {
        ...mapState({
            activeTab: (state) => state.baizhan.activeTab,
            currentBossName: (state) => state.baizhan.currentBossName,
        }),
        bossNames() {
            const list = this.$store.getters["baizhan/bossNames"].filter((item) => item !== "精英首领");
            list.unshift("通用");
            return list;
        },
    },
    watch: {
        // search(search) {
        //     this.$store.commit("baizhan/setState", {
        //         key: "search",
        //         val: search,
        //     });
        // },
        "$route.query": {
            immediate: true,
            deep: true,
            handler(query) {
                if (query.boss && this.bossNames.includes(query.boss)) {
                    this.$store.commit("baizhan/setState", {
                        key: "currentBossName",
                        val: query.boss,
                    });
                }
            },
        },
    },
    methods: {
        setBoss(bossName) {
            if (bossName === this.currentBossName) {
                this.$store.commit("baizhan/setState", {
                    key: "currentBossName",
                    val: "",
                });
                return this.$router.push({ query: {} });
            }
            this.$store.commit("baizhan/setState", {
                key: "currentBossName",
                val: bossName,
            });
            this.$router.push({ query: { boss: bossName } });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map_filter.less";
</style>
