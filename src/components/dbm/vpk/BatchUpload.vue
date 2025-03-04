<template>
    <div class="m-batch-upload m-voice-upload">
        <el-upload
            class="m-uploader"
            drag
            action=""
            multiple
            accept=".mp3,.wav,.acc,.flac,.m4a,.ogg"
            :file-list="fileList"
            ref="upload"
            :auto-upload="false"
            :on-change="onFileChange"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或 <em>点击上传</em>
                只能上传音频文件文件，且单个文件不超过1M
            </div>
            <template #file="{ file }">
                <div class="m-file-item">
                    <img class="u-file-icon" src="@/assets/img/dbm/vpk/voice.svg" svg-inline alt="" />
                    <span class="u-file-name">{{ file.name }}</span>
                    <div
                        class="u-status-tip"
                        :class="getFileStatus(file)"
                        v-show="getFileStatus(file) && statusMap[getFileStatus(file)]"
                    >
                        {{ statusMap[getFileStatus(file)] || "" }}
                        <i v-if="getFileStatus(file) === 'success'" class="el-icon-success"></i>
                    </div>
                    <div class="u-file-action">
                        <div class="u-play" @click.stop="onPlay(file)">
                            <i :class="getFilePlaying(file) ? 'el-icon-video-pause' : 'el-icon-video-play'"></i>
                        </div>
                        <div class="u-delete" @click.stop="onDelete(file)">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </div>
            </template>
        </el-upload>

        <div class="u-buttons">
            <el-progress v-if="totalNum" class="u-progress" :percentage="uploadedNum/totalNum * 100" status="success" :format="format" text-inside :stroke-width="24"></el-progress>
            <el-button class="" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            <el-button class="u-submit" type="primary" @click="onUpload" icon="el-icon-s-promotion" v-if="!isUploading">开始上传</el-button>
        </div>

        <audio-player-vue ref="player" @ended="onEnded" />
    </div>
</template>

<script>
import audioPlayerVue from "./AudioPlayer.vue";
import { uploadVoice } from "@/service/dbm/voice";
import { isAudioFile, convertToOgg } from "@/utils/dbm/voice";
import { cloneDeep } from "lodash";
export default {
    name: "BatchUpload",
    components: {
        audioPlayerVue,
    },
    props: {
        contents: {
            type: Array,
            default: () => [],
        },
        list: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            fileList: [],

            // 用于记录file文件的状态
            copyFileList: {},

            statusMap: {
                converting: "正在转换语音格式...",
                success: "语音格式转换成功",
                error: "语音格式转换失败",
                uploading: "正在上传语音...",
                uploaded: "语音上传成功",
                uploadError: "语音上传失败",
            },

            // 用于提交的数据
            voiceList: [],
            playId: "",
            isUploading: false,
        };
    },
    computed: {
        slugs() {
            return Object.keys(this.list);
        },
        vpkId() {
            return this.$route.params.id;
        },
        uploadedNum() {
            return Object.values(this.copyFileList).filter((file) => file._status === "uploaded").length;
        },
        totalNum() {
            return Object.keys(this.copyFileList).length;
        },
    },
    methods: {
        format() {
            return `${this.uploadedNum}/${this.totalNum}`;
        },
        onFileChange(file, fileList) {
            // 去除非音频文件
            if (fileList.some((_file) => !this.slugs.includes(_file.name.split(".")[0]))) {
                this.$message.error("存在标题名与预设slug不相符的文件，已自动过滤");
            }
            this.fileList = fileList.filter(
                (_file) =>
                    isAudioFile(_file.raw) &&
                    _file.size / 1024 / 1024 <= 1 &&
                    this.slugs.includes(_file.name.split(".")[0])
            );

            this.copyFileList = cloneDeep(this.fileList).reduce((acc, cur) => {
                acc[cur.uid] = {
                    ...cur,
                    slug: cur.name.split(".")[0],
                };
                return acc;
            }, {});

            // 转换格式
            for (const key in this.copyFileList) {
                const _file = this.copyFileList[key];
                this.$set(_file, "_status", "");
                this.$set(_file, "isPlaying", false);
                if (_file.raw.type !== "audio/ogg") {
                    _file._status = "converting";

                    convertToOgg(_file.raw)
                        .then((res) => {
                            _file.file = res;
                            _file._status = "success";
                        })
                        .catch((err) => {
                            console.log(err);
                            _file._status = "error";
                        });
                } else {
                    _file._status = "success";
                }
            }
        },
        getFileStatus(file) {
            return this.copyFileList[file.uid]["_status"];
        },
        getFilePlaying(file) {
            return this.copyFileList[file.uid]["isPlaying"];
        },
        // TODO: 重新转换
        onReconvert(file) {},
        onUpload() {
            // 上传
            this.isUploading = true;
            const promises = [];
            for (const key in this.copyFileList) {
                const _file = this.copyFileList[key];
                if (_file._status === "success") {
                    _file._status = "uploading";
                    const data = new FormData();
                    data.append("file", _file.file || _file.raw);
                    data.append("slug", _file.slug);
                    data.append("group", this.list[_file.slug]?.group);
                    data.append("vpk_id", this.vpkId);
                    data.append("remark", this.list[_file.slug]?.remark)

                    if (this.list[_file.slug]?.voice_uuid) {
                        data.append("replace_target", this.list[_file.slug].voice_uuid);
                    }

                    promises.push(
                        uploadVoice(data)
                            .then((res) => {
                                _file._status = "uploaded";
                                this.voiceList.push({
                                    slug: _file.name.split(".")[0],
                                    url: res.url,
                                });

                                return res.data.data;
                            })
                            .catch((err) => {
                                console.log(err);
                                _file._status = "uploadError";
                                throw err;
                            })
                    );

                }
            }

            Promise.allSettled(promises).then((res) => {
                this.$message.success("上传成功");
                // 所有都上传成功
                if (res.every((item) => item.status === "fulfilled")) {
                    this.$emit("onUploaded");
                }
            });
        },
        // 删除
        onDelete(file) {
            this.$refs.upload.handleRemove(file);
        },
        reset() {
            this.$refs.upload.clearFiles();
            this.fileList = [];
            this.copyFileList = {};
            this.voiceList = [];
            this.isUploading = false;
        },
        onPlay(file) {
            this.playId = file.uid;
            if (this.copyFileList[file.uid].isPlaying) {
                this.$refs.player.pause();
                this.copyFileList[file.uid].isPlaying = false;
            } else {
                const _file = this.copyFileList[file.uid]?.file || this.copyFileList[file.uid]?.raw;
                this.$refs.player.play(URL.createObjectURL(_file));
                this.copyFileList[file.uid].isPlaying = true;
            }
        },
        onEnded() {
            this.copyFileList[this.playId].isPlaying = false;
            this.playId = "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/upload.less";
.m-batch-upload {
    .flex;
    justify-content: center;
    margin-top: 20px;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    .auto(x);

    .m-uploader {
    }
    .el-upload {
        width: 720px;
    }
    .el-upload-dragger {
        .flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 300px;
    }
    .el-upload__text {
        font-size: 12px;
    }

    .el-upload-list {
        max-height: 350px;
        overflow: auto;
        .scrollbar();
        margin-top: 10px;
    }
    .u-progress {
        margin: 10px 0;
    }
}
</style>
