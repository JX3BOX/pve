<template>
    <div class="m-battle-info">
        <div class="u-map">
            <span>地图名称</span>
            <span>{{ mapName }}</span>
        </div>
        <div class="u-time">
            <span>战斗时间</span>
            <span>{{ battleTime }}</span>
        </div>
    </div>
</template>

<script>
import { $img } from "@/service/battle/axios";

export default {
    name: "BattleInfo",
    data() {
        return {
            mapIndex: {},
        };
    },
    mounted() {
        $img.get("/map/data/map_index.json").then((res) => {
            this.mapIndex = res.data;
        });
    },
    computed: {
        mapName() {
            let map = window.$store.map;
            return this.mapIndex[map] || "未知地图";
        },
        battleTime() {
            const end = window?.$store?.end?.m;
            if (!end) return "--:--";
            let time = (end / 1000).toFixed();
            let minute = `${Math.floor(time / 60)}`.padStart(2, "0");
            let second = `${time % 60}`.padStart(2, "0");
            return `${minute}:${second}`;
        },
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.m-battle-info {
    .flex;
    align-items: center;
    justify-content: space-between;

    border: #eee 1px solid;
    padding: 16px 8px 8px 8px;
    margin-bottom: 16px;
    & > div {
        .flex;
        flex-direction: column;
        align-items: center;

        width: 100%;

        & > span:first-of-type {
            .fz(12px);
            color: #999;
        }

        & > span:last-of-type {
            .fz(16px);
            font-weight: bold;
            padding: 8px;
        }
    }
}
</style>
