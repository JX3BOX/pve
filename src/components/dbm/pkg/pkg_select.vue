<template>
    <div class="m-pkg-select">
        <div class="m-pkg-select-header">
            <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索包.." :disabled="disabled">
                <template #suffix>
                    <i class="el-input__icon el-icon-refresh u-refresh" @click="loadPkgList" title="刷新列表"></i>
                </template>
            </el-input>
            <a v-if="linkToCreate" class="el-button el-button--primary" href="/dbm/pkg/create" target="_blank">
                <i class="el-icon-circle-plus-outline"></i> 创建数据包
            </a>
        </div>
        <div class="m-pkg-select-content" v-loading="loading">
            <template v-if="data && data.length">
                <div
                    class="m-pkg-item"
                    v-for="item in data"
                    :key="item.id"
                    :class="{ 'is-selected': isSelected(item) }"
                >
                    <el-tag :type="item.status ? 'warning' : 'success'" size="small" class="u-key">{{
                        item.name
                    }}</el-tag>
                    <span class="u-title">{{ item.title }}</span>
                    <template v-if="item.is_raw && !rawPkgSelectable">
                        <el-tooltip content="非云数据不可在线构建" placement="top">
                            <span class="u-op u-tip"><i class="el-icon-warning-outline"></i> 不可选择</span>
                        </el-tooltip>
                    </template>
                    <template v-else>
                        <el-button
                            v-if="!isSelected(item)"
                            class="u-op"
                            size="mini"
                            type="primary"
                            icon="el-icon-circle-plus-outline"
                            @click="onAdd(item)"
                            :disabled="disabled"
                            >选择</el-button
                        >
                        <el-button
                            v-else
                            class="u-op"
                            size="mini"
                            type="info"
                            icon="el-icon-remove-outline"
                            @click="onRemove(item)"
                            :disabled="disabled"
                            >移除</el-button
                        >
                    </template>
                </div>
                <el-pagination
                    class="u-pagination"
                    small
                    :page-size.sync="per"
                    :total="total"
                    :current-page.sync="page"
                    hide-on-single-page
                    layout="prev, pager, next"
                    background
                ></el-pagination>
            </template>
            <template v-else>
                <div class="u-empty">
                    <i class="el-icon-warning-outline"></i> 还没有任何数据包，
                    <a href="/dbm/pkg/create" target="_blank">前往创建</a>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { getMyPkgList, getPkgList } from "@/service/dbm/pkg";
import { debounce } from "lodash";
export default {
    name: "PkgSelect",
    props: {
        linkToCreate: {
            type: Boolean,
            default: true,
        },
        public: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: [Array, Number],
            default: () => [],
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        showRawPkg: {
            type: Boolean,
            default: false,
        },
        rawPkgSelectable: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        search: "",
        per: 5,
        page: 1,
        loading: false,
        total: 0,

        data: [],
    }),
    computed: {
        _selected: {
            set(val) {
                this.$emit("update:selected", val);
            },
            get() {
                return this.selected;
            },
        },
        params() {
            const result = {
                _search: this.search,
                per: this.per,
                page: this.page,
                client: this.$store.state.client,
            };
            if (!this.showRawPkg) result["is_raw"] = 0;
            return result;
        },
        searchOptions() {
            return [this.page, this.search];
        },
    },
    watch: {
        visible(val) {
            if (val) {
                this.loadPkgList();
            }
        },
        _search() {
            this.page = 1;
        },
        searchOptions: {
            handler: debounce(
                function () {
                    this.loadPkgList();
                },
                300,
                { leading: true }
            ),
            deep: true,
            immediate: true,
        },
    },
    methods: {
        loadPkgList() {
            this.loading = true;
            const fn = this.public ? getPkgList : getMyPkgList;
            fn(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        isSelected(item) {
            if (this.multiple) {
                if (!this._selected) {
                    this._selected = [];
                    return false;
                }
                return this._selected.includes(item.id);
            } else {
                return this._selected == item.id;
            }
        },
        onAdd(item) {
            if (this.disabled) return;
            if (!this.multiple) {
                this._selected = item.id;
                return;
            }
            if (!this._selected) this._selected = [];
            this._selected.push(item.id);
        },
        onRemove(item) {
            if (this.disabled) return;
            if (!this.multiple) {
                this._selected = null;
                return;
            }
            if (!this._selected) this._selected = [];
            this._selected = this.selected.filter((id) => id !== item.id);
        },
    },
};
</script>

<style lang="less">
.m-pkg-select {
    background-color: @bg-light;
    padding: 20px;
    border: 1px solid #eee;
    .r(4px);
    .m-pkg-select-header {
        display: flex;
        gap: 10px;
    }
    .m-pkg-select-content {
        margin-top: 10px;
        height: 280px;
        overflow-y: auto;
        // .scrollbar();

        .u-empty {
            .flex;
            align-items: center;
            height: 90%;
            justify-content: center;
            color: #888;
            i {
                margin-right: 2px;
            }
            a {
                box-shadow: 0 1px 0 @color-link;
            }
        }
    }
    .u-pagination {
        .x;
        margin-top: 10px;
    }
    .m-pkg-item {
        .pr;
        padding: 10px;
        .flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        .u-key {
            .mr(10px);
        }
        .u-op {
            .pa;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
        .u-tip {
            color: orange;
            .fz(12px);
            .bold;
        }
    }
    .u-refresh {
        .pointer;
    }
}
</style>
