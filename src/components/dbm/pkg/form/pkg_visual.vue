<template>
    <el-dialog :visible="modelValue" @close="onClose" fullscreen title="可视化编辑">
        可视化编辑内容
    </el-dialog>
</template>

<script>
export default {
    name: "PkgVisual",
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue"
    },
    data() {
        return {
            loading: false,
        };
    },
    methods: {
        onClose() {
            this.$emit("update:modelValue", false);
        },
    },
};
</script>
