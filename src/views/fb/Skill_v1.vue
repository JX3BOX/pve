<template>
    <div class="m-fb-skill" v-loading="loading">
        <!-- BOSS切换 -->
        <div class="m-skill-index">
            <el-tabs v-model="focus" type="card" @tab-click="loadLua" v-if="subnav">
                <el-tab-pane v-for="boss in subnav" :label="boss" :key="boss" :name="boss"></el-tab-pane>
            </el-tabs>
        </div>

        <el-input class="m-skill-search" placeholder="请输入技能名称" v-model.trim.lazy="search">
            <span slot="prepend"><i class="el-icon-search"></i> 搜索</span>
            <el-button slot="append" icon="el-icon-position"></el-button>
        </el-input>

        <ul class="m-skill-list" v-if="!empty">
            <li v-for="(skill, key) in data" class="u-item" :key="key" v-show="skill.show">
                <skill-item :data="skill" :hasRight="hasRight" :name="key"></skill-item>
            </li>
        </ul>
        <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
    </div>
</template>

<script>
import { getLuaIndex, getLua } from "@/service/fb/skill";
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box";
import skill_item from "@/components/fb/skill/skill_item.vue";
export default {
    name: "Skill_v1",
    props: [],
    data: function () {
        return {
            focus: "",
            search: "",
            loading: false,
            cache: {},
            data: {},
            empty: false,
            hasRight: false,
            isAdmin: true,
            subnav: [],
        };
    },
    computed: {
        fb: function () {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
    },
    methods: {
        loadLua: function () {
            this.loading = true;
            getLua(this.fb, this.focus)
                .then((res) => {
                    this.data = res.data;
                    for (let key in this.data) {
                        this.data[key]["show"] = true;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadLuaIndex: function () {
            getLuaIndex(this.fb)
                .then((res) => {
                    this.empty = false;
                    this.subnav = res.data;
                    this.focus = this.subnav[0];
                    this.loadLua();
                })
                .catch((err) => {
                    this.empty = true;
                    console.log(err);
                });
        },
    },
    watch: {
        search: function (val) {
            if (!val) {
                for (let key in this.data) {
                    this.data[key]["show"] = true;
                }
            } else {
                for (let key in this.data) {
                    if (
                        key.includes(val) ||
                        (!!this.data[key]["origin_id"] ? String(this.data[key]["origin_id"]).includes(val) : false) ||
                        (!!this.data[key]["origin_name"] ? this.data[key]["origin_name"].includes(val) : false)
                    ) {
                        this.data[key]["show"] = true;
                    } else {
                        this.data[key]["show"] = false;
                    }
                }
            }
        },
        fb: function () {
            this.loadLuaIndex();
        },
    },
    mounted: function () {
        this.loadLuaIndex();
        // User.isLogin() &&
        //     User.isVIP().then((data) => {
        //         this.hasRight = data;
        //     });
    },
    components: {
        "skill-item": skill_item,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/skill.less";
</style>
