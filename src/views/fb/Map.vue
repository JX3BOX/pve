<template>
    <div class="m-fb-map" v-if="maptree">
        <img class="u-map" :src="mapLink(mapid, item)" :alt="fb" ref="fb_map_img" v-for="item in maplist" :key="item" />
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { getMaptree } from "@/service/fb/map.js";
export default {
    name: "JMap",
    props: [],
    data: function () {
        return {
            loading: true,
        };
    },
    computed: {
        fb: function () {
            return this.$store.state.fb || this.$store.state.default_fb;
        },
        dungeons() {
            return this.$store.getters.dungeons;
        },
        mapid: function () {
            return this.dungeons?.[this.fb]["maps"][0]["map_id"];
        },
        maplist: function () {
            return this.maptree[this.mapid];
        },
        maptree: function () {
            return this.$store.state.maptree;
        },
    },
    watch: {
        mapid: function (val) {
            // console.log(val)
        },
    },
    methods: {
        loaded: function () {
            this.loading = false;
        },
        mapLink: function (val, i) {
            return __imgPath + "map/maps/map_" + val + "_" + i + ".png";
        },
    },
    mounted: function () {
        getMaptree().then((res) => {
            this.$store.state.maptree = res.data;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/map.less";
</style>
