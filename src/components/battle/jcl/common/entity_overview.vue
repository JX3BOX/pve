<template>
    <div class="m-jcl-stat-overview">
        <div class="u-overview">
            <div class="u-overview-item">
                <div class="u-overview-item-title">参战时长</div>
                <div class="u-overview-item-value">{{ overviewTime }}</div>
            </div>
            <div class="u-overview-item">
                <div class="u-overview-item-title">总{{ statLabel }}次数</div>
                <div class="u-overview-item-value">{{ overviewValueCount }}</div>
            </div>
            <div class="u-overview-item">
                <div class="u-overview-item-title">总{{ statLabel }}</div>
                <div class="u-overview-item-value">{{ overviewValue }}</div>
            </div>
            <div class="u-overview-item">
                <div class="u-overview-item-title">每秒{{ statLabel }}</div>
                <div class="u-overview-item-value">{{ overviewValuePS }}</div>
            </div>
            <div class="u-overview-item">
                <div class="u-overview-item-title">{{ statLabel }}会心率</div>
                <div class="u-overview-item-value">{{ overviewCriticalRate }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "JclStatOverview",
    props: {
        entityID: {
            type: Number,
            default: null,
        },
        mode: {
            type: String,
            default: "damage",
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
            return labelMap[this.mode];
        },
        data() {
            const source = window.$store.entityStat[this.mode];
            const entities = window.$store.entities;
            if (!entities[this.entityID]) return null;
            return source[this.entityID]?.all;
        },
        overviewCriticalRate: function () {
            if (!this.data) return "- %";
            let critical = this.data.criticalCount / this.data.count;
            return `${(critical * 100).toFixed(2)} %`;
        },
        overviewValueCount: function () {
            if (!this.data) return "-";
            return this.data.count;
        },
        overviewValue: function () {
            if (!this.data) return "-";
            return this.data.value?.toLocaleString();
        },
        overviewValuePS: function () {
            if (!this.data) return "-";
            let dps = this.data.value / (this.data.time / 1000);
            return dps.toFixed(2);
        },
        overviewTime: function () {
            if (!this.data) return "--:--";
            const end = window.$store.end.m;
            let time = (end / 1000).toFixed();
            let minute = `${Math.floor(time / 60)}`.padStart(2, "0");
            let second = `${time % 60}`.padStart(2, "0");
            return `${minute}:${second}`;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less">
.m-jcl-stat-overview {
    .u-overview {
        .flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        text-align: center;
        padding: 40px 0;
    }
    .u-overview-item-title {
        font-weight: bold;
        font-size: 14px;
        color: #909399;
        margin-top: 8px;
    }
    .u-overview-item-value {
        font-size: 20px;
        margin-top: 8px;
    }
}
</style>
