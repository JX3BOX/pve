<template>
    <div class="m-entity-single">
        <el-card class="u-filters">
            <p class="u-filters-title">控制台</p>
            <el-button class="u-export" type="primary" @click="exportExcel" size="mini">导出Excel</el-button>
            <div class="u-filters-item">
                <span class="u-filter-item__title">建议过滤: </span>
                <el-checkbox v-model="filters.hideReact"> 隐藏反击事件(主要为吸血) </el-checkbox>
                <el-checkbox v-model="filters.hideNoValue"> 隐藏没有数值的技能效果 </el-checkbox>
            </div>
            <div class="u-filters-item u-filters-time">
                <span class="u-filter-item__title">时间窗口: </span>
                <el-input v-model.lazy="filters.timeRange[0]"></el-input>
                <span>&nbsp;~&nbsp;</span>
                <el-input v-model.lazy="filters.timeRange[1]"></el-input>
                <el-slider v-model="filters.timeRange" range :max="maxTime"> </el-slider>
            </div>
            <div class="u-filters-item">
                <span class="u-filter-item__title">只看单位: </span>
                <el-select v-model="filters.entities" multiple collapse-tags filterable placeholder="请选择单位">
                    <el-option v-for="entity in entities" :key="entity.id" :value="entity.id" :label="entity.name">
                        <jcl-entity :id="entity.id" :click-redirect="false"></jcl-entity>
                    </el-option>
                </el-select>
                <el-checkbox v-model="filters.selectOnlyName"> 仅有名字单位 </el-checkbox>
                <el-checkbox v-model="filters.selectOnlyNoSon"> 仅无归属单位 </el-checkbox>
                <el-checkbox v-model="filters.selectOnlyNoRepeat"> 仅出现一只的单位 </el-checkbox>
                <el-checkbox v-model="filters.onlySource"> 仅显示所选单位为事件来源的事件 </el-checkbox>
            </div>
            <div class="u-filters-item">
                <span class="u-filter-item__title">类型过滤: </span>
                <el-checkbox-group v-model="filters.showTypes">
                    <el-checkbox label="scene">单位出现/消失</el-checkbox>
                    <el-checkbox label="say">系统消息/NPC喊话</el-checkbox>
                    <el-checkbox label="skill">技能生效</el-checkbox>
                    <el-checkbox label="skillCast">技能释放/释放结果</el-checkbox>
                    <el-checkbox label="skillResult">技能命中/偏离/...</el-checkbox>
                    <el-checkbox label="buff">BUFF刷新</el-checkbox>
                    <el-checkbox label="kill">死亡/击杀</el-checkbox>
                    <el-checkbox label="position">单位位置</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="u-filters-item u-filters-search">
                <span class="u-filter-item__title"
                    >内容过滤
                    <el-tooltip content="条件越多应用的时候就会越卡，再次建议excel导出分析" placement="top">
                        <i class="el-icon-info"></i> </el-tooltip
                ></span>
                <el-input v-model="filters.keyword" placeholder="关键词，用空格分隔"></el-input>
                <el-input v-model="filters.hideKeyword" placeholder="过滤词，优先于搜索词，用空格分隔"></el-input>
            </div>
            <div class="u-filters-item">
                <el-button type="primary" @click="applyFilter" size="mini">应用筛选</el-button>
                <el-tooltip content="性能原因，处理大文件时自动应用可能会导致内存占用以及卡顿，非常不建议开启">
                    <el-checkbox v-model="autoApplyFilter">自动应用</el-checkbox>
                </el-tooltip>
                <el-tooltip content="表格显示总有不全，开启调试模式可以输出某一个事件(F12控制台查看)的详细信息(ง •_•)ง">
                    <el-checkbox v-model="debug">调试模式</el-checkbox>
                </el-tooltip>
            </div>
        </el-card>
        <vxe-table
            :data="showRows"
            :border="true"
            size="mini"
            :show-overflow="true"
            :height="tableHeight"
            :scroll-y="{ gt: 100 }"
            resizable
        >
            <vxe-column type="seq" title="#" width="60"></vxe-column>
            <vxe-column title="秒数" width="100">
                <template #default="{ row }">
                    {{ (row.micro / 1000).toFixed(2) }}
                </template>
            </vxe-column>
            <vxe-column title="事件类型" field="LFC" width="120">
                <template #default="{ row }">
                    {{ row.typeDesc }}
                </template>
            </vxe-column>
            <vxe-column title="子类型" width="96">
                <template #default="{ row }">
                    {{ row.subtype }}
                </template>
            </vxe-column>
            <vxe-column title="事件来源">
                <template #default="{ row }">
                    <jcl-entity v-if="row.source.t == 'entity'" :id="row.source.v"></jcl-entity>
                </template>
            </vxe-column>
            <vxe-column title="事件内容">
                <template #default="{ row }">
                    <!-- NPC喊话的内容 -->
                    <el-tooltip v-if="row.content.t == 'str'" placement="top" :content="row.content.v">
                        <span>{{ row.content.v }}</span>
                    </el-tooltip>
                    <!-- BUFF事件,显示BUFF -->
                    <jcl-skill
                        v-else-if="row.content.t"
                        :type="row.content.t"
                        :stack="row.content.n || 1"
                        :id="row.content.v"
                    ></jcl-skill>
                </template>
            </vxe-column>
            <vxe-column title="事件目标">
                <template #default="{ row }">
                    <jcl-entity v-if="row.target.t == 'entity'" :id="row.target.v"></jcl-entity>
                </template>
            </vxe-column>
            <vxe-column title="数值">
                <template #default="{ row }">
                    <!-- 这里是造成伤害时的伤害数值 -->
                    <el-tooltip v-if="showEventValue(row)" placement="top">
                        <div slot="content">
                            <span v-for="(value, type) in row.value" :key="type"> {{ type }}: {{ value }}<br /> </span>
                        </div>
                        <span>{{ Object.values(row.value)[0] }}</span>
                    </el-tooltip>
                </template>
            </vxe-column>
            <vxe-column title="备注">
                <template #default="{ row }">
                    {{ row.remark }}
                </template>
            </vxe-column>
            <vxe-column v-if="debug" title="调试">
                <template #default="{ row }">
                    <el-button @click="consoleLog(row)" size="mini">输出此条</el-button>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>

