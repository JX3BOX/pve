<template>
    <div class="p-vpk-public p-vpk-list">
        <div class="w-filter-box">
            <div class="m-archive-search">
                <!-- <router-link :to="{ name: 'create_vpk' }" class="u-publish el-button el-button--primary"
                >+ 发布语音包</router-link
            > -->
                <el-input
                    placeholder="请输入搜索内容"
                    v-model.trim.lazy="search"
                    clearable
                    @clear="onSearchChange"
                    @keydown.native.enter="onSearchChange"
                >
                    <span slot="prepend"><i class="el-icon-search"></i> <span class="u-search">关键词</span></span>
                    <el-button slot="append" icon="el-icon-position" class="u-btn" @click="onSearchChange"></el-button>
                </el-input>
            </div>
            <div class="m-vpk-filter">
                <clientBy v-model="client"></clientBy>
                <el-checkbox
                    class="u-only u-checkbox"
                    v-model="is_official"
                    label="只看官方"
                    :true-label="1"
                    :false-label="0"
                    border
                    size="small"
                ></el-checkbox>
                <el-checkbox
                    class="u-star u-checkbox"
                    v-model="star"
                    label="精选"
                    :true-label="1"
                    :false-label="0"
                    border
                    size="small"
                ></el-checkbox>
                <topic-by :topics="tags" label="标签" v-model="tag"></topic-by>
            </div>
        </div>
        <div class="w-filter-list" v-loading="loading">
            <template v-if="list && list.length">
                <VpkList :list="list" mode="public_list" @reload="loadData" />
                <!-- 分页 -->
                <el-pagination
                    class="m-archive-pages"
                    background
                    layout="total, prev, pager, next, jumper"
                    :hide-on-single-page="true"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                    @current-change="loadData"
                ></el-pagination>
            </template>
            <template v-else>
                <el-empty class="m-vpk-null" description="暂无数据" :image-size="120"></el-empty>
            </template>
        </div>
    </div>
</template>

<script>
import { getPublicVpkList } from "@/service/dbm/vpk";
// import tags from "@/assets/data/dbm/vpk_tags.json";
import { removeEmptyParams } from "@/utils/dbm/params";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
// components
import topicBy from "@jx3box/jx3box-common-ui/src/filters/topicBy.vue";
import VpkList from "@/components/dbm/vpk/list.vue";
import clientBy from "@/components/dbm/common/client_by.vue";
export default {
    name: "PublicVpk",
    components: {
        VpkList,
        topicBy,
        clientBy,
    },
    props: [],
    data: function () {
        return {
            tags: [],

            // 搜索参数
            search: "",

            // 筛选参数
            star: 0,
            is_official: 0,
            tag: "",
            client: "all",

            // 分页参数
            per: 10,
            total: 0,
            page: 1,

            list: [],
            loading: false,
        };
    },
    computed: {
        params() {
            const _params = {
                pageIndex: this.page,
                pageSize: this.per,
                title: this.search,
                tag: this.tag,
                client: this.client,
            };
            if (this.is_official) {
                _params.is_official = 1;
            }
            if (this.star) {
                _params.star = 1;
            }

            return _params;
        },
        resetOptions() {
            return [this.tag, this.star, this.is_official, this.client];
        },
    },
    watch: {
        resetOptions: {
            deep: true,
            handler() {
                this.page = 1;
                this.loadData();
            },
        },
        "$route.query": {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.tag) {
                    this.tag = val.tag;
                }
            },
        },
        tag(val) {
            if (val) {
                this.$router.push({ query: { tag: val } });
            } else {
                this.$router.push({ query: {} });
            }
        },
    },
    mounted: function () {
        this.loadTags();
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            const params = removeEmptyParams(this.params);
            getPublicVpkList(params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        setTag(item) {
            this.tag = this.tag === item ? "" : item;
        },
        onSearchChange() {
            this.page = 1;
            this.loadData();
        },
        loadTags() {
            try {
                const tags = sessionStorage.getItem("vpk_tags");
                if (tags) {
                    this.tags = tags.split(",");
                } else {
                    getBreadcrumb("vpk_tags").then((res) => {
                        sessionStorage.setItem("vpk_tags", res);
                        this.tags = res.split(",");
                    });
                }
            } catch (error) {
                console.log(error);
                this.tags = [];
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/public.less";
</style>
