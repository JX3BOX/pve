<template>
    <div class="m-jx3dat-rank-mini m-jx3dat-rank">
        <h3 class="c-sidebar-right-title">
            <img class="u-icon" svg-inline src="@/assets/img/tool/rank.svg" />排行榜
            <span class="u-more" @click="viewRank">查看更多 &raquo;</span>
        </h3>
        <el-tabs v-model="active" @tab-click="handleClick">
            <el-tab-pane label="综合" name="mix"></el-tab-pane>
            <el-tab-pane label="下载" name="download"></el-tab-pane>
            <el-tab-pane label="订阅" name="subscribers"></el-tab-pane>
            <el-tab-pane label="收藏" name="favorite"></el-tab-pane>
        </el-tabs>
        <ul class="u-list" v-loading="loading">
            <li v-for="(item, k) in data" :key="k">
                <a class="u-link" :href="postLink('dbm/pkg', item.id)">
                    <span class="u-order" :class="highlight(k)">{{ k + 1 }}</span>
                    <Avatar class="u-avatar" :url="item.ext_user_info.avatar" :size="14"> </Avatar>
                    <!-- <span class="u-tag" :class="item.client">{{ item.client === "std" ? "重制" : "缘起" }}</span> -->
                    <span class="u-name"> {{ item.key }} </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getPkgRank } from "@/service/tool/rank";
import { postLink } from "@jx3box/jx3box-common/js/utils";
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "rank",
    data: function () {
        return {
            loading: false,
            data: [],
            active: "mix",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        postLink,
        handleClick() {
            this.loadData();
        },
        viewRank: function () {
            const root = this.client === "std" ? __Root : __OriginRoot;
            window.open(`${root}dbm/pkg/rank`, "_blank");
        },
        highlight: function (i) {
            if (i == 0) {
                return "t1";
            } else if (i == 1) {
                return "t2";
            } else if (i == 2) {
                return "t3";
            }
        },
        loadData() {
            this.loading = true;
            getPkgRank(this.active, { top: 10, client: this.client })
                .then((res) => {
                    this.data = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/rank.less";
</style>
