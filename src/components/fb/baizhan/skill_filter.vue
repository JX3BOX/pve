<template>
    <div class="w-card m-skill-filter">
        <div class="w-card-title">
            <img src="@/assets/img/fb/baizhan/filter.svg" alt="筛选" />
            <span>筛选</span>
        </div>
        <div class="m-skill-search first-section">
            <el-input v-model="name" placeholder="请输入技能名称" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="m-selects">
                <el-select v-model="currentType">
                    <el-option
                        v-for="type in skillTypes"
                        :key="type.id"
                        :value="type.id"
                        :label="type.name"
                    ></el-option>
                </el-select>
                <el-select v-model="currentColor">
                    <el-option
                        v-for="color in skillColors"
                        :key="color.id"
                        :value="color.id"
                        :label="color.name"
                    ></el-option>
                </el-select>
                <el-select v-model="currentCost">
                    <el-option
                        v-for="cost in skillCosts"
                        :key="cost.id"
                        :value="cost.id"
                        :label="cost.name"
                    ></el-option>
                </el-select>
            </div>
        </div>
        <!-- <div class="m-section-title m-two-title">效果</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="currentType === type.id && 'is-active'"
                v-for="type in skillTypes"
                :key="type.id"
                :title="type.name"
                @click="setSkill(type.id, 'currentType')"
            >
                {{ type.name }}
            </div>
        </div>
        <div class="m-section-title m-two-title">颜色</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="currentColor === color.id && 'is-active'"
                v-for="color in skillColors"
                :key="color.id"
                :title="color.name"
                @click="setSkill(color.id, 'currentColor')"
            >
                {{ color.name }}
            </div>
        </div>
        <div class="m-section-title m-two-title">消耗</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="currentCost === cost.id && 'is-active'"
                v-for="cost in skillCosts"
                :key="cost.id"
                :title="cost.name"
                @click="setSkill(cost.id, 'currentCost')"
            >
                {{ cost.name }}
            </div>
        </div> -->
        <div class="m-section-title m-two-title">首领</div>
        <div class="m-filter-list">
            <div
                class="u-filter"
                :class="currentBossName === bossName && 'is-active'"
                v-for="(bossName, index) in bossNames"
                :key="index"
                :title="bossName"
                @click="setSkill(bossName, 'currentBossName')"
            >
                {{ bossName }}
            </div>
        </div>
    </div>
</template>

<script>
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
import { removeEmptyIncludeZero } from "@/utils";
export default {
    name: "SkillFilter",
    data() {
        return {
            name: "",
            currentType: 0,
            currentColor: 0,
            currentCost: 0,
            currentBossName: "全部首领",
        };
    },
    computed: {
        ...mapState({
            types: (state) => state.baizhan.types,
        }),
        skillColors() {
            return this.types.skill_colors;
        },
        skillCosts() {
            return this.types.skill_costs;
        },
        skillTypes() {
            return this.types.skill_types;
        },
        bossNames() {
            return [
                ...this.$store.getters["baizhan/bossNames"].map((item) => {
                    if (item === "精英首领") {
                        item = "全部首领";
                    }
                    return item;
                }),
                "未知",
            ];
        },
        params() {
            return {
                color: this.currentColor,
                cost: this.currentCost,
                type: this.currentType,
                name: this.name,
                bossName: this.currentBossName === "全部首领" ? "" : this.currentBossName,
            };
        },
    },
    watch: {
        params(params) {
            this.$store.commit("baizhan/setState", {
                key: "skillParams",
                val: removeEmptyIncludeZero(params),
            });
        },
        "$route.query": {
            immediate: true,
            deep: true,
            handler(query) {
                if (query.skill) {
                    this.name = query.skill;
                } else {
                    this.name = "";
                }
                this.reset();
            },
        },
    },
    methods: {
        reset() {
            this.currentBossName = "";
            this.currentType = 0;
            this.currentColor = 0;
            this.currentCost = 0;
        },
        setSkill(id, type) {
            if (this[type] === id) {
                return (this[type] = null);
            }
            this[type] = id;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map_filter.less";
</style>
