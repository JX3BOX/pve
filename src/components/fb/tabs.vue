<template>
    <el-tabs class="m-fb-tabs" v-model="view" @tab-click="changeView">
        <el-tab-pane label="副本攻略" name="index">
            <span slot="label">
                <i class="el-icon-collection"></i>
                <b>副本攻略</b>
                <em class="u-secret">开荒首发</em>
            </span>
        </el-tab-pane>

        <el-tab-pane label="副本掉落" name="drop">
            <span slot="label">
                <i class="el-icon-present"></i>
                <b>副本掉落</b>
                <!-- <em class="u-new">最新同步</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="瑰石列表" name="gem">
            <span slot="label">
                <i class="el-icon-cherry"></i>
                <b>瑰石列表</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="副本成就" name="cj">
            <span slot="label">
                <i class="el-icon-medal"></i>
                <b>副本成就</b>
                <!-- <em class="u-new">最新同步</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="秘境传说" name="story">
            <span slot="label">
                <i class="el-icon-film"></i>
                <b>秘境传说</b>
            </span>
        </el-tab-pane>

        <el-tab-pane label="首领数据" name="npc">
            <span slot="label">
                <i class="el-icon-aim"></i>
                <b>首领数据</b>
                <!-- <em class="u-secret">重磅独家</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="特殊机制" name="attr">
            <span slot="label">
                <i class="el-icon-help"></i>
                <b>高阶技巧</b>
                <!-- <em class="u-new">全新上线</em> -->
            </span>
        </el-tab-pane>

        <el-tab-pane label="技能数据" name="skill" v-if="isSuperAuthor && client == 'std'">
            <span slot="label">
                <i class="el-icon-key"></i>
                <b>技能数据</b>
                <em class="u-ready">签约</em>
            </span>
        </el-tab-pane>

        <el-tab-pane label="源码分析" name="lua" v-if="isEditor">
            <span slot="label">
                <i class="el-icon-full-screen"></i>
                <b>源码分析</b>
                <em class="u-ready">签约</em>
            </span>
        </el-tab-pane>

        <!-- <el-tab-pane label="地图大全" name="map">
            <span slot="label">
                <i class="el-icon-map-location"></i>
                <b>地图大全</b>
            </span>
        </el-tab-pane> -->

        <!-- <el-tab-pane label="秘境百强" name="rank" v-if="client=='std'">
            <a slot="label" href="/rank" target="_blank">
                <i class="el-icon-trophy"></i>
                <b>秘境百强</b>
            </a>
        </el-tab-pane>

        <el-tab-pane label="团队管理" name="team">
            <a slot="label" href="/team" target="_blank">
                <i class="el-icon-user"></i>
                <b>团队管理</b>
            </a>
        </el-tab-pane> -->
    </el-tabs>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "index",
            isEditor: User.isEditor(),
            links: ["rank", "team"],
        };
    },
    watch: {
        $route: {
            immediate: true,
            handler: function (_route) {
                this.view = _route.name;
            },
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        isSuperAuthor: function () {
            return this.$store.state.isSuperAuthor || false;
        },
    },
    methods: {
        changeView: function (tab) {
            if (!this.links.includes(this.view)) {
                this.$router.push({
                    name: this.view,
                    query: {
                        fb_name: this.$route.query.fb_name,
                    },
                });
            }
        },
    },
    mounted: function () {
        User.isLogin() &&
            User.isSuperAuthor().then((data) => {
                this.$store.state.isSuperAuthor = data;
            });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/tabs.less";
</style>
