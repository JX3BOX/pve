<template>
    <el-dialog
        custom-class="m-item-countdown-edit"
        title="编辑倒计时"
        width="1000px"
        :append-to-body="true"
        :lock-scroll="false"
        :center="true"
        :visible="visible"
        :close-on-click-modal="false"
        @close="visible = false"
    >
        <el-divider content-position="left"><i class="el-icon-files"></i> 生成预览</el-divider>
        <el-input class="u-countdown-content" v-model="content" :disabled="true"></el-input>

        <el-divider content-position="left"><i class="el-icon-alarm-clock"></i> 计时项</el-divider>
        <div class="u-countdown-sections">
            <table v-if="sections.length">
                <thead>
                    <tr>
                        <th></th>
                        <th>持续时间/血量节点</th>
                        <th>提示内容</th>
                        <th>语音</th>
                        <th></th>
                    </tr>
                </thead>
                <draggable
                    handle=".u-drag-arrow"
                    tag="tbody"
                    v-model="sections"
                    animation="500"
                    @start="drag = true"
                    @end="drag = false"
                >
                    <tr v-for="(section, index) in sections" :key="index">
                        <!-- 拖拽列 -->
                        <td class="u-drag-arrow"><i class="el-icon-rank"></i></td>
                        <td><el-input size="mini" v-model="section.node" placeholder="血量节点"></el-input></td>
                        <td><el-input size="mini" v-model="section.label" placeholder="提示"></el-input></td>
                        <td>
                            <div class="u-voice-about">
                                <el-cascader
                                    :props="{ emitPath: false }"
                                    size="mini"
                                    v-model="section.voice"
                                    :clearable="true"
                                    :filterable="true"
                                    :options="slugs"
                                    :show-all-levels="false"
                                ></el-cascader>
                            </div>
                        </td>
                        <td>
                            <el-button size="mini" @click="delSection(index)" type="info" icon="el-icon-delete" plain>
                                删除
                            </el-button>
                        </td>
                    </tr>
                </draggable>
            </table>
            <el-button size="mini" class="u-countdown-add" icon="el-icon-plus" @click="addSection" type="primary" plain
                >新增</el-button
            >
        </div>
        <!-- 语音包选择 -->
        <div class="u-choose-voice"> </div>
        <!-- 预览区域 -->
        <el-divider content-position="left">
            <el-tooltip class="item" effect="dark" placement="top" content="暂时只支持预览时间节点">
                <div><i class="el-icon-time"></i> 效果预览 <i class="el-icon-info"></i></div>
            </el-tooltip>
        </el-divider>
        <div class="u-countdown-preview__wrapper">
            <div class="u-countdown-preview">
                <img class="u-countdown-icon" :src="iconUrl" />
                <div class="u-countdown-bar" :style="barStyle"></div>
                <span class="u-countdown-tip">{{ play_content }}</span>
                <span class="u-countdown-time">{{ play_time }}s</span>
            </div>
            <div class="u-preview-setting">
                <vpk-select v-model="play_vpk"></vpk-select>
                <el-button
                    v-if="!playing"
                    class="u-countdown-preview-play"
                    icon="el-icon-video-play"
                    @click="preview"
                    :disabled="!sections.length"
                    type="primary"
                    plain
                    size="small"
                >
                    预览
                </el-button>
                <el-button
                    v-else
                    class="u-countdown-preview-play"
                    icon="el-icon-refresh-right"
                    @click="preview"
                    plain
                    size="small"
                >
                    停止
                </el-button>
            </div>
        </div>
        <!-- 保存 -->
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import draggable from "vuedraggable";
import cdcolors from "@/assets/data/dbm/countdown_colors.json";
import { isArray, cloneDeep, sortBy } from "lodash";
import { getVoiceList } from "@/service/dbm/voice";
import { getAudioLink } from "@/utils/dbm/voice";
import { mapState } from "vuex";
import VpkSelect from "@/components/dbm/vpk/vpk_select.vue";

