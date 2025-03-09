<template>
    <div class="m-raiders">
        <div class="m-archive-list" v-if="data && data.length">
            <ul class="u-list">
                <list-item
                    v-for="(item, i) in data"
                    :key="i + item"
                    :item="item"
                    :order="order"
                    caller="fb_index_click"
                />
            </ul>
        </div>
        <!-- 空 -->
        <el-alert
            v-else
            effect="dark"
            class="m-archive-null"
            title="没有找到相关条目"
            type="info"
            center
            show-icon
        ></el-alert>

        <!-- 下一页 -->
        <el-button
            class="m-archive-more"
            v-show="hasNextPage"
            type="primary"
            @click="appendPage"
            :loading="loading"
            icon="el-icon-arrow-down"
        >
            加载更多
        </el-button>

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
</template>

<script>
const appKey = "fb";
import { mapState } from "vuex";
import listItem from "@/components/fb/list/list_item.vue";
import { getPosts } from "@/service/fb/post";
import topicObj from "@/assets/data/fb/baizhan_topic.json";
export default {
    name: "BRaiders",
    components: {
        listItem,
    },
    data() {
        return {
            loading: false, //加载状态
            data: [], //数据列表

            order: "update",
            subtype: "百战异闻录",
            client: "std",

            page: 1, //当前页数
            per: 10, //每页条目
            total: 1, //总条目数
            pages: 1, //总页数
            topicObj,
        };
    },
    computed: {
        ...mapState({
            topic: (state) => state.baizhan.currentBossName,
            search: (state) => state.baizhan.search,
        }),
        hasNextPage() {
            return this.pages > 1 && this.page < this.total;
        },
        query() {
            return {
                subtype: this.subtype,
                order: this.order,
                client: this.client,
                topic: this.topicObj[this.topic] ? this.topicObj[this.topic] : this.topic,
            };
        },
        pageQuery() {
            return {
                page: this.page,
                per: this.per,
            };
        },
        aggregate() {
            return this.data.map((item) => this.postLink(item.ID));
        },
    },
    watch: {
        topic: {
            handler() {
                this.page = 1;
                this.loadData();
            },
        },
        search: {
            handler() {
                this.page = 1;
                this.loadData();
            },
        },
    },
    methods: {
        postLink: function (val) {
            return `/${appKey}/` + val;
        },
        // 构建最终请求参数
        buildQuery: function (appendMode) {
            if (appendMode) {
                this.page += 1;
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
        loadData(appendMode = false) {
            let query = this.buildQuery(appendMode);
            this.loading = true;
            return getPosts(query)
                .then((res) => {
                    if (appendMode) {
                        this.data = this.data.concat(res.data?.data?.list);
                    } else {
                        this.data = res.data?.data?.list;
                    }
                    this.total = res.data?.data?.total;
                    this.pages = res.data?.data?.pages;
                    this.$forceUpdate();
                })
                .finally(() => {
                    this.loading = false;
                });
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
    mounted() {
        this.loadData();
    },
};
</script>
<style lang="less">
.m-raiders {
    .m-archive-list .u-post .u-push {
        .none;
    }
}
</style>
