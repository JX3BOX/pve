<template>
    <div class="m-parse-update-push">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" status="success"></el-progress>
        <!-- <div class="u-push-options">
            <el-checkbox v-model="delete_item">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除的元数据默认不会实际删除元数据而只是解除包对元数据的依赖关系"
                    placement="top"
                >
                    <span>彻底删除元数据</span>
                </el-tooltip>
            </el-checkbox>
        </div> -->
        <div class="u-loading" v-if="loading">
            <i class="el-icon-loading"></i>
            <span class="u-count">{{ current_total }} / {{ total }}</span>
        </div>
        <div class="m-parse-update-opr">
            <el-button @click="cancel" :loading="loading" v-if="status === 'waiting'">上一步</el-button>
            <el-button type="primary" @click="submit" :loading="loading" v-if="status === 'waiting'">确定</el-button>
            <el-button type="primary" @click="success" :loading="loading" v-if="status === 'success'">完成</el-button>
        </div>
    </div>
</template>

<script>
import { toPostItem } from "@/utils/dbm/item";
import { bulkCreateItem, bulkDeleteItemByUUID, bulkUpdateItemByUUID } from "@/service/dbm/item";
import { appendItemsToPkg } from "@/service/dbm/pkg";
import { mapState } from "vuex";
import lodash from "lodash";

const BATCH_SIZE = 128;

export default {
    name: "ParseUpdatePush",
    props: {
        diffs: {
            type: Array,
            default: () => [],
        },
        pkg_id: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        delete_item: false,

        status: "waiting",
        loading: false,

        total: 0,
        current_total: 0,
    }),
    computed: {
        ...mapState({
            client: (state) => state.client,
        }),
        toPost() {
            const toCreate = this.diffs
                .filter((diff) => diff.type === "ADD")
                .map((diff) => toPostItem(diff.cur, diff?.cur?.resource, this.client));
            const toDelete = this.diffs.filter((diff) => diff.type === "DELETE").map((diff) => diff.uuid);
            const toUpdate = this.diffs
                .filter((diff) => diff.type === "MODIFY")
                .reduce((update, diff) => {
                    update[diff.uuid] = toPostItem(diff.cur, diff?.cur?.resource, this.client);
                    return update;
                }, {});
            return { toCreate, toDelete, toUpdate };
        },
        progress() {
            return Math.round((this.current_total / this.total) * 100) || 0;
        },
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        submit() {
            this.start();
        },
        success() {
            this.$emit("success");
        },
        async start() {
            this.status = "loading";
            this.loading = true;
            try {
                const { toCreate, toDelete, toUpdate } = this.toPost;
                this.total = toCreate.length + toDelete.length + Object.keys(toUpdate).length;
                // create
                const create_batches = lodash.chunk(toCreate, BATCH_SIZE);
                for (let create_batch of create_batches) {
                    const create_res = await bulkCreateItem(create_batch);
                    const item_ids = create_res.data.data?.map((item) => item.id);
                    await appendItemsToPkg(this.pkg_id, item_ids);
                    this.current_total += create_batch.length;
                }
                // delete
                const delete_batches = lodash.chunk(toDelete, BATCH_SIZE);
                for (let delete_batch of delete_batches) {
                    await bulkDeleteItemByUUID(delete_batch);
                    this.current_total += delete_batch.length;
                }
                // update
                const update_batches = lodash.chunk(Object.entries(toUpdate), BATCH_SIZE);
                for (let update_batch of update_batches) {
                    await bulkUpdateItemByUUID(
                        update_batch.reduce((update, [uuid, item]) => {
                            update[uuid] = item;
                            return update;
                        }, {})
                    );
                    this.current_total += update_batch.length;
                }
                this.loading = false;
                this.status = "success";
            } catch (e) {
                this.loading = false;
                this.status = "error";
            }
        },
    },
    mounted() {},
};
</script>

<style lang="less">
.m-parse-update-push {
    .u-loading {
        height: 120px;
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        .mt(40px);
    }

    .el-icon-loading {
        .size(60px);
        .fz(60px);
    }

    .u-count {
        .fz(30px);
        .bold;
    }
}
</style>
