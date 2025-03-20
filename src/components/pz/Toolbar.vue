<template>
    <div class="m-pz-toolbar">
        <div class="u-qk">
            <el-button
                plain
                class="u-back"
                icon="el-icon-arrow-left"
                size="small"
                @click="goBack"
            >返回</el-button>
            <h1 class="u-name" v-if="isEditPage">
                <i
                    class="u-client i-client"
                    :class="schema_client || 'std'"
                >{{schema_client == 'origin' ? '缘起' : '重制'}}</i>
                <i
                    class="u-level i-client"
                    :class="schema_client || 'std'"
                >Lv.{{ schema.global_level || SETTINGS[schema_client+'_global_level'] }}</i>
                <a class="u-title" :href="'/pz/view/' + id" target="_blank">
                    <i class="el-icon-link"></i>
                    <span >{{ schema.title }}</span>
                </a>
            </h1>
        </div>
        <div class="u-misc" :class="{isEditMode:isEditMode}">
            <template v-if="isEditMode">
                <el-button
                    class="u-save"
                    icon="el-icon-check"
                    size="small"
                    type="primary"
                    @click="submit()"
                >保存</el-button>
                <el-button
                    class="u-save"
                    icon="el-icon-document-checked"
                    size="small"
                    @click="save"
                >另存为</el-button>
                <el-button
                    class="u-save"
                    plain
                    size="small"
                    icon="el-icon-printer"
                    @click="exportPz"
                >导出</el-button>
            </template>
            <template v-else>
                <el-button
                    v-if="isAuthor"
                    class="u-edit"
                    icon="el-icon-edit-outline"
                    size="small"
                    type="primary"
                    @click="goEdit"
                >编辑</el-button>
                <el-tooltip class="item" effect="dark" content="基于此方案快速生成一份属于自己的副本" placement="top">
                    <el-button
                        type="primary"
                        plain
                        class="u-copy"
                        icon="el-icon-document-copy"
                        size="small"
                        @click="copy"
                    >复制方案</el-button>
                </el-tooltip>
            </template>
        </div>

        <el-dialog
            class="m-pz-export-window"
            title="导出"
            :visible.sync="canvas_visible"
            width="1360px"
            center
            :modal-append-to-body="true"
            :append-to-body="true"
            top="8vh"
        >
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="横版图" name="horizontal"></el-tab-pane>
                <el-tab-pane label="竖版图" name="vertical"></el-tab-pane>
                <el-tab-pane label="数据版" name="pzCode"></el-tab-pane>
                <el-tab-pane label="嵌入版" name="pzIframe"></el-tab-pane>
            </el-tabs>
            <div class="m-pz-canvas">
                <component :is="activeName" :key="schema.id"></component>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="canvas_visible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { updatePz, addPz, selfRecommend } from "@/service/pz/schema.js";
import { mapGetters } from "vuex";
import SETTINGS from "@/pages/pz/setting.json";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";

// components
import OverviewHorizontal from "./overviewcludes/OverviewHorizontal.vue";
import OverviewVertical from "./overviewcludes/OverviewVertical.vue";
import OverviewCode from "./overviewcludes/OverviewCode.vue";
import OverviewIframe from "./overviewcludes/OverviewIframe.vue";