<script>
import JclSkill from "@/components/battle/jcl/common/skill";
import JclEntity from "@/components/battle/jcl/common/entity";

import { cloneDeep } from "lodash";

export default {
    name: "LogList",
    props: ["info"],
    components: {
        JclSkill,
        JclEntity,
    },
    data: () => ({
        showRows: [],
        debug: false,

        autoApplyFilter: false,
        filters: {
            hideReact: true,
            hideNoValue: false,
            timeRange: [0, 0],
            keyword: "",
            hideKeyword: "",
            entities: [],
            selectOnlyName: true,
            selectOnlyNoSon: true,
            selectOnlyNoRepeat: true,
            onlySource: true,
            showTypes: ["say", "skill", "skillCast", "skillResult", "buff", "kill", "scene"],
        },
    }),
    computed: {
        maxTime() {
            let lastRow = window.$store.rows?.at(-1);
            return lastRow ? Math.ceil(lastRow.micro / 1000) : 0;
        },
        tableHeight() {
            let height = window.innerHeight - 400;
            return height;
        },
        entities() {
            let entities = window?.$store.entities;
            if (!entities) return [];
            let filters = this.filters;
            entities = Object.values(entities).filter((entity) => {
                if (filters.selectOnlyName && !entity.name) return false;
                if (filters.selectOnlyNoSon && entity.belongID) return false;
                if (filters.selectOnlyNoRepeat && entity.appearOrder > 1) return false;
                return true;
            });
            return entities;
        },
    },
    methods: {
        applyFilter() {
            let entityRows = cloneDeep(window.$store.rows);
            let keywords = this.getKeywords();
            let hideKeywords = this.getKeywords("hide");
            let timeRange = [this.filters.timeRange[0] * 1000, this.filters.timeRange[1] * 1000];
            let allowEntities = this.filters.entities;
            let showTypes = this.filters.showTypes;
            const typeMap = {
                say: [14, 15, 18],
                scene: [2, 3, 6, 7, 10, 11],
                buff: [13],
                skill: [21],
                skillCast: [19, 20],
                skillResult: [22, 23, 24, 25, 26],
                kill: [28],
                position: [29],
            };
            entityRows = entityRows.filter((r) => {
                // 妹什么用的东西直接过滤
                if ([4, 8, 10, 11, 12].includes(r.type)) return false;
                // 事件类型过滤
                for (let type in typeMap) {
                    // 如果显示类型里不包含这个类型,并且当前事件处于这个类型，则不显示
                    if (!showTypes.includes(type) && typeMap[type].includes(r.type)) {
                        return false;
                    }
                }
                // 相关单位过滤
                if (allowEntities.length) {
                    if (r.source.t == "entity" || r.target.t == "entity") {
                        // 过滤雨我无瓜的单位
                        if (!allowEntities.includes(r.source.v) && !allowEntities.includes(r.target.v)) {
                            return false;
                        }
                        // 开启了只显示选择单位为来源单位后
                        if (this.filters.onlySource && r.source && r.source.t == "entity") {
                            if (!allowEntities.includes(r.source.v)) return false;
                        }
                    }
                }
                // 时间范围过滤
                if (r.micro < timeRange[0] || r.micro > timeRange[1]) return false;
                // 关键词过滤
                if (hideKeywords && r.content) {
                    for (let keyword of hideKeywords) {
                        if (keyword.type == "str" && r.content.t === "str" && r.content.v.includes(keyword.text))
                            return false;
                        if (keyword.type == "skill" && r.content.t === "skill" && r.content.v.startsWith(keyword.id))
                            return false;
                        if (keyword.type == "buff" && r.content.t === "buff" && r.content.v.startsWith(keyword.id))
                            return false;
                    }
                }
                // 事件内容搜索,逻辑有些复杂Orz
                if (keywords && r.content) {
                    let conform = false;
                    for (let keyword of keywords) {
                        if (conform) return true;
                        if (keyword.type == "str" && r.content.t === "str") {
                            conform = r.content.v.includes(keyword.text);
                        }
                        if (keyword.type == "skill" && r.content.t === "skill")
                            conform = r.content.v.startsWith(keyword.id);
                        if (keyword.type == "buff" && r.content.t === "buff")
                            conform = r.content.v.startsWith(keyword.id);
                    }
                    if (conform) return true;
                    return false;
                }
                // 隐藏反击
                if (this.filters.hideReact && r.type == 21) {
                    if (r.__log.r == 1) return false;
                }
                // 隐藏无数值事件
                if (this.filters.hideNoValue && r.type == 21 && !this.showEventValue(r)) return false;
                return true;
            });
            Object.freeze(entityRows);
            this.showRows = entityRows;
        },
        getKeywords(type) {
            let target = type == "hide" ? this.filters.hideKeyword : this.filters.keyword;
            if (!target) return null;
            let keywords = [];
            let resources = window.$store.resources;
            let ks = target.split(" ");
            for (let k of ks) {
                let includes = Object.keys(resources).filter((r) => resources[r].name.includes(k));
                for (let include of includes) {
                    let type = include.split(":")[0];
                    let id = include.split(":")[1];
                    keywords.push({ type, id });
                }
                keywords.push({ type: "str", text: k });
            }
            return keywords;
        },
        parseContent(str) {
            if (!str || !str.split(":").length < 2)
                return {
                    type: "str",
                    content: str,
                };
            return {
                type: str.split(":")[0],
                content: str.split(":")[1],
            };
        },
        showEventValue(row) {
            if (row.type != 21) return false;
            if (Object.values(row.value).every((x) => !x)) return false;
            return true;
        },
        exportExcel() {
            this.$emit("export");
        },
        consoleLog(row) {
            console.log(JSON.stringify(row, null, 4));
        },
    },
    mounted() {
        this.filters.timeRange = [0, this.maxTime];
        this.applyFilter();
    },
    watch: {
        filters: {
            deep: true,
            handler: function () {
                if (this.autoApplyFilter) this.applyFilter();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/log_list.less";
</style>
