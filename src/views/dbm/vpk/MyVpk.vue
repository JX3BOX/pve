<template>
    <div class="p-vpk-my p-vpk-list" v-loading="loading">
        <div class="w-filter-box m-archive-search">
            <!-- <router-link :to="{ name: 'create_vpk' }" class="u-publish el-button el-button--primary"
                >+ 发布语音包</router-link
            > -->
            <el-input
                placeholder="请输入搜索内容"
                v-model.trim.lazy="search"
                clearable
                @clear="loadData"
                @keydown.native.enter="loadData"
            >
                <span slot="prepend"><i class="el-icon-search"></i> <span class="u-search">关键词</span></span>
                <el-button slot="append" icon="el-icon-position" class="u-btn" @click="loadData"></el-button>
            </el-input>
        </div>
        <div class="w-filter-list" v-loading="loading">
            <template v-if="list && list.length">
                <VpkList :list="list" mode="mine_list" @reload="loadData"></VpkList>
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
                <div class="m-vpk-null-box">
                    <el-empty class="m-vpk-null" description="暂无数据" :image-size="120"></el-empty>
                    <el-button type="primary" icon="el-icon-position" class="u-btn" @click="goBuild"
                        >构建语音包</el-button
                    >
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { getMyVpkList } from "@/service/dbm/vpk";
import VpkList from "@/components/dbm/vpk/list.vue";
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "MyVpk",
    components: {
        VpkList,
    },
    props: [],
    data: function () {
        return {
            // 搜索参数
            search: "",

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
                title: this.search,
            };
        },
    },
    watch: {
        search() {
            this.page = 1;
        },
    },
    methods: {
        loadData() {
            if (!User.isLogin()) return;
            this.loading = true;
            getMyVpkList(this.params)
                .then((res) => {
                    this.list = res.data.data?.list || [];
                    this.total = res.data.data?.page?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        goBuild() {
            this.$router.push({ name: "create_vpk" });
        },
    },
    created: function () {},
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/my.less";
</style>
