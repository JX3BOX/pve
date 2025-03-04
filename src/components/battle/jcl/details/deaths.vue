<template>
    <div class="m-entity-deaths">
        <fold-wrapper>
            <template slot="header">
                <div class="u-title-with-setting">
                    <img svg-inline src="@/assets/img/battle/jcl/death.svg" />
                    <span>死亡记录</span>
                    <el-checkbox-group v-model="displays">
                        <el-checkbox label="death">死亡</el-checkbox>
                        <el-checkbox label="kill">击杀</el-checkbox>
                    </el-checkbox-group>
                </div>
            </template>
            <vxe-table :data="logs" :show-overflow="true" :max-height="600" size="mini" :border="'none'">
                <vxe-column type="seq" title="#" width="60"></vxe-column>
                <vxe-column title="时间" field="time" width="120"></vxe-column>
                <vxe-column title="类型" field="type" width="90">
                    <template #default="{ row }">
                        <span v-if="row.type === 'death'">死亡</span>
                        <span v-else>击杀</span>
                    </template>
                </vxe-column>
                <vxe-column title="击杀者">
                    <template #default="{ row }">
                        <jcl-entity v-if="row.type === 'death'" :id="parseInt(row.id)"></jcl-entity>
                        <jcl-entity v-else :id="parseInt(entityID)"></jcl-entity>
                    </template>
                </vxe-column>
                <vxe-column title="去世者">
                    <template #default="{ row }">
                        <jcl-entity v-if="row.type === 'death'" :id="parseInt(entityID)"></jcl-entity>
                        <jcl-entity v-else :id="parseInt(row.id)"></jcl-entity>
                    </template>
                </vxe-column>
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
            <Timeline :data="timeline" :linetime="timeScale" :time="fightTime"></Timeline>
        </fold-wrapper>
    </div>
</template>

<script>
import FoldWrapper from "@/components/battle/common/fold_wrapper.vue";
import JclEntity from "@/components/battle/jcl/common/entity";
import Timeline from "@/components/battle/jcl/common/timeline.vue";
import { entityName } from "@/utils/battle/jcl/format";
export default {
    name: "EntityDeaths",
    props: ["entityID"],
    components: {
        FoldWrapper,
        Timeline,
        JclEntity,
    },
    data: () => ({
        displays: ["death", "kill"],

        settingVisible: false,
        timeScale: 30,
    }),
    computed: {
        fightTime() {
            return window.$store.end?.s;
        },
        entityName() {
            const entity = window.$store.entities[this.entityID];
            return entityName(entity);
        },
        overview() {
            let data = window.$store.entityDeath[this.entityID];
            if (!data) return {};
            return {
                kill: data.kill,
                death: data.death,
            };
        },
        logs() {
            let data = window.$store.entityDeath[this.entityID];
            if (!data) return [];
            return data.logs.filter((log) => this.displays.includes(log.type));
        },
        timeline() {
            let logs = this.logs;
            let result = logs.map((log) => {
                const entity = window.$store.entities[log.id];
                const name = entityName(entity);
                const typeDesc = log.type === "death" ? "死亡" : "击杀";
                const targetDesc = log.type === "death" ? "击杀者" : "目标";
                return {
                    time: log.time,
                    content: typeDesc,
                    extra: {
                        tooltip: {
                            类型: typeDesc,
                            [targetDesc]: name,
                            时间: log.time,
                        },
                        color: log.type === "death" ? "#FF3333" : "#E6E600",
                    },
                };
            });
            result.unshift({
                extra: {
                    tooltip: {
                        事件: "战斗开始",
                    },
                    color: "#000000",
                },
                content: "战斗开始",
                time: 0,
            });
            result.push({
                extra: {
                    tooltip: {
                        事件: "战斗结束",
                    },
                    color: "#000000",
                },
                content: "战斗结束",
                time: this.fightTime + 2,
            });
            return result;
        },
    },
};
</script>

<style lang="less">
.m-entity-deaths {
    .vxe-header--row {
        padding: 6px 0;
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

.u-title-with-setting {
    .flex;
    align-items: center;

    .el-checkbox-group {
        margin-left: 16px;
    }
}
</style>
