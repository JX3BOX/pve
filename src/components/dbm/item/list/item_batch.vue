<template>
    <div class="m-item-batch">
        <el-switch v-model="selectingModel" active-color="#13ce66" active-text="选择模式"></el-switch>
        <span class="u-count" v-if="selectingModel">({{ dataSelectCount }}/{{ data.length }})</span>
        <el-checkbox
            v-if="selectingModel"
            class="u-check-all"
            v-model="checkAll"
            label="全选"
            border
            size="mini"
            @change="checkSwitch"
        ></el-checkbox>
        <el-button type="primary" icon="el-icon-setting" size="mini" @click="open" :disabled="!selectingModel"
            >操作</el-button
        >
        <el-dropdown trigger="click">
            <el-button plain size="mini"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="clearItem"><i class="el-icon-circle-close"></i>清空</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-drawer
            title="批量管理"
            :visible.sync="visible"
            append-to-body
            show-close
            size="40%"
            custom-class="m-item-batch__drawer"
            :before-close="onClose"
        >
            <div class="m-item-batch-manage">
                <div class="m-batch-toolbar">
                    <div class="m-batch-filter m-batch-count">
                        <span class="u-label">已选择</span>
                        <div class="u-count"
                            >{{ showItems.length }}
                            <div class="u-reset"
                                ><el-button
                                    type="info"
                                    plain
                                    icon="el-icon-close"
                                    size="mini"
                                    @click="clearSelected"
                                    v-if="showItems.length"
                                    >清空
                                </el-button></div
                            >
                        </div>
                    </div>
                    <div class="m-batch-filter">
                        <span class="u-label">类型</span>
                        <item-types
                            class="u-type-batch"
                            :type.sync="type"
                            :types="types"
                            mode="select"
                            :counts="counts"
                        ></item-types>
                    </div>
                </div>

                <div class="m-batch-status">
                    <div class="u-tips" v-if="loading">
                        <el-progress class="u-progress" :percentage="progress" status="success"></el-progress>
                    </div>
                </div>
                <div class="m-batch-list">
                    <div class="m-batch-list-wrapper" v-if="showItems.length">
                        <item-list-item
                            v-for="(item, index) in showItems"
                            :key="index"
                            :item="item"
                            :click-to-detail="false"
                            :read-only="true"
                            :show-remove="true"
                            @onRemove="cancelSelect(item)"
                        ></item-list-item>
                    </div>
                    <el-empty v-else description="还没有选择的条目哦"></el-empty>
                </div>

                <div class="m-batch-footer">
                    <div>
                        <el-dropdown placement="top" @command="handleCommand">
                            <el-button type="primary"> 移动数据 <i class="el-icon-arrow-up"></i> </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="batchAppendItemsToPkg" :loading="loading">
                                    <i class="el-icon-folder-add"></i>加入到包
                                </el-dropdown-item>
                                <el-dropdown-item command="batchRemoveItemsFromPkg" :loading="loading">
                                    <i class="el-icon-folder-remove"></i>从包移除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div>
                        <el-button type="primary" icon="el-icon-receiving" @click="exportPkg">导出到本地</el-button>
                        <el-dropdown placement="top" @command="handleCommand">
                            <el-button type="warning"> 更多操作 <i class="el-icon-arrow-up"></i> </el-button>

                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="batchSetStatusLock" :loading="loading">
                                    <i class="el-icon-lock"></i>锁定数据
                                </el-dropdown-item>
                                <el-dropdown-item command="batchSetStatusUnlock" :loading="loading">
                                    <i class="el-icon-unlock"></i>取消锁定
                                </el-dropdown-item>
                                <el-dropdown-item command="batchSetStatusPublic" :loading="loading">
                                    <i class="el-icon-view"></i>设为公开
                                </el-dropdown-item>
                                <el-dropdown-item command="batchSetStatusPrivate" :loading="loading">
                                    <i class="el-icon-lock"></i>设为私有
                                </el-dropdown-item>
                                <el-dropdown-item command="batchDelete" :loading="loading">
                                    <i class="el-icon-circle-close"></i>彻底删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </el-drawer>

        <pkg-select-dialog ref="pkgSelect" :public="false"></pkg-select-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import ItemListItem from "@/components/dbm/item/list/item.vue";
