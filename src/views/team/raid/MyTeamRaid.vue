<template>
    <div class="v-raid-myteams">
        <h1 class="m-title">
            <i class="el-icon-s-flag"></i>
            <span class="u-txt">我的活动</span>
            <div class="u-op">
                <el-button class="u-join" size="mini" icon="el-icon-plus" @click="goTeamList">加入团队</el-button>
                <el-button class="u-back" size="mini" icon="el-icon-search" @click="goRaidList">活动大厅</el-button>
            </div>
        </h1>
        <div class="m-raid-joined" v-loading="loading">
            <div class="m-raid-myteams" v-if="data && data.length">
                <div class="m-raid-table">
                    <!-- <table>
                        <thead>
                            <th width="160px">日期</th>
                            <th width="50px">时间</th>
                            <th width="140px">活动</th>
                            <th width="180px">团队</th>
                            <th width="80px">服务器</th>
                            <th width="300px">活动</th>
                            <th width="180px">队长</th>
                            <th width="80px">状态</th>
                            <th width="80px">操作</th>
                        </thead>
                        <tbody>
                            <tr class="u-item" v-for="(item, i) in data" :key="i">
                                <td class="u-t">
                                    <em class="u-placeholder">日期</em>
                                    <span class="u-date u-blue"
                                        >{{ item.raid_info.start_time | showRaidMonth }}月{{
                                            item.raid_info.start_time | showRaidDate
                                        }}日</span
                                    >
                                    <span class="u-week">({{ item.raid_info.start_time | showRaidWeek }})</span>
                                    <span class="u-today" v-if="isToday(item.raid_info.start_time)">★ 今天</span>
                                </td>
                                <td class="u-time u-green">
                                    <em class="u-placeholder">时间</em>
                                    <span>{{ item.raid_info.start_time | showRaidTime }}</span>
                                </td>
                                <td class="u-name u-sp">
                                    <em class="u-placeholder">活动</em>
                                    <span>{{ item.raid_info.name }}</span>
                                </td>
                                <td class="u-team">
                                    <em class="u-placeholder">团队</em>
                                    <router-link :to="'/org/' + item.raid_info.team_id" target="_blank">
                                        <i class="el-icon-link"></i>
                                        {{ item.raid_info.team_name }}
                                    </router-link>
                                </td>
                                <td class="u-server">
                                    <em class="u-placeholder">服务器</em>
                                    <span>{{ item.raid_info.server }}</span>
                                </td>
                                <td>
                                    <em class="u-placeholder">标题</em>
                                    <router-link class="u-title" :to="'/raid/' + item.raid_info.id" target="_blank">{{
                                        item.raid_info.title
                                    }}</router-link>
                                </td>
                                <td class="u-leader">
                                    <em class="u-placeholder">队长</em>
                                    {{ item.raid_info.leader }}
                                </td>
                                <td class="u-count">
                                    <em class="u-placeholder">状态</em>
                                    <span>
                                        <b :class="showCountColor(item.raid_info.count_normal, item.raid_info.count_total)">{{
                                            item.raid_info.count_normal
                                        }}</b>
                                        / {{ item.raid_info.count_total }}
                                    </span>
                                </td>
                                <td class="u-op">
                                    <el-button
                                        type="primary"
                                        @click="subscribe(item.raid_info.id)"
                                        size="small"
                                        icon="el-icon-s-flag"
                                        >预约</el-button
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table> -->
                    <template v-for="item in data">
                        <activity-item :activity="item.raid_info" :key="item.id" :team-info="item.raid_team_info" :canQuit="true" @quit="handleQuit"></activity-item>
                    </template>
                </div>
            </div>
            <el-alert class="m-raid-myteams-null" title="没有近期的活动" type="info" show-icon v-else></el-alert>
            <div class="m-raid-myteam-tip"><i class="el-icon-warning-outline"></i> 此处仅显示我报名的近期的活动</div>
        </div>
    </div>
</template>

<script>
import { getMyJoinedTeams } from "@/service/team/member.js";
import { getMyTeamRaids } from "@/service/team/raid.js";
import { moment } from "@jx3box/jx3box-common/js/moment";
import ActivityItem from '@/components/team/raid/ActivityItem.vue';
export default {
    name: "MyTeamRaid",
    props: [],
    components: {
        ActivityItem
    },
    data: function() {
        return {
            teams: [],
            ids: [],
            data: [],
            loading: false,
        };
    },
    computed: {
        is_guawang: function() {
            return !this.teams?.length;
        },
    },
    watch: {},
    methods: {
        goTeamList: function() {
            this.$router.push("/org/list");
        },
        goRaidList: function() {
            this.$router.push("/raid/list");
        },
        loadTeams: function() {
            return getMyJoinedTeams().then((res) => {
                this.teams = res.data.data || [];
                // 队伍ID序列
                let ids = [];
                this.teams.forEach((item) => {
                    ids.push(item?.team_info?.ID);
                });
                this.ids = ids.join(",");
            });
        },
        showCountColor: function(current, total) {
            if (current == total) {
                return "full";
            } else if (current < total * 0.3) {
                return "rich";
            } else if (current >= total * 0.8) {
                return "warning";
            }
            return "";
        },
        isToday: function(d) {
            return moment(d).format("MM-DD") == moment(new Date()).format("MM-DD");
        },
        loadRaids: function() {
            this.loading = true;
            getMyTeamRaids()
                .then((res) => {
                    this.data = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        subscribe: function(id) {
            this.$router.push(`/raid/${id}`);
        },
        handleQuit(id) {
            this.data = this.data.filter((item) => item.raid_info.id != id);
            debugger
        }
    },
    filters: {
        showRaidTime: function(d) {
            return moment(d).format("HH:mm");
        },
        showRaidWeek: function(d) {
            return moment(d).format("dddd");
        },
        showRaidMonth: function(d) {
            return moment(d).format("MM");
        },
        showRaidDate: function(d) {
            return moment(d).format("DD");
        },
    },
    created: function() {},
    mounted: function() {
        // this.loadTeams().then(() => {
        this.loadRaids();
        // });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/raid/list_raid.less";
</style>
