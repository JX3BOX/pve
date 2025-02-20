<template>
    <div class="v-lua" v-loading="loading" v-if="isSuperAuthor">
        <div class="m-lua-search">
            <el-input placeholder="请输入关键词" v-model.trim.lazy="search" class="input-with-select" @change="searchLua">
                <span slot="prepend"><i class="el-icon-search"></i> 搜索</span>
                <el-button slot="append" icon="el-icon-position" @change="searchLua"></el-button>
            </el-input>
        </div>
        <el-alert
            class="m-lua-warning"
            title="本功能仅内部作者可见，仅作为攻略写作的参考资料。禁止外传，违者后果自负！(本功能需要额外独立申请授权)"
            type="warning"
            effect="dark"
            show-icon
            :closable="false"
        ></el-alert>
        <div class="m-lua-tree m-lua-box">
            <div class="u-title">
                <i class="el-icon-collection-tag"></i>
                <span class="u-title-list" @click="showList">文件列表</span>
                <span class="u-title-file"><i class="el-icon-arrow-right"></i> {{ file }}</span>
                <div class="u-back" @click="showList" v-if="data"><i class="el-icon-caret-left"></i> 返 回</div>
            </div>
            <div class="u-item" v-show="!data" v-for="item in map" :key="item">
                <template v-if="!item.includes('/') && client == 'std'">
                    <div class="u-leaf">❤️ {{ item }}</div>
                </template>
                <template v-else>
                    <div class="u-leaf" @click="showCode(item)"><i class="el-icon-tickets"></i> {{ item }}</div>
                </template>
            </div>
            <div class="u-data" v-show="data">
                <div class="u-code" ref="lua">
                    <pre><code class="language-lua" id="lua" v-html="data"></code></pre>
                </div>
            </div>
        </div>
    </div>
    <div class="v-null" v-else>
        <el-alert type="warning" show-icon
            ><span slot="title">没有查看权限，仅<a href="/dashboard/#cooperation" target="_blank">【签约作者】</a>可见。</span></el-alert
        >
    </div>
</template>

<script>
import { getLuaIndex, getLua } from "@/service/fb/lua.js";
import "@/plugins/prism.js";
import "@/plugins/prism.css";
export default {
    name: "Lua",
    props: [],
    components: {},
    data: function() {
        return {
            loading: false,
            map: [],
            copyMap: [],
            current: "",
            data: "",
            file: "",
            search: "",
        };
    },
    computed: {
        fb: function() {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
        client: function() {
            return this.$store.state.client || "std";
        },
        isSuperAuthor: function() {
            return this.$store.state.isSuperAuthor;
        },
    },
    watch: {
        fb: function() {
            this.loadLuaIndex();
        },
        isSuperAuthor: {
            immediate: true,
            handler: function(val) {
                if (val) {
                    this.current = this.school_name;
                    this.loadLuaIndex();
                }
            },
        },
    },
    methods: {
        isDirectory: function(val) {
            return Array.isArray(val);
        },
        showSubtree: function(e, key) {
            this.$refs[key][0]["classList"].toggle("on");
        },
        showCode: function(path) {
            // console.log(path);
            this.file = path;
            this.loadLua(path);
        },
        showList: function() {
            this.file = this.current;
            this.data = "";
        },
        loadLua: function(path) {
            this.loading = true;
            getLua(this.fb, path, this.client)
                .then((res) => {
                    this.data = res.data;
                })
                .then(() => {
                    let root = this.$refs.lua;
                    root && Prism.highlightAllUnder(root);
                    this.$forceUpdate();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        searchLua: function() {
            if (this.search) {
                this.map = this.copyMap.filter((item) => item.includes(this.search));
            } else {
                this.map = this.copyMap;
            }
        },
        loadLuaIndex: function() {
            this.loading = true;
            getLuaIndex(this.fb, this.client)
                .then((res) => {
                    this.$store.state.isSuperAuthor = true;
                    this.map = this.copyMap = res.data.filter((item) => item) || [];
                }).finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/lua.less";
</style>
