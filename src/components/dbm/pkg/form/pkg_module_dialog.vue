<template>
    <el-dialog class="m-pkg-module__dialog" :visible="modelValue" @close="onClose" title="添加依赖包" append-to-body>
        <el-radio-group v-model="active" class="m-dialog-header">
            <el-radio-button label="search">
                <i class="el-icon-search"></i>
                <span>查找</span>
            </el-radio-button>
            <el-radio-button label="select">
                <i class="el-icon-folder-opened"></i>
                <span
                    >已选择<b v-if="count" class="u-count--selected">({{ count }})</b></span
                >
            </el-radio-button>
        </el-radio-group>

        <div class="m-dialog-content">
            <div v-show="active === 'search'">
                <div class="m-search">
                    <div class="u-condition u-name-search">
                        <span class="u-prepend el-input-group__prepend">作者</span>
                        <el-select
                            v-model="params.user_id"
                            popper-class="u-author-pop"
                            :remote-method="filterUser"
                            remote
                            filterable
                            placeholder="昵称"
                            size="small"
                            clearable
                            @change="onUserChange"
                        >
                            <el-option v-for="item in users" :key="item.ID" :label="item.display_name" :value="item.ID">
                                <div class="u-author-option">
                                    <img class="u-avatar" :src="showAvatar(item.user_avatar)" alt="" />
                                    <span class="u-value">{{ item.display_name }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="u-condition u-pkg-select">
                        <span class="u-prepend el-input-group__prepend">数据包</span>
                        <el-select
                            class="u-key"
                            ref="pkgSelect"
                            v-model="params.pkg"
                            popper-class="u-author-pop"
                            size="small"
                            filterable
                            :filter-method="filterMethod"
                            @change="onPkgChange"
                        >
                            <el-option v-for="pkg in pkgs" :key="pkg.id" :value="pkg.id" :label="pkg.key">
                                <div class="u-pkg-select__option">
                                    <span class="u-value">{{ pkg.key }}</span>
                                    <time class="u-remark">最后更新时间：{{ showDateTime(pkg.updated_at) }}</time>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="m-search-result">
                    <div class="m-version-list" v-if="versions.length">
                        <el-table :data="versions" size="mini" v-loading="loading" height="242px">
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
                                        @click="onAddPkg(row)"
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
                            :current-page.sync="page"
                            :page-size="per"
                            :total="total"
                            small
                        ></el-pagination>
                    </div>
                    <el-alert v-else type="info" :title="alertTitle" show-icon></el-alert>
                </div>
            </div>
            <div v-show="active === 'select'">
                <el-table :data="selected" class="m-select-table" size="mini" height="242px">
                    <el-table-column prop="remark" label="数据">
                        <template #default="{ row }">
                            <span>{{ pkgName(row) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="version" label="版本"></el-table-column> -->
                    <el-table-column prop="uuid" label="UUID"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button
                                type="danger"
                                size="mini"
                                icon="el-icon-remove-outline"
                                @click="onRemove(scope.$index)"
                                >移除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <template #footer>
            <div class="m-dialog-footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { getUserList } from "@/service/dbm/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getUserPkg, getPkgVersion, appendModuleToPkg, removeModuleFromPkg } from "@/service/dbm/pkg";
import dayjs from "dayjs";
import bus from "@/utils/dbm/mitt";
import {cloneDeep} from "lodash";
export default {
    name: "PkgModuleDialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            active: "search",

            users: [],
            params: {
                user_id: "",
                pkg: "",
            },

            pkgs: [], // 数据包列表
            copyPkgs: [], // 数据包列表副本
            versions: [], // 数据包版本列表

            per: 5,
            page: 1,
            total: 0,
            loading: false,

            selected: [], // 已选择的依赖包
        };
    },
    computed: {
        ...mapState(["pkg"]),
        alertTitle() {
            return this.params.pkg ? (this.versions?.length ? "请选择版本" : "该数据包暂无版本") : "请先选择数据包";
        },
        count() {
            return this.selected.length;
        },
        query() {
            return {
                per: this.per,
                page: this.page,
            };
        },
        id() {
            return this.$route.params.id;
        },
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        query: {
            deep: true,
            handler() {
                this.loadPkgVersion();
            },
        },
    },
    methods: {
        showDateTime(val) {
            return dayjs(val).format("YYYY-MM-DD HH:mm");
        },
        onClose() {
            this.$emit("update:modelValue", false);
            this.selected = [];
        },
        onConfirm() {
            const data = this.selected.map((item) => ({ id: item.pkg_id, uuid: item.uuid }));
            appendModuleToPkg(this.pkg?.id, data).then((res) => {
                const length = res.data.data?.length || 0;
                this.$notify({
                    type: "success",
                    title: "添加成功",
                    message: `成功添加${length}个依赖包`,
                });

                this.$emit("update:modelValue", false);
                bus.emit("module-update");
                this.selected = [];
            });
        },
        filterUser: function (query) {
            if (query !== "") {
                getUserList({ name: query }).then((res) => {
                    this.users = res.data.data?.list || [];
                });
            } else {
                this.users = [];
            }
        },
        showAvatar,
        onUserChange() {
            if (!this.params.user_id) {
                this.pkgs = [];
                this.versions = [];
                this.users = [];
                this.params.pkg = "";
                return;
            }
            // 用户改变则去加载对应用户的数据包
            getUserPkg({ user_id: this.params.user_id, client: this.client }).then((res) => {
                this.pkgs = res.data.data?.filter((pkg) => pkg.id != this.id) || [];
                this.copyPkgs = cloneDeep(this.pkgs);

                if (this.pkgs.length > 0) {
                    this.$refs.pkgSelect.$el.querySelector(".el-input__inner").click();
                }
            });
        },
        onPkgChange() {
            if (this.page === 1) {
                this.loadPkgVersion();
            } else {
                this.page = 1;
            }
        },
        loadPkgVersion() {
            // 数据包改变则去加载对应数据包的版本
            this.loading = true;
            getPkgVersion(this.params.pkg, this.query)
                .then((res) => {
                    this.versions = res.data.data?.list || [];
                    this.total = res.data.data?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pkgName({ key, version }) {
            return `${key}@${version}`;
        },
        // 添加依赖包
        onAddPkg(row) {
            // 如果有相同pkg_id的依赖包，则移除旧的
            if (this.selected.some((item) => item.pkg_id == row.pkg_id)) {
                this.selected = this.selected.filter((item) => item.pkg_id != row.pkg_id);
            }

            const pkg = this.pkgs.find((item) => item.id == row.pkg_id);

            this.selected.push({
                key: pkg.key,
                version: row.version,
                uuid: row.uuid,
                id: row.id,
                pkg_id: row.pkg_id,
            });
        },
        // 移除依赖包
        onRemove(index) {
            this.selected.splice(index, 1);
        },
        pkgDisabled(row) {
            return this.selected.some((item) => item.id == row.id);
        },
        filterMethod(query) {
            if (query !== "") {
                this.pkgs = this.copyPkgs.filter((item) => item?.key?.includes(query) || item?.remark?.includes(query));
            } else {
                this.pkgs = cloneDeep(this.copyPkgs);
            }
        },
    },
};
</script>

<style lang="less">
.m-pkg-module__dialog {
    .el-dialog__body {
        padding-top: 0;
    }
    .m-search {
        .flex;
        align-items: center;
        margin-top: 10px;
        gap: 10px;
    }
    .m-dialog-header {
        .x;
        .db;
    }
    .u-count--selected {
        color: orange;
        .bold;
        .ml(3px);
        // .fz(12px);
    }
    .u-condition {
        .el-input-group__prepend {
            padding-left: 10px;
            padding-right: 10px;
        }
        .u-prepend {
            .fl;
            .w(50px);
            box-sizing: border-box;
            .fz(12px,30px);
        }
        .el-select {
            .db;
            .ml(50px);
        }
        .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    .u-name-search {
        width: 200px;
    }
    .u-pkg-select {
        flex: 1;
        .flex;
        .u-prepend {
            .w(60px);
            padding: 0 10px;
        }
        .u-key {
            margin-left: 0;
            flex: 1;
        }
    }

    .u-pagination {
        .x;
        margin-top: 10px;
    }

    .m-search-result {
        .mt(10px);
        min-height: 200px;
    }
    .m-select-table {
        margin-top: 10px;
    }
}
.u-author-pop {
    .u-author-option {
        .flex;
        align-items: center;
        gap: 10px;
        img {
            .size(24px);
            border-radius: 50%;
        }
    }
    .u-pkg-select__option {
        .flex;
        justify-content: space-between;
        align-items: center;

        time {
            .fz(12px);
            color: #888;
        }
    }
}
</style>
