<template>
    <div class="m-jcl-compare-table">
        <el-table
            ref="table"
            size="mini"
            :border="true"
            :data="data"
            class="u-compare-table"
            :row-class-name="rowClassName"
            @cell-click="handleCellClick"
        >
            <template slot="empty">该单位没有伤害数据</template>
            <el-table-column label="" width="32">
                <template slot-scope="scope">
                    <span v-if="pin.includes(scope.row.skill)">×</span>
                    <span v-else>↑</span>
                </template>
            </el-table-column>
            <el-table-column label="效果">
                <template slot-scope="scope">
                    <jcl-skill :type="scope.row.skill.split(':')[0]" :id="scope.row.skill.split(':')[1]"></jcl-skill>
                </template>
            </el-table-column>
            <el-table-column label="数值" width="170">
                <template slot-scope="scope">
                    <div class="u-stat-value">
                        <div class="u-progress-container">
                            <i class="u-rate" :style="progressStyles(scope.row)"></i>
                        </div>
                        <span class="u-progress-value">{{ scope.row.value }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="次数" width="60" prop="count"> </el-table-column>
            <el-table-column label="会心数" width="60" prop="criticalCount"> </el-table-column>
            <el-table-column label="会心率" width="80" prop="criticalRate" :formatter="percentFormat">
            </el-table-column>
            <el-table-column label="平均值" prop="avg" :formatter="floatFormat"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import JclSkill from "@/components/battle/jcl/common/skill.vue";

import { getEntityColor } from "@/utils/battle/jcl/colors";

export default {
    name: "JclCompareTable",
    components: {
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
        pin: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        handleCellClick(row, column, cell, event) {
            if (column.label === "") {
                this.$emit("row-pin", row);
            } else {
                this.$emit("row-click", row);
            }
        },
        percentFormat: function (_, __, cellValue) {
            return (cellValue * 100).toFixed(2) + "%";
        },
        floatFormat: function (_, __, cellValue) {
            return cellValue.toFixed(2);
        },
        progressStyles: function (item) {
            let style = {
                width: 0,
                "background-color": "",
            };
            if (item.length != -1) style.width = item.length;
            style["background-color"] = getEntityColor(this.entityID);
            return style;
        },
        rowClassName: function ({ row, rowIndex }) {
            if (!row) return;
            const skill = row.skill;
            if (this.pin.includes(skill)) return "u-row-pinned";
        },
    },
    computed: {
        data() {
            const source = window.$store.entityStat[this.mode];
            const entities = window.$store.entities;
            if (!entities[this.entityID]) return [];
            let allValue = source[this.entityID]?.all?.value;
            let details = source[this.entityID]?.all?.details;
            if (!details) return [];
            let result = {};
            //遍历详情 得到计算结果
            for (let detail of details) {
                let effect_id = detail.e;
                if (!result[effect_id]) {
                    result[effect_id] = {
                        count: 0, // 伤害次数
                        criticalCount: 0, //会心次数
                        value: 0, //总伤害量
                        min: Number.MAX_VALUE, //最小伤害值
                        max: Number.MIN_VALUE, //最大伤害值
                        logs: [], // 详细伤害日志
                        skill: effect_id,
                    };
                }
                result[effect_id].count++;
                result[effect_id].value += detail.v;
                result[effect_id].min = Math.min(result[effect_id].min, detail.v);
                result[effect_id].max = Math.max(result[effect_id].max, detail.v);
                result[effect_id].logs.push(detail);
                if (detail.C) result[effect_id].criticalCount += 1;
            }
            result = Object.values(result).sort((a, b) => b.value - a.value);
            let maxValue = result[0].value;
            result = result.sort((a, b) => {
                if (this.pin.includes(a.skill) && !this.pin.includes(b.skill)) return -1;
                if (!this.pin.includes(a.skill) && this.pin.includes(b.skill)) return 1;
                return b.value - a.value;
            });
            //计算结果->给表格展示的数据
            for (let res of result) {
                res.criticalRate = res.criticalCount / res.count;
                res.valueRate = res.value / allValue;
                res.avg = res.value / res.count;
                res.length = (res.value / maxValue) * 100 + "%";
            }
            return Object.freeze(result);
        },
    },
};
</script>

<style lang="less">
.m-jcl-compare-table {
    margin-bottom: 32px;

    .u-button-pin {
        padding: 0;
    }

    .u-stat-value {
        display: flex;
        align-items: center;
    }
    .u-progress-container {
        flex-shrink: 1;
        .h(20px);
        .w(80px);

        .u-rate {
            .db;
            .h(16px);
            .r(16px);
            .mt(2px);
            background-image: url("~@/assets/img/battle/tinymins/process_bg.svg");
            background-repeat: repeat;
            background-position: 0 0;
            background-size: auto 100%;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        }
    }

    .u-progress-value {
        margin-left: 6px;
        vertical-align: top;
    }

    .u-row-pinned {
        background-color: #e6f0fb;
    }
}
</style>
