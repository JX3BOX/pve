<template>
    <swipe-cell :disabled="isPublic" @open="handleOpen" @close="handleClose">
        <div class="m-list-item" :style="style" :class="{ 'is-open': isOpen }" @click="toDetail">
            <img :src="mountBg" class="u-bg" alt="" />

            <div class="m-pz-header">
                <!-- <img class="u-author-avatar" :src="showAvatar(author.user_avatar)" alt="" /> -->
                <div class="u-pz-name">
                    <img class="u-xf-icon" :src="data.mount | showMountIcon" :alt="data.mount" />
                    <div class="u-name">{{ data.title }}</div>
                </div>
                <div class="m-pz-tags">
                    <i class="u-top" v-if="data.sticky"><i class="el-icon-top"></i></i>
                    <i class="u-sticky" v-if="~~data.sticky_time">置顶</i>
                    <i class="u-client" :class="data.client || 'std'">
                        <i class="u-star" v-if="~~data.star">★</i>
                        {{ data.client == "origin" ? "缘起" : "重制" }}</i
                    >
                </div>
            </div>
            <div class="m-pz-info">
                <!-- <img class="u-xf-icon" :src="data.mount | showMountIcon" :alt="data.mount" /> -->
                <el-tag
                    v-for="tag in tags"
                    effect="dark"
                    color="rgba(255, 255, 255, 0.2)"
                    class="u-tag"
                    size="small"
                    :key="tag"
                    >{{ tag }}</el-tag
                >
            </div>
            <div class="m-pz-attrs" v-if="overview && overview.attrs">
                <div class="u-attr">
                    <span class="u-attr-value">{{ overview.score }}</span>
                    <span class="u-attr-name">装分</span>
                </div>
                <div class="u-attr" v-for="attr in attrs" :key="attr">
                    <span class="u-attr-value"
                        >{{ showAttributeValue(attr, overview.attrs[attr]) }}
                        <span class="u-percent" v-show="attr.endsWith('Percent')">%</span>
                    </span>
                    <span class="u-attr-name">{{ attrs_map[attr] }}</span>
                </div>
            </div>
        </div>
        <template #right>
            <el-button-group class="u-cell-btn-group">
                <el-button type="primary" icon="el-icon-edit" class="u-cell-btn" size="mini"></el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="u-cell-btn"
                    size="mini"
                    @click="handleDel"
                ></el-button>
            </el-button-group>
        </template>
    </swipe-cell>
</template>

<script>
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { mount_group } from "@jx3box/jx3box-data/data/xf/mount_group.json";
import { mobile_attrs } from "@/assets/data/pz/mobile_attrs.js";
import { compareAttrs } from "@/assets/data/pz/overview_display.js";
import { showAttributeValue, getMountColor } from "@/utils/pz/tools.js";

import { SwipeCell } from "vant";
export default {
    name: "ListItem",
    components: {
        SwipeCell,
    },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    computed: {
        client() {
            return this.data.client;
        },
        author() {
            return this.data?.pz_author_info;
        },
        overview() {
            return this.data?.overview;
        },
        mountColor() {
            return getMountColor(this.data.mount);
        },
        style() {
            return {
                background: `linear-gradient(269.1deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), ${this.mountColor}`,
            };
        },
        tags() {
            return (this.data?.tags || []).slice(0, 5);
        },
        attrs() {
            let group;
            Object.entries(mount_group).forEach(([key, value]) => {
                if (value.includes(this.data.mount)) {
                    group = key;
                }
            });
            return mobile_attrs[this.client][this.pzTag][group];
        },
        pzTag() {
            return this.data?.tags?.includes("PvP") ? "PvP" : "PvE";
        },
        attrs_map() {
            return Object.assign(compareAttrs, { hitPercent: "命中" });
        },
        mountBg() {
            return `${__imgPath}image/mount_vector/${this.data.mount}.svg`;
        },
    },
    methods: {
        showAvatar,
        showAttributeValue,
        handleDel() {
            this.$emit("del", this.data);
        },
        handleOpen() {
            this.isOpen = true;
        },
        handleClose() {
            this.isOpen = false;
        },
        toDetail() {
            this.$router.push({
                name: "detail",
                params: {
                    id: this.data.id,
                },
            });
        },
    },
};
</script>
