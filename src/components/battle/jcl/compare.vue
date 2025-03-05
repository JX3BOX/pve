<template>
    <div class="m-jcl-compare">
        <div class="u-options">
            <el-select v-model="entityA" filterable placeholder="请选择单位" @change="refreshChart">
                <el-option v-for="entity in entities" :key="entity.id" :value="entity.id" :label="entity.name">
                    <jcl-entity :id="entity.id" :click-redirect="false"></jcl-entity>
                </el-option>
            </el-select>
            <span class="u-compare-icon">↔️</span>
            <el-select v-model="entityB" filterable placeholder="请选择单位" @change="refreshChart">
                <el-option v-for="entity in entities" :key="entity.id" :value="entity.id" :label="entity.name">
                    <jcl-entity :id="entity.id" :click-redirect="false"></jcl-entity>
                </el-option>
            </el-select>
        </div>
        <el-tabs v-model="mode" :stretch="true" @tab-click="refreshChart">
            <el-tab-pane label="伤害" name="damage"></el-tab-pane>
            <el-tab-pane label="治疗" name="treat"></el-tab-pane>
            <el-tab-pane label="承伤" name="beDamaged"></el-tab-pane>
            <el-tab-pane label="承疗" name="beTreated"></el-tab-pane>
        </el-tabs>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"><img svg-inline src="@/assets/img/battle/jcl/eye.svg" />统计总览</span>
            </div>
            <el-row class="u-compare-overview" :gutter="20">
                <el-col :span="12">
                    <jcl-entity-overview :entityID="entityA" :mode="mode"></jcl-entity-overview>
                </el-col>
                <el-col :span="12">
                    <jcl-entity-overview :entityID="entityB" :mode="mode"></jcl-entity-overview>
                </el-col>
            </el-row>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"><img svg-inline src="@/assets/img/battle/jcl/line.svg" />统计曲线</span>
            </div>
            <div class="u-compare-chart">
                <v-echart ref="chart" autoresize manual-update :option="chartOption" class="u-chart"></v-echart>
            </div>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"><img svg-inline src="@/assets/img/battle/jcl/table.svg" />统计表格</span>
                <el-tooltip placement="top">
                    <template #content>
                        <div>
                            <div>点击表格行可以查看双方该效果的详细日志</div>
                            <div>点击表格列头可以置顶双方该效果</div>
                        </div>
                    </template>
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>
            <el-row class="u-compare-tables" :gutter="20">
                <el-col :span="12">
                    <jcl-compare-table
                        :entityID="entityA"
                        :mode="mode"
                        :pin="pin"
                        @row-pin="handleRowPin"
                        @row-click="handleRowClick"
                    ></jcl-compare-table>
                </el-col>
                <el-col :span="12">
                    <jcl-compare-table
                        :entityID="entityB"
                        :mode="mode"
                        :pin="pin"
                        @row-pin="handleRowPin"
                        @row-click="handleRowClick"
                    ></jcl-compare-table>
                </el-col>
            </el-row>
            <el-row class="u-compare-logs" :gutter="20">
                <el-col :span="12">
                    <jcl-compare-logs :entityID="entityA" :effect="effect" :mode="mode"></jcl-compare-logs>
                </el-col>
                <el-col :span="12">
                    <jcl-compare-logs :entityID="entityB" :effect="effect" :mode="mode"></jcl-compare-logs>
                </el-col>
            </el-row>
        </fold-wrapper>
    </div>
</template>

<script>
import JclEntity from "@/components/battle/jcl/common/entity";
import JclEntityOverview from "@/components/battle/jcl/common/entity_overview";
import JclCompareTable from "@/components/battle/jcl/compare/table";
import JclCompareLogs from "@/components/battle/jcl/compare/logs";

import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";

import { getEntityColor } from "@/utils/battle/jcl/colors";
import { cloneDeep } from "lodash";

export default {
    name: "JclCompare",
    components: {
        JclEntity,
        JclEntityOverview,
        JclCompareTable,
        JclCompareLogs,
        FoldWrapper,
    },
    data() {
        return {
            mode: "damage",
            entityA: null,
            entityB: null,

            pin: [],
            effect: null,
        };
    },
    computed: {
        xData() {
            let result = [];
            let end = window.$store?.end?.s ?? 180;
            let max = Math.ceil(end / 5) * 5;
            let min = 0;
            while (min <= max) {
                result.push(min);
                min += 5;
            }
            return result;
        },
        yData() {
            const defaultSeries = {
                type: "line",
                smooth: true,
                showSymbol: false,
            };
            const type = this.mode;
            let result = {};
            let sourceData = cloneDeep(window.$store.entityStat[type]);
            const entities = window.$store.entities;
            for (let id of [this.entityA, this.entityB]) {
                let name = entities[id]?.name;
                let color = getEntityColor(id);
                if (!name) continue;
                let newData = [];
                let windows = sourceData[id]?.windows;
                for (let x of this.xData) newData.push(windows?.[x]?.value ?? 0);
                result[name] = {
                    itemStyle: { color },
                    ...defaultSeries,
                    name,
                    data: newData,
                };
            }
            return Object.values(result);
        },
        chartOption() {
            let legendNames = this.yData.map((item) => item.name);
            return {
                legend: {
                    show: true,
                    icon: "roundRect",
                    orient: "horizontal",
                    data: legendNames,
                    top: 20,
                },
                toolbox: {
                    top: 20,
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
                    order: "valueDesc",
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
                series: this.yData,
            };
        },
        entities() {
            let entities = window?.$store.entities;
            if (!entities) return [];
            entities = Object.values(entities).sort((a, b) => {
                if (a.isPlayer) return -1;
                if (!a.name) return 1;
            });
            return entities;
        },
    },
    mounted() {},
    methods: {
        selectEntity() {
            this.refreshChart();
        },
        handleRowPin(row) {
            let skill = row.skill;
            if (this.pin.includes(skill)) this.pin = this.pin.filter((item) => item !== skill);
            else this.pin.push(skill);
        },
        handleRowClick(row) {
            let skill = row.skill;
            if (this.effect === skill) this.effect = null;
            else this.effect = skill;
        },
        refreshChart() {
            const inst = this.$refs.chart;
            inst.clear();
            inst.setOption(this.chartOption);
        },
    },
};
</script>

<style lang="less">
.m-jcl-compare {
    .u-compare-chart {
        width: 100%;
        height: 320px;
        .mb(48px);
    }
    .u-options {
        padding: 16px 0;
        text-align: center;
        .u-compare-icon {
            font-size: 12px;
            font-weight: bold;
            color: #909399;
            margin: 0 16px;
        }
    }

    .u-title-content {
        margin-right: 16px;
    }
}
</style>
