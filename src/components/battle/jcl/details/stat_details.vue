<template>
    <div class="m-stat-details">
        <!-- 按照技能展示 -->
        <el-table
            size="mini"
            :border="true"
            :data="detailsData"
            v-if="mode == 'skill'"
            class="u-stat-detail"
            @row-click="handleRowClick"
        >
            <template slot="empty">该单位{{ currentWindows ? "在所选时间内" : "" }}没有伤害数据</template>
            <el-table-column label="效果">
                <template slot-scope="scope">
                    <jcl-skill :type="scope.row.skill.split(':')[0]" :id="scope.row.skill.split(':')[1]"></jcl-skill>
                </template>
            </el-table-column>
            <el-table-column label="数值" prop="value" sortable> </el-table-column>
            <el-table-column label="占比" width="120" prop="valueRate" :formatter="percentFormat" sortable>
            </el-table-column>
            <el-table-column label="次数" width="80" prop="count" sortable> </el-table-column>
            <el-table-column label="会心数" width="100" prop="criticalCount" sortable> </el-table-column>
            <el-table-column label="会心率" width="120" prop="criticalRate" :formatter="percentFormat" sortable>
            </el-table-column>
            <el-table-column label="最小值" prop="min" sortable> </el-table-column>
            <el-table-column label="最大值" prop="max" sortable> </el-table-column>
            <el-table-column label="平均值" prop="avg" :formatter="floatFormat" sortable> </el-table-column>
        </el-table>
        <!-- 按照敌人展示 -->
        <el-table
            size="mini"
            :border="true"
            :data="detailsData"
            v-if="mode == 'target'"
            class="u-stat-detail"
            @row-click="handleRowClick"
        >
            <template slot="empty">该单位{{ currentWindows ? "在所选时间内" : "" }}没有伤害数据</template>
            <el-table-column :label="entityLabel">
                <template slot-scope="scope">
                    <jcl-entity :id="scope.row.target"></jcl-entity>
                </template>
            </el-table-column>
            <el-table-column label="数值" prop="value" sortable> </el-table-column>
            <el-table-column label="占比" width="120" prop="valueRate" :formatter="percentFormat" sortable>
            </el-table-column>
            <el-table-column label="次数" width="80" prop="count" sortable> </el-table-column>
            <el-table-column label="会心数" width="100" prop="criticalCount" sortable> </el-table-column>
            <el-table-column label="会心率" width="120" prop="criticalRate" :formatter="percentFormat" sortable>
            </el-table-column>
            <el-table-column label="最小值" prop="min" sortable> </el-table-column>
            <el-table-column label="最大值" prop="max" sortable> </el-table-column>
            <el-table-column label="平均值" prop="avg" :formatter="floatFormat" sortable> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import JclEntity from "@/components/battle/jcl/common/entity";
import JclSkill from "@/components/battle/jcl/common/skill";

export default {
    name: "StatDetails",
    components: {
        JclEntity,
        JclSkill,
    },
    props: ["mode", "type", "currentWindows", "entityID"],
    methods: {
        handleRowClick: function (row) {
            this.$emit("row-click", row.logs);
        },
        percentFormat: function (_, __, cellValue) {
            return (cellValue * 100).toFixed(2) + "%";
        },
        floatFormat: function (_, __, cellValue) {
            return cellValue.toFixed(2);
        },
    },
    computed: {
        entityLabel: function () {
            if (["damage", "treat"].includes(this.type)) {
                return "目标";
            } else {
                return "来源";
            }
        },
        detailsData: function () {
            if (this.mode == "skill") {
                return this.tableDataBySkill;
            } else {
                return this.tableDataByTarget;
            }
        },
        tableDataByTarget: function () {
            let data = window.$store.entityStat[this.type][this.entityID];
            // 只计算给我的时间段
            if (this.currentWindows === null) data = data.all;
            else data = data.windows[this.currentWindows];
            if (!data) return [];

            let result = {};
            //遍历详情 给出结果
            for (let detail of data.details) {
                let target_id; //这个target_id不一定是目标的ID，在承伤/承疗的时候表现为来源ID
                if (["damage", "treat"].includes(this.type)) {
                    target_id = detail.t;
                } else {
                    target_id = detail.c;
                }

                if (!result[target_id]) {
                    result[target_id] = {
                        count: 0, // 伤害次数
                        criticalCount: 0, //会心次数
                        value: 0, //总伤害量
                        min: Number.MAX_VALUE, //最小伤害值
                        max: Number.MIN_VALUE, //最大伤害值
                        logs: [], // 详细伤害日志
                    };
                }
                result[target_id].count++;
                result[target_id].value += detail.v;
                result[target_id].min = Math.min(result[target_id].min, detail.v);
                result[target_id].max = Math.max(result[target_id].max, detail.v);
                result[target_id].logs.push(detail);
                if (detail.C) result[target_id].criticalCount += 1;
            }
            let allValue = data.value;
            for (let r in result) {
                result[r].criticalRate = result[r].criticalCount / result[r].count;
                result[r].valueRate = result[r].value / allValue;
                result[r].avg = result[r].value / result[r].count;
                result[r].target = parseInt(r);
            }
            return Object.freeze(Object.values(result));
        },
        tableDataBySkill: function () {
            let data = window.$store.entityStat[this.type][this.entityID];
            // 只计算给我的时间段
            if (this.currentWindows === null) data = data.all;
            else data = data.windows[this.currentWindows];
            if (!data) return [];

            let result = {};
            //遍历详情 得到计算结果
            for (let detail of data.details) {
                let effect_id = detail.e;
                if (!result[effect_id]) {
                    result[effect_id] = {
                        count: 0, // 伤害次数
                        criticalCount: 0, //会心次数
                        value: 0, //总伤害量
                        min: Number.MAX_VALUE, //最小伤害值
                        max: Number.MIN_VALUE, //最大伤害值
                        logs: [], // 详细伤害日志
                    };
                }
                result[effect_id].count++;
                result[effect_id].value += detail.v;
                result[effect_id].min = Math.min(result[effect_id].min, detail.v);
                result[effect_id].max = Math.max(result[effect_id].max, detail.v);
                result[effect_id].logs.push(detail);
                if (detail.C) result[effect_id].criticalCount += 1;
            }
            let allValue = data.value;
            //计算结果->给表格展示的数据
            for (let r in result) {
                result[r].criticalRate = result[r].criticalCount / result[r].count;
                result[r].valueRate = result[r].value / allValue;
                result[r].avg = result[r].value / result[r].count;
                result[r].skill = r;
            }
            return Object.freeze(Object.values(result));
        },
    },
};
</script>

<style lang="less">
.el-table__row {
    cursor: pointer;
}
</style>
