<template>
    <div class="m-pkg-append">
        <el-tooltip class="item" effect="dark" content="加入到指定数据包" placement="top">
            <el-button class="u-fork" type="primary" :size="size" icon="el-icon-box" :disabled="false" @click="onShow"
                >{{ btnText }}
                <span v-if="count" class="u-count"
                    >(<b>{{ count }}</b
                    >)</span
                ></el-button
            >
        </el-tooltip>

        <el-dialog class="m-pkg-append__dialog" :visible.sync="visible" title="加入包" append-to-body width="40%">
            <div class="m-append-header">
                <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索包..">
                    <template #suffix>
                        <i class="el-input__icon el-icon-refresh u-refresh" @click="loadPkgList" title="刷新列表"></i>
                    </template>
                </el-input>
            </div>
            <div class="m-append-content" v-loading="loading">
                <template v-if="data && data.length">
                    <div
                        class="m-pkg-item"
                        v-for="item in data"
                        :key="item.id"
                        :class="{ 'is-selected': hasAppended(item) }"
                    >
                        <el-tag :type="item.status ? 'warning' : 'success'" size="small" class="u-key">{{
                            item.name
                        }}</el-tag>
                        <span class="u-title">{{ item.title }}</span>
                        <template v-if="item.is_raw">
                            <el-tooltip content="非云数据不可在线构建" placement="top">
                                <span class="u-op u-tip"><i class="el-icon-warning-outline"></i> 不可加入</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <el-button
                                v-if="!hasAppended(item)"
                                class="u-op"
                                size="mini"
                                type="primary"
                                icon="el-icon-circle-plus-outline"
                                @click="onAdd(item)"
                                >加入</el-button
                            >
                            <el-button
                                v-else
                                class="u-op"
                                size="mini"
                                type="info"
                                icon="el-icon-remove-outline"
                                @click="onRemove(item)"
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
        </el-dialog>
    </div>
</template>

<script>
import { getMyCandidateList, appendItemToPkg, removeItemFromPkg } from "@/service/dbm/pkg";
import { debounce } from "lodash";
export default {
    name: "PkgAppendItem",
    props: {
        itemId: {
            type: [Number, String],
            required: true,
        },
        size: {
            type: String,
            default: "default",
        },
        count: {
            type: Number,
            default: 0,
        },
        btnText: {
            type: String,
            default: "归属包",
        },
    },
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
        params() {
            return {
                _search: this.search,
                per: this.per,
                page: this.page,
                client: this.$store.state.client,
                _item_id: this.itemId,
            };
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
            handler: debounce(function () {
                this.loadPkgList();
            }, 300),
            deep: true,
        },
    },
    methods: {
        onShow() {
            this.visible = true;
        },
        loadPkgList() {
            this.loading = true;
            getMyCandidateList(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onAdd(item) {
            appendItemToPkg(item.id, this.itemId).then((res) => {
                this.$message.success("操作成功");
                this.loadPkgList();
                this.$emit("update");
            });
        },
        onRemove(item) {
            this.$confirm(`确定将该元数据从【${item.name}】数据包移除吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        removeItemFromPkg(item.id, [this.itemId]).then((res) => {
                            this.$message.success("操作成功");
                            this.loadPkgList();
                            done();
                            this.$emit("update");
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        hasAppended(pkg) {
            return pkg.pkg_item.map((item) => item.item_id).includes(~~this.itemId);
        },
    },
};
</script>

<style lang="less">
.m-pkg-append {
    .dbi;
    margin-left: 10px;
    .u-count {
        .ml(5px);
        color: #ffae2a;
    }
}
@import "~@/assets/css/dbm/pkg/append_dialog.less";
</style>
