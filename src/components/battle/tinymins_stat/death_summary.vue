<template>
    <div class="m-stat-damage">
        <template v-if="mode === 'list'">
            <list-header :info="info" :overview="overview" class="m-stat-damage-header"></list-header>
            <fold-wrapper>
                <div slot="header" class="m-stat-list-title">
                    <img alt="" class="u-title-icon" src="@/assets/img/battle/raid/skill.svg" svg-inline />
                    死亡总览
                </div>
                <el-table
                    :data="list"
                    :default-sort="{ prop: 'total', order: 'descending' }"
                    :highlight-current-row="true"
                    :stripe="true"
                    border
                    class="m-stat-list"
                    size="mini"
                >
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="u-death-item" v-for="(item, index) in scope.row.arr" :key="index">
                                <span>死亡类型：{{ deathType(item.type) }}</span>
                                <span>触发时间：{{ formatTime(item.trigger) }}</span>
                                <span>结束时间：{{ formatTime(item.stop) }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="排名" sortable></el-table-column>
                    <el-table-column
                        prop="forceID"
                        label="门派"
                        sortable
                        column-key="forceID"
                        :filters="localforces"
                        :filter-method="filterForce"
                    >
                        <template slot-scope="scope">
                            <img class="u-force-icon" :src="scope.row['forceID'] | showForceIcon" alt="" />
                            <span>{{ scope.row["forceName"] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="玩家" sortable></el-table-column>
                    <el-table-column prop="total" label="总计" sortable width="220px">
                        <template slot-scope="scope">
                            {{ scope.row.arr.length }}
                        </template>
                    </el-table-column>
                </el-table>
            </fold-wrapper>
        </template>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import forcemap from "@jx3box/jx3box-data/data/xf/forceid.json";

import listHeader from "@/components/battle/tinymins_stat/list_header";
import foldWrapper from "@/components/battle/common/fold_wrapper.vue";

export default {
    name: "death_summary",
    props: ["info", "data", "mode"],
    components: {
        listHeader,
        foldWrapper,
    },
    model: {
        prop: "mode", //向上同步的数据
        event: "update", //向上同步数据的事件
    },
    computed: {
        overview: function () {
            return this.data["death"]["overview"];
        },
        list: function () {
            const data = this.data?.["death"]["playerData"];
            if (!data) return [];
            const teammates = this.data.teammates;

            return data.map((item) => {
                return {
                    ...item,
                    total: item.arr.length,
                    forceID: teammates[item.id].forceID,
                    forceName: forcemap[teammates[item.id].forceID],
                };
            });
        },
        localforces: function () {
            let force_set = new Set();
            this.list.forEach((item) => {
                force_set.add(item.forceID);
            });
            let force_arr = Array.from(force_set);
            let _arr = [];
            force_arr.forEach((item) => {
                _arr.push({
                    text: forcemap[item] || "NPC",
                    value: item,
                });
            });
            return _arr;
        },
    },
    methods: {
        filterForce: function (value, row, column) {
            return row["forceID"] === value;
        },
        deathType: function (val) {
            return {
                0: "死亡",
                1: "离线",
                2: "暂离",
            }[val];
        },
        formatTime: function (val) {
            return val ? new Date(val * 1000).toLocaleString() : "未知";
        },
    },
    filters: {
        showForceIcon: function (val) {
            return __imgPath + "image/force/" + val + ".png";
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/battle/tinymins_stat/common_list.less";

.u-death-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #ebeef5;
    &:last-child {
        border-bottom: none;
    }
    & > span {
        flex: 1;
    }
}
</style>
