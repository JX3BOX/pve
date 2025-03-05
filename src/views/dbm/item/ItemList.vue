<template>
    <div class="p-item">
        <div class="w-filter-box">
            <!-- tabs -->
            <item-types :type.sync="params.type" :types="types"></item-types>

            <!-- 混合搜索 -->
            <div class="m-item-search m-archive-search">
                <el-input
                    placeholder="请输入搜索内容"
                    v-model.trim.lazy="params.keyword"
                    clearable
                    @clear="load"
                    @keydown.native.enter="load"
                >
                    <template slot="prepend">
                        <i class="el-icon-search"></i> <span class="u-search">关键词</span>
                    </template>
                    <el-button slot="append" icon="el-icon-position" class="u-btn" @click="load"></el-button>
                </el-input>
            </div>

            <!-- 子条件过滤 -->
            <item-conditions></item-conditions>
        </div>

        <!-- 列表 -->
        <div class="w-filter-list m-list-content" v-loading="loading">
            <resource-list :resources="resources" :blur="blur"></resource-list>

            <template v-if="data.length">
                <item-list-item
                    v-for="(item, i) in data"
                    :key="i"
                    :item="item"
                    :read-only="true"
                    :type="type"
                    @update="loadItems"
                ></item-list-item>

                <!-- 分页 -->
                <el-pagination
                    class="m-archive-pages"
                    background
                    layout="total, sizes,prev, pager, next,jumper"
                    :page-size.sync="per"
                    :total="total"
                    :current-page.sync="page"
                    @current-change="loadItems"
                    @size-change="loadItems"
                    :page-sizes="pageSizes"
                >
                </el-pagination>
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
import { cloneDeep } from "lodash";

import ItemTypes from "@/components/dbm/item/item_types.vue";
import ItemConditions from "@/components/dbm/item/list/item_conditions.vue";
import ResourceList from "@/components/dbm/item/list/resource_list.vue";
import ItemListItem from "@/components/dbm/item/list/item.vue";

import { getResource, findResource } from "@/service/dbm/node.js";
import { getItemList } from "@/service/dbm/item.js";

export default {
    name: "ItemList",
    props: [],
    components: {
        ItemTypes,
        ItemConditions,
        ResourceList,
        ItemListItem,
    },
    data: function () {
        return {
            data: [],
            resources: [],
            blur: false,
            isLogin: User.isLogin(),
            loginURL,

            initd: false,
            loading: true,
            page: 1, //当前页数
            total: 1, //总条目数
            per: 15, //每页条目
            pages: 1,
            pageSizes: [10, 15, 30, 50, 100, 500],
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
            const _types = cloneDeep(types);
            delete _types.EXTERNAL;
            return _types;
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
                if (key === "map") {
                    result[key] = params[key].join(",");
                    continue;
                }
                // 对应类型只传递可选范围内内容参数
                if (itemQueryProps[this.type].includes(key) && this.isValidParams(params[key])) {
                    result[key] = params[key];
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
            getItemList(this.query)
                .then((res) => {
                    window.scroll(0, 0);
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadResource() {
            this.resources = [];
            const isIDValid = this.isValidParams(this.params.dwID);
            if (!this.isDBType || this.type == "ALL" || !isIDValid) {
                return;
            }

            if (this.params.dwID) {
                const isLevelValid = !isNaN(this.params.nLevel) && this.isValidParams(this.params.nLevel);
                if (isNaN(this.params.dwID)) {
                    findResource(this.client, this.dbType, this.params.dwID).then((res) => {
                        const data = res.data?.list || [];
                        if (isLevelValid) {
                            const filterData = data.filter((item) => item.Level == this.params.nLevel);
                            if (filterData.length) {
                                this.resources = filterData;
                                return;
                            }
                        }
                        this.resources = res.data?.list || [];
                    });
                } else {
                    const id = isLevelValid ? `${this.params.dwID}_${this.params.nLevel}` : this.params.dwID;
                    getResource(this.client, this.dbType, id).then((res) => {
                        if (res.data.length) {
                            this.resources = res.data;
                        } else {
                            this.resources = [res.data];
                        }
                    });
                }
            }
        },
        load() {
            this.loadResource();
            this.loadItems();
        },
        init() {
            const { type, pkg_id } = this.$route.query;
            if (type) this.params.type = type;
            if (pkg_id) this.params.pkg_id = pkg_id;
            this.initd = true;
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
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/list.less";
</style>
