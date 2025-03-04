<template>
    <div class="m-parse-update-merge-view">
        <div class="u-item-header">
            <div class="u-item-header__type" :class="'i-diff-' + diff.type">
                {{ diff.type }}
                <em class="u-item-uuid" v-if="diff.uuid"> - {{ diff.uuid }}</em>
            </div>
            <div class="u-item-header__title"> {{ itemTitle }} </div>
        </div>
        <div class="u-item-content">
            <div class="u-item-content__tar">
                <template v-if="target">
                    <div class="u-item-content__type" :class="'i-type-' + target.type">{{ target.type }}</div>
                    <div class="u-item-content__map">
                        <span class="u-map" v-for="(map, index) in current_maps.tar" :key="index" :class="map.class">
                            {{ map.name }}
                        </span>
                    </div>
                </template>
                <div v-else class="u-empty"> </div>
            </div>
            <div class="u-item-content__cur">
                <template v-if="current">
                    <div class="u-item-content__type" :class="'i-type-' + current.type">{{ current.type }}</div>
                    <div class="u-item-content__map">
                        <span class="u-map" v-for="(map, index) in current_maps.cur" :key="index" :class="map.class">
                            {{ map.name }}
                        </span>
                    </div>
                </template>
                <div v-else class="u-empty"> </div>
            </div>
        </div>
        <div class="u-item-payload-compare">
            <code-diff
                :old-string="target?.__payload ? jsonToLua(target.__payload) : ''"
                :new-string="current?.__payload ? jsonToLua(current.__payload) : ''"
                :context="1024"
                language="javascript"
                output-format="side-by-side"
            ></code-diff>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { jsonToLua } from "@/utils/dbm/item.js";
import { CodeDiff } from "v-code-diff";
import { showName } from "@/utils/dbm/item.js";

export default {
    name: "ParseMergeView",
    components: {
        CodeDiff,
    },
    props: {
        diff: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapState({
            mapIndex: (state) => state.mapIndex,
        }),
        current() {
            return this.diff.cur;
        },
        target() {
            return this.diff.tar;
        },
        current_maps() {
            const result = { tar: [], cur: [] };
            const target_maps = this.showMap(this.target?.map || []);
            const current_maps = this.showMap(this.current?.map || []);
            for (let target_map of target_maps) {
                if (!current_maps.includes(target_map)) {
                    result.tar.push({ name: target_map, class: "i-diff-DELETE" });
                } else {
                    current_maps.splice(current_maps.indexOf(target_map), 1);
                    result.cur.push({ name: target_map, class: "" });
                    result.tar.push({ name: target_map, class: "" });
                }
            }
            for (let current_map of current_maps) {
                result.cur.push({ name: current_map, class: "i-diff-ADD" });
            }

            return result;
        },

        itemTitle() {
            const item = this.diff.tar || this.diff.cur || {};
            return showName(item);
        },
    },
    methods: {
        jsonToLua,
        showMap(maps) {
            return maps.map((map) => this.mapIndex[map] || map);
        },
    },
};
</script>

<style lang="less">
.m-parse-update-merge-view {
    .u-item-content,
    .u-item-payload-compare {
        display: flex;
        width: 100%;
        gap: 16px;
    }

    .code-diff-view {
        max-width: 1200px;
    }

    .code-diff-view .diff-table .blob-code .blob-code-inner {
        font-family: Cascadia Code, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        font-size: 14px;
    }

    .u-item-content__cur,
    .u-item-content__tar {
        display: flex;
        align-items: center;
        gap: 10px;
        width: calc(50% - 8px);
        border: 1px solid #d0d7de;
        padding: 8px;
        .r(4px);
    }

    .u-item-header,
    .u-item-content,
    .u-item-payload-compare {
        max-width: 1200px;
    }

    .u-item-header__type {
        .bold;
        .fz(16px);
        padding: 6px;
        .r(2px);
    }

    .u-item-header__title {
        .bold;
        .fz(16px);
        padding: 6px 0;
    }

    .u-item-uuid {
        .fz(12px);
        color: #999;
        font-style: normal;
    }

    .u-item-content__type {
        display: inline-block;
        padding: 2px 10px;
        color: white;
        .bold;
    }

    .u-item-content__map {
        .fz(14px);
        padding: 4px 0;
        display: flex;
        gap: 4px;
        .u-map {
            padding: 2px 4px;
        }
    }

    .u-empty {
        .size(100%);
        background-color: #f4f6f8;
        border: 1px solid #d0d7de;
    }

    .u-item-content__tar {
        .pr;
    }
}
</style>
