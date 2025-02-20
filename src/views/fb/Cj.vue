<template>
    <div class="m-fb-cj" v-loading="loading">
        <div class="m-cj-list" v-if="hasData">
            <a class="m-cj-item" v-for="(item, i) in data" :href="item.ID | url" :key="i" target="_blank">
                <img class="u-icon" :src="item.IconID | iconLink" />
                <span class="u-title">{{ item.Name }}</span>
                <span class="u-desc">{{ item.BossName }} · {{ item.ShortDesc }}</span>
                <i class="u-point"><img src="@/assets/img/fb/point.png" />{{ item.Point }}</i>
            </a>
        </div>
        <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
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
import { getAchievements } from "@/service/fb/achievement";
import { __ossMirror, __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Cj",
    props: [],
    data: function () {
        return {
            loading: false,

            data: "",
            total: 0,
            page: 1,
            pages: 1,
            per: 15,
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
                dungeon_name: this.fb,
                page: this.page,
                limit: this.per,
                client: this.client,
            };
        },
        hasData: function () {
            return (this.data && this.data.length) || Object.keys(this.data).length;
        },
    },
    filters: {
        iconLink,
        url: function (id) {
            return "/cj/#/view/" + id;
        },
    },
    methods: {
        loadPosts: function (append = false) {
            this.loading = true;
            getAchievements(this.params)
                .then((res) => {
                    this.data = res.data.data.achievements;
                    this.total = res.data.data.total;
                    this.pages = res.data.data.last_page;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function () {
            window.scrollTo(0, 0);
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
@import "~@/assets/css/fb/cj.less";
</style>
