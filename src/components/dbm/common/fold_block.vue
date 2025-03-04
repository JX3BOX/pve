<template>
    <div class="m-foldblock">
        <el-divider content-position="left">
            <slot name="title"> <i :class="icon"></i> {{ desc }} </slot>
            <span class="u-collapse" v-if="!fixed" @click="collapse" :class="{ on: status }">{{
                status ? "展开" : "折叠"
            }}</span>
            <div v-if="showToolbarOnCollapse || !status" class="m-foldblock-toolbar">
                <slot name="title-toolbar"></slot>
            </div>
        </el-divider>
        <div class="m-foldblock-content" :class="{ on: status }">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "FoldBlock",
    props: {
        name: String,
        desc: String,
        icon: String,
        fold: {
            type: Boolean,
            default: false,
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        showToolbarOnCollapse: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            status: this.fold,
        };
    },
    computed: {},
    methods: {
        collapse: function () {
            this.status = !this.status;
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/common/fold_block.less";
</style>
