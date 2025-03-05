<template>
    <div class="m-entity-says">
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/say.svg" />喊话内容</span>
                <el-popover
                    v-if="logs"
                    width="400"
                    v-model="settingVisible"
                    popper-class="u-setting-popover"
                    trigger="click"
                    placement="top"
                    class="u-setting"
                >
                    <el-button slot="reference" icon="el-icon-setting" type="text"></el-button>
                    <div class="u-setting-list">
                        <p class="u-setting-title">时间轴显示配置</p>
                        <div class="u-setting-item" v-for="(_, content) in displayLogs" :key="content">
                            <el-checkbox v-model="displayLogs[content]" @change="applyFilter">{{
                                content
                            }}</el-checkbox>
                        </div>
                    </div>
                </el-popover>
            </div>
            <vxe-table
                :data="timelineData"
                :show-overflow="true"
                :resizable="true"
                :max-height="600"
                size="mini"
                :border="'none'"
            >
                <vxe-column type="seq" title="#" width="60"></vxe-column>
                <vxe-column title="喊话时间" field="time" width="120"></vxe-column>
                <vxe-column title="喊话类型" field="type" width="120"></vxe-column>
                <vxe-column title="喊话者" width="200">
                    <template #default="{ row }">
                        <jcl-entity v-if="row.type === 'NPC喊话'" :id="parseInt(entityID)"></jcl-entity>
                        <span v-else>系统</span>
                    </template>
                </vxe-column>
                <vxe-column title="内容" field="content"></vxe-column>
            </vxe-table>
        </fold-wrapper>
        <fold-wrapper>
            <div slot="header">
                <span><img svg-inline src="@/assets/img/battle/jcl/timeline.svg" />时间轴</span>
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
import JclEntity from "@/components/battle/jcl/common/entity";
import Timeline from "@/components/battle/jcl/common/timeline.vue";
import { cloneDeep } from "lodash";
export default {
    name: "EntitySays",
    props: ["entityID"],
    components: {
        FoldWrapper,
        Timeline,
        JclEntity,
    },
    data: () => ({
        logs: [],
        timelineData: [],

        displayLogs: {},
        settingVisible: false,
        timeScale: 30,
    }),
    computed: {
        fightTime() {
            return this.logs.at(-1)?.time + 10;
        },
    },
    methods: {
        init: function () {
            this.initLogs();
            this.calcTimelineData();
        },
        initLogs: function () {
            let logs = cloneDeep(window.$store.entitySay[this.entityID]);
            this.displayLogs = {
                战斗开始: true,
                战斗结束: true,
            };
            // 太长的内容需要省略号处理一下
            logs = logs.map((l) => {
                l.extra = {
                    tooltip: {
                        内容: l.content,
                        时间: l.time,
                    },
                };
                this.displayLogs[l.content] = true;
                if (l.content.length > 10) l.content = l.content.substring(0, 10) + "...";
                return l;
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
            this.logs = logs;
        },
        calcTimelineData: function () {
            this.timelineData = this.logs.filter((log) => this.displayLogs[log.content]);
        },
        applyFilter: function () {
            this.$forceUpdate();
            this.calcTimelineData();
        },
    },
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
.m-entity-says {
    .vxe-header--row {
        padding: 6px 0;
    }

    .vxe-resizable.is--line {
        display: none;
    }

    .vxe-body--row {
        .pointer;
    }

    .u-title {
        .el-checkbox-group,
        .el-radio-group,
        .el-dropdown,
        .el-tooltip {
            margin-left: 16px;
        }
    }

    .u-setting {
        margin-left: 16px;
    }
}

.u-setting-popover {
    color: #909399;
    .u-setting-list {
        max-height: 600px;
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
        .el-checkbox__label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 360px;
            vertical-align: bottom;
        }
    }
}
</style>
