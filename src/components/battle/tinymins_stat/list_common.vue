<template>
    <fold-wrapper v-if="list && list.length">
        <div class="m-stat-list-title" slot="header">
            <slot name="header"></slot>
        </div>
        <el-table
            :data="list"
            :default-sort="{ prop: 'total', order: 'descending' }"
            :stripe="true"
            border
            size="mini"
            :highlight-current-row="true"
            class="m-stat-list"
            @row-click="view"
        >
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
                    <img class="u-force-icon" :src="scope.row['forceID'] | showForceIcon" />
                    <span>{{ scope.row["forceName"] }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="玩家" sortable></el-table-column>
            <el-table-column prop="total" label="总计" sortable width="220px">
                <template slot-scope="scope">
                    <i class="u-progress-container">
                        <i class="u-progress" :style="getProgressStyles(scope.row, scope.$index)"></i>
                    </i>
                </template>
            </el-table-column>
            <el-table-column prop="total" :label="totalText" sortable></el-table-column>
            <el-table-column prop="dps" :label="dpsText" sortable></el-table-column>
            <el-table-column prop="more" label="详情">
                <template slot-scope="scope">
                    <el-button plain size="mini" icon="el-icon-data-line" @click="view(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </fold-wrapper>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import forcemap from "@jx3box/jx3box-data/data/xf/forceid.json";
import { colors_by_school_name } from "@jx3box/jx3box-data/data/xf/colors.json";

import foldWrapper from "@/components/battle/common/fold_wrapper.vue";
export default {
    name: "CommonList",
    props: ["data", "teammates"],
    components: {
        "fold-wrapper": foldWrapper,
    },
    data: function () {
        return {
            list: [],
            colors_by_school_name,
        };
    },
    computed: {
        type() {
            return this.$store.state.type;
        },
        maxDamage: function () {
            let total_list = [];
            this.list.forEach((item) => {
                total_list.push(item.total);
            });
            return Math.max(...total_list);
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
        totalText: function () {
            switch (this.type) {
                case "damage":
                    return "总伤害";
                case "heal":
                    return "总治疗";
                case "beHeal":
                    return "总承疗";
                case "beDamage":
                    return "总承伤";
                case "absorb":
                    return "总化解";
                default:
                    return "总计";
            }
        },
        dpsText: function () {
            switch (this.type) {
                case "damage":
                    return "秒伤";
                case "heal":
                    return "秒疗";
                case "beHeal":
                    return "秒承疗";
                case "beDamage":
                    return "秒承伤";
                case "absorb":
                    return "秒化解";
                default:
                    return "秒伤";
            }
        },
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function () {
                this.init();
            },
        },
    },
    methods: {
        getProgressStyles: function (item, i) {
            let style = {
                width: 0,
                "background-color": "",
            };

            if (!i) {
                style.width = "100%";
            } else {
                style.width = (item.total / this.maxDamage) * 100 + "%";
            }

            style["background-color"] = colors_by_school_name[forcemap[item.forceID]] || "#aaa";

            return style;
        },
        filterForce: function (value, row, column) {
            return row["forceID"] === value;
        },
        view: function (val) {
            this.$emit("view", val);
        },
        init: function () {
            let data = [];
            let playerData = this.data;
            let playersData = this.teammates;
            // 遍历过程合并入玩家信息构建数组
            for (let item in playerData) {
                if (playersData[item]) {
                    data.push(Object.assign(playerData[item], playersData[item]));
                } else {
                    data.push(
                        Object.assign(playerData[item], {
                            forceID: 0,
                            forceName: "NPC",
                            icon: 0,
                            id: item,
                            name: item,
                        })
                    );
                }
            }
            this.list = data;
        },
    },
    filters: {
        showForceIcon: function (val) {
            return __imgPath + "image/force/" + val + ".png";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/tinymins_stat/common_list.less";
</style>
