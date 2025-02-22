 <template>
    <div class="v-raid-tlist">
        <el-divider content-position="left">
            <i class="el-icon-map-location"></i> 团队活动
        </el-divider>
        <template v-if="hasRight">
            <div class="m-raid-table" v-loading="loading">
                <!-- <table>
                    <thead>
                        <th width="160px">日期</th>
                        <th width="50px">时间</th>
                        <th width="140px">活动</th>
                        <th width="300px">标题</th>
                        <th width="180px">队长</th>
                        <th width="80px">状态</th>
                        <th width="80px">操作</th>
                    </thead>
                    <tbody>
                        <tr class="u-item" v-for="(item,i) in data" :key="i">
                            <td class="u-t">
                                <em class="u-placeholder">日期</em>
                                <span class="u-date u-blue">{{item.start_time|showRaidMonth}}月{{item.start_time|showRaidDate}}日</span>
                                <span class="u-week">({{item.start_time | showRaidWeek}})</span>
                                <span class="u-today" v-if="isToday(item.start_time)">★ 今天</span>
                            </td>
                            <td class="u-time u-green">
                                <em class="u-placeholder">时间</em>
                                <span>{{item.start_time | showRaidTime}}</span>
                            </td>
                            <td class="u-name u-sp">
                                <em class="u-placeholder">活动</em>
                                <span>{{item.name}}</span>
                            </td>
                            <td>
                                <em class="u-placeholder">标题</em>
                                <router-link class="u-title" :to="'/raid/' + item.id" target="_blank">{{item.title}}</router-link>
                            </td>
                            <td class="u-leader">
                                <em class="u-placeholder">队长</em>
                                {{item.leader}}
                            </td>
                            <td class="u-count">
                                <em class="u-placeholder">状态</em>
                                <span>
                                    <b
                                        :class="showCountColor(item.count_normal,item.count_total)"
                                    >{{item.count_normal}}</b>
                                    / {{item.count_total}}
                                </span>
                            </td>
                            <td class="u-op">
                                <el-button
                                    type="primary"
                                    @click="subscribe(item.id)"
                                    size="small"
                                    icon="el-icon-s-flag"
                                >预约</el-button>
                            </td>
                        </tr>
                    </tbody>
                </table> -->
                <template v-for="item in data">
                    <activity-item :activity="item" :key="item.id" :is-home-page="isHomePage"></activity-item>
                </template>
                <div class="u-tip">
                    <i class="el-icon-warning-outline"></i> 默认仅显示最近7天活动
                </div>
            </div>
        </template>
        <template v-else>
            <el-alert class="u-tip" title="没有查看权限" type="warning" show-icon></el-alert>
        </template>
    </div>
</template>

<script>
import { getRaids } from "@/service/team/raid.js";
import { moment } from "@jx3box/jx3box-common/js/moment";
import ActivityItem from '@/components/team/raid/ActivityItem.vue';
export default {
    name: "TeamRaid",
    props: ["v", "super", "authority", "isHomePage"],
    data: function () {
        return {
            data: [],
            loading: false,
        };
    },
    computed: {
        team_id: function () {
            return ~~this.$route.params.id;
        },
        hasRight: function () {
            return !this.v || ~~this.authority.authority >= ~~this.v;
        },
    },
    methods: {
        subscribe: function (id) {
            this.$router.push('/raid/' + id)
        },
        showCountColor: function (current, total) {
            if (current == total) {
                return "full";
            } else if (current < total * 0.3) {
                return "rich";
            } else if (current >= total * 0.8) {
                return "warning";
            }
            return "";
        },
        loadRaids: function () {
            this.loading = true;
            getRaids(this.team_id)
                .then((res) => {
                    this.data = res.data?.data || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        isToday : function (d){
            return moment(d).format('MM-DD') == moment(new Date()).format('MM-DD')
        },
        init: function () {
            this.hasRight && this.loadRaids();
        },
    },
    mounted: function () {
        this.init();
    },
    filters: {
        showRaidTime: function (d) {
            return moment(d).format("HH:mm");
        },
        showRaidWeek: function (d) {
            return moment(d).format("dddd");
        },
        showRaidMonth: function (d) {
            return moment(d).format("MM");
        },
        showRaidDate: function (d) {
            return moment(d).format("DD");
        },
    },
    components: {
        ActivityItem
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/raid/list_raid.less";
</style>
