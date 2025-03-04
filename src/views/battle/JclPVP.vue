<template>
    <div class="p-jcl-pvp">
        <subheader class="m-upload-header" title="日志分析" desc="Battle Statistical Analysis">
            <el-button class="u-back" plain size="small" @click="back" icon="el-icon-arrow-left"> 后退 </el-button>
            <!-- <el-button class="u-save" type="success" size="small" @click="save" v-if="allowAdd">
                <img class="i-btn-save" svg-inline src="@/assets/img/battle/save.svg" />云端保存
            </el-button> -->
        </subheader>
        <div class="u-pvp-wrapper">
            <el-row :gutter="24">
                <el-col :span="6">
                    <battle-info></battle-info>
                    <team-info></team-info>
                    <battle-stat></battle-stat>
                </el-col>
                <el-col :span="12">
                    <battle-player></battle-player>
                    <battle-timeline></battle-timeline>
                </el-col>
                <el-col :span="6">
                    <battle-log></battle-log>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import TeamInfo from "@/components/battle/jcl/pvp/team_info.vue";
import BattleInfo from "@/components/battle/jcl/pvp/battle_info.vue";
import BattleStat from "@/components/battle/jcl/pvp/battle_stat.vue";
import BattlePlayer from "@/components/battle/jcl/pvp/battle_player.vue";
import BattleTimeline from "@/components/battle/jcl/pvp/battle_timeline.vue";
import BattleLog from "@/components/battle/jcl/pvp/battle_log.vue";

import subheader from "@/components/battle/subheader.vue";

export default {
    name: "JclPVP",
    components: {
        subheader,
        TeamInfo,
        BattleInfo,
        BattlePlayer,
        BattleStat,
        BattleLog,
        BattleTimeline,
    },
    data: () => ({
        time: 0,
    }),
    computed: {},
    methods: {
        back() {
            this.$store.commit("RESET");
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
        },
    },
    created() {},
};
</script>
<style lang="less">
@import "~@/assets/css/battle/jcl_pvp.less";
</style>
