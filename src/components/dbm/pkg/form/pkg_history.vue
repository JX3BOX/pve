<template>
    <div class="m-pkg-history">
        <el-button class="u-history" icon="el-icon-folder" size="small" type="primary" @click="onHistoryShow">
            历史版本
        </el-button>

        <el-dialog class="m-pkg-history__dialog" append-to-body :visible.sync="show" title="历史版本" width="80%">
            <el-table :data="history" v-loading="loading" size="mini">
                <el-table-column label="版本" prop="version" width="100px"></el-table-column>
                <el-table-column label="发版说明" prop="commit"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="创建时间" prop="created_at">
                    <template #default="{ row }">
                        {{ showTime(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template #default="{ row }">
                        <!-- 备注，移除，回档 -->
                        <el-button size="mini" icon="el-icon-edit" @click="onRemark(row)">备注</el-button>
                        <el-button size="mini" icon="el-icon-remove" type="danger" @click="onDelete(row)"
                            >移除</el-button
                        >
                        <el-button size="mini" icon="el-icon-refresh-left" type="warning" @click="onRollback(row)" :disabled="pkg.head == row.uuid"
                            >回档</el-button
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
        </el-dialog>
    </div>
</template>

<script>
import { getPkgVersion, updatePkgVersion, deletePkgVersion, rollbackPkgVersion, refreshCache } from "@/service/dbm/pkg";
import { showTime } from "@/utils/dbm/dateFormat";
import { ref } from 'vue';
export default {
    name: "PkgHistory",
    props: {
        pkg: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            show: false,

            loading: false,
            per: 10,
            page: 1,
            total: 0,
            history: [],
        };
    },
    computed: {
        id() {
            return ~~this.$route.params.id;
        },
        params() {
            return {
                per: this.per,
                page: this.page,
            };
        },
    },
    watch: {
        params: {
            handler() {
                this.loadHistory();
            },
            deep: true,
        },
        show(val) {
            if (val) {
                if (this.page == 1) {
                    this.loadHistory();
                } else {
                    this.page = 1;
                }
            }
        },
    },
    methods: {
        showTime,
        onHistoryShow() {
            this.show = true;
        },
        loadHistory() {
            this.loading = true;
            getPkgVersion(this.id, this.params)
                .then((res) => {
                    this.history = res.data.data?.list || [];
                    this.total = res.data.data?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 备注
        onRemark(row) {
            this.$prompt("请输入备注", "备注", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: row.remark,
                inputPlaceholder: "请输入备注",
                closeOnClickModal: false,
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        updatePkgVersion(row.pkg_id, row.uuid, { remark: instance.inputValue }).then((res) => {
                            this.$message.success("修改成功");
                            row.remark = instance.inputValue;
                            done();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        // 移除
        onDelete(row) {
            this.$confirm(
                `确定移除该版本吗？<div style="color:red;font-weight:bold;">该删除为永久操作，无法恢复，所有引用此版本的包将受到影响</div>`,
                "移除版本",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    dangerouslyUseHTMLString: true,
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            deletePkgVersion(row.pkg_id, row.uuid).then((res) => {
                                this.$message.success("移除成功");

                                refreshCache(this.pkg.key);

                                if (this.page == 1) {
                                    this.loadHistory();
                                } else {
                                    this.page = 1;
                                }

                                done();
                            });
                        } else {
                            done();
                        }
                    },
                }
            ).catch(() => {});
        },
        // 回档
        onRollback(row) {
            this.$confirm(`是否确认将该数据包回档至此版本？`, "回档版本", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        rollbackPkgVersion(row.pkg_id, row.uuid).then((res) => {
                            this.$message.success("回档成功");
                            refreshCache(this.pkg.key);
                            this.$emit('rollback')
                            done();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
    },
};
</script>

<style lang="less">
.m-pkg-history__dialog {
    .u-pagination {
        .mt(10px);
        .x;
    }
}
</style>
