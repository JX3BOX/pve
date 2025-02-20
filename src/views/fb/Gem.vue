<template>
    <div class="m-fb-gem" v-loading="loading">
        <el-input class="m-gem-search" placeholder="请输入关键词" v-model.trim.lazy="search" clearable @clear="onSearch" @keydown.native.enter="onSearch">
            <span slot="prepend"><i class="el-icon-search"></i> 搜索</span>
            <el-button slot="append" icon="el-icon-position" @click="onSearch"></el-button>
        </el-input>

        <div class="m-gem-list" v-if="data.length">
            <div class="m-gem-item" v-for="(item, i) in data" :key="i">
                <img class="u-icon" :src="iconLink(item.IconID)" />
                <span class="u-title">
                    <a :href="'/item' + item.Link" target="_blank" draggable="false">{{ item.Name }}</a>
                    <i
                        class="el-icon-copy-document"
                        v-clipboard:copy="item.Name"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onCopyError"
                    ></i>
                </span>
                <game-text class="u-desc" :text="item.Desc"></game-text>
                <!-- <span class="u-drops">
                    <span
                        class="u-drop"
                        v-for="(drop, i) in item._drops"
                        :key="i"
                    >
                        {{ drop }}
                    </span>
                </span> -->
                <span class="u-id">UUID:{{ item.UiID }}</span>
            </div>
        </div>
        <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
        <el-button
            class="m-archive-more"
            :class="{ show: hasNextPage }"
            type="primary"
            :loading="loading"
            @click="appendPage(++page)"
            icon="el-icon-arrow-down"
            v-show="hasNextPage"
            >加载更多</el-button
        >
        <el-pagination
            class="m-archive-pages"
            background
            :hide-on-single-page="true"
            @current-change="changePage"
            :current-page.sync="page"
            :page-size.sync="per"
            layout="total, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
    </div>
</template>

<script>
import GameText from "@jx3box/jx3box-editor/src/GameText.vue"
import { getGemList } from "@/service/fb/gem";
import { __ossMirror, __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Gem",
    props: [],
    components: {
        GameText,
    },
    data: function () {
        return {
            data: [],
            total: 0,
            page: 1,
            pages: 1,
            per: 15,
            loading: false,
            search: "",
            appendMode: false,
        };
    },
    computed: {
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        fb: function () {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
        client: function () {
            return this.$store.state.client || "std";
        },
        params: function () {
            return {
                dungeon: this.fb,
                page: this.page,
                client: this.client,
            };
        },
    },
    methods: {
        iconLink,
        onSearch() {
            this.loadPosts();
        },
        loadPosts: function () {
            this.loading = true;
            const params = {
                ...this.params,
                keyword: this.search,
            };
            getGemList(params)
                .then((res) => {
                    let data = [];
                    if (this.appendMode) {
                        data = this.data.concat(res.data.data.data);
                    } else {
                        data = res.data.data.data;
                    }
                    // for (let item of data) {
                    //     item._desc = this.getDesc(item.Desc);
                    //     item._drops = this.getDrops(item.Desc);
                    // }
                    this.data = data;

                    this.total = res.data.data.total;
                    this.pages = res.data.data.last_page;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function () {
            window.scrollTo(0, 0);
            this.appendMode = false;
        },
        appendPage: function (i) {
            this.appendMode = true;
        },
        getDesc: function (str) {
            const RE = /使用(.*?)装备。/;
            let result = RE.exec(str);
            return result[0];
        },
        getDrops: function (str) {
            const RE = /\[(.*?)\]/g;
            let result = str.match(RE) || [];
            return result;
        },
        getLink,
        onCopy: function () {
            this.$notify({
                title: "复制成功",
                message: "复制物品名称成功",
                type: "success",
            });
        },
        onCopyError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                this.loadPosts();
            },
        },
    },
    created: function () {
        this.loadPosts();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/gem.less";
</style>
