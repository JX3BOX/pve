<template>
    <div class="m-db-item" @click="go(item.id)">
        <a class="u-icon" :href="link(item.id)" target="_blank" @click.stop>
            <img :src="showIcon(item)" />
        </a>

        <div class="u-name">
            <a class="u-title" :href="link(item.id)" target="_blank" @click.stop>
                {{ showName(item) }}
            </a>
            <span class="u-id"> # {{ item.id }} </span>
            <span class="u-status" v-if="item.status"> <i class="el-icon-lock"></i> 私有 </span>
        </div>
        <div class="u-text" v-if="!isDBType(item)">{{ showContent(item.payload.szContent) }}</div>
        <div class="u-meta">
            <span class="u-meta-item" v-if="isDBType(item)">
                <em class="u-meta-label">ID</em>
                <span class="u-meta-value">{{ item.payload.dwID }}</span>
            </span>
            <span class="u-meta-item" v-if="isDBType(item)">
                <em class="u-meta-label">等级</em>
                <span class="u-meta-value">{{ item.payload.nLevel }}</span>
            </span>
            <span class="u-meta-item" v-if="item.map && item.map.length">
                <em class="u-meta-label">地图</em>
                <span class="u-meta-value">
                    {{ showMap(item.map) }}
                </span>
            </span>
            <span class="u-meta-item">
                <em class="u-meta-label">备注</em>
                <span class="u-meta-value">
                    {{ item.szNote ? item.szNote.slice(0, 20) : "无" }}
                </span>
            </span>
            <span class="u-meta-item" v-if="item.origin" @click.stop>
                <em class="u-meta-label">引用</em>
                <span class="u-meta-value">
                    <a v-if="item.origin > 0" :href="link(item.origin)" target="_blank">
                        <i class="el-icon-link"></i> 查看引用源
                    </a>
                    <span v-else><i class="el-icon-download"></i> 解析导入</span>
                </span>
            </span>
        </div>
        <div class="u-misc">
            <time class="u-time">
                <i class="el-icon-refresh"></i>
                {{ showRecently(item.updated_at) }}
            </time>
        </div>
    </div>
</template>

<script>
import { getImage } from "@/utils/dbm";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import { showRecently } from "@/utils/dateFormat.js";
import User from "@jx3box/jx3box-common/js/user";
import { mapState } from "vuex";

export default {
    name: "DBMItem",
    props: {
        item: Object,
    },
    computed: {
        ...mapState({
            mapIndex: (state) => state.mapIndex,
        }),
        isMine() {
            const user_id = User.getInfo()?.uid;
            return this.item.user_id === user_id;
        },
    },
    methods: {
        go(id) {
            // 打开新标签页
            window.open(this.link(id), "_blank");
        },
        showRecently,
        showIcon(item) {
            if (["ALL", "BUFF", "DEBUFF", "CASTING"].includes(item.type))
                return iconLink(item.icon || item.payload?.nIcon || this.resource.IconID || 0);
            if (item.type === "TALK") return iconLink(4835);
            if (item.type === "CHAT") return iconLink(3138);
            if (item.type === "NPC") return getImage("nFrame", item.payload?.nFrame || 47);
            if (item.type === "DOODAD") return iconLink(item.payload?.nIcon || 10909);
            return iconLink();
        },
        showName(item) {
            if (item.type === "TALK") return item.payload.szTarget ?? "天外来客";
            if (item.type === "CHAT") return item.title || "系统消息";
            return item.szName ?? item.title ?? this.resource.Name ?? "#Name";
        },
        isDBType(item) {
            return !["TALK", "CHAT"].includes(item.type);
        },
        showContent(szContent) {
            if (!szContent) return;
            if (szContent.endsWith("\\\n")) {
                return szContent.slice(0, -2);
            } else {
                return szContent;
            }
        },
        showMap(maps) {
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
        link(id) {
            return getLink("dbm/item", id);
        },
    },
};
</script>

<style lang="less">
.m-db-item {
    .pointer;
    .db;
    border: 1px solid #e1e4e8;
    background: #fafbfc;
    margin-bottom: 10px;
    padding: 12px 12px 12px 70px;
    min-height: 48px;
    border-radius: 3px;
    position: relative;

    &:hover {
        border-color: @color-link;
    }

    .u-icon {
        display: block;
        position: absolute;
        left: 10px;
        top: 10px;
        width: 48px;
        height: 48px;
        border-radius: 4px;
        -webkit-box-shadow: 0 0 1px inset rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.2);
        background-color: #333;

        img {
            .db;
            max-width: 100%;
            .r(4px);
        }
    }

    .u-name {
        .fz(14px);
        .bold;
        color: @color;

        a:hover {
            color: @pink;
        }
    }

    .u-meta {
        padding: 10px 0;
        .fz(13px);
        em {
            background-color: #f3f3f3;
            padding: 2px 5px;
            margin-right: 5px;
            color: #999;
            border-radius: 3px;
            font-size: 12px;
            font-style: normal;
        }
        .u-meta-item {
            .mr(15px);
        }

        a:hover {
            color: @pink;
        }
    }
    .u-mark {
        .ml(5px);
        .fz(12px);
        background-color: #444;
        color: #fff;
        padding: 2px 8px 2px 5px;
        border-radius: 2px;
        font-weight: normal;
        display: inline-block;
        transform-origin: left center;

        &:first-of-type {
            .ml(16px);
        }
    }

    .u-op {
        .pa;
        .rb(12px);
    }
    .u-misc {
        .pa;
        .rt(12px,8px);
    }

    &.m-public-item {
        .pointer;
    }

    .u-text {
        .fz(12px);
        color: #999;
        padding-top: 5px;
        letter-spacing: 0.5px;
    }
    .u-status {
        .fz(12px);
        background-color: #ff9900;
        color: #fff;
        padding: 2px 8px 2px 5px;
        border-radius: 2px;
        font-weight: normal;
        .ml(10px);

        transform: scale(0.8);
        display: inline-block;
        transform-origin: left center;
    }
    .u-time,
    // .u-delete,
    .u-id {
        .fz(12px);
        color: #999;
        font-weight: normal;
    }
    .u-op {
        .el-checkbox {
            .flex;
            align-items: center;
        }
        .el-checkbox__input {
            .flex;
        }
    }
}
</style>
