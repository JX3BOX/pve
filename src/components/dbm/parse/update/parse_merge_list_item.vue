<template>
    <div class="m-parse-merge-list-item" @click="$emit('select')">
        <!-- 图标 -->
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
        <!-- 名称 -->
        <div class="u-item-name">
            <span class="u-diff-type u-type-icon" :class="'i-diff-' + diff.type">
                {{ diff.type.substring(0, 1) }}
            </span>
            <em class="u-type-tag" :class="'i-type-' + item.type">{{ item.type }}</em>
            <span class="u-title"> {{ showName(item) }} </span>
            <span class="u-content">#{{ diff.content }}</span>
        </div>
        <!-- 详情 -->

        <!-- 备注 -->
        <div class="u-item-meta">
            <span class="u-meta-item" v-if="item.map && item.map.length">
                <span class="u-meta-value">
                    {{ showMap }}
                </span>
            </span>
        </div>
    </div>
</template>

<script>
import { showName, showIcon } from "@/utils/dbm/item.js";

import Buff from "@jx3box/jx3box-editor/src/Buff.vue";
import Skill from "@jx3box/jx3box-editor/src/Skill.vue";
import Npc from "@jx3box/jx3box-editor/src/Npc.vue";

import { mapState } from "vuex";

export default {
    name: "ParseMergeListItem",
    props: {
        diff: {
            type: Object,
            default: () => ({}),
        },
    },
    data: () => ({
        iconPopoverComponent: {
            BUFF: Buff,
            DEBUFF: Buff,
            CASTING: Skill,
            NPC: Npc,
        },
    }),
    computed: {
        ...mapState(["resource", "mapIndex"]),
        target() {
            return this.diff.tar;
        },
        current() {
            return this.diff.cur;
        },
        item() {
            return this.current || this.target;
        },
        showMap() {
            const maps = this.item.map;
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
    },
    methods: {
        showIcon,
        showName,
    },
};
</script>

<style lang="less">
.m-parse-merge-list-item {
    padding: 2px 0;
    .pl(40px);
    .pr;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .u-item-icon {
        .size(32px);
        .pa;
        .mt(6px);

        left: 0;
        display: inline-block;
    }

    .u-item-name,
    .u-item-meta {
        .fz(14px);
        .ellipsis;
    }

    .u-item-name {
        .fz(14px);
        .bold;
        color: @color;

        a:hover {
            color: @pink;
        }

        display: flex;
        align-items: center;
        gap: 8px;
    }

    .u-type-tag {
        color: #fff;
        border-radius: 2px;
        font-size: 12px;
        padding: 2px 5px;
        font-style: normal;

        display: inline-block;
    }
    .u-content {
        .ellipsis;
        .fz(12px);
        font-weight: normal;
        color: #999;
    }

    .u-item-meta {
        .fz(12px);
        .u-meta-item {
            .mr(15px);
        }
    }

    .u-type-icon {
        .bold;
        .size(18px);
        .x;
        display: inline-block;
        flex-shrink: 0;
    }

    &.is-streak-black {
        background-color: #ebeef5;

        &:hover {
            background-color: #acc;
        }
    }

    &:hover,
    &.is-show {
        background-color: #acc;
    }

    &:not(.is-select) {
        opacity: 0.6;
    }
}
</style>
