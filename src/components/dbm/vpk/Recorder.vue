<template>
    <div class="m-recorder">
        <div class="m-audio">
            <AUDIO ref="LogAudioPlayer" controls style="width: 100%" height="100px"></AUDIO>
        </div>

        <div class="m-recorder-control">
            <div class="m-recorder-control__left">
                <el-button
                    class="u-start"
                    @click="recStart"
                    :disabled="isRecording"
                    type="primary"
                    icon="el-icon-microphone"
                    size="small"
                    v-if="!isRecording"
                    >录制</el-button
                >
                <el-button
                    class="u-stop"
                    @click="recStop"
                    v-if="isRecording"
                    icon="el-icon-video-pause"
                    size="small"
                    plain
                    >停止</el-button
                >
                <el-button
                    class="u-play"
                    @click="recPlayLast"
                    plain
                    icon="el-icon-video-play"
                    size="small"
                    title="播放最后一条"
                    :disabled="!recLogLast || isPlaying"
                    >播放</el-button
                >
            </div>
            <!-- <div class="m-recorder-control__center">
                <el-button @click="recPause" icon="el-icon-video-pause" size="small">暂停</el-button>
                <el-button @click="recResume" size="small">继续</el-button>
            </div> -->
            <div class="m-recorder-control__right">
                <el-button @click="clear" type="info" icon="el-icon-refresh-left" size="small">重置</el-button>
            </div>
        </div>

        <div class="m-recorder-volume">
            <div class="m-wave">
                <div class="m-process">
                    <div class="m-process-bar" :style="{ width: powerLevel + '%' }"></div>
                    <div class="m-process-info">
                        <span class="u-power">
                            <img class="u-volume" src="@/assets/img/dbm/vpk/volume.svg" alt="" />
                            音量: <b>{{ powerLevel }}</b> %</span
                        >
                        <span class="u-duration"
                            >时长: <b>{{ duration / 1000 }}</b> s</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="m-record-main">
            <div class="m-record-logs">
                <div v-for="obj in logs" :key="obj.idx">
                    <div
                        class="m-log-item"
                        :style="{ color: obj.color == 1 ? 'red' : obj.color == 2 ? 'green' : obj.color }"
                    >
                        <span v-once>[{{ getTime() }}]</span><span v-html="obj.msg" />

                        <template v-if="obj.res">
                            {{ intp(obj.res.rec.set.bitRate, 3) }}kbps {{ intp(obj.res.rec.set.sampleRate, 5) }}hz
                            编码{{ intp(obj.res.blob.size, 6) }}b [{{ obj.res.rec.set.type }}]{{
                                intp(obj.res.duration, 6)
                            }}ms

                            <!-- <el-button size="mini" @click="recdown(obj.idx)">下载</el-button> -->
                            <!-- <el-button
                                title="播放"
                                type="text"
                                icon="el-icon-video-play"
                                @click="recplay(obj.idx)"
                            ></el-button> -->

                            <span v-html="obj.playMsg"></span>
                            <span v-if="obj.down">
                                <span style="color: red">{{ obj.down }}</span>

                                没弹下载？试一下链接或复制文本<button @click="recdown64(obj.idx)"
                                    >生成Base64文本</button
                                >

                                <textarea v-if="obj.down64Val" v-model="obj.down64Val"></textarea>
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//加载必须要的core，demo简化起见采用的直接加载类库，实际使用时应当采用异步按需加载
import Recorder from "recorder-core";
//需要使用到的音频格式编码引擎的js文件统统加载进来，这些引擎文件会比较大
import "recorder-core/src/engine/beta-ogg";
import "recorder-core/src/engine/beta-ogg-engine";

