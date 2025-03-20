<template>
    <div class="v-bucket">
        <subheader class="m-upload-header" title="我的云端数据" desc="My Battle Bucket">
            <span class="u-limit">
                <template v-if="isVIP"><i class="el-icon-unlock"></i> 无限制</template>
                <template v-else>
                    免费存储：
                    <b>
                        <strong :class="totalColor">{{ total || 0 }}</strong> / {{ limit }}
                    </b>
                    <a class="u-upgrade" v-if="!isVIP" href="/vip/premium/?from=battle_bucket" target="_blank">
                        <i class="el-icon-shopping-cart-2"></i> 升级会员无限存储
                    </a>
                </template>
            </span>
        </subheader>

        <template v-if="isLogin">
            <!-- 列表 -->
            <div class="m-bucket-list" v-loading="loading">
                <el-input
                    class="u-search"
                    placeholder="请输入搜索内容"
                    v-model.lazy="title"
                    @keyup.enter.native="search"
                >
                    <span slot="prepend">关键词</span>
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
                <el-tabs v-model="type" @tab-click="loadData">
                    <el-tab-pane label="茗伊战斗统计" name="tinymins"></el-tab-pane>
                    <el-tab-pane label="官方战斗统计" name="official"></el-tab-pane>
                </el-tabs>
                <ul class="u-list" v-if="data && data.length">
                    <a
                        class="u-item"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="`/battle/#/combat/${item.id}`"
                        target="_blank"
                    >
                        <div class="u-title">
                            <span class="u-type" :class="item.type"
                                ><img class="u-icon" :src="require(`@/assets/img/battle/common/${item.type}.svg`)" />{{
                                    typeFormat(item.type)
                                }}</span
                            >
                            <span class="u-name"
                                ><i class="u-status" v-if="item.visible != 0">
                                    <img src="@/assets/img/battle/works/draft.svg" /> </i
                                >{{ item.title || "无标题" }}</span
                            >
                        </div>
                        <div class="u-desc">
                            <span class="u-desc-subitem">
                                <i class="el-icon-view"></i>
                                {{ visibleFormat(item.visible) }}
                            </span>
                            <time class="u-desc-subitem">
                                <i class="el-icon-finished"></i>
                                发布 :
                                {{ dateFormat(item.created_at) }}
                            </time>
                            <time class="u-desc-subitem">
                                <i class="el-icon-refresh"></i>
                                更新 :
                                {{ dateFormat(item.updated_at) }}
                            </time>
                        </div>

                        <el-button-group class="u-action">
                            <el-button
                                size="mini"
                                icon="el-icon-edit"
                                title="编辑"
                                @click.prevent.stop="edit(item)"
                            ></el-button>
                            <el-button
                                size="mini"
                                icon="el-icon-delete"
                                title="删除"
                                @click.prevent.stop="del(item)"
                            ></el-button>
                        </el-button-group>
                    </a>
                </ul>

                <el-alert
                    v-else
                    class="u-null"
                    title="您暂时没有云端数据，如需将数据云端保存请在分析结果界面右上角点击【云端保存】或通过【魔盒助手】上传！"
                    type="info"
                    show-icon
                ></el-alert>

                <!-- 分页 -->
                <el-pagination
                    class="m-bucket-pages"
                    background
                    layout="total, prev, pager, next,jumper"
                    :hide-on-single-page="true"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                    @current-change="loadData"
                ></el-pagination>
            </div>
        </template>
        <template v-else>
            <div class="m-bucket-list">
                <el-alert class="u-login" title="您还未登录，请先登录！" type="info" show-icon></el-alert>
            </div>
        </template>

        <EditLogs v-model="editing" :data="editingData" @update="loadData" />
    </div>
</template>

<script>
import subheader from "@/components/battle/subheader.vue";
import EditLogs from "@/components/battle/common/edit_logs.vue";

import { __postType, __visibleMap } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import { getMyList, deleteBattle, updateBattle } from "@/service/battle/team";

export default {
    name: "BattleBucket",
    components: {
        subheader,
        EditLogs,
    },
    props: [],
    data: function () {
        return {
            isVIP: false,

            total: 0,
            limit: 20,
            type: "tinymins",

            per: 20,
            page: 1,
            data: null,
            title: "",

            loading: false,

            editing: false,
            editLoading: false,
            editingData: {},

            isLogin: User.isLogin(),
        };
    },
    computed: {
        totalColor: function () {
            if (this.total < this.limit * 0.5) {
                return "isSafe";
            } else if (this.total < this.limit * 0.75) {
                return "isWarning";
            } else {
                return "isDanger";
            }
        },
        params: function () {
            return {
                pageIndex: this.page,
                pageSize: this.per,
                title: this.title,
                type: this.type,
            };
        },
    },
    methods: {
        view: function (item) {
            this.$store.commit("SET_CURRENT", item);
            this.$router.push({
                name: "combat",
                params: { id: item.id },
            });
        },
        dateFormat: function (val) {
            return val.split(" ")[0];
        },
        visibleFormat: function (val) {
            return __visibleMap[~~val];
        },
        typeFormat: function (val = jcl) {
            const typeMap = {
                official: "官方统计",
                tinymins: "战斗统计",
                jcl: "战斗日志",
            };
            return typeMap[val] || "战斗统计";
        },
        typeIcon: function (val) {
            return this.typeMap?.[val]?.["icon"] || "el-icon-printer";
        },
        edit: function (item) {
            this.editingData = item;
            this.editing = true;
        },
        del: function (item) {
            this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return deleteBattle(item.id);
                })
                .then((res) => {
                    if (res.data.code !== 0) {
                        this.$message.error(res.data);
                        return;
                    }
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    this.loadData();
                })
                .catch(() => {});
        },
        loadData: function () {
            this.loading = true;
            getMyList(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        search: function () {
            this.loadData();
        },
    },
    mounted: function () {
        if (this.isLogin) {
            User.isVIP().then((data) => {
                this.isVIP = data;
            });
            this.loadData();
            this.$store.commit("RESET");
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/mine.less";
</style>
