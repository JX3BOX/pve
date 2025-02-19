<template>
    <div class="m-emotion">
        <h1 class="m-icons-title">剑三表情包</h1>
        <div class="m-emotion-nav">
            <div
                class="u-btn"
                :class="{ active: item.group_id === active.group_id }"
                v-for="(item, i) in emoList"
                :key="i"
                @click="toChangeEmo(item)"
            >
                <span>
                    {{ item.group_name }} <b>（{{ item.items.length }}）</b>
                </span>
            </div>
        </div>
        <!-- 移动端选择表情包 -->
        <div class="m-mobile-layout">
            <div class="m-mobile-header">
                <title class="m-mobile_maps__title">{{ active.group_name }}</title>
                <div @click="drawerVisible = true" class="m-drawer_open">
                    选择表情包
                    <i class="el-icon-search el-icon--right"></i>
                </div>
            </div>
            <div class="m-mobile-toolbar">
                <el-drawer title="全部表情包" :visible.sync="drawerVisible">
                    <div class="m-m-drawer-body">
                        <el-input size="small" v-model="search" clearable>
                            <template slot="prepend">表情包</template>
                        </el-input>
                        <div class="m-emotion-nav m-emotion-nav__mobile">
                            <div
                                class="u-btn"
                                :class="{ active: item.group_id === active.group_id }"
                                v-for="(item, i) in emoList"
                                :key="i"
                                @click="toChangeEmo(item);drawerVisible = false"
                                v-show="!search || item.group_name.includes(search)"
                            >
                                <span>
                                    {{ item.group_name }} <b>（{{ item.items.length }}）</b>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </div>

        <div class="m-emotion-list">
            <el-image
                class="u-img"
                v-for="emoji in active.items"
                :key="emoji.emotion_id"
                v-bind:alt="emoji.key"
                :title="`${emoji.key}`"
                :src="`${EmojiPath}${emoji.filename}`"
            >
                <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading"></i>
                </div>
                <div slot="error" class="image-slot">
                    <i class="el-icon-warning-outline"></i>
                </div>
            </el-image>
        </div>
        <div class="m-emotion-download">
            <el-button
                class="u-btn"
                :loading="isDownloadingEmoji"
                type="primary"
                @click.native.stop="handleDownloadEmoji('zip')"
                icon="el-icon-download"
            >
                下载压缩包 (.zip)
            </el-button>
            <el-button
                class="u-btn"
                :loading="isDownloadingEmoji"
                type="primary"
                @click.native.stop="handleDownloadEmoji('eif')"
                icon="el-icon-download"
            >
                下载QQ表情包 (.eif)
            </el-button>
        </div>
    </div>
</template>
<script>
import { getEmoList } from "@/service/tool/icons.js";
import { __dataPath, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "emotion",
    props: ["list"],
    data: function () {
        return {
            emoList: [],
            active: "",
            EmojiPath: __imgPath + "emotion/output/",
            EmotionRoot: __imgPath + "emotion/",
            isDownloadingEmoji: false,

            drawerVisible: false,
            search: "",
        };
    },
    computed: {},
    methods: {
        getData() {
            getEmoList().then((res) => {
                this.emoList = res;

                const search = new URLSearchParams(location.search);
                const type = search.get("type");

                if (type) {
                    this.active = this.emoList.find((item) => item.group_name == type);
                } else {
                    this.active = res[0];
                }
            });
        },
        toChangeEmo(item) {
            this.active = item;
        },
        handleDownloadEmoji(fileType) {
            this.isDownloadingEmoji = true;

            const { EmotionRoot, active } = this;

            let link = document.createElement("a");
            link.href = `${EmotionRoot}${fileType}/${active.group_name}.${fileType}`;
            link.download = `${active.group_name}.${fileType}`;
            link.click();

            this.isDownloadingEmoji = false;
        },
    },
    filters: {},
    created: function () {
        this.getData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/design/emotion.less";
</style>
