<!--
 * @Author: iRuxu
 * @Date: 2022-05-05 01:50:05
 * @LastEditTime: 2022-07-22 01:09:50
 * @Description:
-->
<template>
    <div class="m-list-nav">
        <!-- 群号 -->
        <!-- <RightSideMsg>
            <em>工具作者交流群</em> :
            <strong @click="onQQClick" class="u-link" title="点击复制">
                <a>{{ qq }}</a>
            </strong>
        </RightSideMsg> -->

        <!-- <h5 class="u-title"><i class="el-icon-menu"></i> 分类导航</h5> -->

        <div class="m-ladder-carousel">
            <el-carousel class="m-carousel" autoplay indicator-position="none">
                <el-carousel-item v-for="(item, index) in slideList" :key="index">
                    <a class="u-link" :href="item.link">
                        <el-image class="u-cover" :src="item.img" :alt="item.title" fit="contain" />
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="m-nav-app">
            <h5 class="u-title">在线应用</h5>
            <a href="/dbm" target="_blank">
                <img class="u-icon" :src="getAppIcon('dbm')" />
                <span>数据构建</span>
                <em>JX3dat</em>
            </a>
            <a :href="getLink('database')" target="_blank">
                <img class="u-icon" :src="getAppIcon('database')" />
                <span>数据库大全</span>
                <em>Database</em>
            </a>
            <a :href="getLink('design')" target="_blank">
                <img class="u-icon" :src="getAppIcon('design')" />
                <span>美术资源</span>
                <em>Design</em>
            </a>
        </div>
    </div>
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { jx3dat_types } from "@/assets/data/tool/types.json";
import { getMenuGroup, getBread } from "@/service/tool/helper.js";
import { getConfigBanner } from "@/service/tool/cms";
export default {
    name: "list_nav",
    props: [],
    data: function () {
        return {
            menu: [
                {
                    slug: "",
                    name: "全部资源",
                    desc: "剑三小工具&资源下载",
                    icon: "all",
                    type: "tool",
                    routeName: "index",
                    disabled: false,
                },
                {
                    slug: 1,
                    name: "工具资源",
                    desc: "剑三小工具&资源下载",
                    icon: "tool",
                    type: "tool",
                    routeName: "index",
                    disabled: false,
                },
                {
                    slug: "",
                    name: "插件数据",
                    desc: "剑三插件数据",
                    icon: "data",
                    type: "jx3dat",
                    routeName: "jx3dat",
                    disabled: false,
                },
                {
                    slug: 3,
                    name: "学习笔札",
                    desc: "游戏调优/插件设置与指南",
                    icon: "game",
                    type: "tool",
                    routeName: "index",
                    disabled: false,
                },
                {
                    slug: 4,
                    name: "魔盒文档",
                    desc: "魔盒使用指南&API文档",
                    icon: "api",
                    type: "tool",
                    routeName: "index",
                    disabled: false,
                },
            ],

            jx3dat_types,
            tags: [],
            rules: "",
            apis: [],

            qq: "608303480",

            slideList: [],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(val) {
                if (!val?.query?.subtype && val.name != "jx3dat") {
                    this.$router
                        .replace({
                            name: val.name,
                            query: { subtype: "", ...val.query },
                        })
                        .catch(() => {});
                }
            },
        },
    },
    mounted() {
        this.loadTags();
        this.loadRules();
        this.loadApis();
        this.loadMenu();
    },
    methods: {
        getLink(val) {
            const path = this.$router.resolve({ name: val })?.href;
            return path;
        },
        getAppIcon(key) {
            return __cdn + "logo/logo-light/" + key + ".svg";
        },
        isActive: function (item, routeName) {
            return item.slug == this.$route.query.subtype && this.$route.name == routeName;
        },
        getIcon: function (slug, type = ".png") {
            return require("@/assets/img/tool/nav/" + slug + type);
        },
        loadTags() {
            try {
                const data = sessionStorage.getItem("tool_links");

                if (data) {
                    this.tags = JSON.parse(data);
                } else {
                    getMenuGroup("tool_links").then((res) => {
                        this.tags = res.data.data?.menus || [];

                        sessionStorage.setItem("tool_links", JSON.stringify(this.tags));
                    });
                }
            } catch (e) {
                this.tags = [];
            }
        },
        onQQClick() {
            navigator.clipboard.writeText(this.qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + this.qq,
                    type: "success",
                });
            });
        },
        loadRules: function () {
            try {
                const data = sessionStorage.getItem("tool_rule");

                if (data) {
                    this.rules = data;
                } else {
                    getBread("tool_rule").then((res) => {
                        this.rules = res.data.data.html;

                        sessionStorage.setItem("tool_rule", this.rules);
                    });
                }
            } catch (e) {
                this.rules = "";
            }
        },
        loadApis: function () {
            try {
                const data = sessionStorage.getItem("tool_api");

                if (data) {
                    this.apis = JSON.parse(data);
                } else {
                    getMenuGroup("tool_api").then((res) => {
                        this.apis = res.data.data.menus || [];

                        sessionStorage.setItem("tool_api", JSON.stringify(this.apis));
                    });
                }
            } catch (e) {
                this.apis = [];
            }
        },
        highLight: function (val) {
            if (val) {
                return "color:" + val + ";font-weight:bold;";
            }
            return "";
        },
        loadMenu() {
            getConfigBanner({ client: this.client, status: 1, per: 10, type: "banner", subtype: "tool" }).then((res) => {
                this.slideList = res.data.data.list;
            });
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/tool/nav.less";
</style>
