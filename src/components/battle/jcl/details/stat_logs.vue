<template>
    <vxe-table
        class="m-stat-logs"
        :data="logs"
        :show-overflow="true"
        :resizable="true"
        :max-height="600"
        size="mini"
        stripe
        :border="'none'"
    >
        <template #empty>
            <span>
                <p>点击上面表格的行查看更详细的日志</p>
            </span>
        </template>
        <vxe-column type="seq" title="#" width="60"></vxe-column>
        <vxe-column title="来源" width="200">
            <template #default="{ row }">
                <jcl-entity :id="row.c"></jcl-entity>
            </template>
        </vxe-column>
        <vxe-column title="目标" width="200">
            <template #default="{ row }">
                <jcl-entity :id="row.t"></jcl-entity>
            </template>
        </vxe-column>
        <vxe-column title="效果">
            <template #default="{ row }">
                <jcl-skill :type="row.e.split(':')[0]" :id="row.e.split(':')[1]"></jcl-skill>
            </template>
        </vxe-column>
        <vxe-column title="时间" width="150" sortable>
            <template #default="{ row }">
                {{ (row.m / 1000).toFixed(2) }}
            </template>
        </vxe-column>
        <vxe-column title="实际数值" field="v" width="150" sortable></vxe-column>
        <vxe-column v-if="type == 'treat'" title="治疗数值(虚条)" field="T" width="150" sortable></vxe-column>
        <vxe-column title="身上BUFF">
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
</template>

<script>
import { getResource } from "@/utils/battle/jcl/resource.js";

import JclEntity from "@/components/battle/jcl/common/entity";
import JclSkill from "@/components/battle/jcl/common/skill";

export default {
    name: "StatLogs",
    components: {
        JclEntity,
        JclSkill,
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
    props: ["logs", "type"],
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/entity_stat_logs.less";
</style>
