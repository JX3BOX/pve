<template>
    <div class="m-parse-result">
        <parse-result-header></parse-result-header>

        <item-types
            :type.sync="current"
            :types="types"
            :showAll="true"
            :counts="counts"
            :replace-route="false"
            :hide="['EXTERNAL']"
        ></item-types>

        <div class="m-parse-result__content m-result">
            <parse-filter :type="current"></parse-filter>
            <div class="m-parse-result__op">
                <el-checkbox
                    class="u-all"
                    v-model="check_all"
                    label="全选"
                    border
                    size="mini"
                    @change="checkSwitch"
                ></el-checkbox>

                <div class="u-switch">
                    <el-switch v-model="parse_filter.checked" active-text="仅显示已选择"></el-switch>
                </div>
                <el-pagination
                    class="u-pagination"
                    small
                    :page-size.sync="page_size"
                    :total="filter_data.length"
                    :current-page.sync="page"
                    :page-sizes="[15, 50, 100, 200]"
                    layout="total, prev, pager, next, sizes, jumper"
                >
                </el-pagination>
                <div class="u-gap"></div>
                <el-button
                    icon="el-icon-upload"
                    size="mini"
                    type="primary"
                    @click="handleSave"
                    :disabled="!checked_count || loading"
                >
                    存入我的仓库
                </el-button>
            </div>
            <div class="m-parse-result__list">
                <parse-result-item
                    v-for="(item, index) in list_data"
                    :class="{ 'is-checked': parse_checked[item.type]?.includes(item.id) }"
                    :key="index"
                    :item="item"
                    @click.native="check(item)"
                ></parse-result-item>
            </div>
            <parse-save ref="saveDialog"></parse-save>
        </div>
    </div>
</template>

<script>
import { types } from "@/assets/data/dbm/types.json";
import { mapState } from "vuex";
import ParseSave from "./parse_save.vue";
import ParseFilter from "./parse_filter.vue";
import ParseResultItem from "@/components/dbm/parse/result/parse_item.vue";
import ParseResultHeader from "@/components/dbm/parse/parse_result_header.vue";
import ItemTypes from "@/components/dbm/item/item_types.vue";
import { debounce } from "lodash";

export default {
    name: "ParseResult",
    components: {
        ParseSave,
        ParseFilter,
        ParseResultItem,
        ParseResultHeader,
        ItemTypes,
    },
    data: () => ({
        types,
        current: "BUFF",
        page: 1,
        page_size: 15,
        filter_data: [],
        check_all: false,

        loading: false,
    }),
    computed: {
        ...mapState({
            parse_result: (state) => state.parse_result,
            parse_filter: (state) => state.parse_filter,
            parse_checked: (state) => state.parse_checked,
        }),
        map() {
            return this.parse_filter.map;
        },
        keyword() {
            return this.parse_filter.keyword;
        },
        checked() {
            return this.parse_filter.checked;
        },
        list_data: function () {
            return this.filter_data.slice((this.page - 1) * this.page_size, this.page * this.page_size);
        },
        checked_count() {
            return Object.values(this.parse_checked).reduce((a, b) => a + b.length, 0);
        },
        counts() {
            const result = Object.keys(this.parse_result).reduce((acc, type) => {
                acc[type] = this.parse_result[type].length;
                return acc;
            }, {});
            result["ALL"] = Object.values(result).reduce((a, b) => a + b, 0);
            return result;
        },
    },
    methods: {
        reset() {
            this.$store.commit("RESET_PARSER");
        },
        bulk() {
            this.$emit("bulk");
        },
        applyFilter() {
            const keywords = this.keyword.split(" ");
            const all_data =
                (this.current === "ALL" ? Object.values(this.parse_result).flat() : this.parse_result[this.current]) ||
                [];
            const all_checked =
                (this.current === "ALL"
                    ? Object.values(this.parse_checked).flat()
                    : this.parse_checked[this.current]) || [];
            const filter_result = all_data.filter((item) => {
                if (this.map.length && this.map.every((map) => !item.map.includes(String(map)))) return false;
                if (this.checked && !all_checked.includes(item.id)) return false;
                if (this.keyword) {
                    const { payload, resource, resolves } = item;
                    for (let key of keywords) {
                        if (resource?.Name?.includes(key)) return true;
                        if (resource?.Remark?.includes(key)) return true;
                        if (resource?.SkillName?.includes(key)) return true;
                        if (resource?.BuffName?.includes(key)) return true;
                        if (payload.szNote?.includes(key)) return true;
                        if (payload.dwID == key) return true;
                        if (payload.szName?.includes(key)) return true;
                        if (resolves && Object.values(resolves).some((item) => item?.includes(key))) return true;
                        const countdown = payload.tCountdown;
                        if (countdown?.length)
                            return countdown.some(
                                (item) =>
                                    item?.szName?.includes(key) ||
                                    (typeof item?.nTime == "string" && item?.nTime?.includes(key)) ||
                                    item?.key?.includes(key)
                            );
                    }

                    return false;
                }
                return true;
            });
            return filter_result;
        },
        check(item) {
            console.log(item);
            const id = item.id;
            if (this.parse_checked[item.type].includes(id)) {
                this.parse_checked[item.type].splice(this.parse_checked[item.type].indexOf(id), 1);
            } else {
                this.parse_checked[item.type].push(id);
            }
        },
        checkSwitch() {
            if (!this.check_all) {
                this.cancelAll();
            } else {
                this.checkAll();
            }
        },
        checkAll() {
            for (let item of this.filter_data) {
                if (!this.parse_checked[item.type].includes(item.id)) this.parse_checked[item.type].push(item.id);
            }
        },
        cancelAll() {
            for (let item of this.filter_data) {
                if (this.parse_checked[item.type].includes(item.id))
                    this.parse_checked[item.type].splice(this.parse_checked[item.type].indexOf(item.id), 1);
            }
        },
        handleSave() {
            this.$refs["saveDialog"].open();
        },
        updateData() {
            this.filter_data = Object.freeze(this.applyFilter());
            this.page = 1;
            this.check_all =
                this.filter_data.length &&
                this.filter_data.every((item) => this.parse_checked[item.type].includes(item.id));
        },
    },
    watch: {
        parse_checked: {
            deep: true,
            handler() {
                this.check_all = this.filter_data.every((item) => this.parse_checked[item.type].includes(item.id));
            },
        },
        current: {
            immediate: true,
            handler() {
                this.updateData();
            },
        },
        checked() {
            this.updateData();
        },
        map() {
            this.updateData();
        },
        keyword: debounce(function () {
            this.updateData();
        }, 500),
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/repo_tabs.less";
@import "~@/assets/css/dbm/parse/parse_result.less";
</style>
