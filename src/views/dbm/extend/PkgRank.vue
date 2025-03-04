<template>
    <div class="p-pkg-rank">
        <el-radio-group v-model="activeType" class="u-type-radio" size="medium" @change="onActiveTypeChange">
            <el-radio-button label="1">团队监控</el-radio-button>
            <el-radio-button label="2">目标监控</el-radio-button>
        </el-radio-group>
        <el-tabs v-model="active" class="m-tabs">
            <el-tab-pane v-for="(item, i) in tabs" :key="i" :name="item.name">
                <span slot="label"><i :class="item.icon"></i> {{ item.label }}</span>
            </el-tab-pane>
        </el-tabs>
        <el-table class="m-pkg-rank__table" :data="data" border stripe v-loading="loading">
            <el-table-column type="index" width="60" align="center">
                <template slot-scope="scope">
                    <span class="u-order" :class="`u-order-${scope.$index + 1}`">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作者" min-width="100">
                <template #default="{ row }">
                    <a class="m-user" :href="authorLink(row.ext_user_info.id)" target="_blank">
                        <Avatar class="u-avatar" :url="row.ext_user_info.avatar" :size="20"> </Avatar>
                        {{ row.ext_user_info.display_name || "匿名" }}
                    </a>
                </template>
            </el-table-column>
            <el-table-column label="订阅名" align="center" min-width="200">
                <template #default="{ row }">
                    <span class="u-key" @click="copy(row.key)">
                        <a :href="postLink('dbm/pkg', row.id)" target="_blank">{{ row.key }}</a>
                        <i class="u-type-value">
                            <i class="el-icon-document-copy u-copy"></i>
                        </i>
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="title" label="数据" align="center" min-width="200">
                <template #default="{ row }">
                    <a :href="postLink('dbm/pkg', row.id)" target="_blank">
                        {{ row.title }}
                    </a>
                </template>
            </el-table-column> -->
            <el-table-column label="语言" align="center">
                <template #default="{ row }">
                    <span class="u-client" :class="row.lang">
                        {{ langs[row.lang] || row.lang }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="客户端" align="center">
                <template #default="{ row }">
                    <span class="u-client" :class="row.client">
                        {{ clients[row.client] || row.client }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="最后更新" align="center">
                <template #default="{ row }">
                    {{ showTime(row) }}
                </template>
            </el-table-column>
            <el-table-column label="统计" align="center">
                <template #default="{ row }">
                    {{ showCount(row) }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getPkgRank } from "@/service/dbm/pkg";
import { authorLink, postLink } from "@jx3box/jx3box-common/js/utils";
import { showTime } from "@/utils/dbm/dateFormat";

export default {
    name: "PkgRank",
    props: [],
    components: {},
    data: function () {
        return {
            data: [],
            loading: false,
            activeType: "1",
            active: "mix",
            tabs: [
                {
                    label: "综合排行榜",
                    name: "mix",
                    icon: "el-icon-s-data",
                },
                {
                    label: "下载排行榜",
                    name: "download",
                    icon: "el-icon-download",
                },
                {
                    label: "订阅排行榜",
                    name: "subscribers",
                    icon: "el-icon-collection-tag",
                },
                {
                    label: "收藏排行榜",
                    name: "favorite",
                    icon: "el-icon-star-off",
                },
            ],
            langs: {
                cn: "简体中文",
                tr: "繁体中文",
            },
            clients: {
                std: "正式服",
                origin: "怀旧服",
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        active() {
            this.loadData();
        },
    },
    methods: {
        postLink,
        authorLink,
        showTime({ ts, created_at }) {
            return ts ? showTime(parseInt(ts, 10)) : created_at;
        },
        loadData() {
            this.loading = true;
            getPkgRank(this.active, { top: 100, client: this.client, type: this.activeType })
                .then((res) => {
                    this.data = res.data.data || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showCount({ favorite, subscribers, last_7day }) {
            if (this.active == "mix") return last_7day + favorite + subscribers;
            if (this.active == "download") return last_7day;
            if (this.active == "subscribers") return subscribers;
            if (this.active == "favorite") return favorite;
            return;
        },
        copy(text) {
            navigator.clipboard.writeText(text);
            this.$notify.success({
                title: "复制成功",
                message: text,
            });
        },
        onActiveTypeChange() {
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dbm/pkg/rank.less";
</style>
