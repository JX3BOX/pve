<template>
    <div class="m-vpk-voice" v-loading="loading || slugLoading">
        <template v-if="type === 'single'">
            <el-tabs v-model="tab">
                <el-tab-pane :label="g.label" :name="g.group" v-for="g in contents" :key="g.group">
                    <template #label>
                        <span class="u-tab-label">{{ g.label }}</span>
                        <em class="u-tab-num">（{{ getNum(g) }}）</em>
                    </template>
                    <div class="u-voice" v-for="v in g.children" :key="v.slug">
                        <span class="u-voice-status" :class="getVoiceStatusClass(v.slug)">
                            <img svg-inline src="@/assets/img/dbm/vpk/sound.svg" />
                            （{{ getVoiceStatus(v.slug) }}）
                        </span>
                        <el-button
                            type="warning"
                            size="small"
                            :icon="list[v.slug]['isPlaying'] ? 'el-icon-video-pause' : 'el-icon-video-play'"
                            @click="play(v.slug)"
                            :disabled="getVoiceStatus(v.slug) === '未设置'"
                            >{{ (list[v.slug]["isPlaying"] && "停止") || "试听" }}</el-button
                        >
                        <span class="u-voice-name"
                            ><el-input
                                v-model="list[v.slug]['remark']"
                                :placeholder="v.remark"
                                size="small"
                                :maxlength="15"
                                :minlength="1"
                                show-word-limit
                            >
                                <template #prepend>
                                    {{ v.remark }} <small class="u-slug">（{{ v.slug }}）</small>
                                </template>
                            </el-input></span
                        >
                        <span class="u-voice-op">
                            <el-button
                                type="primary"
                                size="small"
                                icon="el-icon-upload2"
                                @click="update(v.slug, g.group, v.remark)"
                                >上传</el-button
                            >
                            <el-button
                                plain
                                size="small"
                                icon="el-icon-circle-close"
                                :disabled="!list[v.slug].filename"
                                @click="reset(v.slug)"
                                >清空</el-button
                            >
                        </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <upload v-model="showUpload" :current="current" @submit="onSubmit"></upload>
            <audioPlayerVue ref="player" :playSrc="playSrc" @ended="onEnded" />
        </template>

        <template v-else>
            <BatchUpload :contents="contents" :list="list" @onUploaded="onUploaded" />
        </template>
    </div>
</template>

<script>
import { getAudioLink } from "@/utils/dbm/voice";
import { getMyVoiceList, clearVpkVoice, getManageVoiceList } from "@/service/dbm/voice";
import { getSlugList } from "@/service/dbm/slug";

import upload from "@/components/dbm/vpk/upload.vue";
import audioPlayerVue from "./AudioPlayer.vue";
import BatchUpload from "@/components/dbm/vpk/BatchUpload.vue";
export default {
    name: "VpkVoice",
    props: ["type", "super"],
    components: {
        upload,
        audioPlayerVue,
        BatchUpload,
    },
    data: function () {
        return {
            tab: "",
            contents: [],
            list: {},
            loading: false,
            slugLoading: false,

            showUpload: false,

            current: {
                slug: "",
                group: "",
                remark: "",
                voice_uuid: "",
            },

            voices: [],

            playSrc: "",
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                this.loadSlug();
            },
        },
    },
    methods: {
        // 返回语音条数
        getVoiceCount() {
            return Object.values(this.list).filter((item) => item.filename).length;
        },
        getNum(group) {
            const total = group?.children?.length;
            const num = group?.children?.filter((item) => this.list[item.slug].filename).length;
            return `${num}/${total}`;
        },
        initList() {
            this.list = this.contents.reduce((acc, group) => {
                group.children.forEach((child) => {
                    acc[child.slug] = {
                        group: group.group,
                        slug: child.slug,
                        remark: child.remark,
                        filename: "",
                        status: 0,
                        isPlaying: false,
                    };
                });
                return acc;
            }, {});
        },
        loadVoices() {
            this.loading = true;
            const getVoiceList = this.super ? getManageVoiceList : getMyVoiceList;
            getVoiceList(this.id)
                .then((res) => {
                    const data = res.data?.data?.filter((item) => !!item.slug) || [];
                    this.voices = data;
                    // 去除data中重复的创建时间较早的数据
                    const map = {};
                    data.forEach((item) => {
                        if (map[item.slug]) {
                            if (map[item.slug].id < item.id) {
                                map[item.slug] = item;
                            }
                        } else {
                            map[item.slug] = item;
                        }
                    });
                    Object.values(map).forEach((item) => {
                        this.list[item.slug]["filename"] = item?.filename;
                        this.list[item.slug]["remark"] = item?.remark;
                        this.list[item.slug]["status"] = item?.status;
                        this.list[item.slug]["id"] = item?.id;
                        this.list[item.slug]["voice_uuid"] = item?.voice_uuid;
                        this.list[item.slug]["created_at"] = item?.created_at;
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadSlug() {
            this.slugLoading = true;
            getSlugList()
                .then((res) => {
                    this.contents = res.data.data.reduce((acc, item) => {
                        const group = acc.find((g) => g.group === item.group);
                        if (group) {
                            group.children.push(item);
                        } else {
                            acc.push({
                                group: item.group,
                                label: item.group_name,
                                is_official: item.is_official,
                                children: [item],
                            });
                        }
                        return acc;
                    }, []).sort((a, b) => b.is_official - a.is_official);

                    this.tab = this.contents[0].group;

                    this.initList();

                    this.loadVoices();
                })
                .finally(() => {
                    this.slugLoading = false;
                });
        },
        onUploaded() {
            this.loadVoices();
            this.$emit("onUploaded");
        },
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
        reset(slug) {
            this.$confirm("确定要清空该语音吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    clearVpkVoice(this.id, slug).then(() => {
                        this.list[slug]["filename"] = "";
                        // this.list[slug]["remark"] = "";
                        this.list[slug]["status"] = 0;
                        this.$notify({
                            title: "操作成功",
                            type: "success",
                        });
                    });
                })
                .catch(() => {});
        },
        play(slug) {
            this.current.slug = slug;
            const isPlaying = this.list[slug].isPlaying;
            if (!isPlaying) {
                this.list[slug].isPlaying = true;
                this.playSrc = getAudioLink(this.list[slug]["filename"]);
                this.$refs.player.play(this.playSrc);
            } else {
                this.$refs.player.pause();
                this.list[slug].isPlaying = false;
            }
        },
        onEnded() {
            this.list[this.current.slug].isPlaying = false;
        },
        update(slug, group, remark) {
            this.current.slug = slug;
            this.current.group = group;
            this.current.remark = remark;
            this.current.voice_uuid =
                this.voices.filter((item) => item.slug === slug).sort((a, b) => b.id - a.id)[0]?.voice_uuid || "";
            this.showUpload = true;
        },
        onSubmit(data) {
            this.list[this.current.slug]["filename"] = data.download_url;
            this.list[this.current.slug]["remark"] = data?.voice?.remark;
            this.list[this.current.slug]["status"] = data?.voice?.status;
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
.m-vpk-voice {
    padding-bottom: 20px;
    .global-voice();
}
</style>
