<template>
    <el-checkbox class="m-opentarget" v-model="checked" true-label="1" false-label="0">新窗打开</el-checkbox>
</template>

<script>
export default {
    name: "OpenTarget",
    props: [],
    components: {},
    data: function () {
        return {
            checked: '0',
        };
    },
    computed: {},
    watch: {
        checked: function (val) {
            this.$store.commit("SET_STATE", {
                key: "open_target",
                value: this.checked,
            });
            this.updateStorage(val)
        },
    },
    methods: {
        updateStorage : function (val){
            localStorage.setItem('pz_open_target',val)
        },
        init : function (){
            let currentValue = localStorage.getItem('pz_open_target')
            this.checked = currentValue || '0'
        }
    },
    filters: {},
    created: function () {},
    mounted: function () {
        this.init()
    },
};
</script>

<style lang="less">
.m-opentarget {
    .ml(10px);
    .el-checkbox__label {
        padding-left: 5px;
        .fz(13px);
    }
}
</style>