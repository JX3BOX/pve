<template>
    <div class="m-map-raiders">
        <div class="m-header">
            <div class="u-title">相关攻略</div>
            <a :href="getLink()" target="_blank">查看全部</a>
        </div>
        <div class="m-raider-list" v-loading="loading" v-if="data && data.length">
            <list-item
                v-for="(item, i) in data"
                :key="i + item"
                :item="item"
                :order="order"
                caller="fb_index_click"
            />
        </div>
        <!-- 空 -->
        <div class="u-no-data" v-else>暂无攻略</div>
    </div>
</template>

<script>
const appKey = "fb"
import listItem from "./list_item.vue";
import { getPosts } from "@/service/fb/post";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import topicObj from "@/assets/data/fb/baizhan_topic.json";
export default {
    name: "MapRaiders",
    components: {
        listItem,
    },
    data() {
        return {
            loading: false, //加载状态
            data: [], //数据列表

            search: "", //搜索字串
            order: "update",
            subtype: "百战异闻录",
            client: "std",

            page: 1, //当前页数
            per: 2, //每页条目
            topicObj,
        };
    },
    computed: {
        topic() {
            return this.$store.state.baizhan.currentBoss?.bossName || "";
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
        getLink() {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const currentBossName = this.topicObj[this.topic] ? this.topicObj[this.topic] : this.topic;
            const url = domain + `fb/?fb_name=百战异闻录&topic=${currentBossName}`;
            return url;
        },
        postLink: function (val) {
            return `/${appKey}/` + val;
        },
        // 构建最终请求参数
        buildQuery: function () {
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
        loadData() {
            let query = this.buildQuery();
            this.loading = true;
            return getPosts(query)
                .then((res) => {
                    this.data = res.data?.data?.list;
                    this.$forceUpdate();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/fb/baizhan/map_raider.less";
</style>
