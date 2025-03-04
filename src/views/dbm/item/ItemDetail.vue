<template>
    <div class="v-detail" v-loading="loading">
        <div class="m-detail-wrapper" v-if="loaded">
            <div class="m-detail">
                <div class="m-detail-header">
                    <i class="u-icon"><img class="u-icon-pic" :src="showIcon(item)" /></i>
                    <span class="u-name">{{ showName(item) }}</span>
                    <span class="u-status" v-if="item.status"> <i class="el-icon-lock"></i> 私有 </span>
                    <div class="u-op">
                        <el-button plain class="u-back" icon="el-icon-caret-left" size="mini" @click="goBack">
                            后退
                        </el-button>
                        <el-button
                            class="u-edit"
                            type="warning"
                            icon="el-icon-edit-outline"
                            size="mini"
                            @click="editItem"
                            v-if="isAuthor"
                            >编辑</el-button
                        >
                        <el-button
                            class="u-delete"
                            type="info"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteItem"
                            v-if="isAuthor"
                            >删除</el-button
                        >
                    </div>
                </div>
                <div class="m-detail-meta">
                    <span class="u-meta u-type u-id">
                        <i class="u-type-label">元数据ID</i>
                        <i class="u-type-value" @click="copy">
                            {{ item.uuid }}
                            <i class="el-icon-document-copy u-copy"></i>
                        </i>
                    </span>
                    <span class="u-meta u-type">
                        <i class="u-type-label">{{ types[type] }}</i>
                        <i class="u-type-value" :class="'i-type-' + type">
                            {{ type }}
                        </i>
                    </span>
                    <span class="u-meta" v-if="isDBType">
                        <span class="u-label">原始ID</span>
                        <span class="u-value">
                            <b>{{ item.payload.dwID }}</b>
                        </span>
                    </span>
                    <span class="u-meta" v-if="isDBType && item.payload.nLevel">
                        <span class="u-label">等级</span>
                        <span class="u-value">
                            <b>{{ item.payload.nLevel }}</b>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">地图</span>
                        <span class="u-value">
                            <b>{{ showMap || "全部" }}</b>
                        </span>
                    </span>
                </div>
                <div class="m-detail-meta">
                    <span class="u-meta" v-if="item.author_user_info">
                        <span class="u-label">作者</span>
                        <span class="u-value">
                            <a :href="authorLink(item.user_id)" target="_blank">
                                <i class="el-icon-link"></i>
                                {{ item.author_user_info.display_name || "佚名" }}
                            </a>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">创建日期</span>
                        <span class="u-value">{{ showDate(new Date(item.created_at)) }}</span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">最后更新</span>
                        <span class="u-value">{{ showRecently(item.updated_at) }}</span>
                    </span>
                    <span class="u-meta" v-if="item.origin">
                        <span class="u-label">引用</span>
                        <span class="u-value">
                            <router-link :to="{ name: 'item_detail', params: { id: item.origin } }" target="_blank">
                                <i class="el-icon-link"></i> 查看引用源
                            </router-link>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">派生</span>
                        <el-tooltip effect="dark" placement="top">
                            <span slot="content">共有{{ item.forks }}条数据项派生自此条目</span>
                            <span class="u-value"
                                >共 <strong>{{ item.forks }}</strong> 条</span
                            >
                        </el-tooltip>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">录用</span>
                        <el-tooltip effect="dark" placement="top">
                            <span slot="content">共有{{ item.refcount }}份数据使用过此条目</span>
                            <span class="u-value"
                                >共 <strong>{{ item.refcount }}</strong> 份</span
                            >
                        </el-tooltip>
                    </span>
                </div>
                <div class="m-detail-note" v-if="item.szNote">
                    <div class="u-note">备注：{{ item.szNote }}</div>
                </div>
                <div class="m-detail-info" v-if="resource && isDBType">
                    <div class="u-info" v-if="resource && isDBType">
                        <a :href="databaseUrl" class="u-resource-link" target="_blank">
                            <i class="el-icon-link"></i> 数据库源信息
                        </a>
                        <div>
                            {{ resource.Desc || resource.Remark || resource.MapName || "无详细描述" }}
                        </div>
                        <div class="u-mismatch-error" v-if="mismatch">
                            此数据项的类型与源数据（BUFF类型）不匹配，游戏内监控可能会失效！
                        </div>
                    </div>
                    <div class="u-info" v-if="item.szContent && !isDBType">
                        {{ item.szContent || "无" }}
                    </div>
                </div>
                <item-detail-primary :item="item"></item-detail-primary>
                <item-lua :item="item"></item-lua>
            </div>
            <div class="m-detail-op" v-if="isLogin">
                <el-tooltip class="item" effect="dark" content="克隆该数据项" placement="top">
                    <el-button class="u-fork" type="primary" icon="el-icon-share" @click="forkItem">克隆项</el-button>
                </el-tooltip>

                <pkg-append-item :item-id="id" btnText="加入包"></pkg-append-item>
            </div>
            <item-related v-if="item.forks" :id="id"></item-related>
            <div class="m-comment">
                <el-divider content-position="left"> <i class="el-icon-chat-line-round"></i> 讨论 </el-divider>
                <Comment :id="id" category="dbm_item" />
            </div>
        </div>
        <div class="m-detail-null" v-else>
            <el-alert title="无效请求" type="info" description="数据不存在或没有查看权限" show-icon :closable="false">
            </el-alert>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { authorLink, iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import { showRecently, showDate } from "@/utils/dbm/dateFormat";
import { extendItem } from "@/utils/dbm/item.js";
import acl from "@jx3box/jx3box-common/data/acl_v1.json";

import { types } from "@/assets/data/dbm/types.json";
import { showName, showIcon } from "@/utils/dbm/item.js";

import ItemDetailPrimary from "@/components/dbm/item/item_detail_primary.vue";
import ItemRelated from "@/components/dbm/item/item_related.vue";
import ItemLua from "@/components/dbm/item/item_lua.vue";
import PkgAppendItem from "@/components/dbm/pkg/pkg_append_item.vue";

import { postStat } from "@jx3box/jx3box-common/js/stat";

import { mapState } from "vuex";
import { getItem, deleteItem, forkItem, updateItem, getRawItem } from "@/service/dbm/item";
import { getResource } from "@/service/dbm/node.js";
import typeDatabaseMap from "@/assets/data/dbm/type_database_map.json";

export default {
    name: "ItemDetail",
    props: [],
    data: function () {
        return {
            types,
            children: 0,

            loading: false,

            UID: User.getInfo().uid,
            isLogin: User.isLogin(),
        };
    },
    computed: {
        ...mapState({
            item: (state) => state.item,
            resource: (state) => state.resource,
            client: (state) => state.client,
            mapIndex: (state) => state.mapIndex,
        }),
        id: function () {
            return this.$route.params.id;
        },
        type: function () {
            return this.item.type;
        },
        isDBType: function () {
            return !["TALK", "CHAT"].includes(this.type);
        },
        databaseType() {
            return typeDatabaseMap[this.item.type];
        },
        databaseUrl() {
            if (typeDatabaseMap[this.item.type])
                return getLink(this.databaseType, this.item.payload.dwID, this.item.payload.nLevel);
            return "";
        },
        showMap: function () {
            const maps = this.item.map || [];
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
        loaded: function () {
            return this.item && this.item.id;
        },
        isAuthor: function () {
            return this.item.user_id == this.UID;
        },
        isAdmin: function () {
            return User.getInfo().group >= acl.Admin;
        },
        refCount: function () {
            return this.item.refcount || 0;
        },
        isMine: function () {
            return this.$route.name == "item_detail_raw";
        },
        mismatch: function () {
            if (!["BUFF", "DEBUFF"].includes(this.type)) return false;
            return (
                (this.resource.CanCancel == 1 && this.type === "DEBUFF") ||
                (this.resource.CanCancel == 0 && this.type === "BUFF")
            );
        },
    },
    methods: {
        showRecently,
        showDate,
        authorLink,
        showName,
        showIcon,
        loadItem: function () {
            if (!this.id) return;
            this.loading = true;
            const fn = this.isMine ? getRawItem : getItem;
            fn(this.id)
                .then((res) => {
                    const { code, msg, data } = res.data;
                    if (code != 0) {
                        this.$message.error("获取数据失败: " + msg);
                        return;
                    }
                    this.$store.state.item = extendItem(data);

                    this.loadResource();
                    this.emitStat();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadResource: function () {
            if (!this.isDBType) return;
            if (!this.item.payload.dwID) return;
            const { dwID, nLevel, bCheckLevel } = this.item.payload;
            const resourceID = bCheckLevel ? dwID + "_" + nLevel : dwID;
            getResource(this.client, this.databaseType, resourceID).then((res) => {
                const data = res.data;
                if (data.length) {
                    this.$store.state.resource =
                        data.find((item) => item.Desc || item.Remark || item.Name || item.MapName) || data[0];
                } else this.$store.state.resource = data;
            });
        },
        emitStat: function () {
            postStat("dbm_item", this.id);
        },
        editItem: function () {
            if (!this.id) return;
            this.$router.push({
                name: "item_edit",
                params: {
                    id: this.id,
                },
            });
        },
        deleteItem: function () {
            if (!this.id) return;
            this.$alert("确定永久删除么？该操作无法撤销。", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteItem(this.id)
                            .then(() => {
                                this.$message({
                                    message: "删除成功！",
                                    type: "success",
                                });
                                this.$router.push({
                                    name: "item_mine",
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                },
            });
        },
        forkItem: function () {
            if (!this.id) return;
            this.$confirm("确定要克隆该数据项么？", "消息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        forkItem(this.id).then((res) => {
                            const { code, msg, data } = res.data;
                            if (code != 0) {
                                this.$message.error("Fork失败: " + msg);
                                return;
                            }
                            this.$message({
                                message: "Fork成功，跳转到fork的元数据",
                                type: "success",
                            });
                            setTimeout(() => {
                                const id = data.id;
                                const path = this.$router.resolve({
                                    name: "item_detail_raw",
                                    params: {
                                        id,
                                    },
                                });
                                window.open(path.href, "_blank");
                            }, 1000);
                        });
                    }
                    done();
                },
            }).catch(() => {});
        },
        switchItemStatus: function (id, status) {
            updateItem(id, {
                status,
            }).then((res) => {
                const { code, msg } = res.data;
                if (code != 0) {
                    this.$message.error("更新失败: " + msg);
                    return;
                }
                this.$message({
                    message: "更新成功",
                    type: "success",
                });
                this.loadItem();
            });
        },
        goBack: function () {
            if (this.$route.meta.previousPageExists) {
                this.$router.go(-1);
            } else {
                const name = this.isMine ? "item_mine" : "item_list";
                this.$router.push({
                    name,
                });
            }
        },
        copy() {
            navigator.clipboard.writeText(this.item.uuid);
            this.$notify.success({
                title: "复制成功",
                message: this.item.uuid,
            });
        },
    },
    watch: {
        "$route.params.id": {
            handler: function () {
                this.loadItem();
            },
            immediate: true,
        },
    },
    components: {
        ItemDetailPrimary,
        ItemRelated,
        ItemLua,
        PkgAppendItem,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_detail.less";
</style>
