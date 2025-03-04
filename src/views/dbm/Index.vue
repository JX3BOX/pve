<template>
    <div class="p-index">
        <h1 class="m-index-title"><img src="@/assets/img/dbm/dbm.svg" alt="DBM在线构建" />数据构建</h1>

        <RightSideMsg>
            <div class="m-index-ac" v-html="ac"></div>
        </RightSideMsg>

        <div class="m-index-docs">
            <h5 class="u-title">文档中心</h5>
            <div class="u-list-box">
                <div class="u-list" v-for="doc in docs" :key="doc.name">
                    <div class="u-list-label"><i class="el-icon-folder-opened u-icon"></i>{{ doc.label }}</div>
                    <a :href="item.link" target="_blank" v-for="item in doc.menus" :key="item.link" :style="{ color: item.color }">
                        <i class="u-icon" :class="item.icon || 'el-icon-collection'"></i>
                        <span>{{ item.label }}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getBreadcrumb, getMenus } from "@jx3box/jx3box-common/js/api_misc";
export default {
    name: "Index",
    props: [],
    components: {},
    data: function () {
        return {
            ac: "",
            docs: [],
        };
    },
    computed: {},
    watch: {},
    methods: {
        getLink,
    },
    created: function () {},
    mounted: function () {
        getBreadcrumb("dbm_index_ac").then((res) => {
            this.ac = res || "";
        });
        getMenus({ key: 'dbm_docs,dbm_docs2,dbm_docs3,dbm_docs4' }).then((res) => {
            this.docs = (res || []).filter(item => item.menus.length > 0);
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/index.less";
</style>
