<template>
    <div class="m-buff-timeline">
        <div class="u-chart-wrapper" :style="chartStyle">
            <v-echart autoresize :option="chartOption" class="u-chart"></v-echart>
        </div>
    </div>
</template>

<script>
import { graphic } from "echarts";
import { resourceName } from "@/utils/battle/jcl/format";
export default {
    name: "BuffTimeline",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        maxTime: {
            type: Number,
            default: 3600,
        },
    },
    data() {
        return {};
    },
    computed: {
        endTime() {
            return window.$store?.end?.m;
        },
        chartOption() {
            const vm = this;
            const renderItem = function (params, api) {
                let children = [];
                // 绘制矩形
                const categoryIndex = api.value(3);
                const start = api.coord([api.value(1), categoryIndex]);
                const end = api.coord([api.value(2), categoryIndex]);
                const itemHeight = api.size([0, 1])[1] * 0.6;
                const visibleRect = params.coordSys;
                const rectShape = graphic.clipRectByRect(
                    {
                        x: start[0],
                        y: start[1] - itemHeight / 2,
                        width: end[0] - start[0],
                        height: itemHeight,
                    },
                    visibleRect
                );
                children.push({
                    type: "rect",
                    shape: rectShape,
                    style: api.style(),
                });
                // 根据stackLogs在矩形上绘制层数变化
                const stackLogs = JSON.parse(api.value(4));
                let lastLeft = Number.MIN_SAFE_INTEGER;
                for (let time in stackLogs) {
                    const point = api.coord([time, categoryIndex]);
                    const showText = point[0] > visibleRect.x && point[0] < visibleRect.x + visibleRect.width;
                    if (showText && point[0] - lastLeft > 12) {
                        lastLeft = point[0];
                        children.push({
                            type: "text",
                            style: {
                                text: "|" + stackLogs[time],
                                x: point[0] + 3.5,
                                y: point[1],
                                textAlign: "center",
                                textVerticalAlign: "middle",
                                textShadowColor: "#000",
                                textShadowBlur: 2,
                                fill: "#fff",
                            },
                        });
                    }
                }
                // 如果是被驱散的在矩形后面绘制icon
                const isDelete = api.value(5);
                const showDelete = end[0] > visibleRect.x && end[0] < visibleRect.x + visibleRect.width;
                if (isDelete && showDelete) {
                    children.push({
                        type: "text",
                        style: {
                            text: "〰",
                            x: end[0] + 3.5,
                            y: end[1],
                            textAlign: "center",
                            textVerticalAlign: "middle",
                            textShadowColor: "#000",
                            textShadowBlur: 2,
                            fill: "#fff",
                        },
                    });
                }
                return {
                    type: "group",
                    diffChildrenByName: true,
                    children,
                };
            };
            return {
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
                    formatter: function (params) {
                        let { detail } = params.data;
                        const duration = ((detail.end - detail.start) / 1000).toFixed(1);
                        const start = (detail.start / 1000).toFixed(1);
                        const end = (detail.end / 1000).toFixed(1);
                        return `${params.marker} ${params.name} <br />
                            BUFF来源: ${detail.source} <br />
                            ${detail.deleteBy ? `BUFF卸除者: ${detail.deleteBy} <br />` : ""}
                            开始时间: ${start} 秒 <br />
                            结束时间: ${end} 秒 <br />
                            BUFF持续时间: ${duration} 秒`;
                    },
                },
                dataZoom: [
                    {
                        type: "slider",
                        filterMode: "weakFilter",
                        showDataShadow: false,
                        top: vm.chartHeight - 60,
                        labelFormatter: "",
                    },
                    {
                        type: "inside",
                        filterMode: "weakFilter",
                    },
                ],
                grid: {
                    top: 20,
                    height: vm.chartHeight - 120,
                },
                xAxis: {
                    min: this.maxTime,
                    scale: true,
                    position: "top",
                    axisLabel: {
                        formatter: function (val) {
                            return (val / 1000).toFixed(1) + " s";
                        },
                    },
                },
                yAxis: {
                    data: this.categories,
                    axisTick: {
                        show: false,
                    },
                },
                series: [
                    {
                        type: "custom",
                        renderItem,
                        itemStyle: {
                            opacity: 0.8,
                        },
                        encode: {
                            x: [1, 2],
                            y: 0,
                        },
                        data: this.items,
                    },
                ],
            };
        },
        categories() {
            return Object.values(this.data).map((b) => resourceName(b.info, false));
        },
        // 每一个矩形
        items() {
            let result = [];
            let index = 0;
            for (let buffID in this.data) {
                let { info, times } = this.data[buffID];
                for (let time of times) {
                    const isDelete = time.end != time.shouldEnd && time.end != this.endTime;
                    result.push({
                        index,
                        name: resourceName(info, false),
                        value: [buffID, time.start, time.end, index, JSON.stringify(time.stackLogs), isDelete],
                        detail: time,
                        itemStyle: {
                            color: info.color,
                        },
                    });
                }
                index++;
            }
            return result;
        },
        chartHeight() {
            return Math.max(this.categories.length * 30 + 200, 600);
        },
        chartStyle() {
            return { height: this.chartHeight + "px" };
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less">
.m-buff-timeline {
    .u-chart-wrapper {
        width: 100%;
        height: 600px;
    }
}
</style>
