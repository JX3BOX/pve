<template>
    <div class="m-single-voices">
        <el-tabs v-model="tab">
            <el-tab-pane :label="g.label" :name="g.group" v-for="g in slugs" :key="g.group"> </el-tab-pane>
        </el-tabs>

        <div class="m-single-voices__header">
            <el-button
                class="u-auto-btn"
                @click="onAutoPlay"
                size="small"
                type="warning"
                :icon="isAutoPlay ? 'el-icon-video-pause' : 'el-icon-video-play'"
                >{{ (isAutoPlay && "停止播放") || "自动播放" }}</el-button
            >
            <span class="u-playing" v-if="currentPlaySlug">当前播放: {{ list[currentPlaySlug].remark }}</span>
            <el-button v-if="mode == 'manage_single'" type="success" class="u-pass-btn" size="small" icon="el-icon-check" @click="onAllPass"
                        >全部通过</el-button
                    >
        </div>

        <template v-if="mode == 'manage_single'">
            <div class="m-voices-list m-voices-list--check" v-if="voices && voices.length">
                <!-- <div class="m-single-voices__header">
                    <el-button
                        class="u-auto-btn"
                        @click="onAutoPlay"
                        size="small"
                        type="warning"
                        :icon="isAutoPlay ? 'el-icon-video-pause' : 'el-icon-video-play'"
                        >{{ (isAutoPlay && "停止播放") || "自动播放" }}</el-button
                    >
                    <span class="u-playing" v-if="currentPlaySlug">当前播放: {{ list[currentPlaySlug].remark }}</span>
                    <el-button type="success" class="u-pass-btn" size="small" icon="el-icon-check" @click="onAllPass"
                        >全部通过</el-button
                    >
                </div> -->
                <div class="u-voice" v-for="v in voices" :key="v.slug">
                    <span class="u-voice-status" :class="getVoiceStatusClass(v.slug)">
                        <img svg-inline src="@/assets/img/dbm/vpk/sound.svg" />
                        （{{ getVoiceStatus(v.slug) }}）
                    </span>
                    <!-- 当前激活的可以操作，否则disabled -->
                    <el-button
                        type="warning"
                        size="small"
                        :icon="currentList[v.slug]['isPlaying'] ? 'el-icon-video-pause' : 'el-icon-video-play'"
                        @click="play(v.slug)"
                        :disabled="!!currentSlug && currentSlug !== v.slug"
                        >{{ (currentList[v.slug]["isPlaying"] && "停止") || "试听" }}</el-button
                    >
                    <span class="u-voice-name"
                        ><el-input
                            v-model="list[v.slug]['remark']"
                            :placeholder="v.remark"
                            size="small"
                            :maxlength="15"
                            :minlength="1"
                            show-word-limit
                            disabled
                        >
                            <template #prepend>
                                {{ v.remark }} <small class="u-slug">（{{ v.slug }}）</small>
                            </template>
                        </el-input></span
                    >

                    <span class="u-voice-op">
                        <el-button
                            type="success"
                            size="small"
                            icon="el-icon-circle-check"
                            @click="onAudit(v.slug, 'pass')"
                            >通过</el-button
                        >
                        <el-button plain size="small" icon="el-icon-circle-close" @click="onAudit(v.slug, 'refuse')"
                            >拒绝</el-button
                        >
                    </span>
                </div>
            </div>
            <template v-else>
                <el-empty class="m-voices-null" description="暂无数据" :image-size="120"></el-empty>
            </template>
        </template>
        <template v-else>
            <el-table :data="voices" stripe size="mini">
                <el-table-column label="语音" min-width="200px">
                    <template #default="{ row }">
                        <div class="u-voice">
                            <span class="u-voice-status isNormal" :class="getVoiceStatusClass(row.slug)">
                                <img src="@/assets/img/dbm/vpk/sound_playing.gif" v-if="row.isPlaying" />
                                <img src="@/assets/img/dbm/vpk/sound_static.gif" v-else />
                                <span v-if="mode !== 'public_single'">（{{ getVoiceStatus(row.slug) }}）</span>
                            </span>
                            <el-button
                                type="warning"
                                size="mini"
                                icon="el-icon-video-play"
                                @click="playUser(row.slug)"
                                :disabled="!!currentSlug && currentSlug !== row.slug"
                                >{{ (row.isPlaying && "停止") || "试听" }}</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="标识符" prop="slugName"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="上传时间" prop="created_at" min-width="150px"></el-table-column>
            </el-table>
        </template>

        <audioPlayerVue ref="player" @ended="onEnded" />
    </div>
</template>

