<template>
    <div class="p-pkg p-pkg-list">
        <div class="m-pkg-toolbar w-filter-box">
            <div class="m-pkg-toolbar__search">
                <el-input
                    v-model.trim.lazy="params._search"
                    placeholder="请输入搜索内容"
                    clearable
                    @clear="loadData"
                    @keydown.native.enter="loadData"
                >
                    <span slot="prepend"><i class="el-icon-search"></i> 关键词</span>
                    <el-button slot="append" icon="el-icon-position"></el-button>
                </el-input>
            </div>
            <div class="m-pkg-toolbar__filter m-conditions">
                <clientBy v-model="params.client"></clientBy>
                <div class="u-condition u-map u-author">
                    <span class="u-prepend el-input-group__prepend">类型</span>
                    <el-select
                        v-model="params.type"
                        popper-class="u-author-pop"
                        filterable
                        placeholder="类型"
                        size="small"
                        clearable
                    >
                        <el-option v-for="(item, index) in pkg_types" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </div>
                <div class="u-condition u-map u-author">
                    <span class="u-prepend el-input-group__prepend">作者</span>
                    <el-select
                        v-model="params.user_id"
                        popper-class="u-author-pop"
                        :remote-method="filterUser"
                        remote
                        filterable
                        placeholder="昵称"
                        size="small"
                        clearable
                        @clear="onFilterUserClear"
                    >
                        <el-option v-for="item in users" :key="item.ID" :label="item.display_name" :value="item.ID">
                            <div class="u-author-option">
                                <img class="u-avatar" :src="showAvatar(item.user_avatar)" alt="" />
                                <span class="u-value">{{ item.display_name }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </div>
                <el-checkbox
                    class="u-star u-checkbox"
                    v-model="params._star"
                    label="精选"
                    :true-label="1"
                    :false-label="0"
                    border
                    size="small"
                ></el-checkbox>
                <el-checkbox
                    class="u-only u-checkbox"
                    v-model="params.is_jx3box"
                    label="只看官方"
                    :true-label="1"
                    :false-label="0"
                    border
                    size="small"
                ></el-checkbox>
                <el-checkbox
                    class="u-only u-checkbox"
                    v-model="params.is_raw"
                    label="只看云数据"
                    :true-label="0"
                    :false-label="1"
                    border
                    size="small"
                ></el-checkbox>
                <topicBy :topics="pkg_tag" label="标签" v-model="params._tag"></topicBy>
            </div>
        </div>
        <div class="m-pkg-main w-filter-list" v-loading="loading">
            <template v-if="data && data.length">
                <pkg-list :data="data" :day="31" @update="onUpdate" />
                <el-pagination
                    class="m-archive-pages"
                    background
                    layout="total, prev, pager, next, jumper"
                    :page-size.sync="per"
                    :total="total"
                    :current-page.sync="page"
                    :hide-on-single-page="true"
                    @current-change="loadData"
                >
                </el-pagination>
            </template>
            <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { removeEmptyParams } from "@/utils/dbm/params";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { getPkgList, getPkgListTrend } from "@/service/dbm/pkg.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getUserList } from "@/service/dbm/user.js";
import {pkg_types} from "@/assets/data/dbm/types.json";

// components
import List from "@/components/dbm/pkg/list/pkg_list.vue";
import topicBy from "@jx3box/jx3box-common-ui/src/filters/topicBy.vue";
import clientBy from "@/components/dbm/common/client_by.vue";

// 即使是0也要移除的参数
const removeParams = ["is_jx3box", "_star", "_tag"];

export default {
    name: "List",
    props: [],
    components: {
        "pkg-list": List,
        topicBy,
        clientBy,
    },
    data: function () {
        return {
            loading: false,

            params: {
                _search: "",
                _star: 0,
                _tag: "",
                client: "",
                user_id: "",
                is_jx3box: 0,
                is_raw: 1,
                type: "",
            },

            data: [],
            page: 1, //当前页数
            total: 1, //总条目数
            per: 10, //每页条目

            isLogin: User.isLogin(),

            pkg_tag: [],
            users: [],
            pkg_types
        };
    },
    computed: {
        reset_params() {
            const { _search, user_id, is_jx3box, _star, _tag, is_raw, client } = this.params;
            return [_search, user_id, is_jx3box, _star, _tag, is_raw, client];
        },
        page_options() {
            return [this.per, this.page];
        },
        query() {
            const params = removeEmptyParams({
                ...this.params,
            });

            // 移除不需要的参数
            removeParams.forEach((item) => {
                !params[item] && delete params[item];
            });

            if (params.client == "all") {
                delete params.client;
            }

            if (params.is_raw == 1) {
                delete params.is_raw;
            }

            return params;
        },
    },
    watch: {
        query: {
            deep: true,
            handler: function (val, oldVal) {
                this.$router.push({
                    path: this.$route.path,
                    query: val,
                });
                this.loadData();
            },
        },
        reset_params: {
            deep: true,
            handler() {
                this.page = 1;
            },
        },
    },
    mounted: function () {
        this.loadTags();
        this.params.client = this.$store.state.client;

        // 根据路由设置参数
        const { query } = this.$route;
        Object.keys(query).forEach((key) => {
            if (key in this.params) {
                this.params[key] = query[key];
            }
        });
    },
    methods: {
        async loadData() {
            // 加载数据
            this.loading = true;
            const res = await getPkgList({ ...this.query, page: this.page, per: this.per })
            const data = res.data.data?.list || [];
            this.total = res.data.data?.total || 0;
            const ids = data.map((item) => item.id).join(",");
            const _res = await getPkgListTrend(ids);
            data.forEach((item) => {
                const trend = _res.data.data[item.id]?.days || Array.from({ length: 31 }, () => 0);
                this.$set(item, "trend", trend);
            });
            this.data = data;
            this.loading = false;
        },
        loadTags() {
            try {
                const tags = sessionStorage.getItem("dbm_tags");
                if (tags) {
                    this.pkg_tag = tags.split(",");
                } else {
                    getBreadcrumb("dbm_tags").then((res) => {
                        sessionStorage.setItem("dbm_tags", res);
                        this.pkg_tag = res.split(",");
                    });
                }
            } catch (error) {
                console.log(error);
                this.pkg_tag = [];
            }
        },
        onClientChange({ val }) {
            this.params.client = val;
        },
        onUpdate() {
            this.loadData();
        },
        filterUser: function (query) {
            if (query !== "") {
                getUserList({ name: query }).then((res) => {
                    this.users = res.data.data?.list || [];
                });
            } else {
                this.users = [];
            }
        },
        showAvatar,
        onFilterUserClear() {
            this.users = [];
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/pkg/list.less";
@import "~@/assets/css/dbm/item/item_conditions.less";
</style>