import ItemTypes from "@/components/dbm/item/item_types.vue";
import PkgSelectDialog from "@/components/dbm/pkg/pkg_select_dialog.vue";
import User from "@jx3box/jx3box-common/js/user";
import DBMWorker from "@/utils/dbm/dbm.worker.js";
import { saveAs } from "file-saver";
import { bulkUpdateItem, bulkDeleteItem, clearItem } from "@/service/dbm/item";
import { appendItemsToPkg, removeItemFromPkg } from "@/service/dbm/pkg";
import { sleep } from "@/utils/dbm/common";
import { types } from "@/assets/data/dbm/types.json";

export default {
    name: "ItemBatch",
    props: ["selecting", "data"],
    components: {
        ItemListItem,
        ItemTypes,
        PkgSelectDialog,
    },
    data: () => ({
        visible: false,
        loading: false,
        checkAll: false,
        type: "ALL",
        types,
        doSomething: false,

        progress: 0,
    }),
    computed: {
        ...mapState({
            selected: (state) => state.item_list_selected,
        }),
        user_name() {
            return User.getInfo().name;
        },
        user_id() {
            return User.isLogin() ? Number(User.getInfo().uid) : 0;
        },
        selectingModel: {
            get() {
                return this.selecting;
            },
            set(val) {
                this.$emit("update:selecting", val);
            },
        },
        showItems() {
            return this.selected.filter((item) => this.type === "ALL" || item.type === this.type);
        },
        counts() {
            const result = this.selected.reduce((acc, item) => {
                if (acc[item.type]) {
                    acc[item.type] += 1;
                } else {
                    acc[item.type] = 1;
                }
                return acc;
            }, {});
            result["ALL"] = this.selected.length;
            return result;
        },
        dataSelectCount() {
            return this.data.filter((item) => this.selected.find((i) => i.id === item.id)).length;
        },
    },
    methods: {
        open() {
            this.visible = true;
            this.doSomething = false;
        },
        onClose(done) {
            if (!this.doSomething || !this.selected.length) {
                done();
                return;
            }
            this.$confirm("需要为您清空选择的项目吗？", "提示")
                .then(() => {
                    this.$store.commit("RESET_ITEM_SELECTED");
                })
                .catch(() => {})
                .finally(() => {
                    done();
                });
        },
        cancelSelect(item) {
            this.$store.commit("TOGGLE_ITEM_SELECT", item);
        },
        clearSelected() {
            this.$store.commit("RESET_ITEM_SELECTED");
        },
        checkSwitch() {
            const isCheckAll = this.data.every((item) => this.selected.find((i) => i.id === item.id));
            if (isCheckAll) {
                const ids = this.data.map((item) => item.id);
                this.$store.commit("REMOVE_ITEM_SELECT", ids);
            } else {
                const notSelected = this.data.filter((item) => !this.selected.find((i) => i.id === item.id));
                this.selected.push(...notSelected);
            }
            this.checkAll = !isCheckAll;
        },
        batchSetStatus(status) {
            const items = this.selected.filter((item) => item.user_id === this.user_id);
            const ids = items.map((item) => item.id);
            if (!ids.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            this.loading = true;
            bulkUpdateItem(ids, { status })
                .then(() => {
                    this.$message.success("操作成功");
                    items.forEach((item) => {
                        item.status = status;
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        batchSetLock(is_lock) {
            const items = this.selected.filter((item) => item.user_id === this.user_id);
            const ids = items.map((item) => item.id);
            if (!ids.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            this.loading = true;
            bulkUpdateItem(ids, { is_lock })
                .then(() => {
                    this.$message.success("操作成功");
                    items.forEach((item) => {
                        item.is_lock = is_lock;
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        batchDelete() {
            const items = this.selected.filter((item) => item.user_id === this.user_id);
            const ids = items.map((item) => item.id);
            if (!ids.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            this.$confirm(`此操作将永久删除选中的${ids.length}条元数据, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    bulkDeleteItem(ids).then(() => {
                        this.$message.success("操作成功");
                        this.$store.commit("RESET_ITEM_SELECTED");
                        this.$emit("onDelete", ids);
                    });
                })
                .catch(() => {});
        },
        async selectPkg() {
            try {
                return await this.$refs.pkgSelect.open();
            } catch (e) {
                return null;
            }
        },
        batchSetStatusLock() {
            this.batchSetLock(true);
        },
        batchSetStatusUnlock() {
            this.batchSetLock(false);
        },
        batchSetStatusPrivate() {
            this.batchSetStatus(1);
        },
        batchSetStatusPublic() {
            this.batchSetStatus(0);
        },
        async batchAppendItemsToPkg() {
            const item_ids = this.selected.map((item) => item.id);
            if (!item_ids.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            const select_pkgs = await this.selectPkg();
            if (!select_pkgs) {
                return;
            }
            this.$confirm(`确定要把选中的 ${item_ids.length} 条元数据加入到选中的 ${select_pkgs.length} 个包里面吗？`)
                .then(async () => {
                    this.loading = true;
                    try {
                        for (let pkg of select_pkgs) {
                            await appendItemsToPkg(pkg, item_ids).then((res) => {
                                const ids = res.data.data;
                                if (!ids) return;
                                for (let item of this.selected) {
                                    const pkg_item_related = ids.find((i) => i.item_id === item.id);
                                    if (pkg_item_related) {
                                        item.dependents.push(pkg_item_related);
                                    }
                                }
                            });
                            this.progress += 100 / select_pkgs.length;
                            await sleep(600);
                        }
                        this.progress = 0;
                    } catch (e) {
                        console.log(e);
                    }
                    this.$message.success("操作成功");
                    this.loading = false;
                })
                .catch(() => {});
        },
        async batchRemoveItemsFromPkg() {
            const item_ids = this.selected.map((item) => item.id);
            if (!item_ids.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            const select_pkgs = await this.selectPkg();
            if (!select_pkgs) {
                return;
            }
            this.$confirm(`确定要把选中的 ${item_ids.length} 条元数据从选中的 ${select_pkgs.length} 个包里移除吗？`)
                .then(async () => {
                    this.loading = true;
                    try {
                        for (let pkg of select_pkgs) {
                            await removeItemFromPkg(pkg, item_ids).then(() => {
                                for (let item of this.selected) {
                                    if (item_ids.includes(item.id)) {
                                        item.dependents = item.dependents.filter((i) => i.pkg_id !== pkg);
                                    }
                                }
                            });
                            this.progress += 100 / select_pkgs.length;
                            await sleep(600);
                        }
                        this.progress = 0;
                    } catch (e) {
                        console.log(e);
                    }
                    this.$message.success("操作成功");
                    this.loading = false;
                })
                .catch(() => {});
        },
        async exportPkg() {
            if (!this.selected.length) {
                this.$message.warning("没有可操作的元数据");
                return;
            }
            this.$confirm("确定要将选择的元数据导出为本地数据包吗？", "礼貌的询问")
                .then(async () => {
                    this.loading = true;
                    const items = this.selected;
                    const buildWorker = new DBMWorker();
                    const { buffer } = await new Promise((resolve) => {
                        buildWorker.onmessage = (e) => {
                            const { type, data } = e.data;
                            if (type === "progress") {
                                const { message, progress } = data;
                                this.progress = ((progress - 40) / 40) * 100;
                            } else if (type === "result") {
                                buildWorker.terminate();
                                resolve(data);
                            }
                        };
                        buildWorker.postMessage({
                            cmd: "build",
                            data: {
                                pkg: {
                                    pkg_meta: {
                                        szAuthor: `${this.user_name} - JX3BOX批量导出`,
                                    },
                                },
                                items: items.map((item) => ({
                                    item_id: null,
                                    item: item,
                                    type: item.type,
                                })),
                            },
                        });
                    }).catch((e) => {
                        console.log(e);
                    });
                    saveAs(new Blob([buffer]), `${this.user_name} - JX3BOX元数据导出.jx3dat`);
                    this.progress = 0;
                    this.loading = false;
                })
                .catch(() => {});
        },
        handleCommand(command) {
            this[command]();
            this.doSomething = true;
        },
        clearItem() {
            this.$confirm("确定要清空所有元数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    clearItem().then(() => {
                        this.$message.success("操作成功");
                        this.$emit("onClear");
                    });
                })
                .catch(() => {});
        },
    },
    watch: {
        selected() {
            this.checkAll = this.data.every((item) => this.selected.find((i) => i.id === item.id));
        },
        data() {
            this.checkAll = this.data.every((item) => this.selected.find((i) => i.id === item.id));
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_batch.less";
</style>
