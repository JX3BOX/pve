<template>
    <div class="m-list-nav">
        <div class="m-nav-group">
            <router-link
                v-for="(item, i) in menu"
                :to="{ name: item.routeName }"
                :key="i"
                :class="{ on: isActive(item) }"
                class="u-item"
            >
                <i :class="item.icon"></i>
                <span class="u-text">{{ item.name }}</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "list_nav",
    props: [],
    data: function () {
        return {
            menu: [
                {
                    icon: "el-icon-grape",
                    name: "剑三图标库",
                    routeName: "icon"
                },
                {
                    icon: "el-icon-orange",
                    name: "剑三表情包",
                    routeName: "emotion"
                },
                {
                    icon: "el-icon-map-location",
                    name: "剑三地图库",
                    routeName: "map"
                },
                {
                    icon: "el-icon-cherry",
                    name: "魔盒矢量库",
                    routeName: "vector"
                },
                {
                    icon: "el-icon-watermelon",
                    name: "魔盒壁纸库",
                    routeName: "wallpaper"
                },
            ],
        };
    },
    methods: {
        isActive: function (item, routeName) {
            return item.routeName == this.$route.name;
        },
        getIcon: function (slug, type=".png") {
            return require("@/assets/img/tool/nav/" + slug + type);
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/tool/nav.less";
</style>
