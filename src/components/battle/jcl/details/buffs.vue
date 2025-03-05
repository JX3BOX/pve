<template>
    <div class="m-entity-buffs">
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/total.svg" />BUFF概览</span>
                <el-popover
                    width="500"
                    v-model="statSettingVisible"
                    popper-class="u-buff-stat-popover"
                    trigger="click"
                    placement="bottom-start"
                >
                    <el-button slot="reference" icon="el-icon-setting" type="text"></el-button>
                    <p class="u-setting-title">
                        <span>参与统计的BUFF</span>
                    </p>
                    <div class="u-setting-list">
                        <el-checkbox-group v-model="statBuffs">
                            <div class="u-setting-item" v-for="(id, index) in statSettingShowBuff" :key="index">
                                <el-checkbox :label="id">
                                    <jcl-skill :id="id" type="buff" :click-redirect="false"></jcl-skill>
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </el-popover>
            </div>
            <div class="u-overview">
                <vxe-table
                    class="m-stat-logs"
                    :data="statData"
                    :show-overflow="true"
                    :resizable="true"
                    :max-height="600"
                    size="mini"
                    stripe
                    :border="'none'"
                >
                    <template #empty>
                        <span>
                            <p>通过标题右侧的小齿轮选择需要统计的数据</p>
                        </span>
                    </template>
                    <vxe-column type="seq" title="#" width="60"></vxe-column>
                    <vxe-column title="BUFF" width="200">
                        <template #default="{ row }">
                            <jcl-skill type="buff" :id="row.id"></jcl-skill>
                        </template>
                    </vxe-column>
                    <vxe-column title="覆盖率" field="coverage" sortable>
                        <template #default="{ row }"> {{ (row.coverage * 100).toFixed(2) }} % </template>
                    </vxe-column>
                    <vxe-column title="获得次数" field="getTimes" sortable></vxe-column>
                    <vxe-column title="被卸除次数" field="deleteTimes" sortable></vxe-column>
                    <vxe-column title="最大层数" field="maxStack" sortable></vxe-column>
                    <vxe-column title="最久持续" field="maxDuration" sortable>
                        <template #default="{ row }"> {{ row.maxDuration.toFixed(1) }} 秒</template>
                    </vxe-column>
                    <vxe-column title="平均持续" field="aveDuration" sortable>
                        <template #default="{ row }"> {{ row.aveDuration.toFixed(1) }} 秒</template>
                    </vxe-column>
                    <vxe-column title="最短持续" field="minDuration" sortable>
                        <template #default="{ row }"> {{ row.minDuration.toFixed(1) }} 秒</template>
                    </vxe-column>
                </vxe-table>
            </div>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/timeline.svg" />时间轴</span>
            </div>
            <BuffTimeline :data="timelineData" :maxTime="fightTime"></BuffTimeline>
        </fold-wrapper>
    </div>
</template>

<script>
import BuffTimeline from "@/components/battle/jcl/details/buff_timeline.vue";
import JclSkill from "@/components/battle/jcl/common/skill.vue";

import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";

import { getResource } from "@/utils/battle/jcl/resource";
import { getRandomColor } from "@/utils/battle/jcl/colors";

export default {
    name: "EntityBuffs",
    props: ["entityID"],
    components: {
        FoldWrapper,
        JclSkill,
        BuffTimeline,
    },
    data() {
        return {
            statSettingVisible: false,
            statBuffs: [],
        };
    },
    computed: {
        fightTime() {
            return window.$store.end.m / 1000;
        },
        buffs() {
            return window.$store.entityBuff[this.entityID];
        },
        statSettingShowBuff() {
            let buffIds = Object.keys(this.buffs);
            buffIds = buffIds?.sort((a, b) => {
                return getResource("buff", b)?.icon - getResource("buff", a)?.icon;
            });
            return buffIds;
        },
        statData() {
            return this.statBuffs.map((id) => {
                let logs = this.buffs[id].logs;
                // 一轮遍历走完
                let allCover = 0;
                let getTimes = 0;
                let deleteTimes = 0;
                let maxStack = 0;
                let maxDuration = Number.MIN_SAFE_INTEGER;
                let minDuration = Number.MAX_SAFE_INTEGER;
                let totalDuration = 0;
                for (let log of logs) {
                    allCover += (log.end - log.start) / 1000;
                    getTimes += 1;
                    if (log.end != log.shouldEnd) deleteTimes += 1;
                    maxStack = Math.max(maxStack, log.stack, ...Object.values(log.stackLogs ?? {}));
                    const duration = (log.end - log.start) / 1000;
                    maxDuration = Math.max(maxDuration, duration);
                    minDuration = Math.min(minDuration, duration);
                    totalDuration += duration;
                }
                const aveDuration = totalDuration / logs.length;
                const coverage = allCover / this.fightTime;
                return {
                    id,
                    coverage,
                    getTimes,
                    deleteTimes,
                    maxStack,
                    maxDuration,
                    aveDuration,
                    minDuration,
                };
            });
        },
        timelineData() {
            let colorGenerator = getRandomColor();
            let result = {};
            for (let id of this.statBuffs) {
                const info = Object.assign(
                    {
                        color: colorGenerator.next().value,
                    },
                    getResource("buff", id)
                );
                const times = this.buffs[id].logs;
                result[id] = { info, times };
            }
            return result;
        },
    },
    mounted() {},
    methods: {
        init() {
            this.statBuffs = this.statSettingShowBuff?.filter((b) => getResource("buff", b)?.icon);
        },
    },
    watch: {
        entityID: {
            handler() {
                this.init();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.m-entity-buffs {
    .el-icon-setting {
        margin-left: 16px;
    }
}
.u-buff-stat-popover {
    .u-setting-list {
        max-height: 400px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: #909399;
        }
        &::-webkit-scrollbar-track {
            border-radius: 10px;
            background: #e0d3d3;
        }
    }
    .u-setting-title {
        font-weight: bold;
        margin: 0 0 8px 0;
    }
    .u-setting-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .u-setting-item-name {
            width: 200px;
            flex-shrink: 0;
            text-align: right;
            margin-right: 16px;
            font-size: 12px;
        }
        .el-checkbox__label {
            vertical-align: bottom;
        }
    }
}
</style>
