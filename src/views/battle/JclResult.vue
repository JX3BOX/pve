<template>
    <div class="p-jcl-boss">
        <subheader class="m-upload-header" title="日志分析" desc="Battle Statistical Analysis">
            <el-button class="u-back" plain size="small" @click="back" icon="el-icon-arrow-left"> 后退 </el-button>
            <el-button class="u-save" type="success" size="small" @click="save" v-if="allowAdd">
                <img class="i-btn-save" svg-inline src="@/assets/img/battle/save.svg" />云端保存
            </el-button>
        </subheader>
        <div class="m-boss-header">
            <h1 class="m-battle-title">{{ current.title }}</h1>
            <div class="m-battle-desc" v-if="current.desc">{{ current.desc }}</div>
            <div class="m-tags">
                <a :href="tagLink(item)" v-for="item in tags" :key="item.name" target="_blank">
                    <el-tag class="u-tag" type="success">
                        {{ item.name }}
                    </el-tag>
                </a>
            </div>
            <el-alert
                class="u-alert"
                v-if="isChecked"
                show-icon
                type="success"
                title="当前数据已通过基准校验，数据准确可靠性99.99%"
            />
            <el-tabs v-model="tab" type="card" editable @tab-click="shiftTab" @edit="handleTabsEdit">
                <el-tab-pane label="全局总览" name="overview" :closable="false"></el-tab-pane>
                <el-tab-pane label="单位详情" name="entities" :closable="false"></el-tab-pane>
                <el-tab-pane
                    :key="item.name"
                    v-for="item in editableTabs"
                    :label="item.name"
                    :name="item.name"
                ></el-tab-pane>
                <el-tab-pane label="单位对比" name="compare" :closable="false"></el-tab-pane>
                <el-tab-pane label="全部记录" name="logs" :closable="false"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- 缓存失活组件，内存占用++ -->
        <keep-alive>
            <component :is="component" :info="info" :entityID="currentEntity" @view="view" @export="handleExport">
            </component>
        </keep-alive>
        <jcl-export ref="export"></jcl-export>
    </div>
</template>

<script>
import subheader from "@/components/battle/subheader.vue";
import JclExport from "@/components/battle/jcl/export.vue";

import EntityList from "@/components/battle/jcl/entity_list.vue";
import LogList from "@/components/battle/jcl/log_list.vue";
import JclOverview from "@/components/battle/jcl/overview.vue";
import JclCompare from "@/components/battle/jcl/compare.vue";
import EntityDetails from "@/components/battle/jcl/entity_details.vue";

// mixins
import tagsMixin from "@/mixin/battle/tags.js";

export default {
    name: "JclResult",
    props: {
        allowAdd: {
            type: Boolean,
            default: false,
        },
    },
    mixins: [tagsMixin],
    components: {
        subheader,
        EntityList,
        LogList,
        JclOverview,
        EntityDetails,
        JclExport,
        JclCompare,
    },
    data: function () {
        return {
            tab: "overview",
            components: {
                entities: EntityList,
                logs: LogList,
                overview: JclOverview,
                detail: EntityDetails,
                compare: JclCompare,
            },
            currentEntity: "",
            mode: "overview",
            editableTabs: [],
            ranks: [],
            residentTabs: ["entities", "logs", "overview", "compare"],

            exportNoticed: false,
        };
    },
    computed: {
        isChecked: function () {
            return this.$store.state.current?.is_checked;
        },
        component: function () {
            return this.components[this.mode];
        },
        info: function () {
            return this.$store.state.info;
        },
    },
    methods: {
        save() {
            this.$emit("save");
        },
        back() {
            if (this.mode == "overview") {
                this.$store.commit("RESET");
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
            } else {
                this.tab = this.mode = "overview";
            }
        },
        view(entity) {
            let tabName = `${entity.name ?? ""}#${entity.id}`;
            let exist = this.editableTabs.find((tab) => tab.name == tabName);
            if (!exist) {
                exist = { name: tabName };
                this.editableTabs.push(exist);
            }
            this.shiftTab(exist);
        },
        shiftTab(tab) {
            if (tab.name == "logs") {
                if (!this.exportNoticed) {
                    this.$confirm(
                        "分析过大的JCL文件时在网页查看事件列表会占用大量内存可能导致页面崩溃并且存在渲染卡顿等问题，建议直接导出excel文件进行分析",
                        "提示",
                        {
                            distinguishCancelAndClose: true,
                            confirmButtonText: "导出excel",
                            cancelButtonText: "我不,我偏要网页看",
                            type: "warning",
                        }
                    )
                        .then(() => {
                            this.$refs.export.open();
                            this.tab = this.mode = "overview";
                        })
                        .catch((action) => {
                            if (action == "cancel") {
                                this.exportNoticed = true;
                                this.tab = this.mode = "logs";
                                this.currentEntity = "";
                            } else {
                                this.tab = this.mode = "overview";
                            }
                        });
                } else {
                    this.tab = this.mode = "logs";
                    this.currentEntity = "";
                }
            } else if (this.residentTabs.includes(tab.name)) {
                //常驻直接跳，要清掉currentEntity
                this.tab = this.mode = tab.name;
                this.currentEntity = "";
            } else {
                this.tab = tab.name;
                this.mode = "detail";
                let entityID = tab.name.split("#")[1];
                this.currentEntity = entityID;
            }
        },
        handleTabsEdit(tabName) {
            this.editableTabs = this.editableTabs.filter((tab) => tab.name !== tabName);
            this.tab = this.mode = "entities";
        },
        handleExport() {
            this.$refs.export.open();
        },
        // url带查询参数的时候，自动切换
        initQuery() {
            let query = this.$route.query;
            if (query.subject) {
                this.$store.commit(
                    "SET_INFO",
                    Object.assign({}, this.$store.state.info, {
                        subject: query.subject,
                    })
                );
            }
            if (query.entity) {
                const id = query.entity;
                const entity = window.$store.entities[id];
                if (entity) {
                    this.view(entity);
                }
            } else if (query.tab) {
                this.tab = this.mode = query.tab;
            }
        },
    },
    created: function () {
        this.initQuery();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl.less";
</style>