<script>
import { getAudioLink } from "@/utils/dbm/voice";
import { cloneDeep, flattenDeep } from "lodash";
import audioPlayerVue from "./AudioPlayer.vue";
import { auditVoice } from "@/service/dbm/voice";
export default {
    name: "SingleVoices",
    components: {
        audioPlayerVue,
    },
    props: {
        list: {
            type: Object,
            default: () => ({}),
        },
        slugs: {
            type: Array,
            default: () => [],
        },
        mode: {
            type: String,
            default: "public_single",
        },
    },
    data() {
        return {
            tab: "",

            // 手动播放
            currentList: {},
            currentSlug: "",
            voices: [],

            // 自动播放
            isAutoPlay: false,
            currentPlayIndex: 0,
            currentPlaySlug: "",
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    watch: {
        slugs: {
            deep: true,
            immediate: true,
            handler() {
                if (this.slugs.length) {
                    this.tab = this.slugs[0].group;

                    this.voices =
                        this.slugs
                            .find((item) => item.group === this.tab)
                            ?.children.map((item) => {
                                if (this.list[item.slug]?.filename) {
                                    return {
                                        ...item,
                                        ...this.list[item.slug],
                                        slugName: item.remark,
                                        isPlaying: false,
                                    };
                                }
                                return false;
                            })
                            .filter(Boolean) || [];
                }
            },
        },
        tab() {
            this.voices =
                this.slugs
                    .find((item) => item.group === this.tab)
                    ?.children.map((item) => {
                        if (this.list[item.slug]?.filename) {
                            return {
                                ...item,
                                ...this.list[item.slug],
                                slugName: item.remark,
                                isPlaying: false,
                            };
                        }
                        return false;
                    })
                    .filter(Boolean) || [];
        },
        list: {
            deep: true,
            immediate: true,
            handler() {
                this.currentList = cloneDeep(this.list);

                for (const key in this.currentList) {
                    this.$set(this.currentList[key], "isPlaying", false);
                }
            },
        },
    },
    methods: {
        getVoiceStatus(slug) {
            const item = this.list[slug];
            const statusMap = {
                "-1": "未通过",
                0: "审核中",
                1: "已通过",
            };
            return (item?.filename && statusMap[item.status]) || "未设置";
        },
        getVoiceStatusClass(slug) {
            const item = this.list[slug];
            const statusMap = {
                "-1": "isReject",
                0: "isChecking",
                1: "isReady",
            };
            return (item?.filename && statusMap[item.status]) || "";
        },
        // ========= 管理用 =========
        play(slug) {
            this.currentSlug = slug;
            const isPlaying = this.currentList[slug].isPlaying;

            if (!isPlaying) {
                this.currentList[slug].isPlaying = true;
                this.playSrc = getAudioLink(this.currentList[slug]["filename"]);
                this.$refs.player.play(this.playSrc);
            } else {
                this.$refs.player.pause();
                this.currentList[slug].isPlaying = false;
            }
        },
        onEnded() {
            if (this.mode !== "manage_single") {
                this.onEndedUser();
            }
            if (!this.isAutoPlay) {
                this.currentList[this.currentSlug] && (this.currentList[this.currentSlug].isPlaying = false);
                this.currentSlug = "";
            } else {
                this.currentPlayIndex++;
                if (this.currentPlayIndex < this.voices.length) {
                    this.currentPlaySlug = this.voices[this.currentPlayIndex].slug;
                    const playSrc = this.getLink();
                    if (playSrc) {
                        this.$refs.player.play(playSrc);
                    } else {
                        this.currentPlayIndex = 0;
                        this.currentPlaySlug = "";
                        this.isAutoPlay = false;
                    }
                } else {
                    this.currentPlayIndex = 0;
                    this.currentPlaySlug = "";
                    this.isAutoPlay = false;
                }
            }
        },
        onAutoPlay() {
            this.isAutoPlay = !this.isAutoPlay;
            if (this.isAutoPlay) {
                this.currentPlayIndex = 0;
                this.currentPlaySlug = this.voices[this.currentPlayIndex].slug;
                const playSrc = this.getLink();
                if (playSrc) {
                    this.$refs.player.play(playSrc);
                } else {
                    this.currentPlayIndex = 0;
                    this.currentPlaySlug = "";
                    this.isAutoPlay = false;
                }
            } else {
                this.currentPlayIndex = 0;
                this.currentPlaySlug = "";
            }
        },
        getLink() {
            const filename = this.currentList[this.currentPlaySlug]["filename"];
            const playSrc = (filename && getAudioLink(filename)) || "";

            return playSrc;
        },
        // 审批
        onAudit(slug, action) {
            const item = this.list[slug];
            auditVoice(this.id, item?.id, action).then((res) => {
                this.$message.success("操作成功");
                item.status = action === "pass" ? 1 : -1;
            });
        },
        // 全部通过
        onAllPass() {
            const promises = []
            this.voices.forEach((item) => {
                if (item.status != 1) {
                    promises.push(auditVoice(this.id, item?.id, "pass"));
                }
            });

            promises?.length && Promise.all(promises).then((res) => {
                this.$message.success("操作成功");
                this.voices.forEach((item) => {
                    const _item = this.list[item.slug];
                    this.$set(_item, "status", 1);
                });
            });
        },
        // ========= 用户用 =========
        playUser(slug) {
            const index = this.voices.findIndex((item) => item.slug === slug);
            const isPlaying = this.voices[index].isPlaying;
            this.currentSlug = slug;
            if (isPlaying) {
                this.$refs.player.pause();
                this.voices[index].isPlaying = false;
            } else {
                this.$refs.player.play(getAudioLink(this.voices[index]["filename"]));
                this.voices[index].isPlaying = true;
            }
        },
        onEndedUser() {
            const index = this.voices.findIndex((item) => item.slug === this.currentSlug);
            index > -1 && (this.voices[index].isPlaying = false);
            this.currentSlug = "";
        },
    },
};
</script>

<style lang="less">
.m-single-voices {
    .mt(20px);
    .u-auto-btn {
        margin-bottom: 10px;
        .u-slug {
            font-size: 12px;
        }
    }
    .global-voice();

    .u-pass-btn {
        .fr;
    }
}
.m-single-voices__header {
    .u-playing {
        font-size: 13px;
        margin-left: 10px;
    }
}

.m-voices-null {
    padding: 100px 0;
    .x;
    .el-empty__image {
        .auto(x);
        .db;
    }
    .el-empty__description {
        .fz(14px);
        color: #999;
    }
}
.m-voices-list--check {
    .u-voice {
        .mb(10px);
    }
}
</style>