export default {
    name: "ItemCountdownEdit",
    components: { draggable, VpkSelect },
    props: {},
    data: () => ({
        drag: true,
        defaultSection: {
            node: 0,
            label: "",
            voice: "",
            voice_official: true,
        },

        index: 0,
        line: null,
        visible: false,
        content: "",
        sections: [],

        // 预览相关
        playing: false,
        play_timer: null,
        play_content: "DBM内容",
        play_time: 1,
        play_bar_width: 100,
        // 语音包相关
        play_vpk: 12,
        play_voice_list: [],
    }),
    methods: {
        parseContent(content) {
            if (!content) return;
            const sections = content.split(";");
            for (let section of sections) {
                let [node, label, voice] = section.split(",");
                // 语音包相关解析
                if (voice) {
                    const [voice_type, voice_slug] = voice.split(":");
                    const voice_official = true;
                    this.sections.push({ node, label, voice: voice_slug, voice_official });
                } else {
                    this.sections.push({ node, label, voice: null });
                }
            }
        },
        open(line) {
            this.reset();
            this.visible = true;
            this.line = line;
            if (!isNaN(line.nTime)) this.content = `${line.nTime},${line.szName}`;
            else this.content = line.nTime;

            this.parseContent(this.content);
            this.drag = false;
        },
        reset() {
            this.content = "";
            this.line = null;
            this.sections = [];
        },
        save() {
            this.$set(this.line, "nTime", this.content);
            this.reset();
            this.visible = false;
        },
        addSection() {
            this.sections.push({ ...this.defaultSection });
        },
        delSection(index) {
            this.sections = this.sections.filter((_, i) => i !== index);
        },
        playVoice(section) {
            if (section && section.voice) {
                const slug = section.voice;
                const voice = this.play_voice_list.find((item) => item.slug === slug);
                if (voice) {
                    const filename = voice.filename;
                    const audioLink = getAudioLink(filename);
                    const audio = new Audio(audioLink);
                    audio.play();
                }
            }
        },
        preview() {
            if (this.playing) {
                this.stopPreview();
            } else {
                this.playing = true;
                const play_queue = sortBy(cloneDeep(this.sections), "node");

                let start_time = new Date().getTime() / 1000;
                let now_section = play_queue.shift();
                let node_time = now_section.node;
                this.playVoice(now_section);

                this.play_timer = setInterval(() => {
                    const now_time = new Date().getTime() / 1000 - start_time;
                    if (now_section && now_time >= now_section.node) {
                        now_section = play_queue.shift();
                        node_time = now_section?.node - now_time;
                        this.playVoice(now_section);
                    }

                    if (!now_section) {
                        this.stopPreview();
                        return;
                    }
                    this.play_time = (now_section.node - now_time).toFixed(0);
                    this.play_bar_width = ((now_section.node - now_time) / node_time) * 100;
                    this.play_content = now_section.label;
                }, 10);
            }
        },
        stopPreview() {
            this.playing = false;
            clearInterval(this.play_timer);
            this.play_queue = [];
            this.play_content = "DBM内容";
            this.play_time = "-";
            this.play_bar_width = 100;
        },
        getVoiceList() {
            this.play_vpk_loading = true;
            getVoiceList(this.play_vpk).then((res) => {
                const { code, data, msg } = res.data;
                if (code !== 0) return;
                this.play_voice_list = data.voices;
            });
        },
    },
    computed: {
        ...mapState(["slugs"]),
        iconUrl() {
            if (!this.line) return iconLink(13);
            const icon = this.line.nIcon || 13;
            return iconLink(icon);
        },
        barColor() {
            if (!this.line) return cdcolors[7];
            const color = cdcolors[this.line.nFrame] || cdcolors[7];
            return color;
        },
        barStyle() {
            return {
                background: this.barColor,
                width: `calc(${this.play_bar_width}% - 26px)`,
            };
        },
    },
    watch: {
        play_vpk: {
            immediate: true,
            handler() {
                this.getVoiceList();
            },
        },
        sections: {
            deep: true,
            handler() {
                const sections = this.sections.map((section) => {
                    const { node, label, voice, voice_official } = section;
                    let str = `${node},${label ?? ""}`;
                    if (voice) str += `,VO:${voice}`;
                    return str;
                });
                this.content = sections.join(";");
            },
        },
    },
};
</script>

<style lang="less">
.m-item-countdown-edit {
    .u-countdown-content {
        .mb(12px);
    }

    .u-countdown-add {
        .mt(12px);
        width: 100%;
    }

    .u-countdown-sections {
        table {
            width: 100%;
            // border-spacing: 10px;
            border-collapse: collapse;
        }

        th {
            background-color: @bg-light;
        }

        td,
        th {
            border: 1px solid #eee;
            padding: 5px 10px;
            .x;
        }

        .u-voice-about {
            display: flex;
            gap: 6px;
            align-items: center;
            justify-content: center;
        }
    }

    @icon-size: 26px;
    .black-outline {
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    }

    .u-countdown-preview__wrapper {
        .flex-center;
        flex-direction: column;
        gap: 16px;
    }

    .u-preview-setting {
        .flex-center;
        gap: 10px;
    }

    .u-countdown-preview-play {
        width: 100px;
    }

    .u-countdown-preview {
        .pr;
        .size(300px, 26px);

        .u-countdown-icon {
            .pa;
            left: 0;
            .size(@icon-size);
            display: block;
        }

        .u-countdown-bar {
            .pa;
            left: @icon-size;
            width: calc(300px - @icon-size);
            height: 100%;
            background: #000a;
        }

        .u-countdown-tip {
            color: yellow;
            .black-outline;
            .pa;
            left: 30px;
            .fz(14px, 26px);
        }

        .u-countdown-time {
            color: white;
            .black-outline;
            .pa;
            .fz(14px, 26px);
            right: 4px;
        }
    }
}
</style>
