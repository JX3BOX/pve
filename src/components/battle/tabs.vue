<template>
    <el-tabs class="m-tabs" type="card" v-model="view" @tab-click="changeView">
        <el-tab-pane :label="item.name" :name="item.id" v-for="item in bosslist" :key="item.id">
            <span slot="label">
                <b>{{ item.name }}</b>
            </span>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    name: "tabs",
    props: [],
    data: function () {
        return {
            view: "index",
            bosslist: [
                {
                    id: "9174",
                    name: "罗芬胡汤",
                },
                {
                    id: "9175",
                    name: "赵八嫂",
                },
                {
                    id: "9176",
                    name: "海荼",
                },
                {
                    id: "9177",
                    name: "姜集苦",
                },
                {
                    id: "9178",
                    name: "宇文灭",
                },
                {
                    id: "9179",
                    name: "宫威",
                },
                {
                    id: "9180",
                    name: "宫傲",
                },
            ],
        };
    },
    watch: {
        $route: function (_route) {
            this.view = _route.name;
        },
    },
    computed: {},
    methods: {
        changeView: function () {
            this.$router.push({ name: this.view });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/tabs.less";
</style>
