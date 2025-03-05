<template>
    <el-table
        :data="skills"
        :default-sort="{prop: 'total', order: 'descending'}"
        :stripe="true"
        border
        size="mini"
        :highlight-current-row="true"
        class="m-skills"
    >
        <el-table-column type="index" label="排名" sortable></el-table-column>
        <el-table-column prop="name" label="技能名" sortable v-if="attrs.includes('name')">
            <template slot-scope="scope">
                <a class="u-skill-name" :href="getSkillLink(scope.row)" target="_blank">
                    <img class="u-skill-icon" :src="scope.row.icon | iconLink" />
                    <span>{{scope.row.name || scope.row._name}}</span>
                </a>
            </template>
        </el-table-column>
        <el-table-column prop="_name" label="实际子技能" sortable v-if="attrs.includes('_name')"></el-table-column>
        <el-table-column prop="count" label="技能数" sortable v-if="attrs.includes('count')"></el-table-column>
        <el-table-column prop="min" label="最小值" sortable v-if="attrs.includes('min')"></el-table-column>
        <el-table-column prop="avg" label="平均值" sortable v-if="attrs.includes('avg')"></el-table-column>
        <el-table-column prop="max" label="最大值" sortable v-if="attrs.includes('max')"></el-table-column>
        <el-table-column prop="hit" label="命中" sortable v-if="attrs.includes('hit')"></el-table-column>
        <el-table-column prop="critical" label="会心" sortable v-if="attrs.includes('critical')"></el-table-column>
        <el-table-column prop="miss" label="偏离" sortable v-if="attrs.includes('miss')"></el-table-column>
        <el-table-column prop="insight" label="识破" sortable v-if="attrs.includes('insight')"></el-table-column>
        <el-table-column
            prop="critical_percentage"
            label="会心率"
            sortable
            v-if="attrs.includes('critical_percentage')"
        >
            <template slot-scope="scope">
                <span>{{scope.row.critical_percentage | showPercentage}}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="damage_percentage"
            :label="percentText"
            sortable
            v-if="attrs.includes('damage_percentage')"
        >
            <template slot-scope="scope">
                <span>{{scope.row.damage_percentage | showPercentage}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="total" :label="totalText" sortable v-if="attrs.includes('total_bar')">
            <template slot-scope="scope">
                <i class="u-progress-container">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.total + ''"
                        placement="top-start"
                    >
                        <i
                            class="u-progress"
                            :style="{'width':(scope.row.total / max_skill_damage * 100) + '%'}"
                        >
                            <em>{{scope.row.total}}</em>
                        </i>
                    </el-tooltip>
                </i>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
export default {
    name: "skills",
    props: ["data", "attrs", "total"],
    components: {},
    data: function () {
        return {
        };
    },
    computed: {
        type() {
            return this.$store.state.type;
        },
        max_skill_damage: function () {
            let totalSet = new Set();
            this.skills.forEach((item) => {
                totalSet.add(item.total);
            });
            let maxValue = Math.max(...Array.from(totalSet));
            return maxValue;
        },
        skills: function () {
            let _skills = [];
            this.data.forEach((item, i) => {
                if (item.total) {
                    item.critical_percentage = item.critical / item.count;
                    item.damage_percentage = item.total / this.total;
                    _skills.push(item);
                }
            });
            return _skills;
        },
        percentText: function() {
            switch (this.type) {
                case 'damage':
                    return '伤害占比';
                case 'heal':
                    return '治疗占比';
                case 'beHeal':
                    return '承疗占比';
                default:
                    return '伤害占比';
            }
        },
        totalText: function() {
            switch (this.type) {
                case 'damage':
                    return '伤害总量';
                case 'heal':
                    return '治疗总量';
                case 'beHeal':
                    return '承疗总量';
                default:
                    return '伤害总量';
            }
        }
    },
    methods: {
        getPercentage(a, count) {
            return ((a / count) * 100).toFixed(2) + "%";
        },
        getSkillLink: function (item) {
            if (item.type == 1) {
                return getLink("skill", item.id); //, item.level
            } else {
                return getLink("buff", item.id); //item.level
            }
        }
    },
    filters: {
        iconLink,
        showPercentage: function (val) {
            return (val * 100).toFixed(2) + "%";
        },
    }
};
</script>

<style scoped lang="less">
.m-skills {
    overflow-x: auto;

    .u-skill-icon {
        .size(24px);
        .y;
        .mr(5px);
    }
    .u-skill-name {
        .x(left);
        .db;
        color: @color-link;
        &:hover span {
            box-shadow: 0 1px 0 @color-link;
        }
    }

    .u-progress-container {
        .h(16px);
        .db;
        max-width:120px;
    }
    .u-progress {
        .db;
        .h(100%);
        .r(2px);
        background-color: @color-link;

        .pr;
        em {
            .pa;
            .lt(0);
            color: #fff;
            font-style: normal;
            .fz(12px,16px);
            .none;
        }
    }
}
</style>
