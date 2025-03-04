<template>
    <div class="m-vpk-list m-pkg-rank__table" v-if="list && list.length" :class="`m-vpk-list--${mode}`">
        <div class="m-vpk-item" v-for="item in list" :key="item.uuid" @click="viewVpk(item)">
            <Avatar
                class="u-avatar"
                :uid="item.user_id"
                :url="getUserMeta(item, 'avatar')"
                :frame="getUserMeta(item, 'user_avatar_frame')"
                size="xs"
                @click.stop
            ></Avatar>
            <div class="m-vpk-item__content">
                <span class="u-id">
                    <i class="u-type-label">UUID</i>
                    <i class="u-type-value">
                        {{ item.uuid }}
                    </i>
                </span>
                <span class="m-vpk-item__title">
                    <span class="u-title">{{ item.title || "未命名" }} </span>
                </span>
                <!-- <div class="u-desc" v-html="nl2br(item.description) || '这个作者很懒，什么都没有BB'"></div> -->
                <div class="u-meta">
                    <span class="u-stat">
                        <VpkMarker :vpk="item" class="u-marker" :mode="mode" />
                        <span class="u-count u-status"
                            ><i class="el-icon-microphone u-icon"></i
                            ><span class="u-value">{{ item.voices_count }}/160</span></span
                        >
                        <span class="u-status i-client u-mark" :class="`i-client-${item.client || 'std'}`"
                            ><span class="u-tiny-text">{{ showClient(item) }}</span></span
                        >
                        <div
                            class="u-tag u-label u-status"
                            v-for="tag in item.tags"
                            :key="tag"
                            @click.stop="onTagClick(tag)"
                            ><span class="u-value">{{ tag }}</span></div
                        >
                        <!-- </div> -->

                        <!-- <span class="u-label u-status">
                            <i class="el-icon-download u-icon"></i>
                            ><span class="u-value">{{ getVpkStat(item, "download") }}</span>
                        </span>

                        <span class="u-label u-status">
                            <i class="el-icon-present u-icon"></i>
                            <span class="u-value">{{ getVpkStat(item, "boxcoin") }}</span>
                        </span>

                        <span class="u-label u-status">
                            <i class="el-icon-trophy u-icon"></i>
                            <span class="u-value">{{ getVpkStat(item, "like") }}</span>
                        </span>

                        <span class="u-label u-status">
                            <i class="el-icon-star-off u-icon"></i>
                            <span class="u-value">{{ getVpkStat(item, "favorite") }}</span>
                        </span> -->
                    </span>
                </div>
            </div>
            <div class="m-vpk-action" v-if="mode === 'mine_list'" @click.stop.prevent>
                <el-button type="primary" icon="el-icon-edit-outline" size="small" @click="editVpk(item)">编辑</el-button>
                <el-dropdown trigger="click">
                    <el-button plain size="small"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="deleteVpk(item)"
                            ><i class="el-icon-remove-outline"></i>删除</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="m-vpk-item__misc" v-else>
                <chartVue :data="item.download_trend" v-if="!isPhone"></chartVue>
                <span class="u-misc">
                    <time class="u-time"><i class="el-icon-time"></i>Updated at {{ showTime(item.updated_at) }}</time>
                    <span class="u-author"
                        >By
                        <a :href="authorLink(item.user_id)" target="_blank" @click.stop>{{
                            getUserMeta(item, "display_name") || "匿名"
                        }}</a></span
                    >
                </span>
            </div>
            <!-- <div class="m-vpk-item__op" v-if="mode == 'mine_list'">
                <el-button type="text" icon="el-icon-edit-outline" @click.stop="editVpk(item)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click.stop="deleteVpk(item)">删除</el-button>
            </div> -->
        </div>
    </div>
</template>

<script>
import Avatar from "@jx3box/jx3box-common-ui/src/author/Avatar.vue";
import VpkMarker from "@/components/dbm/vpk/marker.vue";
import { deleteVpk } from "@/service/dbm/vpk";
import dayjs from "dayjs";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";

import chartVue from "@/components/dbm/common/chart.vue";
export default {
    name: "VpkList",
    props: {
        list: {
            type: Array,
            default: function () {
                return [];
            },
        },
        mode: {
            type: String,
            default: "public_list",
        },
    },
    components: {
        Avatar,
        VpkMarker,
        chartVue,
    },
    data: function () {
        return {
            isPhone: window.innerWidth < 768,
        };
    },
    computed: {},
    watch: {},
    methods: {
        showClient(item) {
            const client = item.client || "std";
            return __clients[client];
        },
        nl2br(str) {
            return str.replace(/\n/g, "<br />");
        },
        getUserMeta(item, key) {
            return item?.user?.[key] || "";
        },
        editVpk(item) {
            this.$router.push({ name: "update_vpk", params: { id: item.id } });
        },
        deleteVpk(item) {
            this.$alert("你确定要删除这个语音包吗？该操作不可恢复。", "删除确认", {
                confirmButtonText: "确定",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteVpk(item.id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                type: "success",
                            });
                            this.$emit("reload");
                        });
                    }
                },
            });
        },
        showTime(val) {
            return dayjs(val).format("YYYY-MM-DD HH:mm");
        },
        authorLink,
        getVpkStat(item, key) {
            return item.link_ext_info?.[key];
        },
        onTagClick(tag) {
            this.$router.push({ name: "vpk", query: { tag: tag } });
        },
        getVpkUrl(item) {
            const name = {
                public_list: "public_view_vpk",
                mine_list: "mine_view_vpk",
                manage_list: "manage_view_vpk",
            }[this.mode];
            return { name, params: { id: item.id } };
        },
        viewVpk(item) {
            const routeData = this.$router.resolve(this.getVpkUrl(item));
            window.open(routeData.href, "_blank");
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/list.less";
</style>
