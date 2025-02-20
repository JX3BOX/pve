<template>
    <div class="m-fb-attr" v-loading="loading">
        <template v-if="client == 'std'">
            <el-divider content-position="left">穿透</el-divider>
            <div class="u-desc" v-html="chuantou['desc']"></div>
            <ul class="u-content">
                <li v-for="(item, i) in chuantou['skills']" :key="i">
                    <a :href="getLink(item)" target="_blank">
                        <img :src="item.icon | iconLink" />
                        {{ item.name }}
                        <span v-if="item.school">{{ showSchool(item.school) }}</span>
                    </a>
                </li>
            </ul>
            <el-divider content-position="left">穿刺</el-divider>
            <div class="u-desc" v-html="chuanci['desc']"></div>
            <ul class="u-content">
                <li v-for="(item, i) in chuanci['skills']" :key="i">
                    <a :href="getLink(item)" target="_blank" :title="item.meta_1">
                        <img :src="item.icon | iconLink" />
                        {{ item.name }}
                        <span v-if="item.school">{{ showSchool(item.school) }}</span>
                    </a>
                </li>
            </ul>
        </template>
        <el-divider content-position="left">贯体</el-divider>
        <div class="u-desc" v-html="guanti['desc']"></div>
        <ul class="u-content">
            <li v-for="(item, i) in guanti['skills']" :key="i">
                <a :href="getLink(item)" target="_blank" :title="item.meta_1">
                    <img :src="item.icon | iconLink" />
                    {{ item.name }}
                    <span v-if="item.school">{{ showSchool(item.school) }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box";
import schoolid from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { getSkillGroups } from "@/service/fb/helper.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Attr",
    props: [],
    data: function () {
        return {
            loading: false,
            chuantou: {
                skills: [],
                desc: "",
            },
            chuanci: {
                skills: [],
                desc: "",
            },
            guanti: {
                skills: [],
                desc: "",
            },
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
    },
    filters: {
        iconLink,
    },
    methods: {
        loadData: function () {
            this.loading = true;
            let params = this.client == "origin" ? ["guanti", "origin"] : ["chuantou,chuanci,guanti", "std"];
            getSkillGroups(...params)
                .then((res) => {
                    this.chuantou = res.data.data?.find((item) => item.name == "chuantou") || {};
                    this.chuanci = res.data.data?.find((item) => item.name == "chuanci") || {};
                    this.guanti = res.data.data?.find((item) => item.name == "guanti") || {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showSchool(id) {
            return schoolid[id] || "";
        },
        getLink(item) {
            const {link, type, id} = item;
            return link || `/app/database?type=${type}&query=${id}`;
        }
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/fb/attr.less";
</style>
