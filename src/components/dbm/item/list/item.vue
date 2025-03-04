<template>
    <div
        class="m-item-list__item"
        :class="{ 'm-public-item': !isMine, 'is-selecting': selecting && isSelected, 'is-select-mode': selecting }"
        @click="onClick"
    >
        <el-popover
            trigger="hover"
            placement="right"
            :visible-arrow="false"
            v-if="iconPopoverComponent && showIconPopover"
            popper-class="w-icon-popover"
        >
            <template>
                <component :is="iconPopoverComponent" :id="item.payload?.dwID"></component>
            </template>
            <div class="u-icon" @click.stop="toDetail" slot="reference">
                <img :src="showIcon(item)" />
            </div>
        </el-popover>
        <template v-else>
            <div class="u-icon" @click.stop="toDetail">
                <img :src="showIcon(item)" />
            </div>
        </template>
        <div class="u-name">
            <div class="u-title" @click.stop="toDetail">
                {{ showName(item) }}
            </div>
            <span class="u-id"> # {{ item.id }} </span>
            <em class="u-type-tag" :class="'i-type-' + item.type">{{ item.type }}</em>
            <span class="u-status" v-if="item.status"> <i class="el-icon-lock"></i> 私有 </span>
            <span class="u-status-lock" v-if="item.is_lock"> 锁定 </span>
            <span class="u-external" v-if="item.is_external"> <i class="el-icon-connection"></i> 外部 </span>
        </div>
        <div class="u-text" v-if="!isDBType">{{ showContent(item) }}</div>
        <div class="u-meta">
            <span class="u-meta-item" v-if="isDBType && item.payload">
                <em class="u-meta-label">ID</em>
                <span class="u-meta-value">{{ item.payload.dwID }}</span>
            </span>
            <span class="u-meta-item" v-if="isDBType && item.payload.nLevel">
                <em class="u-meta-label">等级</em>
                <span class="u-meta-value">{{ item.payload.nLevel }}</span>
            </span>
            <span class="u-meta-item" v-if="item.map && item.map.length">
                <em class="u-meta-label">地图</em>
                <span class="u-meta-value">
                    {{ showMap }}
                </span>
            </span>
            <span class="u-meta-item">
                <em class="u-meta-label">备注</em>
                <span class="u-meta-value">
                    {{ showNote(item) }}
                </span>
            </span>
            <span class="u-meta-item" v-if="item.origin" @click.stop>
                <em class="u-meta-label">引用</em>
                <span class="u-meta-value">
                    <router-link
                        v-if="item.origin > 0"
                        :to="{ name: 'item_detail', params: { id: item.origin } }"
                        target="_blank"
                    >
                        <i class="el-icon-link"></i> 查看引用源
                    </router-link>
                    <span v-else><i class="el-icon-download"></i> 解析导入</span>
                </span>
            </span>
        </div>
        <div class="u-misc">
            <el-tooltip v-if="!readOnly && isMine" effect="dark" content="锁定的元数据不会被清空" placement="top">
                <el-button class="u-lock" type="text" :class="{ 'is-lock': item.is_lock }">
                    <i class="el-icon-lock" v-if="item.is_lock" @click.stop="onLock(false)"></i>
                    <i class="el-icon-unlock" v-else @click.stop="onLock(true)"></i>
                </el-button>
            </el-tooltip>

            <time class="u-time">
                <i class="el-icon-refresh"></i>
                {{ showRecently(item.updated_at) }}
            </time>
        </div>
        <div class="u-op" v-if="isLogin" @click.stop>
            <el-button
                v-if="showRemove"
                type="warning"
                size="mini"
                icon="el-icon-circle-close"
                @click.stop="$emit('onRemove')"
                >取消选择</el-button
            >
            <el-tooltip
                v-if="!readOnly && !isMine && !selecting"
                class="item"
                effect="dark"
                content="复制一份加入到我的数据库"
                placement="top"
            >
                <el-button
                    class="u-fork"
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    @click.stop="onFork(item)"
                    :disabled="!!item.own"
                    >克隆项</el-button
                >
            </el-tooltip>
            <pkg-append-item
                v-if="!readOnly && !selecting"
                :item-id="item.item_id || item.id"
                size="mini"
                :count="(item.dependents && item.dependents.length) || 0"
                @update="onAppendItemUpdate"
            ></pkg-append-item>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { showRecently } from "@/utils/dbm/dateFormat.js";
import { mapState } from "vuex";
import PkgAppendItem from "@/components/dbm/pkg/pkg_append_item.vue";
import { forkItem, bulkUpdateItem } from "@/service/dbm/item";
import Buff from "@jx3box/jx3box-editor/src/Buff.vue";
import Skill from "@jx3box/jx3box-editor/src/Skill.vue";
import Npc from "@jx3box/jx3box-editor/src/Npc.vue";
import { showName, showIcon, showContent } from "@/utils/dbm/item.js";

const iconPopoverComponents = {
    BUFF: Buff,
    DEBUFF: Buff,
    CASTING: Skill,
    NPC: Npc,
};

export default {
    name: "ItemListItem",
    components: { PkgAppendItem },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        selecting: {
            type: Boolean,
            default: false,
        },
        clickToDetail: {
            type: Boolean,
            default: true,
        },
        showRemove: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "ALL",
        },
        showIconPopover: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        ...mapState({
            mapIndex: (state) => state.mapIndex,
            item_list_selected: (state) => state.item_list_selected,
        }),
        isLogin() {
            return User.isLogin();
        },
        user_id() {
            return User.getInfo().uid;
        },
        // 逻辑
        isMine() {
            return this.item.user_id == this.user_id;
        },
        isDBType() {
            return !["TALK", "CHAT"].includes(this.item.type);
        },
        isSelected() {
            return this.item_list_selected.find((item) => item.id == this.item.id);
        },
        // 显示
        showMap: function () {
            const maps = this.item.map;
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
        iconPopoverComponent() {
            return iconPopoverComponents[this.item.type];
        },
    },
    methods: {
        showContent,
        showIcon,
        showName,
        showNote(item) {
            return item.payload?.szNote || "无";
        },
        showRecently,
        onClick() {
            if (this.selecting) {
                this.$store.commit("TOGGLE_ITEM_SELECT", this.item);
            } else if (this.clickToDetail) {
                this.toDetail();
            }
        },
        toDetail() {
            const targetRoute = this.$route.name == "item_mine" ? "item_detail_raw" : "item_detail";
            const targetUrl = this.$router.resolve({
                name: targetRoute,
                params: { id: this.item.id },
            });
            window.open(targetUrl.href, "_blank");
        },
        onAppendItemUpdate() {
            this.$emit("update");
        },
        onFork() {
            if (!this.item.id) return;
            this.$confirm("确定要克隆该数据项么？", "消息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        forkItem(this.item.id).then((res) => {
                            this.$message({
                                message: "Fork成功，跳转到fork的元数据",
                                type: "success",
                            });
                            setTimeout(() => {
                                const id = data.id;
                                const path = this.$router.resolve({
                                    name: "item_detail",
                                    params: {
                                        id,
                                    },
                                });
                                window.open(path.href, "_blank");
                            }, 1000);
                        });
                    }
                    done();
                },
            }).catch(() => {});
        },
        onLock(status) {
            bulkUpdateItem([this.item.id], { is_lock: status }).then((res) => {
                this.item.is_lock = status;
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_list_item.less";
</style>
