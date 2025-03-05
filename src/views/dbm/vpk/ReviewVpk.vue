<template>
    <div class="p-vpk-public p-vpk-list">
        <div class="m-archive-search">
            <el-select v-model="status">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已通过" :value="1"></el-option>
                <el-option label="未通过" :value="-1"></el-option>
            </el-select>
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
        <div class="m-vpk-review__list" v-loading="loading">
            <template v-if="list && list.length">
                <VpkList :list="list" mode="manage_list" @reload="loadData" />
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
import { getManageVpkList } from "@/service/dbm/vpk";
import VpkList from "@/components/dbm/vpk/list.vue";
import { removeEmptyParams } from "@/utils/dbm/params";
export default {
    name: "PublicVpk",
    components: {
        VpkList,
    },
    props: [],
    data: function () {
        return {

            // 搜索参数
            search: "",

            // 筛选参数
            status: 0,

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
            return {
                pageIndex: this.page,
                pageSize: this.per,
                status: this.status,
            };
        },
    },
    watch: {
        "$route.query": {
            deep: true,
            handler(val) {
                if (val?.tag) {
                    this.tag = val.tag;
                }
            },
        },
        status() {
            this.page = 1;
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            const params = removeEmptyParams(this.params);
            this.status !== "" && (params.status = this.status);
            getManageVpkList(params)
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/public.less";
</style>
