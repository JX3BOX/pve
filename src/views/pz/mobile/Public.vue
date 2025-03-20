<template>
    <div class="p-mobile-list p-public">
        <mobile-common-header is-public @change="handleFilterChange" ref="commonHeader">
            <template #title>
                <h2 class="m-title">配装大厅</h2>
            </template>
        </mobile-common-header>

        <pull-refresh v-model="loading" @refresh="handleRefresh" class="m-pzlist">
            <List
                class="m-list-content"
                @load="handleLoad"
                v-model="loading"
                :finished="finished"
                :finished-text="loading ? '' : '没有更多了'"
            >
                <ListItem v-for="item in list" :key="item.id" :data="item" is-public />
            </List>
        </pull-refresh>
    </div>
</template>

<script>
import { getPublicPzList } from "@/service/pz/schema.js";

import MobileCommonHeader from "@/components/pz/mobile/CommonHeader.vue";
import ListItem from "@/components/pz/mobile/ListItem.vue";
import { PullRefresh, List } from "vant";
export default {
    name: "PublicList",
    components: {
        MobileCommonHeader,
        ListItem,
        PullRefresh,
        List,
    },
    data() {
        return {
            list: [],

            total: 0,
            page: 1,
            per: 10,
            pages: 0,
            loading: false,
            mount: "0",
            search: "",
            tags: [],
            star: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client || "std";
        },
        params() {
            let _params = {
                per: this.per,
                page: this.page,
                search: this.search,
                tags: this.tags.join(","),
                client: this.client,
                valid: 1,
            };

            if (~~this.mount) {
                _params.mount = this.mount;
            }
            if (this.star) {
                _params.star = 1;
            }
            return _params;
        },
        finished() {
            return this.page >= this.pages;
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData(appendMode = false) {
            this.loading = true;
            getPublicPzList(this.params).then((res) => {
                if (appendMode) {
                    this.list = this.list.concat(res.data.data.list || []);
                } else {
                    this.list = res.data.data.list || [];
                }
                this.total = res.data.data.total || 0;
                this.pages = res.data.data.pages || 0;
                this.loading = false;
            });
        },
        handleLoad() {
            if (this.page < this.pages) {
                this.page++;
                this.loadData(true);
            }
        },
        handleRefresh() {
            this.page = 1;
            this.loadData();
        },
        handleFilterChange(data) {
            this.mount = data.mount;
            this.search = data.search;
            this.tags = data.tags;
            this.star = data.star;
            this.page = 1;
            this.loadData();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/mobile/list.less";
</style>
