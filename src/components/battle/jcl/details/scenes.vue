<template>
    <div class="m-entity-says">
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/robot.svg" />场景信息</span>
            </div>
            <vxe-table
                :data="logs"
                :show-overflow="true"
                :resizable="true"
                :max-height="600"
                size="mini"
                :border="'none'"
            >
                <vxe-column type="seq" title="#" width="60"></vxe-column>
                <vxe-column title="时间" field="time" width="150"></vxe-column>
                <vxe-column title="单位" width="200">
                    <template #default>
                        <jcl-entity :id="parseInt(entityID)"></jcl-entity>
                    </template>
                </vxe-column>
                <vxe-column title="事件" field="content"></vxe-column>
            </vxe-table>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span class="u-title-content"><img svg-inline src="@/assets/img/battle/jcl/timeline.svg" />时间轴</span>
                <el-radio-group v-model.number="timeScale" size="mini">
                    <el-radio-button :label="15">每行15s</el-radio-button>
                    <el-radio-button :label="30">每行30s</el-radio-button>
                    <el-radio-button :label="45">每行45s</el-radio-button>
                    <el-radio-button :label="60">每行60s</el-radio-button>
                </el-radio-group>
            </div>
            <Timeline :data="logs" :linetime="timeScale" :time="fightTime" :tooltip="false"></Timeline>
        </fold-wrapper>
    </div>
</template>

<script>
import Timeline from "@/components/battle/jcl/common/timeline.vue";
import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";
import JclEntity from "@/components/battle/jcl/common/entity";
export default {
    name: "EntityScenes",
    props: ["entityID"],
    components: {
        FoldWrapper,
        Timeline,
        JclEntity,
    },
    data: () => ({
        timeScale: 30,
    }),
    computed: {
        logs() {
            let logs = window.$store.entityScene[this.entityID];
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
            return logs;
        },
        fightTime() {
            return this.logs.at(-1).time + 10;
        },
    },
    methods: {},
};
</script>

<style lang="less">
.m-entity-says {
    .vxe-header--row {
        padding: 6px 0;
    }

    .vxe-resizable.is--line {
        display: none;
    }

    .u-title {
        .el-checkbox-group,
        .el-radio-group,
        .el-dropdown,
        .el-tooltip {
            margin-left: 16px;
        }
    }
}
</style>
