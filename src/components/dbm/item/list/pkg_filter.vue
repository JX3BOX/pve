<template>
    <div class="m-pkg-filter">
        <div class="m-pkg-filter__label">
            <span class="u-prepend u-pkg-filter__label el-input-group__prepend">数据包</span>
            <span class="u-pkg-filter__value" @click="showDialog">
                {{ pkgName }}
                <i class="el-icon-close u-pkg-filer__close" @click.stop="onClear" v-if="params.pkg_id" title="清空"></i>
            </span>
        </div>

        <el-dialog class="m-pkg-append__dialog" :visible.sync="visible" title="数据包" append-to-body width="40%">
            <div class="m-append-header">
                <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索包.."> </el-input>
            </div>
            <div class="m-append-content" v-loading="loading">
                <div class="m-pkg-item" v-for="item in data" :key="item.id">
                    <el-tag :type="item.status ? 'warning' : 'success'" size="small" class="u-key">
                        {{ item.name }}
                    </el-tag>
                    <span class="u-title">{{ item.title }}</span>
                    <template v-if="item.is_raw">
                        <el-tooltip content="非云数据不可进行筛选" placement="top">
                            <span class="u-op u-tip"><i class="el-icon-warning-outline"></i> 非云数据</span>
                        </el-tooltip>
                    </template>
                    <el-button
                        v-else
                        class="u-op"
                        size="mini"
                        :type="params.pkg_id != item.id ? 'primary' : 'info'"
                        :icon="params.pkg_id != item.id ? 'el-icon-circle-check' : 'el-icon-remove-outline'"
                        @click="selectItem(item)"
                        :disabled="!!item.is_raw"
                        >{{ params.pkg_id != item.id ? "选择" : "取消" }}</el-button
                    >
                </div>
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
        </el-dialog>
    </div>
</template>

<script>
import { getMyPkgList } from "@/service/dbm/pkg";
import { debounce } from "lodash";
import { mapState } from "vuex";
export default {
    name: "PkgFilter",
    props: {},
    data() {
        return {
            visible: false,

            search: "",
            per: 5,
            page: 1,
            loading: false,
            total: 0,

            data: [],
        };
    },
    computed: {
        ...mapState({
            params: "item_list_params",
        }),
        _params() {
            return {
                _search: this.search,
                per: this.per,
                page: this.page,
                client: this.$store.state.client,
            };
        },
        searchOptions() {
            return [this.page, this.search];
        },
        pkgName() {
            const id = this.params?.pkg_id;

            if (id) {
                return this.data?.find((item) => item.id == id)?.key || "未知";
            }

            return "全部";
        },
    },
    watch: {
        _search() {
            this.page = 1;
        },
        searchOptions: {
            handler: debounce(function () {
                this.loadPkgList();
            }, 300),
            deep: true,
        },
    },
    mounted() {
        this.loadPkgList();
    },
    methods: {
        onShow() {
            this.visible = true;
        },
        loadPkgList() {
            this.loading = true;
            getMyPkgList(this._params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showDialog() {
            this.visible = true;
        },
        selectItem(item) {
            this.params.pkg_id = item.id == this.params.pkg_id ? "" : item.id;
            this.visible = false;
        },
        onClear() {
            this.params.pkg_id = "";
        },
    },
};
</script>

<style lang="less">
.m-pkg-filter {
    .dbi;

    @h: 36px;
    .m-pkg-filter__label {
        height: @h + 2px;
        .flex;
        align-items: center;
        border-radius: 4px;

        .u-prepend {
            .fl;
            width: auto;
            min-width: 50px;
            box-sizing: border-box;
            .fz(12px,@h);
            text-align: center;
        }
        .el-select {
            .db;
            .ml(50px);
        }
        .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .u-pkg-filter__label {
            font-size: 12px;
            padding: 0 15px;

            background: #fba524;
            color: #fff;
            border: 1px solid #fba524;
        }
        .u-pkg-filter__value {
            .pointer;
            font-size: 12px;
            // border: 1px solid #dcdfe6;
            line-height: @h;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 20px;
            .bold;

            background-color:#fff;
            border: 1px solid #fba524;
        }

        .u-pkg-filer__close {
            &:hover {
                color: #c00;
                font-weight: bold;
            }
        }
    }
}

.m-pkg-append__dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
    .m-append-content {
        margin-top: 10px;
        max-height: 266px;
        overflow-y: auto;
    }
    .u-pagination {
        .x;
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
    }
}
</style>
