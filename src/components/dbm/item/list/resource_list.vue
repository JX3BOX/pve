<template>
    <div class="m-resource-list" v-loading="loading">
        <div class="m-db-item" v-for="(item, i) in data" :key="i">
            <a class="u-icon" :href="getLink(item)">
                <img :src="iconLink(item.IconID)" />
            </a>
            <div class="u-name">
                <a class="u-title" :href="getLink(item)" target="_blank">{{
                    item.Name || item.BuffName || item.SkillName || item.Remark
                }}</a>
                <span class="u-mark"><i class="el-icon-cpu"></i> 源数据</span>
                <span class="u-mark" v-if="getRefCount(item)"
                    ><i class="el-icon-connection"></i> 引用指数 {{ getRefCount(item) }}</span
                >
            </div>
            <div class="u-meta">
                <span class="u-meta-item">
                    <em class="u-meta-label">ID</em
                    ><span class="u-meta-value">{{ item.Id || item.BuffID || item.SkillID }}</span>
                </span>
                <span class="u-meta-item">
                    <em class="u-meta-label">等级</em><span class="u-meta-value">{{ item.Level }}</span>
                </span>
                <span class="u-meta-item">
                    <em class="u-meta-label">备注</em>
                    <span class="u-meta-value">{{ item.Remark || item.MapName }}</span>
                </span>
            </div>
            <div class="u-op">
                <el-button
                    class="u-create"
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="createItem(item)"
                >
                    创建元数据
                </el-button>
                <el-button
                    v-if="blur"
                    class="u-relation"
                    type="primary"
                    size="mini"
                    icon="el-icon-search"
                    @click="viewItem(item)"
                >
                    查看相关条目
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getDBlink } from "@/assets/js/dbm/common.js";
import { getRefCount } from "@/service/dbm/source";
import type_database_map from "@/assets/data/dbm/type_database_map.json";

const hasLevelTypes = ["BUFF", "DEBUFF", "CASTING", "NPC", "DOODAD"];

export default {
    name: "ResourceList",
    props: ["resources", "blur"],
    data: function () {
        return {
            loading: false,
            refCounts: [
                {
                    type: "buff",
                    id: 9855,
                    level: 1,
                    count: 1145614,
                },
            ],
        };
    },
    watch: {
        data: {
            deep: true,
            handler() {
                this.getRefCounts();
            },
        },
    },
    computed: {
        data: function () {
            return this.resources || [];
        },
        type: function () {
            return this.$store.state.item_list_params.type;
        },
    },
    methods: {
        iconLink,
        createItem(item) {
            const route = {
                name: "item_create",
                query: {
                    type: this.type,
                    title: item.Name || item.BuffName || item.SkillName,
                    id: item.ID || item.BuffID || item.SkillID,
                    level: item.Level,
                },
            };
            if (hasLevelTypes.includes(this.type)) {
                route.query.level = item.Level;
            }
            this.$router.push(route);
        },
        viewItem(item) {
            this.$store.commit("SET_ITEM_LIST_PARAMS_ID", item.ID || item.BuffID || item.SkillID);
            if (hasLevelTypes.includes(this.type)) {
                this.$store.commit("SET_ITEM_LIST_PARAMS_LEVEL", item.Level);
            }
        },
        getLink(item) {
            let id = item.ID || item.BuffID || item.SkillID;
            return getDBlink(this.type, id, item.Level);
        },
        getRefCounts() {
            const db_type = type_database_map[this.type];
            const ids = this.data.map((item) => {
                const id = item.ID || item.BuffID || item.SkillID;
                return `${db_type}_${id}`;
            });
            if (!ids.length) return;
            getRefCount(ids).then((res) => {
                this.refCounts = res.data.data.list;
            });
        },
        getRefCount(item) {
            const db_type = type_database_map[this.type];
            const id = item.ID || item.BuffID || item.SkillID;
            const level = item.Level;
            let ref = this.refCounts.find(
                (item) =>
                    item.type === db_type &&
                    item.source_id === id &&
                    (!["BUFF", "DEBUFF", "CASTING"].includes(this.type) || item.source_level === level)
            );
            if (!ref && level == 0) ref = this.refCounts.find((item) => item.type === db_type && item.source_id === id);
            return ref ? ref.count : 0;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/resource_list.less";
</style>
