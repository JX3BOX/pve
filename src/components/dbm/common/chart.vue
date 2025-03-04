<template>
    <div class="m-vpk-chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";

// const date = Array.from({ length: 30 }, (v, k) => dayjs().subtract(k, "day").format("MM-DD")).reverse();
export default {
    name: "VpkChart",
    props: {
        data: {
            type: Array,
            default: function () {
                return [];
            },
        },
        day: {
            type: Number,
            default: 30,
        },
    },
    components: {},
    data: function () {
        this.chart = null;
        const date = Array.from({ length: this.day }, (v, k) => dayjs().subtract(k, "day").format("MM-DD")).reverse();
        return {
            options: {
                visualMap: {
                    show: false,
                    type: "continuous",
                    seriesIndex: 1,
                    dimension: 0,
                    min: 0,
                    max: date.length - 1,
                },
                xAxis: {
                    type: "category",
                    // 今天起前30天
                    data: date,
                    show: false,
                },
                yAxis: {
                    type: "value",
                    show: false,
                },
                series: [
                    {
                        data: this.data,
                        type: "line",
                        symbol: "none",
                        lineStyle: {
                            width: 1,
                        }
                    },
                ],
                grid: {
                    bottom: 4
                }
            },
        };
    },
    computed: {},
    watch: {
        data: {
            handler: function (val) {
                // 对数据进行归一化处理
                const max = Math.max(...val);
                const min = Math.min(...val);
                const diff = max - min;
                const data = val.map((item) => {
                    return isNaN(((item - min) / diff) * 100) ? 0 : ((item - min) / diff) * 100;
                });
                this.options.series[0].data = data;
                this.initChart();
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        initChart() {
            this.$nextTick(() => {
                if (!this.chart) {
                    this.chart = echarts.init(this.$refs.chart);
                }
                this.chart.setOption(this.options);
            });
        },
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    },
};
</script>

<style lang="less">
.m-vpk-chart {
    width: 260px;
    height: 68px;
}
</style>
