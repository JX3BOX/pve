<template>
    <div class="w-battle-timeline">
        <div id="buff-timeline"></div>
        <!-- <div class="u-scaleplate"></div> -->
        <ul>
            <li v-for="(item,i) in data" :key="i">
                <div class="u-timeline">
                    <img class="u-icon" :src="item.info.icon | iconLink" />
                    <i class="u-bar" :style="{'background-color':randomColor()}"></i>
                </div>
                <div class="u-info">
                    <span class="u-left">
                        <span class="u-info-meta u-name">{{item.info.name}}</span>
                    </span>
                    <span class="u-right">
                        <span class="u-info-meta u-total">
                            累计时长 :
                            <b>{{item.total}}</b>秒
                        </span>
                        <span class="u-info-meta u-cover">
                            覆盖率 :
                            <b>{{showCoverage(item.total)}}</b>
                        </span>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
// import { scaleLinear } from "d3-scale";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import "echarts";
export default {
    name: "timeline",
    props: ["raw", "data"],
    components: {},
    data: function () {
        return {};
    },
    computed: {
        start_time: function () {
            return this.raw.TIME_BEGIN;
        },
        end_time: function () {
            return this.raw.TIME_BEGIN + this.raw.TIME_DURING;
        },
        finish_time: function () {
            return this.end_time - this.start_time;
        },
    },
    methods: {
        showCoverage: function (val) {
            return (val / this.raw.TIME_DURING) * 100 + "%";
        },
        randomColor: function () {
            return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
        },
    },
    filters: {
        iconLink,
    },
    created: function () {},
    mounted: function () {
        var data = [
            {
                data: "10月1日",
                maxTemp: 26,
                minTemp: 13,
                rain: false,
                sunny: false,
                windSpeed: 4,
                windDir: "N",
            },
            {
                data: "10月2日",
                maxTemp: 18,
                minTemp: 9,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月3日",
                maxTemp: 20,
                minTemp: 9,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "WS",
            },
            {
                data: "10月4日",
                maxTemp: 22,
                minTemp: 10,
                rain: false,
                sunny: true,
                windSpeed: 4,
                windDir: "WS",
            },
            {
                data: "10月5日",
                maxTemp: 21,
                minTemp: 11,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "S",
            },
            {
                data: "10月6日",
                maxTemp: 22,
                minTemp: 13,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "S",
            },
            {
                data: "10月7日",
                maxTemp: 20,
                minTemp: 13,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月8日",
                maxTemp: 18,
                minTemp: 13,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月9日",
                maxTemp: 15,
                minTemp: 9,
                rain: true,
                sunny: false,
                windSpeed: 4,
                windDir: "N",
            },
            {
                data: "10月10日",
                maxTemp: 11,
                minTemp: 6,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "N",
            },
            {
                data: "10月11日",
                maxTemp: 16,
                minTemp: 6,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "W",
            },
            {
                data: "10月12日",
                maxTemp: 18,
                minTemp: 9,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "WS",
            },
            {
                data: "10月13日",
                maxTemp: 18,
                minTemp: 9,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "WS",
            },
            {
                data: "10月14日",
                maxTemp: 13,
                minTemp: 9,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月15日",
                maxTemp: 16,
                minTemp: 8,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "N",
            },
            {
                data: "10月16日",
                maxTemp: 18,
                minTemp: 7,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月17日",
                maxTemp: 16,
                minTemp: 11,
                rain: true,
                sunny: false,
                windSpeed: 1,
                windDir: "S",
            },
            {
                data: "10月18日",
                maxTemp: 15,
                minTemp: 9,
                rain: true,
                sunny: false,
                windSpeed: 1,
                windDir: "S",
            },
            {
                data: "10月19日",
                maxTemp: 18,
                minTemp: 9,
                rain: false,
                sunny: true,
                windSpeed: 1,
                windDir: "S",
            },
            {
                data: "10月20日",
                maxTemp: 20,
                minTemp: 11,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "EN",
            },
            {
                data: "10月21日",
                maxTemp: 18,
                minTemp: 10,
                rain: true,
                sunny: false,
                windSpeed: 2,
                windDir: "E",
            },
            {
                data: "10月22日",
                maxTemp: 13,
                minTemp: 7,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "WN",
            },
            {
                data: "10月23日",
                maxTemp: 16,
                minTemp: 5,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "W",
            },
            {
                data: "10月24日",
                maxTemp: 18,
                minTemp: 8,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "WS",
            },
            {
                data: "10月25日",
                maxTemp: 15,
                minTemp: 9,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "S",
            },
            {
                data: "10月26日",
                maxTemp: 17,
                minTemp: 9,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "N",
            },
            {
                data: "10月27日",
                maxTemp: 18,
                minTemp: 9,
                rain: false,
                sunny: false,
                windSpeed: 2,
                windDir: "S",
            },
            {
                data: "10月28日",
                maxTemp: 16,
                minTemp: 5,
                rain: false,
                sunny: true,
                windSpeed: 4,
                windDir: "N",
            },
            {
                data: "10月29日",
                maxTemp: 12,
                minTemp: 1,
                rain: false,
                sunny: true,
                windSpeed: 4,
                windDir: "N",
            },
            {
                data: "10月30日",
                maxTemp: 14,
                minTemp: 2,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "WN",
            },
            {
                data: "10月31日",
                maxTemp: 16,
                minTemp: 4,
                rain: false,
                sunny: true,
                windSpeed: 2,
                windDir: "WS",
            },
        ];

        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "map",
            callback: function callback(row) {
                row.range = [row.minTemp, row.maxTemp];
                return row;
            },
        });
        const chart = new G2.Chart({
            container: "buff-timeline",
            forceFit: true,
            // height: window.innerHeight,
            padding: [50, 50, 50, 50], // 上右下左
        });

        chart.source(dv, {
            data: {
                tickCount: 10,
            },
            minTemp: {
                max: 30,
                min: 0,
            },
            maxTemp: {
                max: 30,
                min: 0,
            },
        });
        chart.axis("minTemp", false);
        chart.axis("maxTemp", false);
        chart.legend(false);
        chart.interval().position("data*range").size(4).color("#EBEDF0");
        chart
            .point()
            .position("data*minTemp")
            .size(5)
            .color("minTemp", ["#6ab7da", "#806bd9", "#da6bcc"])
            .shape("circle");
        chart
            .point()
            .position("data*maxTemp")
            .size(5)
            .color("maxTemp", ["#6ab7da", "#806bd9", "#da6bcc"])
            .shape("circle");
        chart.render();
    },
};
</script>

<style scoped lang="less">
.w-battle-timeline {
    .mt(10px);
    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        .mb(5px);
        .fz(12px,2);
    }
    .u-icon {
        // .y;
        .size(32px);
        .mr(5px);
        .pa;
        .lt(0);
    }
    .u-timeline {
        .pr;
        .h(32px);
        .clearfix;
        padding: 1px 0 1px 42px;
    }
    .u-bar {
        .db;
        .size(100%,16px);
        margin-top: 5px;
        .r(2px);
    }
    .u-name {
        // .db;
        min-width: 100px;
        .dbi;
    }
    .u-info {
        .clearfix;
        b {
            color: #f00;
            padding: 0 2px;
        }
    }
    .u-left {
        .fl;
    }
    .u-right {
        .fr;
    }
    .u-info-meta {
        .mr(20px);
    }
}
</style>
