<!-- 管理编辑配装 -->
<template>
    <el-dialog title="编辑配装方案" :visible="modelValue" @close="close" append-to-body width="700px">
        <el-form class="m-macro-pz-form" ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请填写标题" />
            </el-form-item>
            <el-form-item label="资料片" prop="zlp">
                <el-select v-model="form.zlp" placeholder="请选择资料片" style="width: 100%">
                    <el-option v-for="item in zlpList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="适用" prop="adaptation">
                <el-select v-model="form.adaptation" placeholder="请选适用" style="width: 100%">
                    <el-option
                        v-for="item in adaptations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-checkbox-group v-model="form.tags">
                    <el-checkbox v-for="tag in tags" :label="tag" :value="tag" :key="tag">{{ tag }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="用户ID" prop="user_id">
                <el-input v-model="form.user_id" placeholder="用户ID" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submitForm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { std, origin } from "@jx3box/jx3box-common/data/jx3_zlp.json";
import { tags, adaptations } from "@/assets/data/pz/query_types.json";
import { updatePzAdmin } from "@/service/pz/schema.js";
export default {
    name: "SchemaEdit",
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
            form: {
                user_id: "",
                title: "",
                tags: [], // 标签
                zlp: "", // 版本
                adaptation: "std", // 适用 默认旗舰端  std/wujie/both
            },
            rules: {
                title: [{ required: true, message: "请输入标题", trigger: "blur" }],
                zlp: [{ required: true, message: "请选择资料片", trigger: "change" }],
                adaptation: [{ required: true, message: "请选择适用", trigger: "change" }],
                tags: [{ required: true, message: "请选择标签", trigger: "change" }],
                user_id: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
            },
            tags,
            adaptations,
            loading: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client || "std";
        },
        zlpList() {
            return this.client == "std" ? std : origin;
        },
        id() {
            return this.$route.params.id;
        },
        schema() {
            return this.$store.state.schema;
        },
    },
    watch: {
        modelValue(val) {
            if (val) {
                this.form = {
                    user_id: this.schema.user_id,
                    title: this.schema.title,
                    tags: this.schema.tags,
                    zlp: this.schema.zlp,
                    adaptation: this.schema.adaptation,
                };
            }
        },
    },
    methods: {
        close() {
            this.$emit("update:modelValue", false);
            this.loading = false;
            this.$refs?.form.resetFields();
            this.form = {
                user_id: "",
                title: "",
                tags: [],
                zlp: "",
                adaptation: "std",
            };
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    updatePzAdmin(this.id, this.form).then(() => {
                        this.$message({
                            type: "success",
                            message: "修改成功!",
                        });

                        location.reload();
                    });
                }
            });
        },
    },
};
</script>
