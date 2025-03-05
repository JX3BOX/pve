<template>
    <!-- 编辑的对话框 -->
    <el-dialog
        title="编辑战斗记录信息"
        :visible.sync="editing"
        width="60%"
        center
        class="m-battle-form-dialog"
        :close-on-click-modal="false"
    >
        <div class="m-battle-edit">
            <el-form :model="editingData" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="editingData.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="editingData.desc" placeholder="请输入描述" type="textarea" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="阅读权限">
                    <el-radio-group v-model="editingData.visible">
                        <el-radio :label="0">公开</el-radio>
                        <el-radio :label="1">私有</el-radio>
                        <el-radio :label="2">仅亲友可见</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editing = false">取 消</el-button>
            <el-button type="primary" @click="save" :loading="editLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { updateBattle } from "@/service/battle/team";
import { cloneDeep } from "lodash";
export default {
    name: "battleEdit",
    props: {
        data: {
            type: [Object, String],
            default: () => {},
        },
        value: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            editing: false,
            editingData: {},
            editLoading: false,
        };
    },
    watch: {
        data: {
            handler: function (val) {
                this.editingData = cloneDeep(val);
            },
            immediate: true,
        },
        value: {
            handler: function (val) {
                this.editing = val;
            },
        },
        editing: {
            handler: function (val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        save: function () {
            this.editLoading = true;
            updateBattle(this.editingData.id, {
                title: this.editingData.title,
                desc: this.editingData.desc,
                visible: this.editingData.visible,
            })
                .then((res) => {
                    if (res.data.code !== 0) {
                        this.$message.error(res.data);
                        return;
                    }
                    this.$emit("update");
                    this.editing = false;
                    this.$message.success("编辑成功");
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("未知错误，请F12打开控制台将报错内容截图反馈！");
                })
                .finally(() => {
                    this.editLoading = false;
                });
        },
    },
};
</script>
