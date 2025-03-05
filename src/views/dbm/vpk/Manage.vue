<template>
    <div class="p-review">
        <el-tabs v-model="active">
            <el-tab-pane name="vpk">
                <template #label> <i class="el-icon-headset"></i> 语音包审核 </template>
            </el-tab-pane>
            <el-tab-pane name="voice">
                <template #label> <i class="el-icon-microphone"></i> 语音审核 </template>
            </el-tab-pane>
        </el-tabs>
        <ReviewVpk v-if="active === 'vpk'"></ReviewVpk>
        <ReviewVoice v-if="active === 'voice'"></ReviewVoice>
    </div>
</template>

<script>
import ReviewVpk from "./ReviewVpk.vue";
import ReviewVoice from "./ReviewVoice.vue";
export default {
    name: "Manage",
    components: {
        ReviewVpk,
        ReviewVoice,
    },
    data() {
        return {
            active: "vpk",
        };
    },
    watch: {
        "$route.query.tab": {
            handler: function (val) {
                if(val) this.active = val;
            },
            immediate: true,
        },
        active: {
            handler: function (val) {
                this.$router.replace({
                    query: {
                        tab: val,
                    },
                });
            },
            immediate: true,
        },
    },
    methods: {
        changeTab() {},
    },
};
</script>
