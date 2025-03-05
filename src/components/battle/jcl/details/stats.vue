<template>
    <div class="m-entity-stat">
        <jcl-entity-overview :entityID="Number(entityID)" :mode="type"></jcl-entity-overview>
        <fold-wrapper>
            <div slot="header"><img svg-inline src="@/assets/img/battle/jcl/damage.svg" />整场{{ statLabel }}趋势</div>
            <div class="u-chart-wrapper">
                <v-echart autoresize :option="chartOption" @click="handleChartClick" class="u-chart"></v-echart>
            </div>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"
                    ><img svg-inline src="@/assets/img/battle/jcl/damage.svg" />{{ statLabel }}详情</span
                >
                <el-tooltip content="点击上面图标的 X 轴或者曲线上的点可以切换到某一个时间段" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
                <el-radio-group size="mini" v-model="tableMode">
                    <el-radio-button label="skill">按技能显示</el-radio-button>
                    <el-radio-button label="target">按目标显示</el-radio-button>
                </el-radio-group>
                <span class="u-title-tips" v-if="currentWindows !== null">
                    当前展示 {{ timeFilterFormat }} 秒的伤害详情
                    <el-tooltip content="清除选择" placement="top">
                        <i @click="clearFilter" class="el-icon-close"></i>
                    </el-tooltip>
                </span>
            </div>
            <stat-details
                :mode="tableMode"
                :type="type"
                :entityID="entityID"
                :currentWindows="currentWindows"
                @row-click="switchLogs"
            ></stat-details>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"><img svg-inline src="@/assets/img/battle/jcl/damage.svg" />技能列表</span>
                <el-tooltip placement="top">
                    <template #content>
                        <div>
                            点击上面{{ statLabel }}详情中的一行查看每一次{{
                                statLabel
                            }}（次数过多可能导致卡顿，建议切换到某一个时间窗口查看）
                        </div>
                    </template>
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>
            <stat-logs :type="type" :logs="logs"></stat-logs>
        </fold-wrapper>
    </div>
</template>

<script>
import { graphic } from "echarts/core";

import { getEntityColor } from "@/utils/battle/jcl/colors.js";

import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";
import JclEntityOverview from "@/components/battle/jcl/common/entity_overview";
import StatLogs from "@/components/battle/jcl/details/stat_logs";
import StatDetails from "@/components/battle/jcl/details/stat_details";

export default {
    name: "EntityStats",
    props: ["entityID", "type"],
    components: {
        FoldWrapper,
        StatLogs,
        StatDetails,
        JclEntityOverview,
    },
    mounted() {},
    data: () => ({
        tableMode: "skill",
        logs: [],
        currentWindows: null,
    }),
    methods: {
        handleChartClick: function (e) {
            if (e.targetType == "axisLabel") {
                this.currentWindows = e.value;
            } else if (e.componentSubType == "line") {
                this.currentWindows = this.xData[e.dataIndex];
            }
        },
        clearFilter: function () {
            this.currentWindows = null;
        },
        switchLogs: function (logs) {
            this.logs = Object.freeze(logs);
        },
    },
    computed: {
        statLabel: function () {
            const labelMap = {
                damage: "伤害",
                treat: "治疗",
                beDamaged: "承伤",
                beTreated: "承疗",
            };
            return labelMap[this.type];
        },
        timeFilterFormat: function () {
            if (this.currentWindows === null) return "-";
            return `${parseInt(this.currentWindows) - 5} ~ ${this.currentWindows}`;
        },
        currentColor: function () {
            return getEntityColor(this.entityID);
        },
        chartDataset: function () {
            let data = window?.$store.entityStat[this.type][this.entityID].windows;
            if (!data) return [];
            let result = [];
            let windows = Object.keys(data)
                .map((x) => parseInt(x))
                .sort((a, b) => a - b);
            let start = windows[0];
            let max = windows.at(-1);
            // 生成时间轴，可能会有中间空的部分
            for (let i = start; i <= max; i += 5) {
                let value = data[i] ? data[i].value / 5 : 0;
                result.push({
                    window: i,
                    dps: value,
                });
            }
            return Object.freeze(result);
        },
        xData: function () {
            return this.chartDataset.map((x) => x.window);
        },
        yData: function () {
            return this.chartDataset.map((x) => x.dps);
        },
        chartOption: function () {
            return {
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: "none",
                        },
                        restore: {},
                        saveAsImage: {},
                    },
                },
                tooltip: {
                    trigger: "axis",
                    formatter: `每秒${this.statLabel}: {c}`,
                    position: function (pt) {
                        return [pt[0], 0.1];
                    },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: [0.1, 0.1],
                    data: this.xData,
                    triggerEvent: true,
                },
                yAxis: {
                    type: "value",
                    boundaryGap: [0, 0.2],
                },
                dataZoom: [
                    {
                        type: "inside",
                        start: 0,
                        end: 100,
                    },
                    {
                        start: 0,
                        end: 100,
                    },
                ],
                series: [
                    {
                        type: "line",
                        smooth: true,
                        sampling: "lttb",
                        showSymbol: false,
                        itemStyle: {
                            color: this.currentColor,
                        },
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: `${this.currentColor}66`,
                                },
                                {
                                    offset: 1,
                                    color: `${this.currentColor}ff`,
                                },
                            ]),
                        },
                        data: this.yData,
                    },
                ],
            };
        },
    },
    watch: {
        type: {
            handler: function () {
                this.logs = [];
            },
            immediate: true,
        },
        entityID: {
            handler: function () {
                this.logs = [];
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/entity_stat.less";
</style>
