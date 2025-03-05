<template>
    <div class="p-vpk-single">
        <template v-if="vpk">
            <div class="m-vpk-header">
                <div class="m-vpk-author">
                    <Avatar
                        class="u-avatar"
                        :uid="vpk.user_id"
                        :frame="getUserMeta('user_avatar_frame')"
                        :url="getUserMeta('avatar')"
                        size="xs"
                    ></Avatar>
                </div>
                <div class="m-vpk-info">
                    <div class="m-vpk-title">
                        <span class="u-title">{{ vpk.title }}</span>
                        <VpkMarker :vpk="vpk" :mode="mode" />
                    </div>
                </div>
                <!-- <div class="m-vpk-actions" v-if="isEditor && vpk.status != 1">
                    <el-button type="success" icon="el-icon-check" size="small" @click="approve(1)">通过</el-button>
                    <el-button type="danger" icon="el-icon-close" size="small" @click="approve(-1)">拒绝</el-button>
                </div> -->
                <div class="u-op" v-if="isMine">
                    <el-button plain class="u-back" icon="el-icon-caret-left" size="mini" @click="goBack">
                        后退
                    </el-button>
                    <el-button
                        class="u-edit"
                        type="warning"
                        icon="el-icon-edit-outline"
                        size="mini"
                        @click="editVpk"
                        v-if="isAuthor"
                        >编辑</el-button
                    >
                    <el-button
                        class="u-delete"
                        type="info"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteVpk"
                        v-if="isAuthor"
                        >删除</el-button
                    >
                </div>
            </div>
            <div class="m-detail-meta">
                <span class="u-meta u-type u-id u-version">
                    <i class="u-type-label">UUID</i>
                    <i class="u-type-value">
                        {{ vpk.uuid || "-" }}
                        <!-- {{ showVersion }} -->
                    </i>
                </span>
                <span class="u-meta">
                    <span class="u-label">语音数</span>
                    <span class="u-value">
                        <strong>{{ vpk.voices_count }}/160</strong>
                    </span>
                </span>
                <span class="u-meta">
                    <span class="u-label">下载次数</span>
                    <span class="u-value">
                        <b>{{ downloads }}</b>
                    </span>
                </span>
            </div>
            <div class="m-detail-meta">
                <span class="u-meta" v-if="vpk.user">
                    <span class="u-label">作者</span>
                    <span class="u-value">
                        <a :href="authorLink(vpk.user_id)" target="_blank">
                            <i class="el-icon-link"></i>
                            {{ vpk.user.display_name || "佚名" }}
                        </a>
                    </span>
                </span>
                <span class="u-meta">
                    <span class="u-label">创建日期</span>
                    <span class="u-value">{{ showDate(new Date(vpk.created_at)) }}</span>
                </span>
                <span class="u-meta">
                    <span class="u-label">最后更新</span>
                    <span class="u-value">{{ showRecently(vpk.updated_at) }}</span>
                </span>
                <span class="u-meta">
                    <span class="u-label">标签</span>
                    <span class="u-value">
                        <span class="u-tag" v-for="tag in vpk.tags" :key="tag">{{ tag }}</span>
                    </span>
                </span>
            </div>
            <div class="m-vpk-ac">
                <span class="u-title"><img svg-inline src="@/assets/img/dbm/common/ac.svg" />特别说明</span>
                <span class="u-desc">{{ vpk.description }}</span>
            </div>
            <!-- <div class="m-vpk-tags">
                <span class="u-tag u-uuid"
                    >{{ vpk.uuid }}
                    <i class="el-icon-document-copy" title="复制UUID" @click="onCopy(vpk.uuid)"></i>
                </span>
                <router-link
                    class="u-tag"
                    v-for="tag in vpk.tags"
                    :key="tag"
                    :to="{ name: 'public_vpk', query: { tag: tag } }"
                    target="_blank"
                    >{{ tag }}</router-link
                >
            </div> -->
            <div class="m-vpk-extend">
                <VpkHello :vpk="vpk" />
                <VpkCalendarHeatmap :vpkId="id" />
                <!-- <div class="u-banner">
                    <img :src="getThumbnail(vpk.banner)" alt="">
                </div> -->
            </div>
            <div class="m-vpk-voice" v-if="voiceList && voiceList.length">
                <SingleVoices :list="list" :slugs="slugs" :mode="mode" />
            </div>
            <div class="m-vpk-download">
                <a class="el-button el-button--default is-plain" href="/tool/57781" target="_blank"
                    ><i class="el-icon-question"></i> 如何使用语音包</a
                >
            </div>
            <div class="m-vpk-misc">
                <!-- 打赏 -->
                <Thx
                    class="m-thx"
                    :postId="id"
                    postType="vpk"
                    :postTitle="vpk.title"
                    :userId="vpk.user_id"
                    :adminBoxcoinEnable="true"
                    :userBoxcoinEnable="true"
                    client="all"
                    :allowGift="vpk.allow_gift"
                />

                <!-- 评论 -->
                <div ref="commentView" class="m-single-comment">
                    <el-divider content-position="left"><i class="el-icon-chat-line-round"></i> 评论</el-divider>
                    <Comment :id="id" category="vpk" v-if="vpk.allow_comment" />
                    <el-alert title="作者没有开启评论功能" type="warning" show-icon v-else></el-alert>
                </div>
            </div>
        </template>
        <template v-if="isNotExist">
            <el-alert title="语音包不存在或尚在审核中，请稍后再试" type="warning" show-icon> </el-alert>
        </template>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Avatar from "@jx3box/jx3box-common-ui/src/author/Avatar.vue";
