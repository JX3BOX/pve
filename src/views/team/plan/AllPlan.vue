<template>
    <div class="m-plan-all">
        <h1 class="m-title">
            <i class="el-icon-s-order"></i> 全部活动
        </h1>
        <div class="m-list-box">
            <div class="m-list-txt">
                <div class="title">14周一团活动计划</div>
                <div class="time">计划时间：2020-02-02 至 2020-02-09</div>
            </div>
            <div class="m-list-btn">
                <el-button type="primary" size="mini" icon="el-icon-arrow-down">查看详细</el-button>
            </div>
        </div>
        <planItem />
        <div class="m-list-box">
            <div class="m-list-txt">
                <div class="title">14周一团活动计划</div>
                <div class="time">计划时间：2020-02-02 至 2020-02-09</div>
            </div>
            <div class="m-list-btn">
                <el-button type="primary" size="mini" icon="el-icon-arrow-up">查看详细</el-button>
            </div>
        </div>
        <div class="m-list-box">
            <div class="m-list-txt">
                <div class="title">14周一团活动计划</div>
                <div class="time">计划时间：2020-02-02 至 2020-02-09</div>
            </div>
            <div class="m-list-btn">
                <el-button type="primary" size="mini" icon="el-icon-edit">查看详细</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import planItem from "@/components/team/plan/planItem.vue";
export default {
    name: "AllPlan",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {
        planItem,
    },
};
</script>
<style scoped lang="less">
@import "~@/assets/css/team/plan/list_plan.less";
</style>
