<template>
    <div
        class="m-list-item m-pkg-list__item"
        @click="onClick"
        :class="{ 'is-selecting': selecting, 'is-selected': selecting && isSelected, 'is-raw-pkg': item.is_raw }"
    >
        <div class="m-item-main">
            <Avatar
                class="u-avatar"
                :uid="item.user_id"
                :url="getUserMeta(item, 'user_avatar')"
                :frame="getUserMeta(item, 'user_avatar_frame')"
                size="xs"
                @click.stop
            ></Avatar>
            <div class="m-item-main__content">
                <div class="m-detail-meta">
                    <span class="u-head u-feed">
                        <i class="u-type-label" :class="'type-' + item.type">{{ typeName }}</i>
                        <i class="u-type-value" @click.stop.prevent="copy(item.key)">
                            {{ item.key || "-" }}
                        </i>
                        <i class="u-type-value u-uuid" v-if="item.head" @click.stop.prevent="copy(item.head)">
                            {{ item.head || "-" }}
                        </i>
                    </span>
                </div>
                <div class="m-item-detail">
                    <template v-if="isMine">
                        <span class="u-mark u-status" v-if="item.status">
                            <i class="el-icon-lock"></i> <span class="u-tiny-text">私有</span></span
                        >
                        <span class="u-mark u-sticky" v-if="item.is_important"
                            ><i class="el-icon-download"></i><span class="u-tiny-text"></span
                        ></span>
                    </template>
                    <span class="u-title">{{ item.title }}</span>
                </div>
                <div class="m-item-extend">
                    <span class="u-sticky u-mark" v-if="!!item.is_sticky"
                        ><i class="el-icon-download"></i><span class="u-tiny-text">置顶</span></span
                    >
                    <span class="u-star u-mark" v-if="!!getExtendMeta(item, 'star')"
                        ><i class="el-icon-star-off"></i> <span class="u-tiny-text">精选</span></span
                    >
                    <span class="u-star u-mark" v-if="!!item.is_jx3box"
                        ><i class="el-icon-cpu"></i> <span class="u-tiny-text">官方</span></span
                    >
                    <span class="u-client i-client u-mark" :class="`i-client-${item.client}`" v-if="!showLang"
                        ><span class="u-tiny-text">{{ showClient }}</span></span
                    >
                    <span class="u-client i-client u-mark i-client-tr" v-if="showLang"
                        ><span class="u-tiny-text">{{ showLang }}</span></span
                    >
                    <span class="u-mode u-mark"
                        ><span class="u-tiny-text">{{ showMode }}</span></span
                    >
                    <span
                        class="u-tags"
                        v-if="item.pkg_tag && item.pkg_tag.length"
                        :title="`标签:${getPkgTags(item.pkg_tag).join(',')}`"
                    >
                        <template v-if="item.type != 3">
                            <span
                                class="u-tag u-mark"
                                v-for="tag in uniqData(item.pkg_tag).slice(0, 10)"
                                :key="tag.tag_name"
                                ><span class="u-tiny-text">{{ tag.tag_name }}</span></span
                            >
                        </template>
                        <template v-else>
                            <span
                                class="u-tag u-mark"
                                v-for="tag in uniqData(item.pkg_tag).slice(0, 10)"
                                :key="tag.tag_name"
                                ><span class="u-tiny-text">{{ mapIndex[tag.tag_name] }}</span></span
                            >
                        </template>
                    </span>
                </div>
            </div>
        </div>
        <div class="m-pkg-action" v-if="isMine && !selecting" @click.stop.prevent>
            <el-button type="primary" icon="el-icon-edit-outline" size="small" @click="onEdit">编辑</el-button>
            <el-dropdown trigger="click">
                <el-button plain size="small"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="setImportant">
                        <i class="el-icon-top"></i>{{ item.is_important ? "取消置顶" : "置顶" }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="setPublic">
                        <i class="el-icon-view"></i>{{ item.status ? "设为公开" : "设为私有" }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="clearPkg"
                        ><i class="el-icon-circle-close"></i>清空</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="deletePkg"
                        ><i class="el-icon-remove-outline"></i>删除</el-dropdown-item
                    >
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="m-item-meta" v-else-if="!selecting">
            <chartVue :data="item.trend"></chartVue>
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
    </div>
</template>

<script>
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import { topPkg, deletePkg, clearPkg, refreshCache, setPkgStatus } from "@/service/dbm/pkg.js";
import { showTime } from "@/utils/dbm/dateFormat";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { uniqBy } from "lodash";
// components
import chartVue from "@/components/dbm/common/chart.vue";
import Avatar from "@jx3box/jx3box-common-ui/src/author/Avatar.vue";
import User from "@jx3box/jx3box-common/js/user";
import { mapState } from "vuex";
import { pkg_types } from "@/assets/data/dbm/types.json";

export default {
    name: "PkgListItem",
    components: {
        chartVue,
        Avatar,
    },
    props: {
        item: {
            type: Object,
            default: () => {},
        },
        selecting: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        ...mapState({
            pkg_selected: (state) => state.pkg_selected,
            mapIndex: (state) => state.mapIndex,
        }),
        isSelected() {
            return this.pkg_selected.find((item) => item.id == this.item.id);
        },
        isMine() {
            return this.$route.name == "pkg_mine";
        },
        isAuthor() {
            return this.item.user_id == User.getInfo().uid;
        },
        toLink() {
            return this.isMine || this.isAuthor ? `/pkg/${this.item.id}/raw` : `/pkg/${this.item.id}`;
        },
        showClient() {
            return __clients[this.item.client];
        },
        showMode() {
            return this.item.is_raw == 0 ? "云数据" : "本地数据";
        },
        showLang() {
            return this.item.lang != "cn" && "繁體";
        },
        typeName() {
            return pkg_types[this.item.type];
        },
    },
    methods: {
        copy(val) {
            navigator.clipboard.writeText(val);
            this.$notify.success({
                title: "复制成功",
                message: val,
            });
        },
        showTime,
        authorLink,
        uniqData(data) {
            return uniqBy(data, "tag_name");
        },
        getPkgTags(data) {
            return this.uniqData(data).map((item) => item.tag_name);
        },
        getUserMeta(item, key) {
            return item?.pkg_user?.[key] || "";
        },
        getExtendMeta(item, key) {
            return item?.pkg_extend?.[key] || "";
        },
        setImportant() {
            const data = {
                is_important: ~~!this.item.is_important,
            };
            topPkg(this.item.id, data).then((res) => {
                this.$message.success("操作成功");
                this.$emit("update");
            });
        },
        onEdit() {
            const name = {
                1: "pkg_edit",
                2: "target_edit",
                3: "mark_edit",
            }[this.item?.type];
            this.$router.push({
                name,
                params: { id: this.item.id },
            });
        },
        deletePkg() {
            if (!this.item.id) return;
            this.$alert(`确定永久删除「${this.item.title}」么？该操作无法撤销。`, "消息", {
                confirmButtonText: "确定",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deletePkg(this.item.id)
                            .then(async () => {
                                this.$message({
                                    message: "删除成功！",
                                    type: "success",
                                });
                                this.$emit("update");
                                await refreshCache(this.item.key);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                },
            });
        },
        clearPkg() {
            if (!this.item.id) return;
            this.$alert(`确定清空「${this.item.title}」么？该操作无法撤销。`, "消息", {
                confirmButtonText: "确定",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        clearPkg(this.item.id)
                            .then(async () => {
                                this.$message({
                                    message: "清空成功！",
                                    type: "success",
                                });
                                this.$emit("update");
                                // await refreshCache(this.item.key);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                },
            });
        },
        onClick() {
            if (this.selecting) {
                if (!this.item.is_raw) this.togglePkgSelected();
                return;
            }
            const target = this.$router.resolve(this.toLink);
            window.open(target.href, "_blank");
        },
        togglePkgSelected() {
            this.$store.commit("TOGGLE_PKG_SELECT", this.item);
        },

        // 设置公开/私有
        setPublic() {
            const data = {
                status: ~~!this.item.status,
            };
            setPkgStatus(this.item.id, data).then(() => {
                this.$message.success("操作成功");
                this.$emit("update");
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_detail.less";
@import "~@/assets/css/dbm/pkg/list_item.less";
</style>
