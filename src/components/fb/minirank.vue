<template>
    <div class="m-fb-rank-mini" v-if="ready">
        <h3 class="c-sidebar-right-title">
            <img
                class="u-icon"
                svg-inline
                src="@/assets/img/rank.svg"
            />全服排行
        </h3>
        <el-tabs @tab-click="loadRank" v-model="active">
            <el-tab-pane
                v-for="(cid, name) in nav"
                :label="name"
                :key="name"
                :name="name"
            ></el-tab-pane>
        </el-tabs>
        <div class="m-fb-rank-box" v-for="(group, i) in rank" :key="i">
            <div class="m-fb-rank-group" v-show="active == i">
                <ul class="u-list">
                    <li v-for="(item, j) in group" :key="j">
                        <span class="u-order">{{ j + 1 }}</span>
                        <span class="u-team">{{ item.leader || item.Role }}</span>
                        <span class="u-server">{{ item.Server }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <a
            class="u-more el-button el-button--default is-plain el-button--mini"
            href="/fb/#/rank"
            >&raquo; 查看更多</a
        >
    </div>
</template>

<script>
import { getMiniRank } from "@/service/fb/team";

export default {
    name: "minirank",
    props: [],
    data: function() {
        return {
            active: "安小逢",
            rank: {},
            ready: false,
            nav: {
                安小逢: "7529",
                周贽: "7525",
                厌夜: "7526",
                迟驻: "7527",
                白某: "7528",
            },
        };
    },
    methods: {
        loadRank: function() {
            // 状态设置
            this.loading = true;

            // 已请求
            if (this.rank[this.active]) {
                this.loading = false;
                return;
            }

            // 新请求
            let cid = this.nav[this.active];
            return getMiniRank(cid)
                .then((res) => {
                    this.$set(this.rank, this.active, res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function() {
        this.loadRank().then(() => {
            this.ready = true;
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/fb/rank.less";
</style>


