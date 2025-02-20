<template>
    <div class="m-team-act-mini">
        <h3 class="m-act-title">
            <span class="u-title"> <img class="u-icon" svg-inline :src="getAppIcon('team')" /> 团队招募 </span>
            <a class="u-more" href="/team" target="_blank">查看更多<i class="el-icon-d-arrow-right"></i></a>
        </h3>
        <!-- <el-radio-group v-model="tab" size="small" class="m-tab" plain>
            <el-radio-button label="团队"></el-radio-button>
            <el-radio-button label="活动"></el-radio-button>
        </el-radio-group> -->
        <!-- <div class="m-act-info-null" v-show="tab == '活动'" v-if="acts.length == 0"><span>暂无团队活动</span></div> -->
        <!-- <a
            class="m-act-info"
            v-show="tab == 'act'"
            v-else
            v-for="(item, key) in acts"
            :key="key"
            :href="getLink('raid', item.id)"
        >
            <img :src="getThumbnail(item.team_logo)" alt="" class="u-img" />
            <div class="u-act-title">
                <span>【{{ item.team_name }}】{{ item.name }}</span>
            </div>
            <div class="u-detail">
                <span>服务器:@{{ item.server }}</span>
            </div>
            <div class="u-detail">
                <span class="u-date"
                    >{{ item.start_time | showRaidMonth }}月{{ item.start_time | showRaidDate }}日</span
                >
                <span class="u-week">({{ item.start_time | showRaidWeek }})</span>
                <span class="u-today" v-if="isToday(activity.start_time)">★ 今天</span>
                <span class="u-time">{{ item.start_time | showRaidTime }}</span>
            </div>
        </a> -->
        <a class="m-act-info" v-for="(item, key) in teams" :key="key" :href="getLink('org', item.ID)" target="_blank">
            <el-image :src="getThumbnail(item.logo)" alt="" class="u-img"></el-image>
            <div class="u-title">
                <span class="u-team-name">{{ item.name }}</span>
                <span class="u-team-server">@{{ item.server }}</span>
            </div>
            <div class="u-detail">
                <span class="u-tag" v-for="(tag, key) in tag(item.tags)" :key="key">{{ tag }}</span>
            </div>
        </a>
    </div>
</template>

<script>
import { getAppIcon, getLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getActs, getTeams } from "@/service/fb/team.js";
import { moment } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "team_act",
    components: {},
    props: [],
    data: function () {
        return {
            tab: "活动",
            acts: [],
            teams: [],
            tabDefault: "teams",
        };
    },
    computed: {
        params: function () {
            return {
                pageIndex: 1,
                pageSize: 10,
                client: this.$store.state.client,
                status: 1,
            };
        },
    },
    methods: {
        loadData: function () {
            //获取活动列表前三个
            // getActs(this.params).then((res) => {
            //     if (res.data.data.list.length > 3) {
            //         this.acts = res.data.data.list.slice(0, 3);
            //     } else {
            //         this.acts = res.data.data.list;
            //     }
            // });
            getTeams(this.params).then((res) => {
                this.teams = res.data.data.list;
            });
        },
        getAppIcon,
        getLink,
        getThumbnail,
        getActs,
        getTeams,
        tag(tags) {
            if (tags != null) {
                return tags.slice(0, 3);
            } else {
                return ["无标签"];
            }
        },
    },
    filters: {
        showRaidTime(d) {
            return moment(d).format("HH:mm");
        },
        showRaidWeek(d) {
            return moment(d).format("dddd");
        },
        showRaidMonth(d) {
            return moment(d).format("MM");
        },
        showRaidDate(d) {
            return moment(d).format("DD");
        },
    },
    watch: {},
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/team_act.less";
</style>
