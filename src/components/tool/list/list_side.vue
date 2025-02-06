<template>
    <div class="m-extend-list">
        <RightSideMsg>
            <em>工具作者交流群</em> :
            <strong @click="onQQClick" class="u-link" title="点击复制">
                <a>{{ qq }}</a>
            </strong>
        </RightSideMsg>
        <minirank />
        <!-- 其他链接 -->
        <div class="m-jx3dat-links m-side-links">
            <h3 class="m-side-title" style="border-bottom: none">
                <div class="u-title">
                    <img class="u-icon" svg-inline src="@/assets/img/tool/side/docs.svg" />
                    魔盒文档
                </div>
            </h3>
            <el-collapse class="u-groups" v-model="activeDocGroup">
                <!-- <el-collapse-item title="发布指南" name="senior">
                    <div class="u-docs">
                        <a v-for="(item, i) in jx3dat_senior" :key="i" class="u-doc" :href="item.link" target="_blank">
                            <i class="el-icon-collection"></i>
                            {{ item.label }}
                        </a>
                    </div>
                </el-collapse-item> -->
                <!-- <el-collapse-item title="版规与要求" name="rule" class="m-tool-rule">
                    <div class="u-content" v-html="rules"></div>
                </el-collapse-item> -->
                <el-collapse-item title="入门指南" name="newbie">
                    <div class="u-docs">
                        <a v-for="(item, i) in jx3dat_newbie" :key="i" class="u-doc" :href="item.link" target="_blank">
                            <i class="el-icon-collection"></i>
                            {{ item.label }}
                        </a>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="API文档" name="api" class="m-tool-api">
                    <div class="u-list" v-if="apis && apis.length">
                        <a
                            class="u-item"
                            v-for="(item, i) in apis"
                            :href="item.link"
                            target="_blank"
                            :style="highLight(item.color)"
                            :key="i"
                        >
                            <i :class="item.icon"></i> {{ item.label }}
                        </a>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="热门搜索" name="tags" class="m-tool-rule">
                    <div class="m-nav-tags" v-if="tags && tags.length">
                        <!-- <h5 class="u-title"><i class="el-icon-collection-tag"></i> 热门搜索</h5> -->
                        <div class="u-list">
                            <a :href="item.link" target="_blank" v-for="(item, i) in tags" :key="i">{{ item.label }}</a>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <!-- <Github_REPO REPO="fb" coder="8"></Github_REPO> -->
    </div>
</template>

<script>
import minirank from "./minirank.vue";
import { getMenuGroups, getMenuGroup } from "@/service/tool/helper.js";
export default {
    name: "list_side",
    props: [],
    data: function () {
        return {
            activeDocGroup: [],
            jx3dat_newbie: [],
            jx3dat_senior: [],

            qq: "608303480",

            tags: [],
            rules: "",
            apis: [],
        };
    },
    methods: {
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
        loadMenu: function () {
            const key = ["jx3dat_newbie", "jx3dat_senior"].join(",");
            getMenuGroups(key).then((res) => {
                let data = res.data.data.reduce((obj, item) => {
                    obj[item.name] = item;
                    return obj;
                }, {});
                for (let key in data) {
                    this[key] = data[key]["menus"];
                }
            });
        },
        highLight: function (val) {
            if (val) {
                return "color:" + val + ";font-weight:bold;";
            }
            return "";
        },
    },
    mounted: function () {
        this.loadTags();
        // this.loadRules();
        this.loadApis();
        this.loadMenu();
    },
    components: {
        minirank,
    },
};
</script>

<style lang="less">
.m-side-title {
    margin: 20px 0 10px 0;
}

.m-extend-list {
    .u-link {
        .pointer;
    }

    .c-sidebar-right-msg {
        margin-left: 0;
        margin-right: 0;
    }
}

.m-side-links {
    .u-title {
        .flex;
        align-items: center;
        gap: 10px;
        .fz(18px);
    }

    .u-icon {
        .size(20px);
    }

    .u-groups {
        padding: 0 5px;
    }
    .u-doc {
        .nobreak;
        .flex;
        align-items: center;
        .fz(12px, 34px);
        // border-bottom: 1px solid #eee;
        i {
            .fz(16px);
            color: #666;
            .mr(5px);
        }
        &:last-child {
            border-bottom: none;
        }
        &:hover {
            .bold;
            color: @pink;
        }
    }
}

.m-tool-api {
    .u-item {
        display: block;
        padding: 0 5px;
        font-size: 12px;
        line-height: 3;
        text-align: left;
        border-bottom: 1px dashed #eee;
        cursor: pointer;
        height: 32px;

        &:hover {
            color: @pink;
            font-weight: bold;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-side-rank,
    .m-side-links {
        // .none;
    }
}

.c-sidebar-right-list {
    .u-item {
        i {
            .mr(5px);
        }
    }
}

.c-sidebar-right-title {
    font-weight: bold;
}
</style>
