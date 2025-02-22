<template>
    <div class="v-role-list" v-loading="loading">
        <h1 class="m-title">
            <i class="el-icon-user"></i>
            <span class="u-txt">我的角色</span>
            <!-- <goback /> -->
            <div class="u-op">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-connection"></i> 绑定角色
                </router-link>
                <router-link to="/role/add" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div>
        </h1>
        <div class="m-role-list-filter">
            <el-input class="u-name" v-model="name" placeholder="请输入角色名称" size="small">
                <template slot="prepend">
                    <i class="el-icon-search"></i> 查找
                </template>
            </el-input>
            <el-select size="small" v-model="mount" popper-class="m-school-pop">
                <el-option label="全部" value=""></el-option>
                <el-option
                    v-for="(school, school_id) in school_id_map"
                    :key="school_id"
                    :value="school_id"
                    :label="school"
                    class="u-school"
                >
                    <img width="24" height="24" :src="school_id | showSchoolIcon" />
                    {{school}}
                </el-option>
            </el-select>
            <!-- <el-radio-group class="u-mount" v-model="mount">
                <el-radio class="u-mount-unit" label>全部</el-radio>
                <el-radio
                    class="u-mount-unit"
                    v-for="(school,school_id) in school_id_map"
                    :key="school_id"
                    :label="school_id"
                >
                    <img :src="school_id | showSchoolIcon" />
                    {{school}}
                </el-radio>
            </el-radio-group> -->
        </div>
        <div class="m-team-rolelist" v-if="data && data.length">
            <ul class="u-list">
                <li class="u-item" v-for="(item, i) in data" :key="i">
                    <router-link :to="'/role/' + item.ID" class="u-pic u-avatar">
                        <img :src="showAvatar(item.mount, item.body_type)" alt />
                    </router-link>
                    <span class="u-title">
                        <router-link class="u-rolename" :to="'/role/' + item.ID">{{ item.name }}</router-link>
                        <i class="u-status" v-if="!item.custom" title="已认证">
                            <img svg-inline src="@/assets/img/team/verify.svg" />
                        </i>
                        <span class="u-note" v-if="item.note">({{ item.note }})</span>
                        <span class="u-addnote" @click="addNote(item)">
                            <el-tooltip class="item" effect="dark" content="设置备注" placement="top">
                                <i class="el-icon-edit-outline"></i>
                            </el-tooltip>
                        </span>
                        <span class="u-star" :class="{on : item.priority}" @click="starRole(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.priority ? '取消置顶' : '置顶' "
                                placement="top"
                            >
                                <i class="el-icon-star-off"></i>
                            </el-tooltip>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-server">
                            <em>服务器</em>
                            {{ item.server }}
                        </span>
                        <span class="u-mount">
                            <em>门派</em>
                            <img class="u-icon" :src="item.mount | showSchoolIcon" />
                            {{ item.mount | showSchoolName }}
                        </span>
                    </span>
                    <span class="u-time">绑定时间 : {{ item.created_at | showTime }}</span>
                    <div class="u-op">
                        <el-button
                            v-if="!item.custom"
                            class="u-btn u-unbind"
                            type="warning"
                            plain
                            size="mini"
                            @click="unbind(item.ID, i)"
                        >
                            <i class="u-icon">
                                <img svg-inline src="@/assets/img/team/unbind.svg" />
                            </i>解绑角色
                        </el-button>
                        <template v-else>
                            <router-link
                                :to="'/role/edit/' + item.ID"
                                class="el-button el-button--primary el-button--mini is-plain"
                            >
                                <i class="el-icon-edit-outline"></i>
                                编辑
                            </router-link>
                            <el-button
                                class="u-btn u-delete"
                                type="info"
                                plain
                                size="mini"
                                @click="delRole(item.ID, i)"
                                icon="el-icon-delete"
                            >删除</el-button>
                        </template>
                    </div>
                </li>
            </ul>
            <el-pagination
                class="m-archive-pages"
                background
                layout="total, prev, pager, next,jumper"
                :hide-on-single-page="true"
                :page-size="per"
                :total="total"
                :current-page.sync="page"
                @current-change="changePage"
            ></el-pagination>
        </div>
        <template v-else>
            <el-alert class="m-archive-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
            <div class="m-role-null">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-connection"></i> 绑定角色
                </router-link>
                <router-link to="/role/add" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div>
        </template>
        <el-dialog title="设置备注" :visible.sync="noteVisible" width="30%" class="m-team-note-dialog">
            <div>
                <el-input
                    v-model="note"
                    placeholder="请输入内容"
                    :maxlength="20"
                    :show-word-limit="true"
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noteVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmNote">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRoles,
    unbindRole,
    noteRole,
    deleteRole,
    starRole,
    unstarRole,
} from "@/service/team/role.js";
import school_id_map from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { __imgPath,__cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "ListRole",
    props: [],
    data: function () {
        return {
            per: 10,
            page: 1,
            total: 1,
            pages: 1,
            data: [
                // {
                //     id: 0,
                //     uid: 0,
                //     jx3id: "testid",
                //     server: "服务器名称",
                //     name: "角色名",
                //     mount: "10080",
                //     body_type: "6",
                //     status: 1,
                //     created_at: "2020-09-29T16:55:03+08:00",
                // },
            ],
            loading: false,

            // 备注
            noteVisible: false,
            currentItem: "",
            note: "",

            // 角色过滤
            mount: "",
            name: "",
            xfmap,
            school_id_map,
        };
    },
    computed: {
        params: function () {
            return {
                pageIndex: this.page,
                pageSize: this.per,
                mount: this.mount,
                name: this.name,
            };
        },
    },
    methods: {
        unbind: function (id,i) {
            this.$alert("在网站进行解绑游戏内需要小退方可生效", "消息", {
                confirmButtonText: "确定解绑",
                callback: (action) => {
                    if (action == "confirm") {
                        unbindRole(id).then((res) => {
                            this.$notify({
                                title: "解绑成功",
                                message: "角色解绑成功",
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
        loadData: function () {
            this.loading = true;
            getRoles(this.params)
                .then((res) => {
                    this.total = res.data.data.page.total;
                    this.pages = res.data.data.page.pageTotal;
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showAvatar: function (mount, body_type) {
            return getThumbnail(
                __cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png"
            );
        },
        go: function (route) {
            this.$router.push(route);
        },
        addNote: function (item) {
            this.noteVisible = true;
            this.currentItem = item;
        },
        confirmNote: function () {
            noteRole(this.currentItem.ID, this.note).then((res) => {
                this.noteVisible = false;
                this.currentItem.note = this.note;
                this.note = "";

                this.$notify({
                    title: "成功",
                    message: "备注设置成功",
                    type: "success",
                });
            });
        },
        delRole: function (role_id, i) {
            this.$alert("确定删除该角色吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRole(role_id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                message: "角色删除成功",
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
        starRole: function (item) {
            if (item.priority) {
                unstarRole(item.ID).then((res) => {
                    item.priority = 0
                    this.$notify({
                        title: "取消星标成功",
                        message: "角色取消星标成功",
                        type: "success",
                    });
                });
            } else {
                starRole(item.ID).then((res) => {
                    item.priority = Date.now()
                    this.$notify({
                        title: "星标成功",
                        message: "角色星标成功",
                        type: "success",
                    });
                });
            }
        },
        changePage : function (){
            window.scrollTo(0, 0);
        }
    },
    filters: {},
    created: function () {},
    watch: {
        params: {
            immediate: true,
            handler: function (val) {
                this.loadData();
            },
        },
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/team/role/list_role.less";
</style>
