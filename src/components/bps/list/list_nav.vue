<template>
    <div class="m-list-nav">
        <h5 class="u-title">
            心法导航
            <router-link class="u-more" :to="{ query: { subtype: '' } }"
                >全部心法<i class="el-icon-arrow-right"></i
            ></router-link>
        </h5>
        <ul class="m-bps-nav u-list">
            <!-- <li class="u-item" v-for="(item, i) in xfmap" :key="i" v-show="item.client.includes(client)">
                <router-link
                    class="u-link"
                    :class="{ 'router-link-exact-active': activeName === item.name }"
                    :to="{ query: { subtype: item.name, tab: tab } }"
                >
                    <i class="u-pic">
                        <img :src="item.id | xficon" :alt="item.name" />
                    </i>
                    <span class="u-txt">{{ item.name }}</span>
                </router-link>
            </li> -->
            <li class="u-item" v-for="(item, i) in xfmaps" :key="i" v-show="item.client.includes(client)">
                <router-link
                    class="u-link"
                    :to="{ query: { subtype: item.name, tab: tab } }"
                    :class="{ on: isActive(item) }"
                >
                    <i class="u-pic">
                        <img :src="showMountIcon(item.id)" :alt="item.name" />
                    </i>
                    <span class="u-txt">{{ item.name }}</span>
                </router-link>
            </li>
        </ul>

        <h5 class="u-title u-app-title">在线应用</h5>
        <div class="m-nav-group m-app-nav">
            <!-- <a href="/pz" target="_blank">
                <img class="u-icon" :src="getAppIcon('pz', true)" />
                <span>配装模拟器</span>
                <em>Assembly Simulator</em>
            </a> -->
            <a href="/bps/haste" target="_blank">
                <img class="u-icon" :src="getAppIcon('haste')" />
                <span>加速阈值</span>
                <em>Haste</em>
            </a>
            <a href="/bps/dps" target="_blank">
                <img class="u-icon" :src="getAppIcon('dps')" />
                <span>DPS计算器</span>
                <em>DPS</em>
            </a>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { __ossMirror, __imgPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import { getAppIcon, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "list_nav",
    props: [],
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        tab: function () {
            return this.$route.query.tab;
        },
        xfmaps() {
            delete xfmap["山居剑意"];
            return xfmap;
        },
    },
    methods: {
        isActive: function (item) {
            return item.name == this.$route.query.subtype;
        },
        getAppIcon(key) {
            return __cdn + `logo/logo-light/${key}.svg`
        },
        showMountIcon,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/bps/nav.less";
</style>
