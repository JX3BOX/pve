<template>
    <div class="m-entity-skills">
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/total.svg" />技能数量</span>
                <el-tooltip content="点击下面的一条轴即可在时间轴上显示/隐藏对应的技能" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
                <el-popover
                    width="500"
                    v-model="settingVisible"
                    popper-class="u-setting-popover"
                    trigger="click"
                    placement="bottom-start"
                >
                    <el-button slot="reference" icon="el-icon-setting" type="text"></el-button>
                    <p class="u-setting-title">统计设置</p>
                    <div class="u-setting-list">
                        <div class="u-setting-item" v-for="(o, id) in skillStatFilter" :key="id">
                            <div class="u-setting-item-name">({{ id }}){{ dataWithResource.skills[id].name }}</div>
                            <el-checkbox-group v-model="skillStatFilter[id]" @change="forceUpdate">
                                <el-checkbox label="cast">读条</el-checkbox>
                                <el-checkbox label="hit">命中</el-checkbox>
                                <el-checkbox label="miss">偏离</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <el-button class="u-setting-apply" @click="applyFilter" size="mini" type="primary"
                        >应用设置</el-button
                    >
                </el-popover>
            </div>
            <div class="u-chart-wrapper">
                <div v-for="(skill, id) in skillCountArray" :key="id" class="u-chart-item">
                    <el-tooltip placement="right">
                        <div slot="content">{{ skill.name }} # {{ skill.id }}</div>
                        <div class="u-chart-label">{{ skill.name }}</div>
                    </el-tooltip>
                    <el-checkbox v-model="timelineSkill[skill.id]" @change="calcTimeLineData"></el-checkbox>
                    <el-tooltip placement="right">
                        <template slot="content">
                            <div class="u-chart-tooltip">
                                <div>{{ skill.name }}#{{ skill.id }}</div>
                                <div>释放次数：{{ skill.count }}</div>
                                <div>平均释放间隔：{{ skill.interval.toFixed(2) }} 秒 (仅供参考)</div>
                                <div>施法/命中/偏离：{{ `${skill.cast} / ${skill.hit} / ${skill.miss}` }}</div>
                            </div>
                        </template>
                        <div class="u-chart-bar" @click="handleBarClick(skill.id)" :style="barStyle(skill)"></div>
                    </el-tooltip>
                    <span class="u-chart-count">{{ skill.count }}</span>
                </div>
            </div>
        </fold-wrapper>
        <fold-wrapper style="margin-top: 40px">
            <div class="u-timeline-title" slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/timeline.svg" />时间轴</span>
                <el-tooltip content="鼠标移至时间轴上的节点可以查看详情" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
                <el-radio-group v-model.number="timeScale" size="mini">
                    <el-radio-button :label="15">每行15s</el-radio-button>
                    <el-radio-button :label="30">每行30s</el-radio-button>
                    <el-radio-button :label="45">每行45s</el-radio-button>
                    <el-radio-button :label="60">每行60s</el-radio-button>
                </el-radio-group>
            </div>
            <Timeline :data="timelineData" :linetime="timeScale" :time="fightTime"></Timeline>
        </fold-wrapper>
    </div>
</template>

<script>
import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";
import Timeline from "@/components/battle/jcl/common/timeline.vue";

import { getResource } from "@/utils/battle/jcl/resource.js";
import { getRandomColor } from "@/utils/battle/jcl/colors";

import { cloneDeep } from "lodash";

