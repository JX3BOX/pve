<template>
    <div id="app" class="p-app-index">
        <Header></Header>
        <Breadcrumb name="魔盒矩阵" slug="app" root="/app" :feedbackEnable="true">
            <img class="u-app-index" slot="logo" svg-inline src="@/assets/img/tool/app.svg" />
        </Breadcrumb>
        <div class="m-app m-app-index" ref="appContent">
            <h1 class="m-app-index-title">魔盒矩阵</h1>
            <div class="m-app-index-block" v-for="(group, key) in appGroupMap" :key="key">
                <el-divider content-position="left"><i class="el-icon-box"></i> {{ group }}</el-divider>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="(app, index) in appMap[key]" :key="index">
                        <div class="u-item">
                            <a :href="app.link" target="_blank">
                                <span class="u-pic">
                                    <i class="u-icon">
                                        <img :src="getNewIcon(app.key)" />
                                    </i>
                                </span>
                                <span class="u-features">
                                    <span class="u-name">{{ app.label }}</span>
                                    <span class="u-desc">{{ app.remark }}</span>
                                </span>
                            </a>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
import { getAppJson } from "@/service/tool/oss";
export default {
    name: "App",
    data: function () {
        return {
            appMap: {},
            appGroupMap: {
                common: "通用",
                pve: "PVE",
                pvp: "PVP",
                pvx: "PVX",
                other: "其他",
                special: "特殊",
            },
        };
    },
    computed: {
        prefix() {
            const prefix = this.$store.state.client === "std" ? "www" : "origin";
            return prefix;
        },
    },
    methods: {
        getIcon(key) {
            // return `/logos/${key}.svg`;
            // return __cdn + "logo-light/" + key + ".svg";
            return __imgPath + "image/box/" + key + ".svg";
        },
        getNewIcon(key) {
            return __cdn + "logo-light/" + key + ".svg";
        },
        handleClick(e) {
            // 取出a标签
            let a = e.target;

            // 如果不是a标签,则向上查找，直到找到a标签
            while (a.tagName !== "A") {
                a = a.parentNode;
            }

            let href = a.getAttribute("href");

            reportNow({
                caller: "matrix_all",
                data: {
                    href: `${this.prefix}:${href}`,
                },
            });
        },
    },
    mounted: function () {
        getAppJson().then((res) => {
            this.appMap = res;
        });
        this.$nextTick(() => {
            this.$refs.appContent.addEventListener("click", this.handleClick);
        });
    },
    beforeDestroy() {
        this.$refs.appContent.removeEventListener("click", this.handleClick);
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/tool/app/index.less";
</style>
