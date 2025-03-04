<template>
    <div class="m-overview" v-if="overview">
        <ul>
            <li>
                <span>战斗对象</span>
                <b>{{overview.bossname}}</b>
            </li>
            <li>
                <span>总{{totalText}}</span>
                <b v-if="type !== 'death'">{{ overview.total | showNumber }}</b>
                <b v-else>{{ overview.total }}</b>
            </li>
            <li>
                <span>战斗时长</span>
                <b>
                    {{time_during}}
                    <em>秒</em>
                </b>
            </li>
            <li v-if="perText">
                <span>团队秒{{perText}}</span>
                <b>{{overview.dps | showNumber}}</b>
            </li>
            <slot></slot>
            <li>
                <time>开始时间：{{time_begin | showTime}}</time>
                <time>结束时间：{{time_end | showTime}}</time>
            </li>
        </ul>
    </div>
</template>

<script>
import { showTime, moment } from "@jx3box/jx3box-common/js/moment.js";

export default {
    name: "listHeader",
    props: ["overview", "info"],
    data: function () {
        return {};
    },
    filters: {
        showNumber: function (val) {
            return (val / 10000).toFixed(2) + "万";
        },
        showTime: function (val) {
            return showTime(new Date(val));
        },
    },
    computed: {
        type() {
            return this.$store.state.type;
        },
        time_begin: function () {
            return this.info.time_begin * 1000;
        },
        time_end: function () {
            return this.info.time_end * 1000;
        },
        time_during: function () {
            return this.info.time_during;
        },
        totalText: function () {
            switch (this.type) {
                case "damage":
                    return "伤害";
                case "heal":
                    return "治疗";
                case "beHeal":
                    return "承疗";
                case "beDamage":
                    return "承伤";
                case "absorb":
                    return "化解";
                case "death":
                    return "死亡";
                default:
                    return "";
            }
        },
        perText: function () {
            switch (this.type) {
                case "damage":
                    return "伤";
                case "heal":
                    return "治疗";
                case "beHeal":
                    return "承疗";
                case "beDamage":
                    return "承伤";
                case "absorb":
                    return "化解";
                default:
                    return "";
            }
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/battle/tinymins_stat/overview.less";
</style>
