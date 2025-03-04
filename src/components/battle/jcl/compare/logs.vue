<template>
    <div class="m-jcl-compare-logs">
        <vxe-table
            class="m-stat-logs"
            :data="data"
            :show-overflow="true"
            :resizable="true"
            :max-height="600"
            size="mini"
            stripe
            :border="'none'"
        >
            <template #empty>
                <span>
                    <p v-if="effect">该单位没有通过该技能造成过伤害/治疗</p>
                    <p v-else>点击上面表格的行查看更详细的日志</p>
                </span>
            </template>
            <vxe-column type="seq" title="#" width="56"></vxe-column>
            <vxe-column v-if="mode.startsWith('be')" title="来源" width="120">
                <template #default="{ row }">
                    <jcl-entity :id="row.c"></jcl-entity>
                </template>
            </vxe-column>
            <vxe-column v-else title="目标" width="120">
                <template #default="{ row }">
                    <jcl-entity :id="row.t"></jcl-entity>
                </template>
            </vxe-column>
            <vxe-column title="效果" width="120">
                <template #default="{ row }">
                    <jcl-skill :type="row.e.split(':')[0]" :id="row.e.split(':')[1]"></jcl-skill>
                </template>
            </vxe-column>
            <vxe-column title="时间" width="80">
                <template #default="{ row }">
                    {{ (row.m / 1000).toFixed(2) }}
                </template>
            </vxe-column>
            <vxe-column title="实际数值" field="v" width="120"></vxe-column>
            <vxe-column title="BUFF">
                <template #default="{ row }">
                    <el-tooltip v-if="row.b.length" placement="top">
                        <div slot="content" class="m-stat-logs-buff">
                            <div class="u-buffs-list">
                                <jcl-skill
                                    class="u-buffs-item"
                                    type="buff"
                                    v-for="(buff, index) in sortBuff(row.b)"
                                    :key="index"
                                    :id="buff.id"
                                    :stack="buff.stack"
                                    :size="28"
                                ></jcl-skill>
                            </div>
                        </div>
                        <div class="u-buff-cell">
                            <jcl-skill
                                type="buff"
                                :id="sortBuff(row.b)[0].id"
                                :stack="sortBuff(row.b)[0].stack"
                            ></jcl-skill>
                            <span class="u-buff-cell-text">等 {{ row.b.length - 1 }} 个Buff</span>
                        </div>
                    </el-tooltip>
                </template>
            </vxe-column>
            <vxe-column title="备注" width="60">
                <template #default="{ row }">
                    {{ row.C ? "会心" : "" }}
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>

<script>
import JclEntity from "@/components/battle/jcl/common/entity.vue";
import JclSkill from "@/components/battle/jcl/common/skill.vue";

import { getResource } from "@/utils/battle/jcl/resource";

export default {
    name: "JclCompareLogs",
    components: {
        JclEntity,
        JclSkill,
    },
    props: {
        entityID: {
            type: Number,
            default: 0,
        },
        mode: {
            type: String,
            default: "damage",
        },
        effect: {
            type: String,
            default: "",
        },
    },
    data() {
        return {};
    },
    computed: {
        data() {
            const source = window.$store.entityStat[this.mode];
            const entities = window.$store.entities;
            if (!this.effect || !entities[this.entityID]) return [];
            let details = source[this.entityID]?.all?.details;
            details = details?.filter((d) => d.e === this.effect);
            return details || [];
        },
    },
    methods: {
        sortBuff(buffs) {
            return buffs
                .map((b) => {
                    b = b.split("*");
                    return {
                        id: b[0],
                        stack: parseInt(b[1]),
                    };
                })
                .sort((a, b) => {
                    return getResource("buff", b.id).icon - getResource("buff", a.id).icon;
                });
        },
    },
};
</script>

<style lang="less">
.m-jcl-compare-logs {
    .m-stat-logs {
        .u-buff-cell {
            display: flex;
            align-items: center;
            .u-buff-cell-text {
                margin-left: 4px;
                font-size: 12px;
                color: #999;
            }
        }
    }
}
</style>
