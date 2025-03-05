<template>
    <div class="v-public">
        <subheader class="m-upload-header" title="云端数据大厅" desc="Public Battle Data"> </subheader>

        <!-- 内容 -->
        <div class="m-public-list" v-loading="loading">
            <!-- 搜索 -->
            <div class="u-search">
                <el-input
                    v-model.lazy="keyword"
                    placeholder="请输入搜索关键词 或 战斗唯一标识符"
                    @keyup.enter.native="loadData"
                >
                    <span slot="prepend">搜索</span>
                    <el-button slot="append" icon="el-icon-search" @click="loadData"></el-button>
                </el-input>
            </div>
            <el-tabs v-model="type" @tab-click="loadData">
                <el-tab-pane label="茗伊战斗统计" name="tinymins"></el-tab-pane>
                <el-tab-pane label="官方战斗统计" name="official"></el-tab-pane>
            </el-tabs>
            <div class="u-ac" v-html="ac"></div>
            <!-- 列表 -->
            <ul class="u-list" v-if="data && data.length">
                <a
                    class="u-item"
                    v-for="(item, i) in data"
                    :key="i"
                    target="_blank"
                    :href="`/battle/#/combat/${item.id}`"
                >
                    <div class="u-primary">
                        <span class="u-type" :class="item.type"
                            ><img class="u-icon" :src="require(`@/assets/img/battle/common/${item.type}.svg`)" />{{
                                typeFormat(item.type)
                            }}</span
                        >
                        <i class="u-star" v-if="item.rank_id"><i>★</i>天梯榜</i>
                        <i class="u-checked" v-if="item.is_checked"
                            ><img svg-inline src="@/assets/img/battle/works/checked.svg"
                        /></i>
                        <span class="u-title">{{ item.title }}</span>
                    </div>
                    <div class="u-extend">
                        <span class="u-time"
                            ><i class="el-icon-refresh"></i>更新：{{ dateFormat(item.created_at) }}</span
                        >
                    </div>
                </a>
            </ul>
            <!-- 空 -->
            <el-alert class="u-null" v-else title="暂无数据" type="info" show-icon></el-alert>
            <!-- 分页 -->
            <el-pagination
                class="m-bucket-pages"
                background
                layout="total, prev, pager, next,jumper"
                :hide-on-single-page="true"
                :page-size="per"
                :total="total"
                :current-page.sync="page"
                @current-change="loadData"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getPublicList } from "@/service/battle/team";
import subheader from "@/components/battle/subheader.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
export default {
    name: "PublicList",
    props: [],
    data: () => ({
        total: 0,
        page: 1,
        per: 20,
        data: null,
        loading: false,

        keyword: "",
        type: "tinymins",

        ac: "",
    }),
    computed: {},
    methods: {
        dateFormat: function (val) {
            return val.split(" ")[0];
        },
        typeFormat: function (val) {
            const typeMap = {
                official: "官方统计",
                tinymins: "战斗统计",
                jcl: "战斗日志",
            };
            return typeMap?.[val] || "战斗统计";
        },
        view: function (item) {
            this.$store.commit("SET_CURRENT", item);
            this.$router.push({
                name: "combat",
                params: { id: item.id },
            });
        },
        loadData: function () {
            let params = { page: this.page, type: this.type };
            if (this.keyword) {
                if (this.keyword.match(/^zhcn_.+::.+::\d+::\d+::\d+\/\d+/)) {
                    params.battle_id = this.keyword;
                } else {
                    params.title = this.keyword;
                }
            }
            this.loading = true;
            getPublicList(params)
                .then((res) => {
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    let data = res.data.data;
                    this.data = data.list;
                    this.total = data.page.total;
                })
                .catch((err) => {
                    this.$message.error("网络请求失败，请F12查看错误信息进行反馈");
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadAc: function () {
            getBreadcrumb("battle-ac").then((data) => {
                this.ac = data;
            });
        },
    },
    components: { subheader },
    mounted: function () {
        this.$store.commit("RESET");
        this.loadData();
        this.loadAc();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/public_list.less";
</style>
