<template>
    <div class="m-pkg-extend">
        <div class="m-pkg-version">
            <div class="u-version">
                <span class="u-version__prepend">当前版本</span>
                <span class="u-version__value" @click="showDialog">
                    {{ version || "v0.0.0" }}
                </span>
            </div>
            <div class="u-uuid">{{ fullKey }}</div>
            <el-button class="u-download" type="primary" icon="el-icon-download" @click="onDownload">下载</el-button>
        </div>

        <pkgHeatmap :pkg-id="pkg.id" :version="version"></pkgHeatmap>

        <div class="m-pkg-info" v-if="pkg.pkg_record">
            <div class="u-title">数据包信息</div>
            <div class="u-info">
                <div class="u-count">
                    <i class="el-icon-files"></i>
                    <span class="u-count__value"
                        ><b>{{ pkg.pkg_record.total_items || 0 }}</b> 数据项</span
                    >
                </div>
                <div class="u-count">
                    <i class="el-icon-folder"></i>
                    <span class="u-count__value"
                        ><b>{{ pkg.pkg_record.total_modules || 0 }}</b> 依赖包</span
                    >
                </div>
            </div>
            <div class="u-info">
                <div class="u-count u-tags">
                    <i class="el-icon-collection-tag"></i>
                    <router-link
                        class="u-tag"
                        v-for="tag in uniq(pkg.pkg_tag)"
                        :key="tag"
                        :to="{ name: 'pkg_list', query: { tag: tag } }"
                        target="_blank"
                    >
                        <span v-if="pkg.type != 3">{{ tag }}</span>
                        <span v-else>{{ mapIndex[tag] }}</span>
                    </router-link>
                </div>
            </div>
            <div class="u-misc">
                <el-button
                    :disabled="!!~~pkg.pkg_record.is_raw"
                    v-if="isLogin"
                    type="primary"
                    size="small"
                    icon="el-icon-circle-plus-outline"
                    @click="onPkgDialogShow"
                    >添加为依赖包</el-button
                >
            </div>
        </div>

        <el-dialog
            title="选择版本"
            :visible.sync="showVersionDialog"
            @close="onClose('showVersionDialog')"
            custom-class="m-pkg-dialog"
            width="40%"
        >
            <el-table :data="versions" row-key="id" v-loading="loading" size="mini">
                <el-table-column label="备注" prop="remark"> </el-table-column>
                <el-table-column label="版本" prop="version">
                    <template #default="{ row }">
                        <span>{{ row.version }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template #default="{ row }">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-check"
                            :disabled="pkgDisabled(row)"
                            @click="onSelectVersion(row)"
                            >选择</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="u-pagination"
                hide-on-single-page
                layout="prev,pager,next"
                background
                :current-page.sync="versionPagination.page"
                :page-size="versionPagination.per"
                :total="versionPagination.total"
                small
            ></el-pagination>
        </el-dialog>

        <el-dialog class="m-pkg-append__dialog" :visible.sync="showPkgDialog" title="加入包" append-to-body width="40%">
            <div class="m-append-header">
                <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索包..">
                    <template #suffix>
                        <i class="el-input__icon el-icon-refresh u-refresh" @click="loadPkgList" title="刷新列表"></i>
                    </template>
                </el-input>
            </div>
            <div class="m-append-content" v-loading="loading">
                <template v-if="pkgs && pkgs.length">
                    <div
                        class="m-pkg-item"
                        v-for="item in pkgs"
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
                                :disabled="item.id == pkg.id"
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
                        :page-size.sync="pkgPagination.per"
                        :total="pkgPagination.total"
                        :current-page.sync="pkgPagination.page"
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
import User from "@jx3box/jx3box-common/js/user";
import { getPkgVersion, appendModuleToPkg, getMyModuleCandidateList, removeModuleFromPkg } from "@/service/dbm/pkg";
import pkgHeatmap from "../detail/pkg_heatmap.vue";
import { debounce, uniq } from "lodash";
import { saveAs } from "file-saver";
import { mapState } from "vuex";

export default {
    name: "PkgDetailExtend",
    components: {
        pkgHeatmap,
    },
    props: {
        pkg: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            versions: [],
            version: "",

            showVersionDialog: false,
            versionPagination: {
                page: 1,
                per: 5,
                total: 0,
            },
            loading: false,

            pkgs: [],
            showPkgDialog: false,
            pkgPagination: {
                page: 1,
                per: 5,
                total: 0,
            },
            search: "",
        };
    },
    computed: {
        ...mapState({
            mapIndex: (state) => state.mapIndex,
        }),
        params() {
            return {
                page: this.versionPagination.page,
                per: this.versionPagination.per,
            };
        },
        pkgParams() {
            return {
                client: this.$store.state.client,
                page: this.pkgPagination.page,
                per: this.pkgPagination.per,
                _search: this.search,
                _module_id: this.pkg.id,
            };
        },
        searchOptions() {
            return [this.pkgPagination.page, this.pkgPagination.search];
        },
        fullKey() {
            return this.pkg.key + "@" + (this.version || "v0.0.0");
        },
        isLogin() {
            return User.isLogin();
        },
    },
    watch: {
        pkg: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val?.pkg_record?.version) this.version = val.pkg_record.version;
            },
        },
        params: {
            deep: true,
            handler() {
                this.loadVersions();
            },
        },
        search() {
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
        loadVersions() {
            if (!this.pkg.id) return;
            this.loading = true;
            getPkgVersion(this.pkg.id, this.params)
                .then((res) => {
                    this.versions = res.data.data?.list || [];
                    this.versionPagination.total = res.data.data?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showDialog() {
            this.versionPagination.page = 1;
            this.showVersionDialog = true;
            this.loadVersions();
        },
        onPkgDialogShow() {
            this.pkgPagination.page = 1;
            this.showPkgDialog = true;
            this.loadPkgList();
        },
        onClose(key) {
            this[key] = false;
        },
        onSelectVersion(row) {
            this.version = row.version;
            this.showVersionDialog = false;

            this.$router.push({
                name: "pkg_detail",
                params: {
                    id: this.pkg.id,
                },
                query: {
                    version: row.version,
                },
            });
        },
        pkgDisabled(row) {
            return row.version == this.version;
        },
        onDownload() {
            saveAs(this.pkg.pkg_record?.file, `${this.fullKey}.jx3dat`);
        },
        onAdd(row) {
            this.$confirm(
                `确定将该数据包加入【${this.pkg.title}】吗？<div style="color: #ffa500;font-weight:bold;">需要构建发版才会生效，现有数据版本不会变化</div>`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    dangerouslyUseHTMLString: true,
                    beforeClose: async (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            const data = [
                                {
                                    id: this.pkg.id,
                                    uuid: this.pkg.pkg_record?.uuid,
                                },
                            ];
                            await appendModuleToPkg(row.id, data)
                                .then((res) => {
                                    this.$message.success("添加成功");
                                    this.loadPkgList();
                                    done();
                                })
                                .finally(() => {
                                    instance.confirmButtonLoading = false;
                                    done();
                                });
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    },
                }
            ).catch(() => {});
        },
        loadPkgList() {
            this.loading = true;
            getMyModuleCandidateList(this.pkgParams)
                .then((res) => {
                    this.pkgs = res.data.data.list;
                    this.pkgPagination.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        hasAppended(pkg) {
            return pkg.pkg_module.map((item) => item.module_id).includes(~~this.pkg.id);
        },
        onRemove(item) {
            this.$confirm(`确定将该数据包从【${item.key}】数据包移除吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        removeModuleFromPkg(item.id, this.pkg.id).then((res) => {
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
        uniq,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/pkg/append_dialog.less";
</style>
