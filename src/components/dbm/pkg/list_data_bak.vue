<template>
    <div class="m-datalist-list">
        <ul>
            <li class="m-datalist-item" v-for="(item, i) in data" :key="i" @click="viewData(item.ID)">
                <a class="u-icon" @click.stop :href="item.ID | getLink">
                    <img :src="item.icon | getIcon" />
                </a>
                <div class="u-name">
                    <span class="u-mark" v-if="item.mark == 'jx3box'"> <i class="el-icon-cpu"></i> 官方 </span>
                    <a class="u-title" @click.stop :href="item.ID | getLink">{{
                        item.title.slice(0, 40) || "无标题数据"
                    }}</a>
                    <span class="u-status" v-if="item.status"> <i class="el-icon-lock"></i> 私有 </span>
                </div>
                <div class="u-desc">
                    {{ item.desc || "作者很懒，没有留下任何介绍" }}
                </div>
                <div class="u-meta">
                    <span class="u-meta-item" v-if="!isMydata">
                        <em class="u-meta-label">作者</em>
                        <span class="u-meta-value">
                            <a @click.stop :href="item.uid | authorLink" v-if="item.uid" target="_blank">
                                <i class="el-icon-link"></i>
                                {{ item.author || "未知" }}
                            </a>
                            <span v-else>佚名</span>
                        </span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">BUFF</em>
                        <span class="u-meta-value">{{ (item.BUFF && item.BUFF.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">DEBUFF</em>
                        <span class="u-meta-value">{{ (item.DEBUFF && item.DEBUFF.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">CASTING</em>
                        <span class="u-meta-value">{{ (item.CASTING && item.CASTING.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">NPC</em>
                        <span class="u-meta-value">{{ (item.NPC && item.NPC.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">DOODAD</em>
                        <span class="u-meta-value">{{ (item.DOODAD && item.DOODAD.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">TALK</em>
                        <span class="u-meta-value">{{ (item.TALK && item.TALK.length) || 0 }}</span>
                    </span>
                    <span class="u-meta-item">
                        <em class="u-meta-label">CHAT</em>
                        <span class="u-meta-value">{{ (item.CHAT && item.CHAT.length) || 0 }}</span>
                    </span>
                </div>
                <div class="u-misc">
                    <time class="u-time">
                        <i class="el-icon-refresh"></i>
                        {{ showRecently(item.updated_at) }}
                    </time>
                    <span class="u-delete" v-if="isMydata || isSuper" @click.stop="delData(item.ID)">
                        <i class="el-icon-delete"></i> 删除
                    </span>
                </div>
                <div class="u-op" v-if="isMydata">
                    <el-button
                        class="u-edit"
                        type="primary"
                        size="mini"
                        icon="el-icon-edit-outline"
                        @click.stop="editData(item.ID)"
                        >编辑</el-button
                    >
                    <el-button
                        class="u-build"
                        type="primary"
                        size="mini"
                        icon="el-icon-printer"
                        @click.stop="buildData(item.ID)"
                        >构建</el-button
                    >
                </div>
                <div class="u-op" v-else>
                    <el-button
                        class="u-view"
                        type="primary"
                        size="mini"
                        icon="el-icon-full-screen"
                        @click.stop="viewData(item.ID)"
                        >查看数据详情</el-button
                    >
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { getIcon } from "@/assets/js/common.js";
import { showRecently } from "@/utils/dbm/dateFormat";

import { delData } from "@/service/dbm/data.js";
export default {
    name: "DataList",
    props: ["list"],
    data: function () {
        return {
            isSuper: User.getInfo().group > 60,
        };
    },
    computed: {
        data: function () {
            return this.list;
        },
        isMydata: function () {
            return this.$route.name == "myData";
        },
    },
    methods: {
        viewData: function (val) {
            this.$router.push({
                name: "viewData",
                params: {
                    id: val,
                },
            });
        },
        editData: function (val) {
            this.$router.push({
                name: "editData",
                params: {
                    id: val,
                },
            });
        },
        buildData: function (val) {
            // TODO:
            this.$router.push({
                name: "buildData",
                params: {
                    id: val,
                },
            });
        },
        delData: function (id) {
            if (!id) return;
            this.$alert("确定删除么？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        delData(id).then((res) => {
                            this.$message({
                                message: "删除成功！",
                                type: "warning",
                            });
                        });
                    }
                },
            });
        },
        showRecently,
    },
    filters: {
        getIcon,
        getLink: function (id) {
            return "/dbm/#/data/view/" + id;
        },
        authorLink,
    },
    mounted: function () {
        // console.log(this.data);
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/list_data.less";
</style>
