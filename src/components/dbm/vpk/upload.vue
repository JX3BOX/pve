<template>
    <el-dialog
        :visible="modelValue"
        class="m-voice-upload"
        @close="onClose"
        title="上传语音"
        :width="isPhone ? '90%' : '700px'"
    >
        <el-radio-group v-model="activeType" class="m-voice-upload__type" size="mini">
            <el-radio-button label="cloud"><i class="el-icon-cloudy"></i> 在线录音</el-radio-button>
            <el-radio-button label="local"><i class="el-icon-monitor"></i> 本地文件</el-radio-button>
        </el-radio-group>
        <template v-if="activeType == 'cloud'">
            <Recorder ref="recorder"></Recorder>
        </template>
        <el-upload
            v-else
            class="m-uploader"
            :file-list="fileList"
            drag
            ref="upload"
            :auto-upload="false"
            :on-change="onFileChange"
            action=""
            :limit="1"
            accept=".mp3,.wav,.acc,.flac,.m4a,.ogg"
            :on-exceed="onExceed"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或 <em>点击上传</em>
                <small class="u-upload-tips">只能上传音频文件文件，且不超过1M</small>
            </div>

            <template #file="{file: currentFile}">
                <div class="m-file-item">
                    <img class="u-file-icon" src="@/assets/img/dbm/vpk/voice.svg" svg-inline alt="">
                    <span class="u-file-name">{{ currentFile.name }}</span>
                    <div class="u-status-tip" :class="status" v-show="statusTip">{{ statusTip }}</div>
                    <div class="u-file-action">
                        <div class="u-play" @click.stop="onPlay">
                            <i :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"></i>
                        </div>
                        <div class="u-delete" @click.stop="onDelete">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </div>
            </template>
        </el-upload>


        <el-input v-if="isSingle" v-model="remark" class="u-remark">
            <template #prepend> 备注: </template>
        </el-input>

        <template #footer>
            <div class="m-footer">
                <el-button @click="onClose" :disabled="loading" plain>取消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading" :disabled="status==='converting'">确定</el-button>
            </div>
        </template>

        <audio-player-vue ref="player" @ended="onEnded" />
    </el-dialog>
</template>

<script>
import { uploadVoice } from "@/service/dbm/voice";
import { isAudioFile, convertToOgg } from "@/utils/dbm/voice";
import audioPlayerVue from './AudioPlayer.vue';
import Recorder from "./Recorder.vue";
export default {
    name: "VpkUpload",
    components: {
        audioPlayerVue,
        Recorder,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        current: {
            type: Object,
            default: () => ({
                slug: "",
                group: "",
                remark: "",
                voice_uuid: "",
            }),
        },
        isSingle: {
            type: Boolean,
            default: true,
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    emits: ["update:modelValue", "submit"],
    data: function () {
        return {
            isPhone: false,
            fileList: [],
            remark: "",
            activeType: "cloud", // "cloud" | "local

            status: "",
            statusMap: {
                converting: "正在转换语音格式...",
                success: "语音格式转换成功",
                error: "语音格式转换失败",
                uploading: "正在上传语音...",
                uploaded: "语音上传成功",
                uploadError: "语音上传失败",
            },
            loading: false,

            file: null,

            isPlaying: false,
        };
    },
    computed: {
        vpkId() {
            return this.$route.params.id;
        },
        statusTip() {
            return this.status && this.statusMap[this.status] || "";
        },
    },
    watch: {
        modelValue(val) {
            if (val) {
                this.remark = this.current.remark;
                this.isPlaying = false;
                this.activeType = "cloud";
            } else {
                this.$refs?.player?.pause();
            }
        },
    },
    mounted() {
        this.isPhone = window.innerWidth < 768;
    },
    methods: {
        onClose() {
            this.$refs?.upload?.clearFiles();
            this.remark = "";
            this.loading = false;
            this.isPlaying = false;
            this.status = "";
            this.$emit("update:modelValue", false);
            this.activeType = ""
            this.$refs.recorder?.destroy()
        },
        //
        onExceed() {
            this.$message.error("一次只允许提交一个语音文件!");
        },
        // 播放
        onPlay() {
            if (this.isPlaying) {
                this.$refs.player.pause();
                this.isPlaying = false;
            } else {
                this.$refs.player.play(URL.createObjectURL(this.file));
                this.isPlaying = true;
            }
        },
        onEnded() {
            this.isPlaying = false;
        },
        // 删除
        onDelete() {
            this.status = "";
            this.$refs.upload.clearFiles();
        },
        onFileChange(file, fileList) {
            this.status = "";
            // 是否为音频文件
            if (!isAudioFile(file.raw)) {
                this.$message.error("上传语音文件格式不正确!");
                // 清空文件列表
                this.$refs.upload.clearFiles();
                return false;
            }

            // 文件大小限制为 1M
            if (file.size / 1024 / 1024 > 1) {
                this.$message.error("上传语音文件不能超过 1MB!");
                // 清空文件列表
                this.$refs.upload.clearFiles();
                return false;
            }


            // 如果是ogg格式，直接上传
            if (file.raw.type === "audio/ogg") {
                this.file = file.raw;
            } else {
                this.status = "converting";
                // 转换为 ogg 格式
                this.file2ogg(file.raw).then((res) => {
                    this.file = res;
                    this.status = "success";
                }).catch((err) => {
                    console.log(err)
                    this.status = "error";
                });
            }
        },
        file2ogg(file) {
            return new Promise((resolve, reject) => {
                convertToOgg(file).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            })
        },
        async onSubmit() {
            const data = new FormData();
            let file = null;

            if (this.activeType === "cloud") {
                file = this.$refs.recorder.getFile();
                // 转换成file
                file = file ? new File([file], "recorder.ogg", { type: "audio/ogg" }) : null;
            } else {
                file = this.file;
            }

            if (!file) {
                this.$message.error("请先上传语音文件或录音!");
                return false;
            }

            this.current?.slug && data.append("slug", this.current.slug);
            this.current?.group && data.append("group", this.current.group);
            this.remark && data.append("remark", this.remark);
            data.append("vpk_id", this.vpkId);
            data.append("file", file);
            if (this.current?.voice_uuid) {
                data.append("replace_target", this.current.voice_uuid);
            }

            this.loading = true;
            this.status = "uploading";
            uploadVoice(data)
                .then((res) => {
                    this.$message.success("上传成功");
                    this.status = "uploaded";
                    this.$emit("submit", res.data.data);
                    this.onClose();
                })
                .catch((err) => {
                    this.$message.error("上传失败");
                    this.status = "uploadError";
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/upload.less";
</style>
