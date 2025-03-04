<template>
    <div class="m-stat-damage-single">
        <!-- 头部 -->
        <single-header :data="data" :info="info"></single-header>

        <!-- 技能分析 -->
        <fold-wrapper v-if="data">
            <div slot="header">
                <img svg-inline src="@/assets/img/battle/raid/skill.svg" />技能分析
            </div>
            <div class="m-status">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <li>
                            <span>命中</span>
                            <b>{{data.overview.hit || 0}}</b>
                        </li>
                    </el-col>
                    <el-col :span="4">
                        <li>
                            <span>会心</span>
                            <b>{{data.overview.critical || 0}}</b>
                        </li>
                    </el-col>
                    <el-col :span="4">
                        <li>
                            <span>会心率</span>
                            <b>{{total_critical_percent}}</b>
                        </li>
                    </el-col>
                    <el-col :span="4">
                        <li>
                            <span>偏离</span>
                            <b>{{data.overview.miss || 0}}</b>
                        </li>
                    </el-col>
                    <el-col :span="4">
                        <li>
                            <span>识破</span>
                            <b>{{data.overview.insight || 0}}</b>
                        </li>
                    </el-col>
                    <el-col :span="4">
                        <li>
                            <span>无效</span>
                            <b>{{data.overview.shield || 0}}</b>
                        </li>
                    </el-col>
                </el-row>
            </div>
            <skills :data="data._skills" :attrs="attrs" :total="data.total"></skills>
        </fold-wrapper>

        <!-- 目标分析 -->
        <single-targets :data="data"></single-targets>
    </div>
</template>

<script>
import singleHeader from "./single_header.vue";
import foldWrapper from "@/components/battle/common/fold_wrapper.vue";
import skills from "./skills.vue";
import singleTargets from "./single_targets.vue";
export default {
    name: "single",
    props: ["info", "data"],
    components: {
        singleHeader,
        skills,
        foldWrapper,
        singleTargets,
    },
    data: function () {
        return {
            attrs: [
                "name",
                "_name",
                "count",
                "max",
                "avg",
                "min",
                "hit",
                "critical",
                "miss",
                "insight",
                "critical_percentage",
                "damage_percentage",
                "total_bar",
            ],
        };
    },
    computed: {
        total_critical_percent: function () {
            let count = 0;
            for (let item in this.data.overview) {
                count += this.data.overview[item];
            }
            return (
                ((this.data.overview.critical / count) * 100).toFixed(2) + "%"
            );
        },
    }
};
</script>

<style scoped lang="less">
@import "~@/assets/css/battle/tinymins_stat/status.less";
</style>
