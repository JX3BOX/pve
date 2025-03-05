<template>
    <div class="p-item p-item-mine">
        <div class="w-filter-box">
            <div class="m-item-entry">
                <div class="m-item-entry__left">
                    <pkg-filter></pkg-filter>
                    <!-- 分页 -->
                    <el-pagination
                        class="m-item-entry__pagination"
                        layout="total, prev, pager, next, sizes"
                        :page-size.sync="per"
                        :total="total"
                        :current-page.sync="page"
                        @current-change="loadItems"
                        @size-change="loadItems"
                        :page-sizes="pageSizes"
                    >
                    </el-pagination>
                </div>
                <item-select :selecting.sync="selecting" @onDelete="onDelete" @onClear="onClear" :data="data"></item-select>
            </div>

            <!-- tabs -->
            <item-types :type.sync="params.type" :types="types"></item-types>

            <!-- 子条件过滤 -->
            <item-conditions :is-external="query.type === 'EXTERNAL'" :external-type="externalType">
                <!-- 混合搜索 -->
                <div class="u-condition u-search">
                    <el-input
                        placeholder="请输入关键词"
                        v-model.trim.lazy="params.keyword"
                        clearable
                        @clear="load"
                        @keydown.native.enter="load"
                        size="small"
                    >
                        <template slot="prepend">
                            <span class="u-search">搜索</span>
                        </template>
                        <!-- <el-button slot="append" icon="el-icon-search" class="u-btn" @click="load"></el-button> -->
                    </el-input>
                </div>
                <div class="u-condition u-map" v-if="query.type === 'EXTERNAL'">
                    <span class="u-prepend el-input-group__prepend">类型</span>
                    <item-types
                        :type.sync="externalType"
                        style="width: 180px"
                        :types="externalTypes"
                        mode="select"
                        size="small"
                    ></item-types>
                </div>
            </item-conditions>
        </div>

        <!-- 列表 -->
        <div class="w-filter-list m-list-content" v-loading="loading">
            <template v-if="data.length">
                <item-list-item
                    v-for="(item, i) in data"
                    :key="i"
                    :item="item"
                    :read-only="false"
                    :selecting="selecting"
                    @update="loadItems"
                ></item-list-item>
            </template>
            <el-alert
                v-else-if="!loading"
                class="m-archive-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
                key="null-item-list"
            >
            </el-alert>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";

import { loginURL } from "@/assets/js/dbm/common.js";
import { mapState } from "vuex";
import { throttle } from "lodash";
import databaseTypes from "@/assets/data/dbm/type_database_map.json";
import itemQueryProps from "@/assets/data/dbm/item_query_props.json";
import { types } from "@/assets/data/dbm/types.json";

import pkg_filter from "@/components/dbm/item/list/pkg_filter.vue";
import ItemTypes from "@/components/dbm/item/item_types.vue";
import ItemConditions from "@/components/dbm/item/list/item_conditions.vue";
import ItemSelect from "@/components/dbm/item/list/item_batch.vue";
import ItemListItem from "@/components/dbm/item/list/item.vue";

import { getExternalItem, getItemMine } from "@/service/dbm/item.js";
import { omit, cloneDeep } from "lodash";

export default {
    name: "ItemList",
    components: {
        ItemTypes,
        ItemConditions,
        ItemSelect,
        ItemListItem,
        "pkg-filter": pkg_filter,
    },
    data: function () {
        return {
            data: [],
            resources: [],
            blur: false,
            isLogin: User.isLogin(),
            loginURL,

            selecting: false,
            initd: false,
            loading: true,
            page: 1, //当前页数
            total: 1, //总条目数
            per: 15, //每页条目
            pages: 1,
            pageSizes: [10, 15, 30, 50, 100, 500],

            externalType: "ALL",
        };
    },
    computed: {
        ...mapState({
            params: "item_list_params",
            client: "client",
        }),
        hasDbKey: function () {
            return this.params?.dwID || this.params.szName || this.params.nLevel;
        },
        type: function () {
            return this.params.type;
        },
        types: function () {
            return types;
        },
        externalTypes: function () {
            const types = cloneDeep(this.types);
            delete types.EXTERNAL;
            return types;
        },
        dbType: function () {
            return databaseTypes[this.params.type];
        },
        isDBType: function () {
            return !["TALK", "CHAT"].includes(this.type);
        },

        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        loadTrigger() {
            return [this.$route.name, this.params];
        },
        query: function () {
            const params = this.params;
            const result = {
                client: this.client,
                search: params.keyword,
            };
            for (let key in params) {
                if (["dwID", "nLevel"].includes(key) && isNaN(Number(params[key]))) continue;
                // 类型为ALL时，不传type
                if (key === "type" && this.type === "ALL") continue;
                // 我的列表总是列出所有条目
                if (key == "fork") continue;
                if (key === "map" && params.map) {
                    result[key] = params[key].join(",");
                    continue;
                }
                // 对应类型只传递可选范围内内容参数
                if (itemQueryProps?.[this.type]?.includes(key) && this.isValidParams(params[key])) {
                    result[key] = params[key];
                }
                if (params?.pkg_id) {
                    result["pkg_id"] = params.pkg_id;
                }
            }
            return {
                ...result,
                page: this.page,
                per: this.per,
            };
        },
    },
    methods: {
        onDelete(ids) {
            this.data = this.data.filter((item) => !ids.includes(item.id));
        },
        isValidParams(val) {
            return val !== undefined && val !== null && val !== "" && val !== " ";
        },
        loadItems() {
            if (this.isMine && !this.isLogin) return;
            this.loading = true;
            const fn = this.query.type === "EXTERNAL" ? getExternalItem : getItemMine;
            const query = this.buildQuery();
            fn(query)
                .then((res) => {
                    window.scroll(0, 0);
                    this.data = this.buildList(res.data.data.list);
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        buildQuery() {
            const query = { ...this.query };
            if (query.type === "EXTERNAL") {
                this.externalType === "ALL" ? delete query.type : (query.type = this.externalType);
            }
            return query;
        },
        buildList(data) {
            if (this.query.type === "EXTERNAL") {
                return data.map((d) => {
                    return {
                        ...omit(d, ["item"]),
                        ...omit(d.item || {}, ["user_id"]),
                        payload: d.item,
                        item_id: d.item.id,
                    };
                });
            }
            return data;
        },
        load() {
            this.loadItems();
        },
        init() {
            const { type, pkg_id } = this.$route.query;
            if (type) this.params.type = type;
            if (pkg_id) this.params.pkg_id = pkg_id;
            this.initd = true;
        },
        onClear() {
            this.page = 1;
            this.load();
        },
    },
    watch: {
        type() {
            this.page = 1;
        },
        loadTrigger: {
            handler: throttle(
                function () {
                    if (!this.initd) return;
                    this.load();
                },
                500,
                { leading: true }
            ),
            deep: true,
            immediate: true,
        },
        externalType() {
            this.load();
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/list.less";
</style>
