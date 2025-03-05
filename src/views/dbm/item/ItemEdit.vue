<template>
    <div class="v-std v-additem" v-loading="loading">
        <!-- 页面头 -->
        <div class="m-header">
            <h1 class="u-title">{{ isEditMode ? '构建' : '创建'}}元数据</h1>
            <p class="u-desc">
                {{ isEditMode ? '编辑' : '创建'}}元数据，可以创建未捕获但预知的数据，点击查看<a href="/tool/17401" target="_blank"
                    >「帮助文档」</a
                >。
            </p>
            <div class="u-ops">
                <el-button class="u-reset" plain icon="el-icon-delete" size="small" type="warning" @click="reset">
                    清空重置
                </el-button>
                <el-button class="u-code" plain icon="el-icon-document" size="small" type="primary" @click="openCode">
                    代码编辑
                </el-button>
            </div>
        </div>
        <!-- 表单部分 -->
        <div class="m-content">
            <el-form ref="form" :model="item.payload" label-width="120px" :label-position="layout">
                <el-form-item label="元数据标题" prop="title">
                    <span slot="label"
                        ><span class="u-client i-client" :class="'i-client-' + client">{{
                            clients[client]
                        }}</span
                        >标题</span
                    >
                    <el-input
                        v-model="item.title"
                        placeholder="必填"
                        :maxlength="50"
                        show-word-limit
                        class="u-title"
                    ></el-input>
                </el-form-item>
                <el-form-item label="公开" prop="status">
                    <el-switch v-model="item.status" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                <!-- 类型 -->
                <item-type></item-type>
                <!-- 基本信息 -->
                <item-basic ref="basicForm"></item-basic>
                <!-- 限制条件 -->
                <item-limit v-if="hasLimitForm"></item-limit>
                <!-- 报警设置 -->
                <item-warning></item-warning>
                <!-- 计时设置 -->
                <item-countdown :data="item.payload.tCountdown" :type="item.type" :icon="item.payload.nIcon">
                </item-countdown>
                <!-- 其它设置 -->
                <fold-block name="other" desc="其它设置" icon="el-icon-collection-tag" :fold="false">
                    <el-form-item label="茗伊团队面板" prop="aCataclysmBuff" v-if="hasProp('aCataclysmBuff')">
                        <span slot="label">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" class="u-tips">
                                    仅茗伊团队面板生效，官方面板不生效。<br />
                                    相同的定义会覆盖上方数值。
                                </div>
                                <div>
                                    茗伊团队面板
                                    <i class="el-icon-info"></i>
                                </div>
                            </el-tooltip>
                        </span>
                        <item-panel v-model="item.payload.aCataclysmBuff"></item-panel>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="szNote">
                        <el-input
                            v-model="item.payload.szNote"
                            placeholder="选填"
                            :maxlength="20"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </fold-block>
            </el-form>
        </div>
        <!-- 代码编辑 -->
        <el-dialog :visible.sync="codeVisible" width="60%" :lock-scroll="false" center>
            <div class="m-code-dialog-title" slot="title">
                <span>代码编辑器</span>
            </div>
            <el-input type="textarea" :rows="20" placeholder="请输入元数据的Lua代码" v-model="codeInput" resize="none">
            </el-input>
            <span slot="footer">
                <el-button @click="codeVisible = false">取 消</el-button>
                <el-button type="primary" @click="applyCode">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 发布按钮 -->
        <div class="m-publish">
            <el-divider class="u-tip" v-if="!isLogin"
                ><i class="el-icon-user"></i> 请先<a :href="loginURL">登录</a></el-divider
            >
            <el-button
                class="u-btn"
                type="primary"
                icon="el-icon-s-promotion"
                @click="contribute"
                :disabled="!isLogin"
                ><span class="u-txt">发布</span></el-button
            >
            <!-- <el-button class="u-btn" type="primary" icon="el-icon-lock" @click="contribute" :disabled="!isLogin">
                <span class="u-txt">私有发布</span></el-button
            > -->
        </div>
    </div>
</template>

<script>
import _ from "lodash";

import User from "@jx3box/jx3box-common/js/user.js";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";

import { updateItem, createItem, getItem, getRawItem } from "@/service/dbm/item";
import { itemHasProp, toPostItem, extendItem, parseLuaTable } from "@/utils/dbm/item.js";
import { getLoginUrl } from "@/utils/dbm/common";
import types from "@/assets/data/dbm/types.json";

import FoldBlock from "@/components/dbm/common/fold_block.vue";

