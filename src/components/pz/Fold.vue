<template>
    <div class="m-fold">
        <el-divider class="u-div" content-position="left">
            <i :class="icon"></i> {{title}}
            <span class="u-op" @click="toggle">[ {{collapse ? '－折叠' : '＋展开'}} ]</span>
        </el-divider>
        <div class="m-fold-body" v-show="collapse">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "Fold",
    props: ["icon", "title", "defaultValue"],
    components: {},
    data: function () {
        return {
            collapse : this.defaultValue || false
        };
    },
    computed: {},
    watch: {},
    methods: {
        toggle : function (){
            this.collapse = !this.collapse
        }
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
.m-fold{
    .u-op{
        .pointer;
        .ml(10px);
        color:@color-link;
        .fz(12px);
    }
}
.m-fold-body {
    background-color: @bg-light;
    padding: 20px;
    .r(3px);
    border: 4px solid @border-hr;
}
</style>
