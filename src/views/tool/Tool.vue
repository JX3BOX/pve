<template>
    <ListLayout :withoutRight="false">
        <div class="m-archive-box" v-loading="loading">
            <!-- 搜索 -->
            <div class="m-archive-search" slot="search-before">
                <a :href="publish_link" class="u-publish el-button el-button--primary">+ 发布作品</a>
                <el-input
                    placeholder="请输入搜索内容"
                    v-model.trim.lazy="search"
                    clearable
                    @clear="onSearch"
                    @keydown.native.enter="onSearch"
                >
                    <span slot="prepend"><i class="el-icon-search"></i> <span class="u-search">关键词</span></span>
                    <el-button slot="append" icon="el-icon-position" class="u-btn" @click="onSearch"></el-button>
                </el-input>
            </div>

            <!-- 筛选 -->
            <div class="m-archive-filter">
                <!-- 版本过滤 -->
                <clientBy @filter="filterImperceptibly" :type="client"></clientBy>
                <!-- 角标过滤 -->
                <markBy @filter="filterMeta"></markBy>
                <!-- 排序过滤 -->
                <orderBy @filter="filterMeta"></orderBy>
            </div>

            <!-- 推荐 -->
            <rec-table v-if="!search && !subtype" />

            <!-- 列表 -->
            <div class="m-archive-list" v-if="data && data.length">
                <ul class="u-list">
                    <list-item v-for="(item, i) in data" :key="i + item" :item="item" :order="order" type="tool" />
                </ul>
            </div>

            <!-- 空 -->
            <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon></el-alert>

            <!-- 下一页 -->
            <el-button
                class="m-archive-more"
                v-show="hasNextPage"
                type="primary"
                @click="appendPage"
                :loading="loading"
                icon="el-icon-arrow-down"
                >加载更多</el-button
            >

            <!-- 分页 -->
            <el-pagination
                class="m-archive-pages"
                background
                layout="total, prev, pager, next, jumper"
                :hide-on-single-page="true"
                :page-size="per"
                :total="total"
                :current-page.sync="page"
                @current-change="changePage"
            ></el-pagination>
        </div>

        <design-task v-model="showDesignTask" :post="currentPost"></design-task>
    </ListLayout>
</template>
<script>
import listItem from "@/components/tool/list/list_item.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { getPosts } from "@/service/tool/post";
import recTable from "@/components/tool/list/rec_table.vue";
import ListLayoutVue from "@/layouts/tool/ListLayout.vue";
import {getDesignLog} from "@/service/tool/design";
import DesignTask from "@jx3box/jx3box-common-ui/src/bread/DesignTask.vue";
import bus from "@/utils/bus";
import User from "@jx3box/jx3box-common/js/user";
const appKey = "tool";
export default {
    name: "Index",
    props: [],
    data: function () {
        return {
            loading: false, //加载状态
            data: [], //数据列表

            page: 1, //当前页数
            per: 10, //每页条目
            total: 1, //总条目数
            pages: 1, //总页数
            number_queries: ["per", "page"],

            subtype: "", //子类别
            order: "update", //排序模式
            mark: "", //筛选模式
            client: this.$store.state.client, //版本选择
            search: "", //搜索字串

            showDesignTask: false,
            currentPost: {},
        };
    },
    computed: {
        // 发布按钮链接
        publish_link: function () {
            return publishLink(appKey);
        },
        // 是否显示加载更多
        hasNextPage: function () {
            return this.pages > 1 && this.page < this.total;
        },
        // 请求关联参数
        query: function () {
            return {
                subtype: this.subtype,
                order: this.order,
                mark: this.mark,
                client: this.client,
            };
        },
        // 分页相关参数
        pg_queries: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
        // 重置页码参数
        reset_queries: function () {
            return [this.subtype];
        },
    },
    methods: {
        onSearch() {
            if (this.page != 1) {
                this.page = 1;
                return;
            }
            this.loadData();
        },
        // 构建最终请求参数
        buildQuery: function (appendMode) {
            if (appendMode) {
                this.page += 1;
                this.replaceRoute({ page: this.page }, false);
            }
            let _query = {
                per: this.per,
                page: this.page,
            };

            for (let key in this.query) {
                if (this.query[key] !== undefined && this.query[key] !== "" && this.query[key] !== null) {
                    if (key == "search") {
                        _query.search = this.query.search.trim();
                    } else {
                        _query[key] = this.query[key];
                    }
                }
            }
            // 当指定子类别时启用置顶
            if (_query.subtype) {
                _query.sticky = 1;
            }

            if (this.search) {
                _query.search = this.search.trim();
            }

            return _query;
        },
        // 加载数据
        loadData: function (appendMode = false) {
            let query = this.buildQuery(appendMode);
            console.log("[cms-list]", "<loading data>", query);

            query.type = "tool";

            this.loading = true;
            return getPosts(query)
                .then(async(res) => {
                    if (appendMode) {
                        this.data = this.data.concat(res.data?.data?.list);
                    } else {
                        this.data = res.data?.data?.list;
                    }
                    this.total = res.data?.data?.total;
                    this.pages = res.data?.data?.pages;

                    if (User.hasPermission('push_banner') && !this.isPhone) {
                        const ids = this.data.map(item => item.ID);
                        const logs = await getDesignLog({ source_type: "tool", ids: ids.join(',') }).then(res => res.data.data);

                        this.data = this.data.map(item => {
                            const log = logs.find(log => log.source_id == item.ID) || null;
                            this.$set(item, 'log', log);
                            return item;
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 路由绑定
        replaceRoute: function (extend, toTop=true) {
            return this.$router
                .push({ name: this.$route.name, query: Object.assign({}, this.$route.query, extend) })
                .then(() => {
                    toTop && window.scrollTo(0, 0);
                })
                .catch((err) => {});
        },
        // 条件过滤
        filterMeta: function (o) {
            this.replaceRoute({ [o["type"]]: o["val"], page: 1 });
        },
        // 条件过滤（不附加路由）
        filterImperceptibly: function (o) {
            this[o["type"]] = o["val"];
        },
        // 翻页加载
        changePage: function (i) {
            this.loadData();
            this.replaceRoute({ page: i });
        },
        // 追加加载
        appendPage: function () {
            this.loadData(true);
        },
    },
    watch: {
        // 加载路由参数
        "$route.query": {
            deep: true,
            immediate: true,
            handler: function (query) {
                if (Object.keys(query).length) {
                    console.log("[cms-list]", "<route query change>", query);
                    for (let key in query) {
                        // for:element分页组件兼容性问题
                        if (this.number_queries.includes(key)) {
                            this[key] = ~~query[key];
                        } else {
                            this[key] = query[key];
                        }
                    }
                }
            },
        },
        // 重置分页参数
        reset_queries: {
            deep: true,
            handler: function () {
                console.log("[cms-list]", "<reset page>");
                this.page = 1;
            },
        },
        // 监听请求参数
        query: {
            deep: true,
            immediate: true,
            handler: function (query) {
                console.log("[cms-list]", "<request query change>", query);
                this.loadData();
            },
        },
    },
    mounted: function () {
        bus.on("design-task", (post) => {
            this.currentPost = post;
            this.showDesignTask = true;
        });
    },
    components: {
        listItem,
        recTable,
        ListLayout: ListLayoutVue,
        DesignTask,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/list.less";
</style>