import ItemType from "@/components/dbm/item/form/item_type.vue";
import ItemBasic from "@/components/dbm/item/form/item_basic.vue";
import ItemLimit from "@/components/dbm/item/form/item_limit.vue";
import ItemWarning from "@/components/dbm/item/form/item_warning.vue";
import ItemCountdown from "@/components/dbm/item/form/item_countdown.vue";
import ItemPanel from "@/components/dbm/item/form/item_panel.vue";
import { toLuaTable } from "@/utils/dbm/item.js";
import { mapState } from "vuex";

export default {
    name: "ItemEdit",
    props: [],
    data: function () {
        return {
            // 字段与验证
            overview: "",
            codeVisible: false,
            //codeOnlyItem: true, // 是否只显示该数据的代码
            codeInput: "",

            // 权限
            isLogin: User.isLogin(),
            loginURL: getLoginUrl(),
            isVIP: User.getInfo().group > 30,
            isSuper: User.getInfo().group > 60,
            loading: false,
            layout: window.innerWidth < 1024 ? "top" : "left",

            // 其它
            clients: __clients,
        };
    },
    computed: {
        ...mapState({
            item: "item",
            resource: "resource",
            client: "client",
        }),
        client(){
            return this.$store.state.client
        },
        type: function () {
            return this.item.type;
        },

        hasLimitForm: function () {
            return !["TALK", "CHAT"].includes(this.item.type);
        },
        // 编辑状态
        item_id: function () {
            return this.$route.params.id;
        },
        isEditMode: function () {
            return this.$route.name == "item_edit" && this.item_id;
        },
    },
    methods: {
        // 字段关联显隐控制
        hasProp: function (prop) {
            return itemHasProp(this.item.type, prop);
        },

        // 按钮
        reset: function () {
            this.$store.commit("RESET_ITEM");
        },
        contribute() {
            // 标题是否为空
            if (!this.item.title) {
                this.$alert("标题为必填字段", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }
            // ID校验
            if (this.hasProp("dwID") && (!this.item.payload.dwID || isNaN(this.item.payload.dwID != 0))) {
                this.$alert("ID为必填字段且必须为数字", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }
            // 提交数据
            if (this.isEditMode) {
                updateItem(this.item.id, toPostItem(this.item, this.resource, this.client)).then((res) => {
                    const { code, msg, data } = res.data;
                    if (code != 0) {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                        return;
                    }
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                    this.$router.push({
                        name: "item_detail_raw",
                        params: {
                            id: this.item_id,
                        },
                    });
                });
            } else {
                createItem(toPostItem(this.item, this.resource, this.client)).then((res) => {
                    const { code, msg, data } = res.data;
                    if (code != 0) {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                        return;
                    }
                    this.$message({
                        message: "提交成功",
                        type: "success",
                    });
                    this.$router.push({
                        name: "item_detail_raw",
                        params: {
                            id: data.id,
                        },
                    });
                });
            }
        },
        load: function () {
            this.loading = true;
            getRawItem(this.item_id)
                .then((res) => {
                    let data = res.data.data;
                    // 是否存在
                    if (!data) {
                        this.$message({
                            message: "未找到匹配数据项",
                            type: "error",
                        });
                        return;
                    }
                    this.$store.state.item = extendItem(data);
                    this.$refs["basicForm"].getResource();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 代码输入
        openCode: function () {
            this.codeVisible = true;
            this.codeInput = toLuaTable(this.item);
        },
        applyCode: function () {
            const code = this.codeInput;
            try {
                const item = parseLuaTable(code, this.item);
                this.$store.state.item = item;
                this.codeVisible = false;
                this.$refs["basicForm"].getResource();
            } catch (e) {
                console.error(e);
                this.$message({
                    message: "代码解析失败, 请打开F12查看错误信息",
                    type: "error",
                });
            }
        },

        // 初始化
        initQuery() {
            const { type, id, level, title } = this.$route.query;
            if (type && types.types[type]) this.item.type = type;
            if (title) this.item.title = title;
            if (id) {
                this.item.payload.dwID = id;
                this.item.payload.nLevel = level;
                this.$refs["basicForm"].getResource();
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.initQuery();
        });
    },
    watch: {
        "$route.params.id": {
            immediate: true,
            handler: function () {
                this.reset();
                if (this.isEditMode) this.load();
            },
        },
    },
    components: {
        ItemType,
        ItemBasic,
        ItemLimit,
        ItemWarning,
        ItemCountdown,
        ItemPanel,
        FoldBlock,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_edit.less";
</style>
