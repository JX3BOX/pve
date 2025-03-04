<template>
    <div class="m-state-damage-single-header">
        <header class="m-single-header">
            <div class="u-basic">
                <template v-if="isUper">
                    <img class="u-icon-xf" :src="info.player_mount | showMountIcon" />
                </template>
                <template v-else>
                    <img class="u-icon-xf" :src="data.forceID | showForceIcon" />
                </template>
                <span class="u-name">
                    <template v-if="isUper">
                        <span class="u-player-name">{{ info.player_name }}</span>
                    </template>
                    <template v-else>
                        <span class="u-player-name">{{ data.name }}</span>
                    </template>
                </span>
            </div>
        </header>
        <div class="m-overview">
            <ul>
                <li>
                    <span>战斗名称</span>
                    <b>{{ info.bossname }}</b>
                </li>
                <li>
                    <span>{{ totalText }}</span>
                    <b>{{ total | showNumber }}</b>
                </li>
                <li>
                    <span>战斗时长</span>
                    <b>
                        {{ info.time_during }}
                        <em>秒</em>
                    </b>
                </li>
                <li>
                    <span>{{ dpsText }}</span>
                    <b>{{ dps | showNumber }}</b>
                </li>
            </ul>
        </div>
        <div class="m-meta">
            <ul>
                <li>
                    <span>服务器</span>
                    <b>{{ info.server }}</b>
                </li>
                <li>
                    <span>地图场景</span>
                    <b>{{ showMapName(info.map) }}</b>
                </li>
                <li>
                    <span>数据类型</span>
                    <b>{{ info.type | showDataType }}</b>
                </li>
                <li>
                    <span>数据版本号</span>
                    <b>v{{ info.version }}</b>
                </li>
                <li>
                    <span>开始时间</span>
                    <time>{{ info.time_begin | showTime }}</time>
                </li>
                <li>
                    <span>结束时间</span>
                    <time>{{ info.time_end | showTime }}</time>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import datatypes from "@/assets/data/battle/datatypes.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { showTime, moment } from "@jx3box/jx3box-common/js/moment.js";

export default {
    name: "singleHeader",
    props: ["data", "info"],
    data: function () {
        return {
            maps: {},
        };
    },
    methods: {},
    computed: {
        type: function () {
            return this.$store.state.type;
        },
        isUper: function () {
            return this.info.player_id == this.data.id;
        },
        dps: function () {
            if (this.isUper) {
                return this.info.dps;
            } else {
                return this.data.dps;
            }
        },
        total: function () {
            if (this.isUper) {
                return this.info.damage;
            } else {
                return this.data.total;
            }
        },
        dpsText: function () {
            switch (this.type) {
                case "damage":
                    return "秒伤";
                case "heal":
                    return "秒治疗";
                case "beHeal":
                    return "秒承疗";
                default:
                    return "秒伤";
            }
        },
        totalText: function () {
            switch (this.type) {
                case "damage":
                    return "总伤害";
                case "heal":
                    return "总治疗";
                case "beHeal":
                    return "总承疗";
                default:
                    return "总伤害";
            }
        },
    },
    filters: {
        showForceIcon: function (val) {
            return val && __imgPath + "image/force/" + val + ".png";
        },
        showMountIcon: function (val) {
            return val && __imgPath + "image/xf/" + val + ".png";
        },
        showTime: function (val) {
            return showTime(new Date(val * 1000));
        },
        showNumber: function (val) {
            return (val / 10000).toFixed(2) + "万";
        },
        showDataType: function (val) {
            return datatypes[val];
        },
    },
    methods: {
        getMaps() {
            try {
                const jx3maps = sessionStorage.getItem("jx3maps");
                if (jx3maps) {
                    this.maps = JSON.parse(jx3maps);
                } else {
                    fetch("https://data.jx3box.com/map/data/map_index.json")
                        .then((res) => res.json())
                        .then((res) => {
                            this.maps = res;
                            sessionStorage.setItem("jx3maps", JSON.stringify(res));
                        });
                }
            } catch (error) {
                console.log(error);
            }
        },
        showMapName: function (val) {
            return this.maps[val] ?? "未知地图";
        },
    },
    created: function () {},
    mounted: function () {
        this.getMaps();
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/battle/tinymins_stat/damage_single.less";
</style>