import Thx from "@jx3box/jx3box-common-ui/src/single/Thx.vue";
import VpkMarker from "@/components/dbm/vpk/marker.vue";
import VpkCalendarHeatmap from "@/components/dbm/vpk/CalendarHeatmap.vue";
import VpkHello from "@/components/dbm/vpk/hello.vue";
import SingleVoices from "@/components/dbm/vpk/SingleVoices.vue";

import { authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { showDate, showRecently } from "@/utils/dbm/dateFormat";
import dayjs from "dayjs";

import { getVpkById, getMyVpk, checkVpk, approveVpk, deleteVpk } from "@/service/dbm/vpk";
import { getVoiceList, getMyVoiceList, getManageVoiceList } from "@/service/dbm/voice";
import { getSlugList } from "@/service/dbm/slug";
export default {
    name: "VpkSingle",
    props: [],
    components: { Avatar, Thx, VpkMarker, SingleVoices, VpkCalendarHeatmap, VpkHello },
    data: function () {
        return {
            vpk: "",
            loading: false,
            done: false,

            voiceList: [],
            slugs: [],
            list: {},

            isEditor: false,
            isAuthor: false,
        };
    },
    computed: {
        id() {
            return Number(this.$route.params.id);
        },
        downloads() {
            return this.vpk?.link_ext_info.download || 0;
        },
        routeName() {
            return this.$route.name;
        },
        fn() {
            return {
                public_view_vpk: getVpkById,
                mine_view_vpk: getMyVpk,
                manage_view_vpk: checkVpk,
            }[this.routeName];
        },
        mode() {
            return {
                public_view_vpk: "public_single",
                mine_view_vpk: "mine_single",
                manage_view_vpk: "manage_single",
            }[this.routeName];
        },
        voiceFn() {
            return {
                public_view_vpk: getVoiceList,
                mine_view_vpk: getMyVoiceList,
                manage_view_vpk: getManageVoiceList,
            }[this.routeName];
        },
        isNotExist() {
            return this.done && !this.vpk;
        },
        isSuper() {
            return ~~(User.isEditor() && !this.isAuthor);
        },
        isMine() {
            return this.$route.name == "mine_view_vpk";
        },
    },
    watch: {},
    methods: {
        getThumbnail(url) {
            return getThumbnail(url, [280, 160]);
        },
        getUserMeta(key) {
            return this.vpk?.user?.[key] || "";
        },
        loadVpk() {
            this.loading = true;
            this.fn(this.id)
                .then((res) => {
                    this.vpk = res.data.data;
                    this.isAuthor = this.vpk.user_id == User.getInfo().uid;
                    this.$store.commit("ACTIVE_VPK", this.vpk);
                })
                .finally(() => {
                    this.loading = false;
                    this.done = true;
                });
        },
        authorLink,
        showDate,
        showRecently,
        loadVoiceList() {
            this.voiceFn(this.id).then((res) => {
                this.voiceList = (res.data.data?.voices || res.data.data || []).filter((item) => item.slug);

                if (this.mode === "mine_single") {
                    // 如果存在相同slug的则保留created_at为新的一条,created_at的格式是YYYY-MM-DD HH:mm:ss
                    let slugMap = {};
                    this.voiceList.forEach((item) => {
                        if (slugMap[item.slug]) {
                            if (dayjs(item.created_at).isAfter(slugMap[item.slug].created_at)) {
                                slugMap[item.slug] = item;
                            }
                        } else {
                            slugMap[item.slug] = item;
                        }
                    });
                }

                // 去除data中重复的创建时间较早的数据
                const map = {};
                this.voiceList.forEach((item) => {
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
            });
        },
        loadSlug() {
            getSlugList().then((res) => {
                this.slugs = res.data.data
                    .reduce((acc, item) => {
                        const group = acc.find((g) => g.group === item.group);
                        if (group) {
                            group.children.push(item);
                        } else {
                            acc.push({
                                group: item.group,
                                label: item.group_name,
                                children: [item],
                                is_official: item.is_official,
                            });
                        }
                        return acc;
                    }, [])
                    .sort((a, b) => b.is_official - a.is_official);

                this.list = this.initList(this.slugs);

                this.loadVoiceList();
            });
        },
        initList(slugs) {
            return slugs.reduce((acc, group) => {
                group.children.forEach((child) => {
                    acc[child.slug] = {
                        group: group.group,
                        slug: child.slug,
                        remark: child.remark,
                        filename: "",
                        status: 0,
                        id: child?.id,
                    };
                });
                return acc;
            }, {});
        },

        getVoiceStatus(row) {
            const statusMap = {
                "-1": "未通过",
                0: "审核中",
                1: "已通过",
            };
            return (row?.filename && statusMap[row.status]) || "未设置";
        },
        getVoiceStatusClass(row) {
            const statusMap = {
                "-1": "isReject",
                0: "isChecking",
                1: "isReady",
            };
            return (row?.filename && statusMap[row.status]) || "";
        },
        onCopy(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$notify({ title: "复制成功", message: "复制内容：" + text, type: "success" });
            });
        },
        // 审批
        approve(status) {
            if (status > 0) {
                approveVpk(this.id, { field: "status", value: status }).then(() => {
                    this.$notify({ title: "操作成功", type: "success" });
                });
            } else {
                this.$prompt("请输入拒绝理由", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputValidator: (value) => {
                        if (!value) {
                            return "请输入拒绝理由";
                        }
                    },
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            approveVpk(this.id, { field: "status", value: status, remark: instance.inputValue }).then(
                                () => {
                                    this.$notify({ title: "操作成功", type: "success" });
                                    done();
                                    this.loadVpk();
                                }
                            );
                        } else {
                            done();
                        }
                    },
                }).catch(() => {});
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        editVpk() {
            this.$router.push({ name: "update_vpk", params: { id: this.vpk.id } });
        },
        deleteVpk() {
            this.$alert("你确定要删除这个语音包吗？该操作不可恢复。", "删除确认", {
                confirmButtonText: "确定",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteVpk(this.vpk.id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                type: "success",
                            });
                            this.$router.push({ name: "my_vpk" });
                        });
                    }
                },
            });
        },
    },
    mounted: function () {
        this.loadVpk();
        this.loadSlug();
        this.isEditor = User.isEditor();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_detail.less";
@import "~@/assets/css/dbm/vpk/single.less";
</style>
