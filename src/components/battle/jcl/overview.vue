<!-- 总的overview -->
<template>
    <div class="m-jcl-overview">
        <el-tabs v-model="active" @tab-click="switchTab">
            <el-tab-pane label="伤害总览" name="damage"></el-tab-pane>
            <el-tab-pane label="治疗总览" name="treat"></el-tab-pane>
            <el-tab-pane label="承伤总览" name="beDamaged"></el-tab-pane>
            <el-tab-pane label="承疗总览" name="beTreated"></el-tab-pane>
        </el-tabs>
        <div class="u-chart-wrapper">
            <v-echart ref="chart" autoresize manual-update :option="chartOption" class="u-chart"></v-echart>
        </div>
        <div class="u-overview-table">
            <el-table
                :data="tableData"
                :default-sort="{ prop: 'rate', order: 'descending' }"
                :border="true"
                :row-class-name="rowClassName"
                @row-click="rowClick"
                size="mini"
                style="width: 100%"
            >
                <el-table-column label="姓名" width="180">
                    <template #default="{ row }">
                        <jcl-entity :id="row.id"></jcl-entity>
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="数值" :sortable="true"> </el-table-column>
                <el-table-column prop="dps" label="每秒" :sortable="true" :formatter="toFixed"> </el-table-column>
                <el-table-column prop="rate" label="占比" width="220px" :sortable="true">
                    <template slot-scope="scope">
                        <div class="u-progress-container">
                            <i class="u-progress" :style="getProgressStyles(scope.row)"></i>
                            <span class="u-percent">{{ percentFormat(scope.row.rate) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="次数" :sortable="true"> </el-table-column>
                <el-table-column prop="criticalCount" label="会心数" :sortable="true"> </el-table-column>
                <el-table-column prop="min" label="最小值" :sortable="true"> </el-table-column>
                <el-table-column prop="max" label="最大值" :sortable="true"> </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import JclEntity from "@/components/battle/jcl/common/entity.vue";
import { getEntityColor } from "@/utils/battle/jcl/colors.js";

import { cloneDeep } from "lodash";
export default {
    name: "JclOverview",
    data: () => ({
        active: "damage",
        focus: [],
    }),
    components: {
        JclEntity,
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
            const type = this.active;
            let result = {};
            let sourceData = cloneDeep(window.$store.entityStat[type]);
            const entities = window.$store.entities;
            for (let id in sourceData) {
                let name = entities[id]?.name;
                let color = getEntityColor(id);
                if (!name) continue;
                // 如果已经有同名单位，就合并数据
                if (result[name]) {
                    let newData = [];
                    for (let x of this.xData)
                        newData.push(result[name].data[x] + (sourceData[id].windows[x]?.value ?? 0));
                    result[name].data = newData;
                }
                // 没有同名单位就直接添加
                else {
                    let newData = [];
                    for (let x of this.xData) newData.push(sourceData[id].windows[x]?.value ?? 0);
                    result[name] = {
                        itemStyle: { color },
                        ...defaultSeries,
                        name,
                        data: newData,
                    };
                }
            }
            // 添加一个全局
            result = Object.values(result).filter((item) => item.data.some((v) => v > 0));
            let r = {
                ...defaultSeries,
                name: "【全局】",
                data: [],
            };
            let datas = result.map((item) => item.data);
            for (let i = 0; i < this.xData.length; i++) {
                let sum = 0;
                for (let d of datas) {
                    if (Number(d[i])) sum += d[i];
                }
                r.data.push(sum);
            }
            result.unshift(r);
            return result;
        },
        chartOption() {
            let legendNames = this.yData.map((item) => item.name);
            return {
                legend: {
                    show: true,
                    icon: "roundRect",
                    type: "scroll",
                    orient: "horizontal",
                    left: 0,
                    data: legendNames,
                    selected: legendNames.reduce((obj, name) => {
                        if (this.focus.length === 0) {
                            if (name === "【全局】") obj[name] = true;
                            else obj[name] = false;
                        } else {
                            if (this.focus.includes(name)) obj[name] = true;
                            else obj[name] = false;
                        }

                        return obj;
                    }, {}),
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
        tableData() {
            const source = window.$store.entityStat[this.active];
            const entities = window.$store.entities;
            const time = window.$store.end.m / 1000;
            let result = [];
            let allValue = 0;
            let maxDamage = Number.MIN_SAFE_INTEGER;
            for (let id in source) {
                let name = entities[id]?.name;
                if (!name) continue;
                let data = source[id]?.all ?? {};
                result.push({
                    id: Number(id),
                    name,
                    count: data.count,
                    value: data.value,
                    dps: data.value / time,
                    max: data.max,
                    min: data.min,
                    avg: data.value / data.count,
                    criticalCount: data.criticalCount,
                    isPlayer: Boolean(entities[id].mount),
                });
                if (entities[id].mount) {
                    allValue += data.value;
                    maxDamage = Math.max(maxDamage, data.value);
                }
            }
            for (let item of result) {
                if (item.isPlayer) {
                    item["rate"] = (item.value / allValue) * 100;
                    item["length"] = (item.value / maxDamage) * 100 + "%";
                } else {
                    item["rate"] = -1;
                    item["length"] = -1;
                }
            }
            return result;
        },
    },
    methods: {
        rowClassName({ row, rowIndex }) {
            if (!row) return;
            const name = row.name;
            if (this.focus.includes(name)) return "u-row-focus";
        },
        rowClick(row) {
            const name = row.name;
            if (this.focus.includes(name)) {
                this.focus = this.focus.filter((v) => v !== name);
            } else {
                this.focus.push(name);
            }
            this.refreshChart();
        },
        switchTab() {
            this.refreshChart();
        },
        percentFormat(cellValue) {
            if (cellValue === -1) return "N/A";
            return cellValue.toFixed(2) + "%";
        },
        toFixed(row, column, cellValue) {
            return cellValue.toFixed(2);
        },
        getProgressStyles: function (item) {
            let style = {
                width: 0,
                "background-color": "",
            };
            if (item.length != -1) style.width = item.length;
            style["background-color"] = getEntityColor(item.id);
            return style;
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
.m-jcl-overview {
    .u-chart-wrapper {
        width: 100%;
        height: 480px;
        .mb(48px);
    }

    .u-overview-table {
        width: 100%;
        .mb(48px);

        .u-row-focus {
            background-color: #e6f0fb;
        }
    }

    .u-progress-container {
        .db;
        .h(20px);
        max-width: 400px;
        .w(200px);
        .pr;

        .u-progress {
            .pa;
            .db;
            .h(16px);
            .r(16px);
            .z(1);
            .mt(2px);
            background-image: url("~@/assets/img/battle/tinymins/process_bg.svg");
            background-repeat: repeat;
            background-position: 0 0;
            background-size: auto 100%;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        }

        .u-percent {
            .pa;
            .z(2);
            left: 4px;
            color: white;
        }
    }
}
</style>
