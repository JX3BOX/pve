<template>
    <div ref="heatmap" class="m-cal-heatmap"> </div>
</template>

<script>
import dayjs from "dayjs";
import * as echarts from "echarts";
import {getVpkDownloadHistory} from "@/service/dbm/vpk";
export default {
    name: "CalendarHeatmap",
    props: {
        vpkId: {
            type: Number,
            default: 0,
        }
    },
    data: function () {
        this.cal = null;
        return {
            isPhone: window.innerWidth < 768,
            data: [],
            options: {
                title: {
                    show: false,
                },
                tooltip: {
                    show: true,
                    formatter: function (params) {
                        const date = dayjs(params.value[0]).format("YYYY-MM-DD");
                        const value = params.value[1];
                        return `日期: ${date} <br />下载量: ${value}`;
                    },
                    backgroundColor: "#282a36",
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                    }
                },
                visualMap: {
                    min: 0,
                    max: 10000,
                    type: "piecewise",
                    orient: "horizontal",
                    left: "center",
                    top: 65,
                    show: false,
                    pieces: [
                        { gt: 0, lte: 0, color: "#ebedf0" },
                        { gt: 0, lte: 10, color: "#9be9a8" },
                        { gt: 10, lte: 50, color: "#40c463" },
                        { gt: 50, lte: 100, color: "#30a14e" },
                        {  gt: 100, color: "#216e39" },
                    ],
                },
                legend: {
                    show: false
                },
                calendar: {
                    top: 50,
                    left: 30,
                    right: 30,
                    width: 1055,
                    height: 135,
                    // cellSize: ["auto", 20],
                    range: [this.start, this.end],
                    itemStyle: {
                        borderWidth: 4,
                        color: "#ebedf0",
                        borderJoin: "round",
                        borderColor: "#fff"
                    },
                    yearLabel: { show: false },
                    dayLabel: {
                        show: false,
                        // nameMap: "EN"
                    },
                    monthLabel: {
                        show: true,
                        margin: 8,
                        nameMap: "EN"
                    },
                    splitLine: {
                        show: false,
                    }
                },
                series: {
                    type: "heatmap",
                    coordinateSystem: "calendar",
                    data: [],
                },
            },
        };
    },
    computed: {
        start() {
            return dayjs().subtract(1, "year").format("YYYY-MM-DD");
        },
        end() {
            return dayjs().format("YYYY-MM-DD");
        },
    },
    watch: {
        vpkId: {
            handler: function (val) {
                val && this.loadData();
            },
            immediate: true,
        },
    },
    beforeDestroy() {
        if (this.cal) {
            this.cal.dispose();
            this.cal = null;
        }
    },
    methods: {
        loadData() {
            getVpkDownloadHistory(this.vpkId).then(res => {
                const data = res.data?.data || [];

                // 根据start和end生成虚拟数据,对应日期填入，没有则为0
                let date = dayjs(this.start);
                let end = dayjs(this.end);
                let virtualData = [];

                while (date <= end) {
                    let dateStr = date.format("YYYY-MM-DD 00:00:00");
                    let value = 0;
                    let item = data?.find(item => item.date_time == dateStr);
                    if (item) {
                        value = item.download;
                    }
                    virtualData.push([dateStr, value]);
                    date = date.add(1, "days");
                }

                this.options.series.data = virtualData;

                this.initHeatmap();
            })
        },
        initHeatmap() {
            this.$nextTick(() => {
                this.options.calendar.range = [this.start, this.end];
                if (!this.cal) {
                    this.cal = echarts.init(this.$refs.heatmap);
                }
                this.cal.setOption(this.options);
            });
        },
    },
};
</script>

