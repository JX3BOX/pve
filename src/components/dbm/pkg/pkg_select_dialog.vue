<template>
    <el-dialog class="m-pkg-select__dialog" :visible.sync="visible" title="包选择" append-to-body width="40%">
        <pkg-select v-bind="$attrs" :selected.sync="selected"></pkg-select>
        <div class="u-buttons">
            <el-button size="mini" type="text" @click="onCancel"> 取消</el-button>
            <el-button size="mini" type="primary" @click="onSelect"> 选择完毕</el-button>
        </div>
    </el-dialog>
</template>

<script>
import PkgSelect from "@/components/dbm/pkg/pkg_select.vue";

export default {
    name: "PkgSelectDialog",
    components: {
        PkgSelect,
    },
    data: () => ({
        visible: false,
        selected: [],
        callback: {},
    }),
    methods: {
        open() {
            this.visible = true;
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        reset() {
            this.visible = false;
            this.selected = [];
        },
        onCancel() {
            this.reset();
            this.callback.reject();
        },
        onSelect() {
            this.callback.resolve(this.selected);
            this.reset();
        },
    },
};
</script>

<style lang="less">
.m-pkg-select__dialog {
    .u-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        .mt(20px);
    }
}
</style>