import hash from 'object-hash'
import autoTag from '@/utils/pz/autoTag'
export default {
    name: "ToolBar",
    props: [],
    data() {
        return {
            timer: null,

            // 总览
            canvas_visible: false,
            activeName: window.innerWidth < 1280 ? "vertical" : "horizontal",

            SETTINGS,

            hasManualSaved: false, // 是否进行过人工保存
        };
    },
    computed: {
        ...mapGetters(["schema", "schema_client", "attrs", "mount"]),
        id: function () {
            return this.$route.params.id;
        },
        author_id: function () {
            return this.data?.user_id || 0;
        },
        isAuthor: function () {
            return User.getInfo().uid == this.data?.user_id;
        },
        isEditMode: function () {
            return this.$route.name == "edit" && this.isAuthor;
        },
        isEditPage: function () {
            return this.$route.name == "edit";
        },
        data: function () {
            return this.$store.state.schema;
        },
        content: function () {
            return this.$store.state.content;
        },
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        overview: function () {
            return this.$store.state.schema?.overview;
        },
        setting: function () {
            return this.$store.state.setting;
        },
        score: function () {
            return this.$store.state.schema_score;
        },
        isTertiary: function () {
            return this.$store.state.isTertiary;
        },
    },
    methods: {
        displayAttr: function (key, value) {
            /* if (key.includes("Percent") || key.includes("Rate")) {
                return (value && Number((value * 100).toFixed(2))) || value;
            } */
            return value;
        },
        goEdit: function () {
            this.$router.push(
                { name: "edit" },
                {
                    params: {
                        id: this.id,
                    },
                }
            );
        },
        goBackToList: function (path = '/mine'){
            if (window.history.length > 1) {
                this.$router.push(path);
            } else {
                this.$router.push(path);
            }
            this.$store.commit("SET_STATE", { key: "activeEquip", value: "" });
        },
        goBack: function () {
            if (this.$route.name == "edit") {

                let hasChange =  this.compareHash()

                if (this.isAuthor && hasChange && !this.hasManualSaved) {
                    this.$confirm('是否保存当前修改?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await this.submit()
                    }).finally(() => {
                        this.goBackToList()
                    })
                } else {
                    this.goBackToList()
                }
            } else if (this.$route.name == "view") {
                this.goBackToList('/public')
            }
        },
        compareHash : function (){
            let current_hash = hash(JSON.parse(JSON.stringify(this.data)))
            return current_hash !== sessionStorage.getItem(`schema_hash_${this.id}`)
        },
        submit: function (mute = false) {
            let tags = []
            if (!this.data?.tags?.length) {
                tags = autoTag(this.snapshot);
                this.data.tags = tags
            }
            return updatePz(this.id, {
                ...this.data,
                snapshot: this.snapshot,
                content: this.content,
                overview: this.overview,
                talent_id: this.$store.state.schema.talent_id || null,
                talent_code: this.$store.state.schema.talent_code || null,
                talent_pzcode: this.$store.state.schema.talent_pzcode || null,
                global_level: this.schema?.global_level || SETTINGS.global_level,
                data: this.attrs,
                weapon_mode: this.isTertiary ? 0 : 1, // 0表示重剑，1表示轻剑
            }).then(() => {
                if (!mute) {
                    const msg = "方案保存成功";
                    this.$notify({
                        title: "成功",
                        message: msg,
                        type: "success",
                    });
                }
                this.hasManualSaved = true

                // 是否自荐
                if (this.$store.state.isRecommend && !this.data.star) {
                    selfRecommend(this.id)
                }
            });
        },
        save: function () {
            this.$prompt("请输入方案名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: `拷贝-${this.data.title}`,
                inputValidator: (value) => {
                    if (!value) return "方案名称不能为空";
                },
                inputErrorMessage: "方案名称不能为空",
            }).then(({ value }) => {
                addPz({ ...this.data, title: value, status: 1 }).then((res) => {
                    this.$notify({
                        title: "成功",
                        message: "方案副本创建成功",
                        type: "success",
                    });
                });
            }).catch(() => {});
        },
        copy: function () {
            addPz({ ...this.data, title: this.data.title + "-拷贝", fork_id: this.data?.id, status: 1 }).then(
                (res) => {
                    this.$notify({
                        title: "成功",
                        message: "方案拷贝成功",
                        type: "success",
                    });

                    setTimeout(() => {
                        this.$router.push("/edit/" + res.data.data.id);
                    }, 1000);
                }
            );
        },
        triggerAutosave: function () {
            if (this.isEditMode && this.setting?.autosave) {
                this.timer = setInterval(() => {
                    this.submit(true);
                }, SETTINGS.auto_save_interval);
            }
        },
        exportPz: function () {
            this.submit(true)
            this.canvas_visible = true;
        },
        // 获取副本map_list
        loadMapList: function (){
            try {
                const map_list = sessionStorage.getItem(`jb_map_list`);
                if (map_list) {
                    this.$store.commit('SET_STATE', {key: 'map_list', value: JSON.parse(map_list)})
                } else {
                    fetch(`${__dataPath}/map/data/map_index.json`).then(res => {
                        return res.json()
                    }).then(res => {
                        this.$store.commit('SET_STATE', {key: 'map_list', value: res})
                        sessionStorage.setItem(`jb_map_list`, JSON.stringify(res))
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
    mounted: function () {
        this.triggerAutosave();

        this.loadMapList();
    },
    components: {
        horizontal: OverviewHorizontal,
        vertical: OverviewVertical,
        pzCode: OverviewCode,
        pzIframe: OverviewIframe,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/toolbar.less";
</style>
