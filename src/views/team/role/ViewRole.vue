<template>
    <div class="v-role-view">
        <h1 class="m-title">
            <i class="el-icon-user"></i> 角色信息
            <!-- <div class="u-op" v-if="data && isCustom && hasRight">
                <router-link
                    :to="'/role/edit/' + id"
                    class="el-button el-button--primary el-button--mini"
                >
                    <i class="el-icon-edit-outline"></i> 编辑角色
                </router-link>
                <el-button
                    class="u-btn u-delete"
                    type="info"
                    plain
                    size="mini"
                    @click="delRole"
                    icon="el-icon-delete"
                >删除</el-button>
            </div>-->
            <div class="u-op">
                <el-button
                    slot="reference"
                    class="u-back"
                    size="mini"
                    icon="el-icon-arrow-left"
                    @click="goBack"
                >返回列表</el-button>
            </div>
        </h1>
        <div class="m-role-detail" v-if="data">
            <div class="m-role-info">
                <RoleAvatar class="u-avatar" :mount="data.mount" :body_type="data.body_type" />
                <div class="u-meta u-name">
                    <!-- <em>角色名</em> -->
                    <img
                        v-if="!~~data.custom"
                        class="u-verify"
                        svg-inline
                        src="@/assets/img/team/verify.svg"
                    />
                    {{ data.name }}
                </div>
                <div class="u-meta">
                    <span class="u-author">
                        <img class="u-author-avatar" width="24" height="24" :src="data.user_avatar | showAvatar" alt="">
                        <a
                            class="u-author-name"
                            :href="data.uid | authorLink"
                            target="_blank"
                        >
                            {{ data.display_name }}
                        </a>
                    </span>
                    <span class="u-server">
                        <em>服务器</em>
                        {{ data.server }}
                    </span>
                    <span class="u-school">
                        <em>门 派</em>
                        {{ data.mount | showSchoolName
                        }}
                        <img
                            class="u-icon"
                            :src="data.mount | showSchoolIcon"
                        />
                    </span>
                    <span class="u-body">
                        <em>体 型</em>
                        {{ data.body_type | showBodyType }}
                    </span>
                </div>
            </div>
            <!-- <div class="m-role-player">
                <el-divider content-position="left">
                    <i class="el-icon-magic-stick"></i>
                    角色信息
                </el-divider>
                <template v-if="playerId && data">
                    <Player
                        :playerId="playerId"
                        :server="server"
                        :role="data.name"
                        :darkMode="false"
                        :showEquipName="true"
                        :showPosition="false"
                    />
                </template>
                <div class="u-null" v-else>
                    <i class="el-icon-warning-outline"></i> 本角色需要重新绑定方可获取相应信息
                </div>
            </div> -->
            <div class="m-role-belongs" v-if="hasRight">
                <el-divider content-position="left">
                    <i class="el-icon-collection-tag"></i>
                    加入团队
                </el-divider>
                <template v-if="teams && teams.length">
                    <div class="u-teams">
                        <router-link
                            class="u-team"
                            :to="'/org/' + item.team_id"
                            v-for="(item,i) in teams"
                            :key="i"
                        >
                            <img
                                class="u-team-logo"
                                v-if="item.team_logo"
                                :src="item.team_logo | showTeamLogo"
                            />
                            <img class="u-team-logo" v-else src="@/assets/img/team/null.png" />
                            <span class="u-team-name">{{item.team_name}}</span>
                        </router-link>
                    </div>
                    <div class="u-lock">
                        <i class="el-icon-lock"></i>加入的团队仅自己可见
                    </div>
                </template>
                <template v-else>
                    <div class="u-lock">
                        <i class="el-icon-warning-outline"></i>当前角色没有加入任何团队
                    </div>
                </template>
            </div>
        </div>
        <div class="m-role-null m-team-limit" v-if="warning_visible">
            <p class="u-title">
                <img class="u-icon" svg-inline src="@/assets/img/team/icons/warning.svg" />
                Not Found
            </p>角色不存在或没有权限
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getRole, deleteRole } from "@/service/team/role.js";
import { getRoleBelongTeams } from "@/service/team/member.js";
import RoleAvatar from "@/components/team/widget/RoleAvatar.vue";
import { getThumbnail, authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "ViewRole",
    props: [],
    data: function () {
        return {
            data: "",
            warning_visible: false,
            teams: [],
            isLogin: User.isLogin(),
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
        hasRight: function () {
            return this.data.uid == User.getInfo().uid || User.isSuperAdmin();
        },
        isCustom: function () {
            return this.data && this.data.custom;
        },
        playerId: function () {
            return this.data.player_id;
        },
        server: function () {
            return this.data.server;
        },
    },
    methods: {
        delRole: function () {
            this.$alert("确定删除该角色吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRole(this.id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                message: "角色删除成功",
                                type: "success",
                            });
                            this.$router.push("/role/manage");
                        });
                    }
                },
            });
        },
        loadData: function () {
            getRole(this.id).then((res) => {
                this.data = res.data.data;
                if (this.hasRight) {
                    getRoleBelongTeams(this.id).then((res) => {
                        this.teams = res.data.data;
                    });
                }
            });
        },
        goBack: function () {
            this.$router.push("/role/manage");
        },
    },
    filters: {
        showTeamLogo: function (val) {
            return getThumbnail(val, 256);
        },
        authorLink,
        showAvatar,
    },
    mounted: function () {
        this.loadData();
    },
    components: {
        RoleAvatar,
        // Player,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/role/view_role.less";
</style>
