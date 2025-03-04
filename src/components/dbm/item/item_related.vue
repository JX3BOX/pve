<template>
    <div class="m-related-item" v-if="data.length">
        <el-divider content-position="left"><i class="el-icon-connection"></i> 派生</el-divider>
        <item-list-item v-for="(item, index) in data" :key="index" :item="item" :read-only="true"></item-list-item>
        <item-list :data="data" :readOnly="true"></item-list>
        <el-pagination
            class="u-pagination"
            layout="total, prev, pager, next,jumper"
            :hide-on-single-page="true"
            :page-size.sync="per"
            :total="total"
            :current-page.sync="page"
            @current-change="loadData"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getForkItemList } from "@/service/dbm/item.js";
import { mapState } from "vuex";
import ItemListItem from "@/components/dbm/item/list/item.vue";

export default {
    name: "itemRelated",
    data: () => ({
        data: [],
        page: 1, //当前页数
        total: 1, //总条目数
        per: 5, //每页条目
    }),
    watch: {
        id: {
            handler: function () {
                this.loadData();
            },
            immediate: true,
        },
    },
    computed: {
        ...mapState({
            item: (state) => state.item,
        }),
        id: function () {
            return this.item.id;
        },
        params: function () {
            let query = {
                per: this.per,
                page: this.page,
            };
            return query;
        },
    },
    methods: {
        loadData: function () {
            getForkItemList(this.id, this.params).then((res) => {
                this.data = res.data?.data?.list || [];
                this.total = res.data?.data?.total;
            });
        },
    },
    components: {
        ItemListItem,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_related.less";
</style>
