<template>
    <div class="m-entity-list">
        <el-card class="u-filters">
            <p class="u-filters-title">显示过滤器</p>
            <div class="u-filters-item">
                <el-tooltip
                    placement="top"
                    effect="dark"
                    content="一般是玩家召唤的宠物，例如蓬莱的圈、五毒的蛇、衍天的魂灯这种。妹什么可参考的"
                >
                    <el-checkbox v-model="hideSon"> 隐藏有归属的实体 </el-checkbox>
                </el-tooltip>
                <el-checkbox v-model="showBelongID" :disabled="hideSon"> 展示归属ID </el-checkbox>
            </div>
            <div class="u-filters-item">
                <el-checkbox v-model="showNpc"> 显示NPC</el-checkbox>
                <el-checkbox v-model="showPlayer"> 显示玩家</el-checkbox>
                <el-checkbox v-model="foldTemplate"> 折叠同一模板单位</el-checkbox>
                <el-tooltip placement="top" effect="dark" content="一般是用来实现表现的隐藏NPC，例如衍天的魂灯什么的">
                    <el-checkbox v-model="hideNullName"> 隐藏名称为空的实体</el-checkbox>
                </el-tooltip>
            </div>
        </el-card>
        <el-table
            :data="showEntities"
            :default-sort="{ prop: 'firstAppear' }"
            :stripe="true"
            :border="true"
            size="mini"
            :highlight-current-row="true"
            @row-click="rowClick"
        >
            <el-table-column type="index" label="序号" sortable></el-table-column>
            <el-table-column label="单位类型" sortable>
                <template slot-scope="scope">
                    {{ entityTypeFormat(scope.row.type) }}
                </template>
            </el-table-column>
            <el-table-column prop="id" sortable>
                <template slot="header">
                    <el-tooltip
                        effect="dark"
                        content="一个实体在生成的时候会有一个独一无二的ID用于识别"
                        placement="top"
                    >
                        <span>ID</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column sortable>
                <template slot="header">
                    <el-tooltip effect="dark" content="对于NPC，格式为：单位名称#模板ID@出现次序" placement="top">
                        <span>单位</span>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <jcl-entity :id="scope.row.id"></jcl-entity>
                </template>
            </el-table-column>
            <el-table-column prop="firstAppear" label="首次出现时间" :sort-method="timeSort" sortable>
                <template slot-scope="scope">
                    {{ firstAppearFormat(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column v-if="!hideSon" prop="belongID" label="归属">
                <template slot-scope="scope">
                    <jcl-entity v-if="scope.row.belongID" :id="scope.row.belongID"></jcl-entity>
                </template>
            </el-table-column>
            <el-table-column prop="more">
                <template slot="header">
                    <el-tooltip effect="dark" content="包括目标的技能类型与数量，释放顺序与时间等" placement="top">
                        <span>详情</span>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <el-button plain size="mini" icon="el-icon-data-line" @click="view(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";

import JclEntity from "./common/entity.vue";

export default {
    name: "EntityList",
    props: ["info"],
    components: {
        JclEntity,
    },
    data: () => ({
        showFirstAppear: true,
        timeMode: "time",

        showPlayer: true,
        showNpc: true,
        hideNullName: true,
        hideSon: true,

        foldTemplate: true,
        showBelongID: true,
    }),
    computed: {
        showEntities: function () {
            if (!window.$store) return [];
            let result = Object.values(window.$store.entities);
            let templateShowed = {};
            result = result.filter((entity) => {
                if (!this.showNpc && entity.type == "npc") return false;
                if (!this.showPlayer && entity.type == "player") return false;
                if (this.hideNullName && entity.name == "") return false;
                if (this.hideSon && entity.type == "npc" && entity.belongID != 0) return false;
                if (this.foldTemplate && entity.type == "npc") {
                    if (templateShowed[entity.templateID]) return false;
                    templateShowed[entity.templateID] = true;
                }
                return true;
            });
            return result;
        },
    },
    methods: {
        getLink,
        entityTypeFormat: function (type) {
            return { npc: "NPC", player: "玩家", doodad: "交互物品" }[type];
        },
        firstAppearFormat: function (row) {
            if (!row.firstAppear) return null;
            return (row.firstAppear.m / 1000).toFixed(2) + " 秒";
        },
        belongName: function (id) {
            if (!id) return null;
            let entity = window.$store.entities[id];
            if (!entity) return id;
            let name = entity.name;
            if (this.showBelongID) name += `(${id})`;
            return name;
        },
        timeSort: function (a, b) {
            return a.firstAppear[this.timeMode] - b.firstAppear[this.timeMode];
        },
        rowClick: function (row) {
            this.view(row);
        },
        view: function (entity) {
            this.$emit("view", entity);
        },
        initSubject: function () {
            if (this.$store.state.info.subject == "boss") {
                this.showPlayer = false;
            }
            if (this.$store.state.info.subject == "team") {
                this.showNpc = false;
            }
        },
    },
    mounted: function () {
        this.initSubject();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/entity_list.less";
</style>
