<template>
    <div class="m-vpk-form">
        <el-form ref="form" :model="form" label-position="top">
            <el-form-item label="语音包名称">
                <el-input
                    v-model="form.title"
                    :maxlength="50"
                    show-word-limit
                    placeholder="取一个好听的名字吧"
                ></el-input>
            </el-form-item>
            <el-form-item label="特别说明">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="6"
                    :maxlength="500"
                    show-word-limit
                    placeholder="补充描述当前包含的语音内容等"
                ></el-input>
            </el-form-item>
            <el-form-item label="客户端">
                <el-radio-group v-model="form.client">
                    <el-radio v-for="item in clients" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类型标签">
                <div class="u-tags">
                    <el-checkbox-group v-model="form.tags">
                        <el-checkbox :label="tag" v-for="tag in tags" :key="tag" class="u-tag"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
            <el-form-item label="互动开关">
                <div class="u-interact">
                    <el-switch
                        v-model="form.allow_comment"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="允许评论"
                    ></el-switch>
                    <el-switch
                        v-model="form.allow_gift"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="允许打赏"
                    ></el-switch>
                </div>
            </el-form-item>
            <el-form-item label="欢迎语音" class="u-hello" v-if="~~id">
                <div class="u-voice">
                    <span class="u-voice-status">
                        <img svg-inline src="@/assets/img/dbm/vpk/sound.svg" />
                    </span>
                    <el-button
                        type="warning"
                        size="small"
                        :icon="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"
                        :disabled="!form.hello_voice"
                        @click="play"
                        >{{ (isPlaying && "停止") || "试听" }}</el-button
                    >
                    <el-button type="primary" size="small" icon="el-icon-upload" @click="onUpload">上传</el-button>
                </div>
            </el-form-item>
        </el-form>

        <upload v-model="showUpload" :current="current" @submit="onSubmit" :isSingle="false"></upload>
        <audio-player-vue ref="player" @ended="onEnded" />
    </div>
</template>

<script>
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import upload from "./upload.vue";
import audioPlayerVue from "./AudioPlayer.vue";
import { getAudioLink } from "@/utils/dbm/voice";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
export default {
    name: "VpkForm",
    props: ["data"],
    components: {
        upload,
        audioPlayerVue,
    },
    data: function () {
        return {
            form: {
                title: "",
                description: "",
                tags: [],
                allow_comment: 1,
                allow_gift: 1,
                hello_voice: "",
                client: location.href.includes("origin") ? "origin" : "std"
            },
            tags: [],
            clients: [
                {
                    label: "双端",
                    value: "all",
                },
                {
                    label: "重制",
                    value: "std",
                },
                {
                    label: "缘起",
                    value: "origin",
                },
            ],

            showUpload: false,
            current: {},
            isPlaying: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    watch: {
        data: {
            deep: true,
            handler: function (data) {
                this.form = data;
            },
        },
        form: {
            deep: true,
            handler: function (data) {
                this.$emit("update", data);
            },
        },
    },
    created() {
        this.loadTags();
    },
    methods: {
        onSubmit(data) {
            this.form.hello_voice = data?.voice.filename;
        },
        play() {
            if (this.isPlaying) {
                this.$refs.player.pause();
                this.isPlaying = false;
            } else {
                this.$refs.player.play(getAudioLink(this.form.hello_voice));
                this.isPlaying = true;
            }
        },
        onUpload() {
            this.showUpload = true;
        },
        onEnded() {
            this.isPlaying = false;
        },
        loadTags() {
            try {
                const tags = sessionStorage.getItem("vpk_tags");
                if (tags) {
                    this.tags = tags.split(",");
                } else {
                    getBreadcrumb("vpk_tags").then((res) => {
                        sessionStorage.setItem("vpk_tags", res);
                        this.tags = res.split(",");
                    });
                }
            } catch (error) {
                console.log(error);
                this.tags = [];
            }
        },
    },
};
</script>

<style lang="less">
.m-vpk-form {
    .u-interact,
    .u-tags,
    .u-hello {
        .flex;
        align-items: center;
        .mb(10px);

        .el-form-item__label {
            .mr(20px);
            padding-bottom: 0;
        }
        .el-form-item__content {
            .flex;
            align-items: center;
        }
        .el-switch {
            .mr(40px);
        }

        .u-tag,
        .el-switch__label {
            .normal;
        }

        .el-checkbox-group {
            flex-wrap: wrap;
        }
    }
    .el-form-item__label {
        .bold;
    }
    .u-div-icon {
        .mr(3px);
    }
    .global-voice();
    .u-tags {
        .el-checkbox-group,
        .u-tag,
        .el-checkbox__input,
        .el-checkbox__inner {
            .flex;
            align-items: center;
        }
    }
}
</style>
