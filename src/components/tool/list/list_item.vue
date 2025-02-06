<template>
    <li class="u-item">
        <!-- Banner -->
        <a class="u-banner" :href="postLink(item.ID)" :target="target"
            ><img :src="getBanner(item.post_banner, item.post_subtype)" :key="item.ID"
        /></a>

        <!-- 标题 -->
        <h2 class="u-post" :class="{ isSticky: item.sticky }">
            <!-- 图标 -->
            <img class="u-icon" svg-inline src="@/assets/img/tool/list/post.svg" />

            <!-- 标题文字 -->
            <a class="u-title" :style="showHighlight(item.color)" :href="postLink(item.ID)" :target="target">{{
                item.post_title || "无标题"
            }}</a>

            <!-- 角标 -->
            <span class="u-marks" v-if="item.mark && item.mark.length">
                <i v-for="mark in item.mark" class="u-mark" :key="mark">{{ showMark(mark) }}</i>
            </span>

            <span class="u-push" v-if="hasPermission">
                <time v-if="showPushDate" class="u-push__time" :class="{'is-recent': isRecent()}">{{ pushDate }} 已推送</time>
                <el-button class="u-push__btn" size="mini" type="warning" @click="onPush" icon="el-icon-s-promotion">推送</el-button>
            </span>
        </h2>

        <!-- 字段 -->
        <div class="u-content u-desc">
            {{ item.post_excerpt || item.post_title || "这个作者很懒,什么都没有留下" }}
        </div>

        <!-- 作者 -->
        <div class="u-misc">
            <img class="u-author-avatar" :src="showAvatar(item.author_info)" :alt="showNickname(item.author_info)" />
            <a class="u-author-name" :href="authorLink(item.post_author)" target="_blank">{{
                showNickname(item.author_info)
            }}</a>
            <span class="u-date">
                Updated on
                <time v-if="order == 'update'">{{ dateFormat(item.post_modified) }}</time>
                <time v-else>{{ dateFormat(item.post_date) }}</time>
            </span>
        </div>
    </li>
</template>

<script>
import { showAvatar, authorLink, showBanner, buildTarget } from "@jx3box/jx3box-common/js/utils";
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { cms as mark_map } from "@jx3box/jx3box-common/data/mark.json";
import { showDate } from "@jx3box/jx3box-common/js/moment.js";
import User from "@jx3box/jx3box-common/js/user";
import dayjs from "dayjs";
import bus from "@/utils/bus";
export default {
    name: "ListItem",
    props: ["item", "order", "type"],
    components: {},
    data: function () {
        return {
            target: buildTarget(),
        };
    },
    computed: {
        hasPermission() {
            return User.hasPermission('push_banner');
        },
        pushDate({item}) {
            const date = item?.log?.push_at
            return showDate(new Date(date));
        },
        showPushDate() {
            return Boolean(this.item?.log);
        },
    },
    watch: {},
    methods: {
        getBanner: function (val, subtype) {
            if (val) {
                return showBanner(val);
            } else {
                return __imgPath + `image/banner/${this.type}` + subtype + ".png";
            }
        },
        authorLink,
        postLink: function (val) {
            return location.origin + `/${this.type}/` + val;
        },
        showHighlight: function (val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        showMark: function (val) {
            return mark_map[val] || val;
        },
        showAvatar: function (userinfo) {
            return showAvatar(userinfo?.user_avatar);
        },
        showNickname: function (userinfo) {
            return userinfo?.display_name || "匿名";
        },
        dateFormat: function (gmt) {
            return showDate(new Date(gmt));
        },
        showDate,
        // 是否为30天内
        isRecent: function () {
            const date = this.item?.log?.push_at
            return dayjs().diff(dayjs(date), "day") < 30;
        },
        onPush() {
            bus.emit("design-task", this.item);
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>
