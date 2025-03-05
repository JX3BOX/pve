<template>
    <div class="m-parse-item">
        <el-popover
            trigger="hover"
            placement="right"
            :visible-arrow="false"
            v-if="iconPopoverComponent[item.type]"
            popper-class="w-icon-popover"
        >
            <template>
                <component :is="iconPopoverComponent[item.type]" :id="item.payload.dwID"></component>
            </template>
            <template slot="reference">
                <span class="u-item-icon">
                    <img :src="showIcon(item)" />
                </span>
            </template>
        </el-popover>
        <template v-else>
            <span class="u-item-icon">
                <img :src="showIcon(item)" />
            </span>
        </template>

        <div class="u-item-name">
            <span ref="itemName" class="u-title"> {{ showName(item) }} </span>
            <em class="u-type-tag" :class="'i-type-' + item.type">{{ item.type }}</em>
        </div>
        <div class="u-item-text" v-if="!isDBType">{{ showContent(item) }}</div>
        <div class="u-item-meta">
            <span class="u-meta-item" v-if="isDBType">
                <em class="u-meta-label">ID</em>
                <span class="u-meta-value">{{ item.payload.dwID }}</span>
            </span>
            <span class="u-meta-item" v-if="isDBType">
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
                    {{ item.payload.szNote ? item.payload.szNote.slice(0, 20) : "无" }}
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
        <div class="u-item-op" @click.stop>
            <el-button
                v-if="mode == 'parse'"
                class="u-view-parse"
                plain
                size="mini"
                icon="el-icon-view"
                @click.stop="openView(item)"
                :disabled="!!item.own"
                >查看</el-button
            >
        </div>

        <el-dialog
            @click.stop
            :visible.sync="viewVisible"
            width="80%"
            :lock-scroll="false"
            center
            modal-append-to-body
            close-on-press-escape
            class="m-parse-result__dialog"
        >
            <div class="m-parse-item__title" slot="title">
                <img :src="showIcon(item)" />
                {{ showName(item) }}
            </div>
            <item-detail-primary :item="item"></item-detail-primary>
            <item-lua :item="item"></item-lua>
            <span slot="footer">
                <el-button type="primary" @click="viewVisible = false" class="u-btn--confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { showRecently } from "@/utils/dbm/dateFormat";
import { mapState } from "vuex";
import { showName, showIcon, showContent } from "@/utils/dbm/item.js";
import Buff from "@jx3box/jx3box-editor/src/Buff.vue";
import Skill from "@jx3box/jx3box-editor/src/Skill.vue";
import Npc from "@jx3box/jx3box-editor/src/Npc.vue";
import ItemDetailPrimary from "@/components/dbm/item/item_detail_primary.vue";
import ItemLua from "@/components/dbm/item/item_lua.vue";

export default {
    name: "ParseResultItem",
    components: {
        ItemDetailPrimary,
        ItemLua,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        mode: {
            type: String,
            default: "parse",
        },
    },
    data: () => ({
        viewVisible: false,
        iconPopoverComponent: {
            BUFF: Buff,
            DEBUFF: Buff,
            CASTING: Skill,
            NPC: Npc,
        },
    }),
    computed: {
        ...mapState(["resource", "mapIndex"]),
        type: function () {
            return this.$store.getters.getType;
        },
        isMine: function () {
            return this.$route.name == "item_mine";
        },
        showMap() {
            const maps = this.item.map;
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
        isDBType() {
            return !["TALK", "CHAT"].includes(this.item.type);
        },
    },
    methods: {
        showName,
        showIcon,
        showContent,
        showRecently,
        authorLink,
        openView() {
            this.viewVisible = true;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/parse/parse_item.less";
</style>
