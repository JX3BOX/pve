<template>
    <div class="m-manage-pkg">
        <el-divider content-position="left">基础信息</el-divider>
        <div class="m-form-item">
            <el-input v-model="form.user_id" class="u-author" placeholder="输入作者UID" size="small">
                <template #prepend>作者</template>
            </el-input>
            <el-input v-model="form.title" placeholder="输入标题" size="small">
                <template #prepend>标题</template>
            </el-input>
        </div>

        <el-divider content-position="left">字段变更</el-divider>
        <div class="m-form-item">
            <el-radio-group v-model="form.client" size="small">
                <el-radio-button label="std">重制</el-radio-button>
                <el-radio-button label="origin">缘起</el-radio-button>
            </el-radio-group>
        </div>

        <el-divider content-position="left">状态</el-divider>
        <div class="m-form-item">
            <el-radio-group v-model="form.status" size="small">
                <el-radio-button :label="0">公开</el-radio-button>
                <el-radio-button :label="1">仅自己可见</el-radio-button>
            </el-radio-group>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="onDelete">删除</el-button>
        </div>

        <div class="m-footer">
            <el-button @click="onClose" :disabled="loading">关闭</el-button>
            <el-button @click="onSave" type="primary" :loading="loading">保存</el-button>
        </div>
    </div>
</template>

<script>
import { manageUpdateItem, manageDeleteItem } from "@/service/dbm/item";
export default {
    name: "ManageDrawer",
    data() {
        return {
            form: {
                user_id: "",
                title: "",
                client: "std",
                status: 0,
            },

            loading: false,
        };
    },
    computed: {
        item() {
            return this.$store.state.item;
        },
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.form = {
                        user_id: val?.user_id,
                        title: val?.title,
                        client: val?.client,
                        status: val?.status,
                    };
                }
            },
        },
    },
    methods: {
        onDrawerShow() {
            this.drawer = true;
        },
        onClose() {
            this.$emit("close");
        },
        onSave() {
            this.loading = true;
            manageUpdateItem(this.item.id, this.form)
                .then((res) => {
                    this.$message.success("保存成功");
                    this.$emit("update");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onDelete() {
            this.$confirm("此操作将永久删除该数据包, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    manageDeleteItem(this.item.id).then((res) => {
                        this.$message.success("删除成功");
                        this.$emit("close");

                        this.$router.push({
                            name: "item_list",
                        });
                    });
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less">
</style>
