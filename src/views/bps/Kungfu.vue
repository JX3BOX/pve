<template>
    <AppLayout>
        <div class="v-collection" v-loading="loading">
            <el-tabs class="m-tabs" v-model="type" type="card" @tab-click="changeTab">
                <el-tab-pane :label="item.label" :name="item.key" v-for="(item, i) in types" :key="i">
                    <router-link
                        slot="label"
                        class="u-tab-icon"
                        :to="{ name: 'kungfu', query: { tab: item.key, subtype } }"
                    >
                        <i :class="item.icon"></i>
                        {{ item.label }}
                    </router-link>
                    <div class="m-collection-box">
                        <div class="m-collection-header" v-html="item.desc"></div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="m-types">
                <div class="m-type" v-for="(item, i) in types" :key="i" :class="{'is-active': item.key == type}" @click="changeTab(item)">
                    <router-link
                        slot="label"
                        class="u-tab-icon"
                        :to="{ name: 'kungfu', query: { tab: item.key, subtype } }"
                    >
                        <i :class="item.icon"></i>
                        {{ item.label }}
                    </router-link>
                </div>
                <div class="m-collection-box">
                    <div class="m-collection-header" v-html="desc"></div>
                </div>
            </div>

            <ul class="m-collection-list" v-if="data && data.length">
                <li class="u-item" v-for="(item, j) in data" :key="j">
                    <a :href="getItemLink(item)" target="_blank">
                        <img class="u-icon" :src="iconLink(item.icon, client)" />
                        <span class="u-name">{{ item.name }}</span>
                        <span class="u-xf"> ({{ getBelongTo(item) }}) </span>
                        <span class="u-desc">{{ item.desc }}</span>
                        <span class="u-remark">{{ item.content }}</span>
                    </a>
                </li>
            </ul>
            <el-empty description="当前心法暂无此类技能" v-else :image-size="180"></el-empty>
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/bps/AppLayout.vue";
import { getLink, iconLink, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import relation from "@jx3box/jx3box-data/data/xf/relation.json";

import { getSpecialGroup, getSpecialGroupSkill } from "@/service/bps/skill";
import schoolMap from "@jx3box/jx3box-data/data/xf/schoolid.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
export default {
    name: "Collection",
    props: [],
    components: { AppLayout },
    data: function () {
        return {
            types: [],
            type: "",
            authors: [],
            relation: relation["mount_relation"],

            currentItem: {},

            data: [],
            loading: false,
        };
    },
    computed: {
        subtype: function () {
            return this.$route.query.subtype;
        },
        school: function () {
            return this.subtype === "通用" ? (this.subtype ? 0 : "") : xfmap[this.subtype]?.school;
        },
        mount: function () {
            return xfmap[this.subtype]?.id || 0;
        },
        client: function () {
            return this.$store.state.client;
        },
        contributors: function () {
            return this.$store.state.client == "std" ? "bps_collection_authors" : "bps_collection_authors_origin";
        },
        desc: function () {
            return this.types.find((item) => item.key == this.type)?.desc;
        },
    },
    watch: {
        type: function (val) {
            this.loadData();
        },
        subtype: function (val) {
            this.loadData();
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            const params = {
                group: this.type,
                client: this.client,
                __no_page: 1,
            };
            if (this.school !== "") {
                params.school = this.school;
            }
            getSpecialGroupSkill(params)
                .then((res) => {
                    this.data = res.data.data.filter(
                        (item) => !this.mount || item?.mount == this.mount || !item?.mount
                    );
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadGroup() {
            getSpecialGroup({ __need_item: 0 }).then((res) => {
                this.types = res.data.data
                    .map((item) => {
                        return {
                            ...item,
                            icon: item.icon,
                            key: item.name,
                        };
                    })
                    .filter((item) => !["chuanci", "chuantou", "guanti"].includes(item.name));
            });
        },
        getItemLink: function (item) {
            return getLink(item.type || "skill", item.id);
        },
        changeTab: function (item) {
            this.type = item.name;
            this.$router.push({
                query: { tab: item.name, subtype: this.subtype },
            });
        },
        iconLink,
        getBelongTo({ school, mount }) {
            return mount ? xfid[mount] : schoolMap[school];
        },
    },
    filters: {
        showXfIcon: function (xf) {
            return xfmap[xf] && iconLink(xfmap[xf]["icon"], this.c);
        },
        authorLink,
        showAvatar,
    },
    mounted: function () {
        this.loadGroup();

        // 初始化tab
        if (this.$route.query.tab) {
            this.type = this.$route.query.tab;
        } else {
            this.type = "jianshang";
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/bps/collection.less";
</style>
