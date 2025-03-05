<template>
    <div class="m-fold-block">
        <div class="u-title">
            <slot name="header"></slot>
            <el-button
                plain
                class="u-folder"
                :icon="isFold ? 'el-icon-caret-right' : 'el-icon-caret-top'"
                size="mini"
                @click="execFold"
                >{{ isFold ? "展开" : "收起" }}</el-button
            >
        </div>
        <div v-show="!isFold">
            <slot></slot>
        </div>
        <div class="u-etc" v-show="isFold">
            <p>...</p>
            <p>当前数据被折叠</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "foldWrapper",
    props: [],
    components: {},
    data: function () {
        return {
            isFold: false,
        };
    },
    computed: {},
    methods: {
        execFold: function () {
            this.isFold = !this.isFold;
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
.m-fold-block {
    .mt(16px);
    .u-title {
        .x(left);
        .fz(1.2rem,2);
        margin: 0;
        svg,
        img,
        i {
            .size(20px);
            .y(-1px);
            .mr(5px);
            .dbi;
        }
        border-bottom: 1px solid #e4e7ed;
        .bold;

        .pr;
        .mb(10px);
    }
    .u-folder {
        .pa;
        .rb(0,5px);
    }
    .u-etc {
        .x;
        padding: 20px;
        color: #999;
        .fz(12px);
    }
}
</style>
