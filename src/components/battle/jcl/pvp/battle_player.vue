<template>
    <div class="m-battle-player">
        <div><img :src="imgSrc" alt="" /></div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "BattlePlayer",
    data() {
        return {};
    },
    computed: {
        imgSrc() {
            let { map, client } = window.$store;
            return `${__imgPath}map/maps/map_${map}_0.png`;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less" scoped>
.m-battle-player {
    border: #eee 1px solid;
    min-height: 600px;
    margin-bottom: 16px;
}
</style>
