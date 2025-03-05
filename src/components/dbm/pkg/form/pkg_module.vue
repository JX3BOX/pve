<template>
    <fold-block
        class="m-pkg-module"
        name="module"
        desc="依赖包"
        icon="el-icon-box"
        :fold="false"
        :fixed="false"
        v-loading="loading"
    >
        <div slot="title-toolbar">
            <el-button class="m-dependency-sync" type="primary" icon="el-icon-refresh" size="mini" @click="onSyncAll">
                同步依赖包至最新
            </el-button>
        </div>
        <el-button class="m-dependency-add" type="primary" icon="el-icon-circle-plus-outline" @click="onAdd">
            添加依赖包
        </el-button>
        <div class="m-dependency-table" v-if="pkg.modules && pkg.modules.length">
            <el-table :data="pkg.modules" size="small" row-key="module_id" max-height="500px">
                <el-table-column prop="key" label="数据">
                    <template #default="scope">
                        <a :href="`/dbm/pkg/${scope.row.module_id}`" target="_blank">{{ showDependency(scope.row) }}</a>
                        <el-tooltip v-if="!scope.row.record || !scope.row.module" content="作者已移除该版本">
                            <span class="u-error">（已失效）</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="版本选择">
                    <template #default="scope">
                        <pkg-version-select
                            size="mini"
                            :default-name="scope.row.record?.version"
                            :value="scope.row.uuid"
                            :pkg_id="scope.row.module_id"
                            @change="onVersionSelect"
                        ></pkg-version-select>
                        <el-tooltip
                            class="u-version-lock"
                            effect="dark"
                            content="锁定版本后一键更新版本时不会被修改"
                            placement="top"
                        >
                            <el-button type="text" :class="{ 'is-lock': scope.row.is_lock }">
                                <i class="el-icon-lock" v-if="scope.row.is_lock" @click.stop="onLock(scope.row, false)"></i>
                                <i class="el-icon-unlock" v-else @click.stop="onLock(scope.row, true)"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="priority" label="优先级">
                    <template #default="scope">
                        {{ scope.row.priority || 0 }}
                        <i class="el-icon-edit u-priority" @click="onEditRow(scope.row)"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="uuid" label="UUID">
                    <template #default="scope">
                        <div @click="onCopy(scope.row)" class="u-uuid">
                            {{ scope.row.uuid }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template #default="scope">
                        <el-button type="danger" size="mini" icon="el-icon-remove-outline" @click="onRemove(scope.row)"
                            >移除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else title="暂未添加依赖包" type="info" class="m-dependency-null">
            <i class="el-icon-warning-outline"></i>
            暂未添加依赖包
        </div>
        <pkg-module-dialog v-model="show" @confirm="onConfirm"></pkg-module-dialog>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import PkgVersionSelect from "@/components/dbm/pkg/pkg_version_select.vue";
import pkg_module_dialog from "./pkg_module_dialog.vue";
import { mapState } from "vuex";
import { appendModuleToPkg, removeModuleFromPkg, setModule } from "@/service/dbm/pkg.js";
import bus from "@/utils/dbm/mitt.js";
export default {
    name: "PkgModule",
    components: {
        PkgVersionSelect,
        FoldBlock,
        "pkg-module-dialog": pkg_module_dialog,
    },
    data() {
        return {
            show: false,

            data: [],
            loading: false,
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
        }),
    },
    methods: {
        onRemove(row) {
            this.$confirm("确定移除该依赖包吗？", "移除依赖包", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        removeModuleFromPkg(this.pkg.id, row?.module_id).then(() => {
                            this.$message.success("移除成功");

                            bus.emit("module-update");
                            instance.confirmButtonLoading = false;
                            done();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        onLock(row, is_lock) {
            setModule(this.pkg.id, row?.module_id, {
                is_lock,
            }).then(() => {
                this.$message.success("修改成功");
                row.is_lock = is_lock;
            });
        },
        onEditRow(row) {
            this.$prompt("请输入优先级", "优先级", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: row.priority,
                inputPlaceholder: "请输入优先级",
                // 输入0-10000的整数
                inputPattern: /^(0|[1-9][0-9]{0,3}|10000)$/,
                inputErrorMessage: "请输入0-10000的整数",
                closeOnClickModal: false,
            })
                .then(({ value }) => {
                    setModule(this.pkg.id, row?.module_id, {
                        priority: value,
                    }).then(() => {
                        this.$message.success("修改成功");

                        bus.emit("module-update");
                    });
                })
                .catch(() => {});
        },
        onAdd() {
            this.show = true;
        },
        // 修改某个依赖包版本
        onVersionSelect({ pkg, uuid }) {
            this.loading = true;
            appendModuleToPkg(this.pkg.id, [
                {
                    id: pkg,
                    uuid,
                },
            ])
                .then(() => {
                    this.$notify({
                        title: "更新成功",
                        type: "success",
                    });
                    bus.emit("module-update");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 同步所有依赖包至最新
        onSyncAll() {
            const modules = this.pkg?.modules;
            if (!modules || !modules.length) this.$alert("没有可以更新的依赖包");
            this.loading = true;
            appendModuleToPkg(
                this.pkg?.id,
                modules.map((m) => ({
                    id: m.module_id,
                }))
            )
                .then(() => {
                    this.$notify({
                        title: "更新成功",
                        message: "已更新所有依赖包至最新版本",
                        type: "success",
                    });
                    bus.emit("module-update");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 复制uuid
        onCopy({ uuid }) {
            navigator.clipboard.writeText(uuid);
            this.$notify.success({
                title: "复制成功",
                message: uuid,
            });
        },
        onConfirm(array) {},
        showDependency(mod) {
            let key = mod.module?.key;
            let version = mod.record?.version;
            // 如果依赖包或版本被删除
            if (!key || !version) {
                let mod_snapshot = this.pkg?.pkg_record?.modules.find((m) => m.uuid === mod.uuid);
                key = mod_snapshot?.module?.key;
                version = mod_snapshot?.record?.version;
            }
            return `${key}@${version}`;
        },
    },
};
</script>
