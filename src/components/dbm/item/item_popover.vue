<template>
    <div class="m-item-popover" v-if="data">
        <div class="m-item-wrapper">
            <img class="m-item-icon" :src="showIcon(data)" :alt="showName(data)" />
            <div class="m-item-content">
                <span class="m-item-name">{{ showName(data) }}</span>
                <span class="m-item-desc">{{ showContent(data) }}</span>
                <span class="m-item-meta">ID : {{ data.dwID || "-" }}</span>
                <span class="m-item-meta">Level : {{ data.nLevel || "-" }}</span>
                <span class="m-item-meta">Map : {{ showMap }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { showName, showIcon, showContent } from "@/utils/dbm/item.js";
export default {
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapState({
            mapIndex: "mapIndex",
        }),
        showMap() {
            const maps = this.data.map;
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
    },
    methods: {
        showIcon,
        showName,
        showContent,
    },
};
</script>

<style lang="less">
.m-item-popover {
    padding: 1px;
    border: 1px solid #0f2222;
    .m-item-wrapper {
        @max-width: 345px;
        @min-width: 200px;
        max-width: @max-width;
        min-width: @min-width;
        padding: 9px 10px 10px;
        background-color: rgba(15, 34, 34, 0.88);
        box-sizing: border-box;
        display: flex;
    }

    .m-item-icon {
        .size(48px);
        border: none;
        padding: 0;
        margin: 0 10px 0 0;
    }

    .m-item-content {
        font-weight: normal;
        flex-grow: 1;
        text-shadow: 1px 1px 1px #0f2222;
        line-height: 20px;
    }

    .m-item-name {
        color: #ff0;
        .db;
        .fz(13px);
    }

    .m-item-type {
        .db;
        color: #77ecff;
        letter-spacing: 0.5px;
        .mb(5px);
        .fz(12px, 20px);
    }

    .m-item-desc {
        color: #ffffff;
        letter-spacing: 0.5px;
        .fz(12px, 20px);
    }

    .m-item-meta {
        .db;
        .fz(12px, 20px);
        color: #5df9eb;
    }
}
</style>
