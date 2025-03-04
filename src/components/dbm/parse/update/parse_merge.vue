<template>
    <div class="m-parse-update-merge">
        <div class="u-header">
            <el-button size="small" @click="cancel">重新选择</el-button>
            <el-tooltip placement="bottom" effect="light" popper-class="m-parse-merge-count__popover">
                <div slot="content">
                    <div class="u-count">
                        <div
                            class="u-count-item"
                            :class="'i-diff-' + diff_type"
                            v-for="(diff_type, index) in diff_types"
                            :key="index"
                        >
                            <span class="u-type-title">{{ diff_type }}</span>
                            <div class="u-type-content">
                                <div class="u-type-item" v-for="(item_type, i) in item_types" :key="i">
                                    <span>{{ item_type }}</span>
                                    <span>{{ diffCount[diff_type]?.[item_type] || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="u-total-count">
                    本次更新共影响了
                    <span class="u-total-count__number"> {{ totalCount }} </span>
                    条元数据
                </div>
            </el-tooltip>
            <el-button type="primary" size="small" @click="next">下一步</el-button>
        </div>

        <div class="u-detail">
            <div class="u-detail-left">
                <item-types :type.sync="type" size="mini" :types="types" mode="select" :counts="counts"></item-types>

                <div class="u-list">
                    <parse-merge-list-item
                        v-for="(diff, index) in diffList"
                        :class="{
                            'is-select': isSelect(diff),
                            'is-show': isShow(diff),
                            'is-streak-black': isStreakBlack(diff),
                        }"
                        :key="index"
                        :diff="diff"
                        @select="onDiffItemClick(diff)"
                    ></parse-merge-list-item>
                </div>
                <el-pagination
                    class="u-pagination"
                    layout="prev, pager, next, total, jumper"
                    :total="filteredDiffs.length"
                    :current-page.sync="page"
                    :page-size="pageSize"
                >
                </el-pagination>
            </div>

            <parse-merge-view v-if="show_diff" class="u-view" :diff="show_diff"></parse-merge-view>
        </div>
    </div>
</template>

<script>
import ParseMergeView from "@/components/dbm/parse/update/parse_merge_view.vue";
import ParseMergeListItem from "@/components/dbm/parse/update/parse_merge_list_item.vue";
import ItemTypes from "@/components/dbm/item/item_types.vue";
import { types } from "@/assets/data/dbm/types.json";

export default {
    name: "ParseMerge",
    components: { ParseMergeView, ParseMergeListItem, ItemTypes },
    props: {
        diffs: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        types,
        item_types: Object.keys(types).filter((type) => type != "EXTERNAL"),
        diff_types: ["ADD", "MODIFY", "DELETE"],
        select_diffs: [],
        show_diff: "",

        type: "ALL",
        page: 1,
        pageSize: 17,
    }),
    computed: {
        counts() {
            return this.diffs.reduce((count, cur) => {
                if (!count[cur.item_type]) count[cur.item_type] = 0;
                count[cur.item_type]++;
                return count;
            }, {});
        },
        filteredDiffs() {
            return this.diffs.filter((diff) => {
                if (this.type === "ALL") return true;
                return diff.item_type === this.type;
            });
        },
        diffList() {
            return this.filteredDiffs.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
        },
        diffCount() {
            return this.diffs.reduce((count, cur) => {
                if (!count[cur.type]) count[cur.type] = {};
                const item_type = cur.cur?.type || cur.tar?.type;
                if (!count[cur.type][item_type]) count[cur.type][item_type] = 0;
                count[cur.type][item_type]++;
                return count;
            }, {});
        },
        totalCount() {
            return this.diffs.length;
        },
    },
    methods: {
        isSelect(diff) {
            return true;
        },
        isShow(diff) {
            return this.show_diff === diff;
        },
        isStreakBlack(diff) {
            return diff.batch % 2 === 1;
        },
        onDiffItemClick(diff) {
            this.show_diff = diff;
        },
        next() {
            this.$emit("next", this.select_diffs);
        },
        cancel() {
            this.$emit("cancel");
        },
    },
    mounted() {
        this.show_diff = this.diffs[0];
        this.select_diffs = this.diffs;
    },
};
</script>

<style lang="less">
.m-parse-update-merge {
    .u-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .u-total-count {
        .x();
        .fz(24px);
        .bold;
    }
    .u-total-count__number {
        .fz(30px);
        .bold;
        color: #ffbb00;
    }
    .u-detail {
        display: flex;
        .mt(12px);
        gap: 20px;
    }
    .u-detail-left {
        flex-shrink: 0;
        width: 420px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .u-pagination {
        .scrollbar();
        overflow-x: auto;
    }
    .u-list {
        height: calc(100vh - 460px);
        box-sizing: border-box;
        .scrollbar();
        width: 100%;
        padding: 10px;
        overflow-y: auto;
        border: 1px solid #d0d7de;
        border-radius: 4px;
        padding: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1) inset;
    }
    .u-view {
        flex-grow: 1;
    }
}
.m-parse-merge-count__popover {
    border: 1px solid #ebeef5;
    .fz(14px);
    .u-type-title {
        .fz(18px);
        .bold;
        .mb(14px);
    }
    .u-count {
        display: flex;
        justify-content: space-between;
        width: 600px;
    }
    .u-count-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 160px;
        padding: 10px;
        .r(4px);

        .u-type-title {
            .fz(18px);
            .bold;
        }
        .u-type-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 12px;

            .u-type-item {
                display: flex;
                justify-content: space-between;
                width: 100%;

                span {
                    padding: 1px 4px;
                }
            }
        }
    }
}
&.i-diff-ADD {
    border: 1px solid #abf2bc;
    background-color: #e6ffec;
}
&.i-diff-MODIFY {
    border: 1px solid #ffae00d5;
    background-color: #ffae0065;
}
&.i-diff-DELETE {
    border: 1px solid #ffc1c0;
    background-color: #ffebe9;
}
</style>
