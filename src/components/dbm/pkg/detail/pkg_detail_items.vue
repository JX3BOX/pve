<template>
    <div class="m-pkg-detail__items">
        <el-tabs tab-position="left" v-model="active" @tab-click="switchTab">
            <el-tab-pane v-for="(value, key) in data" :label="key" :name="key" :key="key">
                <template #label>
                    <span>{{ key }}</span>
                    <strong class="u-item-count" v-if="items?.[key]?.length">({{ items?.[key]?.length }})</strong>
                </template>
                <template v-if="value.length">
                    <div class="m-detail-items" v-loading="loading">
                        <template v-for="item in value">
                            <el-popover
                                :key="item.id"
                                trigger="hover"
                                placement="right"
                                :visible-arrow="false"
                                v-if="iconPopoverComponent(item) && showPopover(item)"
                                popper-class="w-icon-popover"
                            >
                                <template>
                                    <component :is="iconPopoverComponent(item)" :id="item.dwID" :data="item">
                                        <span class="w-buff-meta" v-if="['BUFF', 'DEBUFF'].includes(item.type)"
                                            >Map : {{ showMap(item) }}</span
                                        >
                                        <span class="m-npc-meta" slot="title" v-if="item.type == 'NPC'">
                                            地图 : {{ showMap(item) }}
                                        </span>
                                    </component>
                                </template>
                                <template #reference>
                                    <a
                                        class="m-detail-item"
                                        :key="item.id"
                                        :href="`/dbm/item/${item.id}`"
                                        target="_blank"
                                    >
                                        <img class="u-icon" :src="showIcon(item)" alt="" />
                                        <div class="u-info">
                                            <div class="u-name">{{ showName(item) }}</div>
                                            <div class="u-id"
                                                >ID: {{ item.dwID || "-" }} / Level:{{ item.nLevel || "-" }}</div
                                            >
                                        </div>
                                    </a>
                                </template>
                            </el-popover>
                            <a
                                v-else
                                class="m-detail-item"
                                :key="item.id"
                                :href="`/dbm/item/${item.id}`"
                                target="_blank"
                            >
                                <img class="u-icon" :src="showIcon(item)" alt="" />
                                <div class="u-info">
                                    <div class="u-name">{{ showName(item) }}</div>
                                    <div class="u-id">ID: {{ item.dwID || "-" }} / Level:{{ item.nLevel || "-" }}</div>
                                </div>
                            </a>
                        </template>
                    </div>
                    <el-pagination
                        class="u-pagination"
                        hide-on-single-page
                        layout="prev,pager,next,total"
                        background
                        :current-page="page"
                        :page-size="per"
                        :total="total"
                        @current-change="loadMore"
                        small
                    ></el-pagination>
                </template>
                <div class="m-pkg-null" v-else> <i class="el-icon-warning-outline"></i> 该数据包不包含此类型数据 </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { showName, showIcon } from "@/utils/dbm/item.js";
import { getItemSummary } from "@/service/dbm/item";
import Buff from "@jx3box/jx3box-editor/src/Buff.vue";
import Npc from "@jx3box/jx3box-editor/src/Npc.vue";
import item_popover from "@/components/dbm/item/item_popover.vue";

const iconPopoverComponents = {
    BUFF: Buff,
    DEBUFF: item_popover,
    CASTING: item_popover,
    NPC: Npc,
    DOODAD: item_popover,
    TALK: item_popover,
    CHAT: item_popover,
};
export default {
    name: "PkgItems",
    props: {
        pkg: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            active: "BUFF",
            data: {
                BUFF: [], // 有利气劲
                DEBUFF: [], // 不利气劲
                CASTING: [], // 武学招式
                NPC: [], // 系统角色
                DOODAD: [], // 交互物件
                TALK: [], // 角色喊话
                CHAT: [], // 系统频道
            },

            loading: false,
            per: 20,
            start: {
                BUFF: 0,
                DEBUFF: 0,
                CASTING: 0,
                NPC: 0,
                DOODAD: 0,
                TALK: 0,
                CHAT: 0,
            },
        };
    },
    computed: {
        ...mapState({
            mapIndex: "mapIndex",
        }),
        items() {
            return (
                this.pkg?.pkg_record?.items ?? {
                    BUFF: [],
                    DEBUFF: [],
                    CASTING: [],
                    NPC: [],
                    DOODAD: [],
                    TALK: [],
                    CHAT: [],
                }
            );
        },
        total() {
            return this.items?.[this.active]?.length || 0;
        },
        page() {
            // 根据start计算当前页码
            return ~~(this.start[this.active] / this.per) + 1;
        },
    },
    watch: {
        items: {
            handler() {
                this.init();
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        async loadData(ids) {
            const params = {
                ids,
                attributes: "id,icon,dwID,payload,nLevel,title,type,szName,map",
            };
            this.loading = true;
            return await getItemSummary(params)
                .then((res) => {
                    return res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        init() {
            const ids = this.items?.[this.active]?.slice(0, this.per)?.join(",") || "";

            if (ids) {
                this.loadData(ids).then((res) => {
                    this.data[this.active] = res;
                });
            }
        },
        loadMore(page) {
            this.start[this.active] = (page - 1) * this.per;
            const start = this.start[this.active];
            const ids = this.items?.[this.active].slice(start, start + this.per)?.join(",") || "";

            if (ids) {
                this.loadData(ids).then((res) => {
                    this.data[this.active] = res;
                });
            }
        },
        switchTab() {
            this.init();
        },
        showIcon,
        showName,
        showMap(item) {
            const maps = item.map;
            return maps.map((map) => this.mapIndex[map] || map).join(" ");
        },
        iconPopoverComponent(item) {
            return iconPopoverComponents[item.type];
        },
        showPopover(item) {
            return ["BUFF", "DEBUFF", "CASTING", "NPC", "DOODAD", "CHAT", "TALK"].includes(item.type);
        },
    },
};
</script>

<style lang="less">
.m-pkg-detail__items {
    overflow: auto;
    .u-item-count {
        font-size: 12px;
        .pr;
        top: -2px;
        transform: scale(0.8);
        color: #ff9900;
    }
    .m-detail-items {
        // display: grid;
        // grid-template-columns: repeat(5, 1fr);
        .flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 20px;
    }
    .m-detail-item {
        width: 240px;
        padding: 10px;
        .flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #eee;
        border-radius: 4px;
        .pr;
        background-color: @bg-light;
        overflow: hidden;

        &:hover {
            border-color: @color-link;
        }

        .u-icon {
            .size(48px);
        }

        .u-name {
            .fz(14px);
            .bold;
            .nobreak;
        }
        .u-id {
            .fz(12px,20px);
            color: #999;
        }

        .u-map {
            .pa;
            color: #999;
            right: 5px;
            top: 0;
            .fz(12px,20px);
            .nobreak;
        }
    }

    .u-more {
        margin-top: 10px;
        width: 100%;
        text-align: center;
    }

    .el-tabs__item {
        &.is-active {
            .u-item-count {
                color: #ff9900;
            }
        }
    }
}
.w-icon-popover {
    padding: 0;
    box-shadow: none;
    border: none;
}
.m-npc-meta {
    .fz(12px,20px);
    color: #999;
    .nobreak;
}
</style>
