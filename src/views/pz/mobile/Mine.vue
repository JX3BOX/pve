<template>
    <div class="p-mobile-list p-mine">
        <mobile-common-header @change="handleFilterChange" ref="commonHeader">
            <template #title>
                <h2 class="m-title">我的配装</h2>
            </template>
        </mobile-common-header>

        <pull-refresh v-model="loading" @refresh="handleRefresh" class="m-pzlist m-mine-list">
            <List
                class="m-list-content"
                @load="handleLoad"
                v-model="loading"
                :finished="finished"
                :finished-text="loading ? '' : '没有更多了'"
            >
                <div class="m-add" @click="handleAdd">
                    <i class="el-icon-circle-plus u-icon"></i>
                    <span class="u-text">新建配装</span>
                </div>
                <ListItem v-for="item in list" :key="item.id" :data="item" @del="handleItemDel" />
            </List>
        </pull-refresh>
    </div>
</template>

<script>
import { getMyPzList, removePz } from "@/service/pz/schema.js";

// components
import MobileCommonHeader from "@/components/pz/mobile/CommonHeader.vue";
import ListItem from "@/components/pz/mobile/ListItem.vue";
import { PullRefresh, List, Dialog, Toast } from "vant";
export default {
    name: "MyList",
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
        };
    },
    computed: {
        isLogin() {
            return this.$store.state.is_login;
        },
        params() {
            let _params = {
                per: this.per,
                page: this.page,
                search: this.search,
                sticky: 1, // 置顶
            };

            if (~~this.mount) {
                _params.mount = this.mount;
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
            getMyPzList(this.params)
                .then((res) => {
                    if (appendMode) {
                        this.list = this.list.concat(res.data.data.list || []);
                    } else {
                        this.list = res.data.data.list || [];
                    }
                    this.total = res.data.data.total || 0;
                    this.pages = res.data.data.pages || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleLoad() {
            if (this.page < this.pages) {
                this.page++;
                this.loadData(true);
            }
        },
        handleFilterChange(form) {
            this.mount = form.mount;
            this.search = form.search;
            this.page = 1;
            this.loadData();
        },
        handleRefresh() {
            this.page = 1;
            // 滚动至顶部
            document.querySelector(".van-pull-refresh").scrollTop = 0;
            this.loadData();
        },
        handleItemDel(row) {
            Dialog.confirm({
                message: `确认删除"${row.title}"方案？`,
                beforeClose: (action, done) => {
                    if (action === "confirm") {
                        removePz(row.id)
                            .then(() => {
                                done();
                                Toast({ position: "top", message: "删除成功" });
                                this.list = this.list.filter((item) => item.id !== row.id);
                            })
                    } else {
                        done();
                    }
                },
            });
        },
        handleAdd() {
            this.$refs.commonHeader.handleAdd();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/mobile/list.less";
</style>

<style scoped lang="less">
body {
    padding-top: 72px;
}
</style>
