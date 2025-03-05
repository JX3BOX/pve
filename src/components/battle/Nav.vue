<template>
    <nav class="m-nav">
        <a class="m-nav-add el-button el-button--primary" @click="toUpload">
            <span>
                <i class="el-icon-upload"></i>
                上传数据
            </span>
        </a>

        <ul class="m-battle-route">
            <li v-for="(nav, index) in navList" :key="index">
                <router-link :to="nav.path" class="u-item">
                    <i class="u-icon" :class="nav.icon"></i>
                    <span class="u-text">{{ nav.name }}</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Nav",
    data: function () {
        return {
            navList: [
                {
                    name: "使用说明",
                    key: "index",
                    icon: "el-icon-reading",
                    path: "/index",
                },
                {
                    name: "我的数据",
                    key: "mine",
                    icon: "el-icon-folder",
                    path: "/mine",
                },
                {
                    name: "数据大厅",
                    key: "public",
                    icon: "el-icon-search",
                    path: "/public",
                },
                {
                    name: "魔盒助手",
                    key: "jba",
                    icon: "el-icon-box",
                    path: "/jba",
                },
            ],
        };
    },
    computed: {},
    methods: {
        toUpload: function () {
            if (this.$route.path == "/upload") return;
            this.$router.push({
                name: "upload",
            });
        },
    },
    filters: {
        mountIcon: function (val) {
            return __imgPath + "image/xf/" + val + ".png";
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/battle/nav.less";
</style>
