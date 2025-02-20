<template>
    <div class="m-team-recruit">
        <h3 class="c-sidebar-right-title">
            <img class="u-icon" svg-inline src="@/assets/img/puzzle.svg" />团队招募
            <a class="u-more" href="/team" target="_blank">查看更多 &raquo;</a>
        </h3>
        <ul>
            <li v-for="(item, i) in teams" :key="i">
                <a :href="item.ID | teamLink">
                    <i class="u-flag el-icon-s-flag"></i>
                    <!-- <img :src="item.logo | showLogo"> -->
                    <span class="u-name">{{ item.name }}</span>
                    <span class="u-server">{{ item.server }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getTeams } from "@/service/fb/next.js";
import { getLink } from "@jx3box/jx3box-common/js/utils.js";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            teams: [],
        };
    },
    computed: {},
    methods: {},
    filters: {
        teamLink: function (val) {
            return getLink("org", val);
        },
    },
    mounted: function () {
        getTeams().then((res) => {
            this.teams = res.data.data.list;
        });
    },
    components: {},
};
</script>