export default {
    name: "EntitySkills",
    props: ["entityID"],
    components: { Timeline, FoldWrapper },
    data: () => ({
        timeScale: 30,
        nameSuffix: [],
        timelineSkill: {}, //显示在时间轴上的技能
        skillStatFilter: {}, //技能统计过滤器，键为技能ID，值为一个对象，包含cast和hit两个键，值为true或false
        settingVisible: false,

        dataWithResource: {},
        skillCountArray: [],
        timelineData: [],
    }),
    computed: {
        // 总战斗时间
        fightTime: function () {
            return this.dataWithResource.logs.at(-1).time + 10;
        },
    },
    methods: {
        // 拿到store里面的分析结果，以及resources，组合起来
        mergeDataWithResource: function () {
            this.skillStatFilter = {};
            let data = cloneDeep(window?.$store.entitySkill[this.entityID]);
            let result = {};
            let colorGenerator = getRandomColor();
            for (let id in data.skills) {
                let skill = getResource("skill", id);
                if(!skill.name) continue;
                let newID = skill ? `${skill.id}${skill.level ? "_" + skill.level : ""}` : id;
                let name = skill.name;
                // 重名技能放在一起统计，就算ID不同也
                if (!result.hasOwnProperty(newID)) {
                    result[newID] = {
                        _id: id,
                        id: newID,
                        name: name,
                        icon: skill?.icon ?? 13,
                        color: colorGenerator.next().value,
                    };
                    this.skillStatFilter[newID] = ["cast", "hit", "miss"];
                }
                // 替换掉logs里面的ID和名字
                data.logs = data.logs.map((log) => {
                    if (log.id == id) {
                        log.name = name;
                        log._id = log.id;
                        log.id = newID;
                    }
                    return log;
                });
            }
            // 返回结果
            this.dataWithResource = Object.freeze({
                skills: result,
                logs: data.logs,
            });
        },
        // 给技能数量的条形图显示用
        calcSkillCountArray: function () {
            let data = cloneDeep(this.dataWithResource);
            let result = {};
            let logs = data.logs;
            let maxCount = 1;
            for (let id in data.skills) {
                let skill = data.skills[id];
                result[id] = {
                    id: id,
                    name: skill.name,
                    count: 0,
                    hit: 0,
                    miss: 0,
                    cast: 0,
                    color: skill.color,
                    interval: 0,
                    barLength: 20,
                };
                let _logs = logs.filter((log) => {
                    // 筛选出符合条件的参与统计的日志
                    let is = log.id == id && this.skillStatFilter[log.id].includes(log.type);
                    if (is) result[id][log.type]++;
                    return is;
                });
                result[id].count = _logs.length; // 技能释放次数
                maxCount = Math.max(maxCount, _logs.length); // 用于确定bar长度的基准
                if (_logs.length > 1) {
                    // 计算平均释放间隔
                    result[id].interval = (_logs[_logs.length - 1].time - _logs[0].time) / (_logs.length - 1);
                }
            }
            // 计算bar长度
            for (let id in result) {
                result[id].barLength = Math.max(20, (result[id].count / maxCount) * 800);
            }
            this.skillCountArray = Object.values(result)
                .sort((a, b) => b.count - a.count)
                .filter((skill) => skill.count > 0);
        },
        // 给时间轴显示用
        calcTimeLineData: function () {
            let logs = cloneDeep(this.dataWithResource.logs);
            // 过滤掉不显示的
            const typeDescMap = {
                cast: "读条",
                hit: "命中",
                miss: "偏离",
            };
            logs = logs
                .filter((log) => {
                    return this.timelineSkill[log.id] && this.skillStatFilter[log.id].includes(log.type);
                })
                .map((log) => {
                    let name = log.name;
                    if (name.length > 5) {
                        name = name.charAt(0) + ".." + name.charAt(name.length - 1);
                    }
                    if (this.nameSuffix.includes("type")) name = name + `(${log.type})`;
                    if (this.nameSuffix.includes("id")) name = name + `#${log.id}`;
                    return {
                        extra: {
                            tooltip: {
                                技能: log.name,
                                资源ID: log.id,
                                日志ID: log._id,
                                施放时间: log.time.toFixed(2),
                                施放类型: typeDescMap[log.type],
                            },
                            color: this.dataWithResource.skills[log.id].color,
                        },
                        content: name,
                        time: log.time,
                    };
                });
            // 加入开始和结束的时间节点
            logs.unshift({
                extra: {
                    tooltip: {
                        事件: "战斗开始",
                    },
                    color: "#000000",
                },
                content: "战斗开始",
                time: 0,
            });
            logs.push({
                extra: {
                    tooltip: {
                        事件: "战斗结束",
                    },
                    color: "#000000",
                },
                content: "战斗结束",
                time: window.$store?.end?.s ?? logs[logs.length - 1].time + 2,
            });
            this.timelineData = logs;
        },
        // 给出条形图的条形的样式
        barStyle: function (skill) {
            return {
                backgroundColor: skill.color,
                width: skill.barLength + "px",
                boxShadow: "0 0 3px " + skill.color,
            };
        },
        // 不会写自动更新，先写成需要手动更新吧（x
        handleBarClick: function (id) {
            this.$set(this.timelineSkill, id, !this.timelineSkill[id]);
            this.calcTimeLineData();
        },
        // 强制更新视图，这个应该有更好的的办法（x
        forceUpdate: function () {
            this.$forceUpdate();
        },
        // 应用设置的筛选
        applyFilter: function () {
            this.settingVisible = false;
            this.calcSkillCountArray();
            this.calcTimeLineData();
            this.$forceUpdate();
        },
        init: function () {
            this.mergeDataWithResource();
            this.calcSkillCountArray();
            let defaultDisplayMaxCount = this.fightTime / 20; //默认显示在时间轴上的技能最多释放次数
            this.skillCountArray.map((x) => {
                this.$set(this.timelineSkill, x.id, x.count <= defaultDisplayMaxCount);
            });
            this.calcTimeLineData();
        },
    },
    mounted: function () {},
    watch: {
        entityID: {
            handler: function () {
                this.init();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/entity_skill.less";
</style>
