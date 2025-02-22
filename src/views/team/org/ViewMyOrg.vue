<template>
    <div class="v-org-view" v-if="id" v-loading="loading">
        <!-- 查看团队信息 -->
        <team-info :info="data" :team_id="id" />

        <!-- 团队内容TAB组 -->
        <el-tabs v-model="tab" type="card" class="m-team-view">
            <el-tab-pane label="我的角色" name="overview" lazy>
                <span slot="label"> <i class="el-icon-user"></i> 我的角色 </span>
                <team-role :team_id="id" />
            </el-tab-pane>

            <el-tab-pane label="我的成绩" name="history" lazy>
                <span slot="label"> <i class="el-icon-medal"></i> 我的战绩 </span>
                <myBattle :team-id="id" />
            </el-tab-pane>

            <template v-if="isSuper">
                <el-tab-pane label="团员管理" name="manage-member" lazy>
                    <span slot="label">
                        <i class="el-icon-user"></i> 团员管理
                        <i class="u-count" v-if="pendingCount">{{ pendingCount }}</i>
                    </span>
                    <ListMember :id="id" />
                </el-tab-pane>
                <el-tab-pane label="快照管理" name="manage-snapshot" lazy>
                    <span slot="label"> <i class="el-icon-camera"></i> 快照管理 </span>
                    <SnapshotList />
                </el-tab-pane>
                <el-tab-pane label="战绩管理" name="battle-record" lazy>
                    <span slot="label"> <i class="el-icon-trophy"></i> 战绩管理 </span>
                    <ManageBattle :team-id="id" />
                </el-tab-pane>
                <el-tab-pane label="视频管理" name="video" lazy>
                    <span slot="label"> <i class="el-icon-video-camera"></i> 视频管理 </span>
                    <ManageVideo :super="data.super" />
                </el-tab-pane>
                <el-tab-pane label="基本设置" name="setting" lazy>
                    <span slot="label"> <i class="el-icon-setting"></i> 基本设置 </span>
                    <team-form :data="data" btn_txt="更新" @submit="submit" ref="teamForm"></team-form>
                </el-tab-pane>
                <el-tab-pane label="高级设置" name="advance" lazy>
                    <span slot="label"> <i class="el-icon-s-operation"></i> 高级设置 </span>
                    <team-advanced-setting></team-advanced-setting>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
import team_info from "@/components/team/org/team_info.vue";
import team_role from "@/components/team/org/team_role.vue";
import team_from from "@/components/team/org/teamform.vue";
import SnapshotList from "@/views/team/snapshot/ListSnapshot.vue";
import team_advanced_setting from "@/components/team/org/team_advanced_setting.vue";
import ListMember from "../member/ListMember.vue";
import ManageVideo from "./ManageVideo.vue";
import myBattle from "../battle/myBattle.vue";
import ManageBattle from "../battle/index.vue";

import User from "@jx3box/jx3box-common/js/user.js";
import { postStat, getStat } from "@jx3box/jx3box-common/js/stat.js";
import { getTeam, updateTeam } from "@/service/team/team.js";
import { checkMyAuthority } from "@/service/team/member.js";
export default {
    name: "ViewMyOrg",
    props: [],
    data: function () {
        return {
            tab: "overview",
            data: {
                status: 0,
                name: "团队名称",
                server: "服务器名称",
                logo: "",
                desc: "团队介绍",
                uid: 0,
                recruit: "",
                honors: [],
                medals: [],
                tags: ["可教学", "固定团"],
                v_member: 0,
                v_activity: 0,
                v_dkp: 0,
                v_comment: 0,
            },
            loading: false,
            authority: {
                authority: 0,
                r_dkp: 0,
                r_member: 0,
                r_audit: 0,
                r_plan: 0,
                r_snapshot: 0,
                r_drop: 0,
                r_raid: 0,
            },
            done: false,
            processing: false,
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
        query: function () {
            return this.$route.query.tab;
        },
        isSuper() {
            return this.data.super == User.getInfo().uid;
        },
        pendingCount() {
            const pendingList = this.$store.state.pendingList;
            const pending = pendingList.find((item) => item.team_id == this.id);

            return pending ? pending?.pending : 0;
        },
    },
    methods: {
        getTeam: function () {
            return getTeam(this.id).then((res) => {
                this.data = res.data.data;

                this.$store.commit("SET_TEAM", this.data);
            });
        },
        loadData: function () {
            if (!this.id) return;
            this.getTeam().then(() => {
                postStat("team", this.id);
                this.done = true;
            });
        },
        checkAuthority: function () {
            User.isLogin() &&
                checkMyAuthority(this.id).then((res) => {
                    this.authority = res.data.data;
                });
        },
        checkTab: function () {
            if (this.$route.query.tab) {
                this.tab = this.$route.query.tab;
            }
        },
        init: function () {
            this.checkTab();
            this.loadData();
            User.isLogin() && this.checkAuthority();
        },
        submit: function () {
            this.processing = true;
            this.done = false;
            console.log(this.data);
            updateTeam(this.id, this.data)
                .then((res) => {
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                    this.data = res.data.data;
                    this.done = true;
                    this.$refs.teamForm?.submitTv();
                })
                .finally(() => {
                    this.processing = false;
                });
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                val && this.init();
            },
        },
        query: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.tab = val;
                }
            },
        },
        tab: function (val) {
            this.$router.push({
                query: {
                    tab: val,
                },
            });
        },
    },
    components: {
        "team-role": team_role,
        "team-info": team_info,
        "team-form": team_from,
        "team-advanced-setting": team_advanced_setting,

        SnapshotList,
        ListMember,
        ManageVideo,
        myBattle,
        ManageBattle,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/org/view_org.less";
</style>
