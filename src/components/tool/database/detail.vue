<template>
    <div class="m-database-detail">
        <div class="u-top-bar">
            <el-button @click="goBack" icon="el-icon-arrow-left" plain>返回</el-button>
            <div class="m-detail-title">{{ type.toUpperCase() }} - {{ title }}</div>
        </div>
        <component
            :is="item_component[type]"
            :showDetail="true"
            :data="data"
            :hasRight="hasRight"
            :type="type"
            :ref-count="refCount"
        ></component>
        <!-- 引用的元数据 -->
        <template v-if="dbm_items && dbm_items.length">
            <el-divider content-position="left"><i class="el-icon-chat-line-square"></i> 引用的元数据</el-divider>
            <div class="m-dbm-item-list" v-loading="dbm_items_loading">
                <dbm-item v-for="(item, index) in dbm_items" :item="item" :key="index"></dbm-item>
                <el-pagination
                    class="u-pagination"
                    background
                    layout="prev, pager, next"
                    :total="dbm_items_total"
                    :page-size="6"
                    :current-page.sync="dbm_items_page"
                    @current-change="loadDbmItems"
                    hide-on-single-page
                >
                </el-pagination>
            </div>
        </template>
        <!-- 评论组件 -->
        <el-divider content-position="left"><i class="el-icon-chat-line-square"></i> 评论</el-divider>
        <Comment class="m-comment" :id="id" :category="type" />
    </div>
</template>

<script>
import { mapState } from "vuex";

import ItemBuff from "@/components/tool/database/item/buff.vue";
import ItemSkill from "@/components/tool/database/item/skill.vue";
import ItemNpc from "@/components/tool/database/item/npc.vue";
import ItemDoodad from "@/components/tool/database/item/doodad.vue";
import DbmItem from "@/components/tool/database/dbm_item.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import { getDbmItemList } from "@/service/tool/cms";

const db_dbm_type_map = {
    doodad: "DOODAD",
    npc: "NPC",
    skill: "CASTING",
};

export default {
    name: "DatabaseDetail",
    components: {
        Comment,
        DbmItem,
    },
    props: {
        data: Object,
        refCount: Number,
        hasRight: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState({
            client: (state) => state.database_client,
            type: (state) => state.database_type,
        }),
        title() {
            const item = this.data;
            let title = item.Name || item.BuffName || item.SkillName || item.Remark;
            if (title) return title;
            let id = item.ID || item.SkillID || item.BuffID;
            return `(${id})`;
        },
        id() {
            const item = this.data;
            let id = item.ID || item.SkillID || item.BuffID;
            return id;
        },
    },
    data: () => ({
        item_component: {
            buff: ItemBuff,
            skill: ItemSkill,
            npc: ItemNpc,
            doodad: ItemDoodad,
        },

        dbm_items: [],
        dbm_items_page: 1,
        dbm_items_loading: false,
        dbm_items_total: 0,
    }),
    mounted() {},
    methods: {
        loadDbmItems() {
            const query = {
                page: this.dbm_items_page,
                per: 6,
            };
            const id = this.id;
            const dbm_type = db_dbm_type_map[this.type];
            if (id) query["dwID"] = id;
            if (dbm_type) query["type"] = dbm_type;
            this.dbm_items_loading = true;
            getDbmItemList(query)
                .then((res) => {
                    const data = res.data.data;
                    const { list, total } = data;

                    this.dbm_items = list;
                    this.dbm_items_total = total;
                })
                .finally(() => {
                    this.dbm_items_loading = false;
                });
        },
        goBack() {
            let query = { type: this.type };
            this.$router.replace({ query }).catch(() => {});
            this.$emit("update:data", "");
        },
    },
    watch: {
        data: {
            handler(val) {
                if (!val) return;
                this.dbm_items_page = 1;
                this.loadDbmItems();
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>

<style lang="less" scoped>
.m-database-detail {
    .m-detail-title {
        .fz(14px, 1.2);
    }
    .u-top-bar {
        display: flex;
        align-items: center;
        gap: 20px;
        .mb(20px);
    }

    .m-dbm-item-list {
        margin: 30px 0;

        .u-pagination {
            .mt(20px);
            display: flex;
            justify-content: center;
        }
    }
}
</style>
