<template>
    <span class="i-bool">
        <i class="el-icon-success" v-if="value"></i>
        <i class="el-icon-error" v-else></i>
    </span>
</template>

<script>
export default {
    name: "bool",
    props: ["value"],
};
</script>

<style lang="less">
.i-bool {
    .el-icon-success {
        color: #49c10f;
    }
    .el-icon-error {
        color: #ccc;
    }
    .fz(18px,24px);
    .y(-2px);
}
</style>
