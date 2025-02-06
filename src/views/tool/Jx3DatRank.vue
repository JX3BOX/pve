<template>
    <ListLayout app-key="jx3dat" app-name="数据下载" :without-right="true">
        <div class="v-rank" v-loading="loading">
            <div class="m-plugins-header">
                <h1 class="m-plugins-title"><i class="el-icon-box"></i>团队监控数据</h1>
            </div>
            <div class="m-jx3dat-rank-full m-jx3dat-rank">
                <el-table :data="data" :default-sort="{ prop: '7days', order: 'descending' }" :row-class-name="highlight">
                    <el-table-column type="index" label="👑" width="48"> </el-table-column>
                    <el-table-column prop="name" label="订阅号" sortable width="220px">
                        <template slot-scope="scope">
                            <a class="u-feed" :href="postLink(scope.row.pid)" target="_blank">{{ scope.row.author }}{{ scope.row.v == "默认版" ? "" : "#" + scope.row.v }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="7days" label="7天" sortable> </el-table-column>
                    <el-table-column prop="30days" label="30天" sortable> </el-table-column>
                    <el-table-column prop="yesterday" label="昨日" sortable> </el-table-column>
                    <el-table-column prop="before2" label="前日" sortable> </el-table-column>
                    <el-table-column prop="trending" label="趋势" width="100" :formatter="trending">
                        <template slot-scope="scope">
                            <i class="el-icon-top u-trending" v-if="trending(scope.row) > 0">{{ (trending(scope.row) * 100).toFixed(2) + "%" }}</i>
                            <i class="el-icon-bottom u-trending" v-if="trending(scope.row) < 0">{{ (trending(scope.row) * 100).toFixed(2) + "%" }}</i>
                            <span class="u-trending u-trending-keep" v-if="trending(scope.row) == 0">-</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="view"
                        label="详情"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <a :href="postLink(scope.row.pid)" class="el-button el-button--default is-plain el-button--mini">查看详情<i class="el-icon-arrow-right"></i></a>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
    </ListLayout>
</template>

<script>
import ListLayout from "@/layouts/tool/ListLayout.vue";
import { getRank } from "@/service/tool/rank";
import { postLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Rank",
    data: function() {
        return {
            data: [],
            loading: false,
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
    },
    methods: {
        feed: function(row, column) {
            let name = row.author;
            if (row.v != "默认版") name += "#" + row.v;
            return name;
        },
        trending: function(row, column) {
            let trending = (row.before2 - row.yesterday) / row.yesterday;
            if (!isFinite(trending)) trending = 0;
            return isNaN(trending) ? "N/A" : trending.toFixed(4);
        },
        postLink: function(pid) {
            return postLink("jx3dat", pid);
        },
        highlight({ row, rowIndex }) {
            if (rowIndex < 3) {
                return "t1";
            } else if (rowIndex >= 3 && rowIndex < 10) {
                return "t2";
            } else if (rowIndex >= 10 && rowIndex < 20) {
                return "t3";
            }
            return "";
        },
    },
    mounted: function() {
        this.loading = true;
        getRank(this.client, 100)
            .then((data) => {
                let _data = [];
                data.forEach((item) => {
                    if (item["7days"]) {
                        _data.push(item);
                    }
                });
                this.data = _data;
            })
            .finally(() => {
                this.loading = false;
            });
    },
    components: {
        ListLayout,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/rank.less";
</style>
