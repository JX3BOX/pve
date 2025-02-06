<template>
    <el-tabs class="m-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="全部资源" name="all">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/tool/nav/all.png" alt="">
                <b>全部资源</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="工具资源" name="index">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/tool/nav/tool.png" alt="">
                <b>工具资源</b>
                <!-- <em class="u-secret">权威白皮书</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="插件数据" name="jx3dat">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/tool/nav/data.png" alt="">
                <b>插件数据</b>
                <!-- <em class="u-secret">优质作品</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="学习笔札" name="game">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/tool/nav/code.png" alt="">
                <b>学习笔札</b>
                <!-- <em class="u-ready">签约</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="魔盒文档" name="api">
            <span slot="label">
                <img class="u-icon-img" src="@/assets/img/tool/nav/api.png" alt="">
                <b>魔盒文档</b>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="魔盒助手" name="desktop">
            <span slot="label">
                <i class="el-icon-notebook-1"></i>
                <b>魔盒助手</b>
            </span>
        </el-tab-pane> -->
    </el-tabs>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
const subtypes = {
    all: "",
    index: 1,
    jx3dat: 2,
    game: 3,
    api: 4,
}
const _subtypes = {
    1: "index",
    2: "jx3dat",
    3: "game",
    4: "api",
}
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "all",
        };
    },
    watch: {
        $route: {
            handler: function (_route) {
                const subtype = _route.query.subtype;
                if (_route.name === 'index') {
                    if (subtype) {
                        this.view = _subtypes[subtype] || "index";
                    } else {
                        this.view = "all";
                    }
                } else {
                    this.view = _route.name;
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        isSuperAuthor: function () {
            return this.$store.state.isSuperAuthor || false;
        },
    },
    methods: {
        changeView: function () {
            const name = this.view === 'all' ? 'index' : (subtypes[this.view] ? 'index' : this.view);
            this.$router.push({
                name: name,
                query: {
                    subtype: subtypes[this.view],
                },
            });
        },
        getIcon: function (slug, type = ".png") {
            return require("@/assets/img/tool/nav/" + slug + type);
        },
    },
    mounted: function () {
        User.isSuperAuthor().then((data) => {
            this.$store.state.isSuperAuthor = data;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/tabs.less";
</style>
