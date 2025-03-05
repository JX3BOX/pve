<template>
    <div class="p-combat-stat">
        <subheader class="m-upload-header" title="统计分析" desc="Battle Statistical Analysis">
            <el-button class="u-back" plain size="small" @click="back" icon="el-icon-arrow-left"> 后退 </el-button>
            <el-button class="u-save" type="success" size="small" @click="save" v-if="allowAdd">
                <img class="i-btn-save" svg-inline src="@/assets/img/battle/save.svg" alt="云端保存" />云端保存
            </el-button>
        </subheader>
        <div class="p-combat-main">
            <div class="p-combat-primary">
                <div class="m-stat-header">
                    <h1 class="m-battle-title">{{ current.title }}</h1>
                    <div class="m-battle-desc" v-if="current.desc">{{ current.desc }}</div>
                    <div class="m-tags">
                        <a :href="tagLink(item)" v-for="item in tags" :key="item.name" target="_blank">
                            <el-tag class="u-tag" type="success">
                                {{ item.name }}
                            </el-tag>
                        </a>
                    </div>
                    <el-tabs v-model="tab" type="card" @tab-click="tabChange">
                        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
                    </el-tabs>
                </div>
                <component :is="component" :info="info" :data="data" v-model="mode"></component>
            </div>
        </div>
    </div>
</template>

<script>
import subheader from "@/components/battle/subheader.vue";
import list from "@/components/battle/tinymins_stat/list.vue";
import deathSummary from "@/components/battle/tinymins_stat/death_summary";

// mixins
import tagsMixin from "@/mixin/battle/tags.js";

const tabs = [
    {
        label: "伤害分析",
        name: "damage",
    },
    {
        label: "治疗分析",
        name: "heal",
    },
    {
        label: "承疗分析",
        name: "beHeal",
    },
    {
        label: "承伤分析",
        name: "beDamage",
    },
    {
        label: "化解分析",
        name: "absorb",
    },
    {
        label: "死亡分析",
        name: "death",
    },
];

export default {
    name: "",
    components: {
        subheader,
        list,
        deathSummary,
    },
    props: {
        allowAdd: {
            type: Boolean,
            default: false,
        },
    },
    mixins: [tagsMixin],
    data: function () {
        return {
            tab: "damage",
            mode: "list",
            components: {
                damage: list,
                heal: list,
                beHeal: list,
                beDamage: list,
                absorb: list,
                death: deathSummary,
            },
            tabs,
        };
    },
    computed: {
        isChecked: function () {
            return this.$store.state.current?.is_checked;
        },
        component: function () {
            return this.components[this.tab];
        },
        data: function () {
            return this.$store.state.analysis;
        },
        info: function () {
            return this.$store.state.info;
        },
    },
    watch: {
        tab(val) {
            this.$store.commit("set", {
                key: "type",
                val,
            });
        },
    },
    methods: {
        save() {
            this.$emit("save");
        },
        back() {
            if (this.mode === "list") {
                this.$store.commit("RESET");
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
            } else {
                this.mode = "list";
            }
        },
        tabChange() {
            this.mode = "list";
        },
    },
    mounted: function () {
        this.tab = "damage";
        this.$store.commit("set", {
            key: "type",
            val: "damage",
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/tinymins_stat.less";
</style>
