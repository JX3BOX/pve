<template>
    <el-dialog
        title="保存至我的元数据库"
        :visible.sync="visible"
        :append-to-body="true"
        custom-class="m-save-dialog"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="!loading"
    >
        <div class="u-save-confirm" v-if="status == 'confirm'">
            <div class="u-save-desc">
                <div>
                    <span>确定要存入我的元数据库吗？已选中 </span>
                    <span class="u-save-count"> {{ checked_count }} </span>
                    <span>条数据。</span>
                </div>

                <div v-for="(check, type) in parse_checked" :key="type" v-show="check.length">
                    <span>{{ types[type] }} 数据条目数量：</span>
                    <span class="u-save-count">{{ check.length }}</span>
                </div>
                <div>解析器中导入的数据默认为 <span class="u-tip" style="">私有数据</span>。</div>
            </div>
            <div class="u-save-options">
                <div class="u-checkbox-container">
                    <el-checkbox v-model="save_publish"> 保存为公开数据</el-checkbox>
                    <el-checkbox v-model="append_to_pkg"> 同时加入到数据包</el-checkbox>
                </div>
                <pkg-select v-if="append_to_pkg" :selected.sync="pkgs"></pkg-select>
            </div>
            <div class="u-save-btn">
                <el-button plain size="small" @click="visible = false">再瞅瞅</el-button>
                <el-button type="primary" size="small" @click="saveChecked">就这些！</el-button>
            </div>
        </div>
        <div class="u-save-progress" v-else-if="status == 'saving'">
            <el-progress :percentage="saved_percent"></el-progress>
            <div class="u-save-count">{{ saved_count }} / {{ checked_count }}</div>
            <div>正在保存</div>
            <div>{{ save_log }}</div>
        </div>
        <div class="u-save-success" v-else-if="status == 'success'">
            <i class="el-icon-success"></i>
            <div class="u-success-tip">保存成功</div>
            <el-button type="primary" size="small" @click="confirmSuccess">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { types } from "@/assets/data/dbm/types.json";
import { mapState } from "vuex";
import lodash from "lodash";
import { bulkCreateItem } from "@/service/dbm/item.js";
import { appendItemsToPkg } from "@/service/dbm/pkg.js";
import { toPostItem } from "@/utils/dbm/item.js";
import { sleep } from "@/utils/dbm/common";
import PkgSelect from "@/components/dbm/pkg/pkg_select.vue";
const BATCH_SIZE = 436;

export default {
    name: "ParseSave",
    props: [],
    components: {
        PkgSelect,
    },
    data: () => ({
        types,
        current: "BUFF",

        save_publish: false,
        append_to_pkg: false,
        pkgs: [],

        visible: false,
        loading: false,
        status: "confirm",
        saved_count: 0,
        save_log: "保存元数据...",
    }),
    computed: {
        ...mapState({
            parse_checked: (state) => state.parse_checked,
            parse_result: (state) => state.parse_result,
            client: (state) => state.client,
        }),
        checked_count() {
            return Object.values(this.parse_checked).reduce((a, b) => a + b.length, 0);
        },
        saved_percent() {
            return Math.round((this.saved_count / this.checked_count) * 100);
        },
    },
    methods: {
        async saveChecked() {
            const items = Object.keys(this.parse_checked)
                .reduce((items, type) => {
                    const ids = this.parse_checked[type];
                    const type_items = (this.parse_result[type] ?? []).filter((item) => ids.includes(item.id));
                    return [...items, ...type_items];
                }, [])
                .map((item) => {
                    const post_item = toPostItem(item, item.resource, this.client);
                    post_item.status = this.save_publish ? 0 : 1;
                    return post_item;
                });
            this.loading = true;
            this.status = "saving";
            const chunks = lodash.chunk(items, BATCH_SIZE);
            for (let chunk of chunks) {
                this.save_log = `保存元数据...`;
                const create_res = await bulkCreateItem(chunk);
                const item_ids = create_res.data.data?.map((item) => item.id);
                this.saved_count += chunk.length;
                if (this.append_to_pkg && this.pkgs.length && item_ids && item_ids.length) {
                    this.save_log = `将元数据加入到包...`;
                    for (let pkg of this.pkgs) {
                        await sleep(128);
                        await appendItemsToPkg(pkg, item_ids);
                    }
                }
                await sleep(256);
            }
            this.loading = false;
            this.append_to_pkg = false;
            this.pkgs = [];
            this.saved_count = 0;

            this.$message({
                message: "保存成功！",
                type: "success",
            });
            this.$store.commit("RESET_PARSE_SELECT");
            this.status = "success";
        },
        confirmSuccess() {
            this.visible = false;
            this.status = "confirm";
        },
        open() {
            this.visible = true;
        },
    },
};
</script>

<style lang="less">
.m-save-dialog {
    min-width: 800px;
    .el-progress {
        width: 100%;
    }

    .u-save-progress,
    .u-save-confirm {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .u-save-progress {
        gap: 16px;
    }
    .u-save-desc {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: fit-content;
        .u-save-count {
            .bold;
        }
    }
    .u-save-options {
        .mt(20px);
        .m-pkg-select {
            width: 600px;
            .mt(20px);
        }
    }
    .u-checkbox-container {
        display: flex;
        justify-content: center;
    }
    .u-save-btn {
        .mt(40px);
    }

    .u-tip {
        color: #fca11a;
        .bold;
    }
    .u-save-progress {
        .u-save-count {
            .bold;
            .fz(24px);
        }
    }
    .u-save-success {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        .el-icon-success {
            color: green;
            .fz(100px);
        }
        .u-success-tip {
            .fz(24px);
            .bold;
        }
    }
}
</style>