export default {
    name: "VoiceRecorder",
    data() {
        return {
            Rec: null,

            type: "ogg",
            bitRate: 16,
            sampleRate: 16000,

            rec: 0,
            duration: 0,
            powerLevel: 0,

            logs: [],
            recLogLast: null,
            isRecording: false,
            isPlaying: false,
        };
    },
    computed: {},
    mounted() {
        this.init();

        this.$nextTick(() => {
            this.$refs.LogAudioPlayer.addEventListener("ended", () => {
                this.isPlaying = false;
            });
        });
    },
    beforeDestroy() {
        this.destroy();
    },
    methods: {
        // 初始化录音
        init() {
            this.Rec = Recorder({
                type: this.type,
                bitRate: this.bitRate,
                sampleRate: this.sampleRate,
                onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
                    this.rec = buffers[0];
                    this.duration = bufferDuration;
                    this.powerLevel = powerLevel;
                },
            });

            this.Rec.open(
                () => {
                    this.reclog(
                        `录音初始化成功，采样率：${this.sampleRate}，比特率：${this.bitRate}，格式：${this.type}`,
                        2
                    );
                },
                (msg, isUserNotAllow) => {
                    this.reclog((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + msg, 1);
                }
            );
        },
        destroy() {
            if (this.Rec) {
                this.Rec.close();
                this.Rec = null;
            }
        },
        clear() {
            this.logs = [];
            this.recLogLast = null;
            this.powerLevel = 0;
            this.duration = 0;
        },
        // 开始录制
        recStart() {
            if (!this.Rec || !Recorder.IsOpen()) {
                this.reclog("未打开录音", 1);
                return;
            }
            this.Rec.start();
            this.isRecording = true;
            const msg = `开始录制，采样率：${this.sampleRate}，比特率：${this.bitRate}，格式：${this.type}`;
            this.reclog(msg);
        },
        recStop() {
            if (!(this.Rec && Recorder.IsOpen())) {
                this.reclog("未打开录音", 1);
                return;
            }

            const rec = this.Rec;
            this.Rec.stop(
                (blob, duration) => {
                    this.reclog("已录制:", "", {
                        blob: blob,
                        duration: duration,
                        rec: rec,
                    });
                    this.isRecording = false;
                },
                (s) => {
                    this.reclog("录音失败：" + s, 1);
                }
            );
        },
        recPlayLast() {
            if (!this.recLogLast) {
                this.reclog("请先录音，然后停止后再播放", 1);
                return;
            }
            this.recplay(this.recLogLast.idx);
        },
        recPause() {
            if (this.Rec && Recorder.IsOpen()) {
                this.Rec.pause();
            } else {
                this.reclog("未打开录音", 1);
            }
        },
        recResume() {
            if (this.Rec && Recorder.IsOpen()) {
                this.Rec.resume();
            } else {
                this.reclog("未打开录音", 1);
            }
        },
        reclog(msg, color, res) {
            var obj = {
                idx: this.logs.length,
                msg: msg,
                color: color,
                res: res,

                playMsg: "",
                down: 0,
                down64Val: "",
            };
            if (res && res.blob) {
                this.recLogLast = obj;
            }
            this.logs.splice(0, 0, obj);
        },
        recplay: function (idx) {
            var o = this.logs[this.logs.length - idx - 1];
            o.play = (o.play || 0) + 1;

            var audio = this.$refs.LogAudioPlayer;
            audio.controls = true;
            if (!(audio.ended || audio.paused)) {
                audio.pause();
            }
            audio.src = (window.URL || webkitURL).createObjectURL(o.res.blob);
            audio.play();
            this.isPlaying = true;
        },
        recdown: function (idx) {
            var o = this.logs[this.logs.length - idx - 1];
            o.down = (o.down || 0) + 1;

            o = o.res;
            var name =
                "rec-" +
                o.duration +
                "ms-" +
                (o.rec.set.bitRate || "-") +
                "kbps-" +
                (o.rec.set.sampleRate || "-") +
                "hz." +
                (o.rec.set.type || (/\w+$/.exec(o.blob.type) || [])[0] || "unknown");
            var downA = document.createElement("A");
            downA.href = (window.URL || webkitURL).createObjectURL(o.blob);
            downA.download = name;
            downA.click();
        },
        recdown64(idx) {
            var o = this.logs[this.logs.length - idx - 1];
            var reader = new FileReader();
            reader.onloadend = function () {
                o.down64Val = reader.result;
            };
            reader.readAsDataURL(o.res.blob);
        },
        getTime() {
            var now = new Date();
            var t =
                ("0" + now.getHours()).substr(-2) +
                ":" +
                ("0" + now.getMinutes()).substr(-2) +
                ":" +
                ("0" + now.getSeconds()).substr(-2);
            return t;
        },
        intp(s, len) {
            s = s == null ? "-" : s + "";
            if (s.length >= len) return s;
            return ("_______" + s).substr(-len);
        },
        getFile() {
            return this.recLogLast?.res?.blob;
        },
    },
};
</script>

<style lang="less">
.m-recorder-control {
    background-color: #ebeef5;
    border: 1px solid #eee;
    .r(4px);
    padding: 10px;
    .flex;
    justify-content: space-between;
    .u-icon {
        width: 12px;
        height: 12px;
        margin-right: 5px;
        top: 1px;
        .pr;
    }
    .mt(5px);
}
@record-height: 10px;
.m-process {
    height: @record-height;
    width: 100%;
    display: inline-block;
    background: #ebeef5;
    position: relative;
    vertical-align: bottom;
    border-radius: 4px;
    margin: 10px 0;
}
.m-process-bar {
    height: @record-height;
    background: #0b1;
    position: absolute;
    border-radius: 4px;
}
.m-process-info {
    .flex;
    justify-content: space-between;
    padding-left: 20px;
    position: relative;
    color: @color;
    padding: 0 5px;
    .fz(12px);
    .h(@record-height);
    .lh(@record-height);

    .u-power {
        .flex;
        align-items: center;
    }
    .u-volume {
        .size(14px);
        .mr(3px);
    }
}
.m-record-logs {
    height: 220px;
    overflow-y: auto;
    .pr;
    background-color: #ebeef5;
    padding: 10px;
    .r(4px);
}
.m-log-item {
    .fz(13px,2);
    .flex;
    align-items: center;
    gap: 10px;
}
</style>
