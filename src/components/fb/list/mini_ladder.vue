<template>
    <div class="m-team-ladder-mini">
        <div class="m-ladder-header">
            <h3 class="m-ladder-title">
                <span class="u-title"> <img class="u-icon" svg-inline :src="getAppIcon('jdt',true)" /> 秘境百强榜 </span>
                <a class="u-more" target="_blank" :href="getLink('rank', event_id)"
                    >查看更多<i class="el-icon-d-arrow-right"></i
                ></a>
            </h3>
            <el-select class="m-ladder-select" v-model="event_id" placeholder="请选择" size="small">
                <el-option v-for="event in events" :key="event.ID" :label="event.name" :value="event.ID"></el-option>
            </el-select>
        </div>
        <div class="m-ladder-rank" v-loading="loading">
            <ul v-if="teams && teams.length">
                <li v-for="(item, j) in teams" :key="item.ID">
                    <a :href="getLink('org', item.team_id)" class="u-link" target="_blank">
                        <span class="u-order" :class="highlight(j)">{{ j + 1 }}</span>
                        <img :src="getThumbnail(item.team_logo)" alt="" class="u-img" />
                        <span class="u-team">{{ item.team_name }}</span>
                        <span class="u-server">{{ item.server }}</span>
                    </a>
                </li>
            </ul>
            <div class="u-null" v-else><i class="el-icon-warning-outline"></i> 当前榜单暂无数据</div>
        </div>
    </div>
</template>

<script>
import { getAppIcon, getLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getRank, getEvents } from "@/service/fb/team.js";
export default {
    name: "MiniLadder",
    components: {},
    props: [],
    data: function () {
        return {
            loading: false,

            event_id: 0,
            events: [],

            teams: [], //存储团队列表
        };
    },
    computed: {
        achievement_id() {
            let active_event = this.events.find((event) => event.ID == this.event_id);
            let event_achievements = active_event?.boss_map;
            return event_achievements?.[event_achievements.length - 1]?.achievement_id || 0;
        },
    },
    watch: {
        achievement_id: {
            handler: function (val) {
                this.loadRank();
            },
            immediate: true,
        },
    },
    methods: {
        loadEvents: function () {
            return getEvents().then((res) => {
                this.events = res.data.data.list || [];
                this.event_id = this.events[0]["ID"];
            });
        },
        loadRank: function () {
            if (!this.achievement_id) {
                this.teams = [];
                return;
            }

            this.loading = true;
            return getRank(this.achievement_id, {
                event_id: this.event_id,
                limit: 100,
            })
                .then((res) => {
                    this.teams = res.data.data || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getAppIcon,
        getLink,
        getThumbnail,
        highlight: function (i) {
            if (i == 0) {
                return "t1";
            } else if (i == 1) {
                return "t2";
            } else if (i == 2) {
                return "t3";
            }
        },
    },
    mounted: function () {
        this.loadEvents();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/ladder.less";
</style>
