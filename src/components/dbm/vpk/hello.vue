<template>
    <div class="m-vpk-hello">
        <div class="u-title">欢迎您，侠士！</div>
        <div class="u-desc">点击播放欢迎词</div>
        <el-button type="primary" :icon="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'" @click="play" :disabled="!vpk.hello_voice">{{
            (isPlaying && "停止") || "试听"
        }}</el-button>

        <audio-player-vue ref="player" @ended="onEnded" />
    </div>
</template>

<script>
import audioPlayerVue from "./AudioPlayer.vue";
import { getAudioLink } from "@/utils/dbm/voice";
export default {
    name: "VpkHello",
    props: ["vpk"],
    components: {
        audioPlayerVue,
    },
    data: function () {
        return {
            isPlaying: false,
        };
    },
    computed: {},
    watch: {},
    methods: {
        play() {
            if (!this.isPlaying) {
                this.$refs.player.play(getAudioLink(this.vpk.hello_voice));
                this.isPlaying = true;
            } else {
                this.$refs.player.pause();
                this.isPlaying = false;
            }
        },
        onEnded() {
            this.isPlaying = false;
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.m-vpk-hello {
    background-color: #eff7ff;
    .r(4px);
    // border:1px solid @color-link;
    padding: 20px;
    .flex;
    flex-direction: column;
    .w(180px);

    .u-title {
        .bold;
        .fz(14px);
    }

    .u-desc {
        .fz(12px,2);
        color: #999;
        .mb(5px);
    }
}
</style>
