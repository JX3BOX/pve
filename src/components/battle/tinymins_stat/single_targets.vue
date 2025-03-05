<template>
    <fold-wrapper class="m-targets" v-if="targets && targets.length">
        <div slot="header">
            <i class="el-icon-aim"></i> 目标分析
            <span class="u-tip">(点击饼图目标查看目标技能详情)</span>
        </div>
        <div class="m-status">
            <el-row :gutter="20">
                <el-col :span="4">
                    <li>
                        <span>目标总数</span>
                        <b v-if="data._targets">{{Object.keys(data._targets._targets).length || 0}}</b>
                    </li>
                </el-col>
                <el-col :span="4">
                    <li>
                        <span>技能总数</span>
                        <b v-if="data._targets">{{data._targets._count || 0}}</b>
                    </li>
                </el-col>
                <el-col :span="4">
                    <li>
                        <span>当前目标技能总数</span>
                        <b>{{currentTarget.count || '-'}}</b>
                    </li>
                </el-col>
                <el-col :span="4">
                    <li>
                        <span>当前目标{{ totalText }}</span>
                        <b>{{currentTarget.total || '-'}}</b>
                    </li>
                </el-col>
                <el-col :span="4">
                    <li>
                        <span>当前目标ID(编号)</span>
                        <b>{{currentTarget.id || '-'}}</b>
                    </li>
                </el-col>
                <el-col :span="4">
                    <li>
                        <span>当前目标名称</span>
                        <b>{{title || '-'}}</b>
                    </li>
                </el-col>
            </el-row>
        </div>
        <div class="m-targets-content">
            <v-echart
                class="m-chart-pie"
                :option="options"
                ref="pie"
                autoresize
                @click="showSkillDetail"
            />
        </div>
        <div class="m-targets-skill">
            <skills :data="currentTarget.skills" v-if="currentTarget" :attrs="attrs" :total="currentTarget.total"></skills>
        </div>
    </fold-wrapper>
</template>

<script>
import foldWrapper from "@/components/battle/common/fold_wrapper.vue";
import skills from './skills.vue';
export default {
    name: "singleTargets",
    props: ["data"],
    components: {
        "fold-wrapper": foldWrapper,
        'skills':skills
    },
    data: function () {
        return {
            currentTarget: "",
            title: "总览",
            attrs : ['name','_name','count','max','hit','critical','miss','insight','total_bar']
        };
    },
    computed: {
        type() {
            return this.$store.state.type;
        },
        options: function () {
            return {
                title: {
                    text: this.title,
                    left: "center",
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{b} <br/> 技能数 : {c} ({d}%)",
                },
                // 目标类型
                legend: {
                    orient: "vertical",
                    left: "left",
                    type: 'scroll',
                    data: this.targets,
                },
                series: [
                    {
                        name: this.title,
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "50%"],
                        data: this.transformToPieData(this.data._targets.detail),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            };
        },
        targets : function (){
            let list = []
            for(let id in this.data?._targets?._targets){
                let name = this.data?._targets?._targets[id]
                list.push((name || '未知') + `(${id})`)
            }
            return list
        },
        totalText : function (){
            switch (this.type) {
                case 'damage':
                    return '伤害总量'
                case 'heal':
                    return '治疗总量'
                case 'beHeal':
                    return '承受疗总量'
                default:
                    return '伤害总量'
            }
        }
    },
    methods: {
        // 点击饼图展示对应目标的技能详情
        showSkillDetail: function (val) {
            let targetID = val.data.key;
            for (let item of this.data?._targets.detail) {
                if (targetID == item.id) {
                    this.currentTarget = item;
                    this.title = item.name;
                    break;
                }
            }
        },
        // 转换为echarts格式
        transformToPieData: function (detail) {
            let list = [];
            for (let key in detail) {
                list.push({
                    value: detail[key]["count"],
                    name: (detail[key]["name"] || '未知') + `(${detail[key]["id"]})`,
                    key: detail[key]["id"],
                });
            }
            return list;
        },
    }
};
</script>

<style scoped lang="less">
@import "~@/assets/css/battle/tinymins_stat/status.less";
.m-targets{
    .mt(20px);
}
.m-targets-content {
    .mt(10px);
}
.m-chart-pie {
    .h(500px);
}
.u-tip{
    .fz(12px);
    color:#999;
    font-weight:normal;
}
</style>
