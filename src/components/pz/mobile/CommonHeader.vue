<template>
    <div class="m-mobile-header" :class="{ 'on-search': showSearch }">
        <div class="m-header">
            <div class="u-left">
                <i class="u-mount" @click="handleShow">
                    <img class="u-pic" :src="showMountIcon(form.mount)" :alt="form.mount" />
                </i>
                <slot name="title" />
            </div>
            <div class="u-right">
                <i class="el-icon-search u-icon" :class="{ 'active': showSearch }" @click="handleSearchIconClick"></i>
                <i class="u-add u-icon" @click="handleAdd">+</i>
            </div>
        </div>
        <div class="m-filter">
            <div class="m-search" v-show="showSearch">
                <el-input placeholder="请输入关键词" v-model.trim="form.search" clearable prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="m-tag" v-show="isPublic && showSearch">
                <div class="m-tag-content" :class="{ expended: tagShow }">
                    <el-tag
                        v-for="(item, i) in tags"
                        :key="i"
                        class="u-tag"
                        type="warning"
                        :effect="form.tags.includes(item) ? 'dark' : 'plain'"
                        @click="handleTagClick(item)"
                        size="small"
                    >
                        {{ item }}
                    </el-tag>
                    <el-tag
                        class="u-tag"
                        @click="handleStar"
                        :effect="form.star ? 'dark' : 'plain'"
                        size="small"
                        type="warning"
                        >★编辑推荐</el-tag
                    >
                </div>
                <i class="u-handler" :class="tagShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="handleTagShow"></i>
            </div>
        </div>

        <el-dialog title="选择心法" :visible.sync="show" fullscreen center custom-class="m-mount" append-to-body>
            <div class="m-mount-list">
                <el-radio
                    v-for="(item, i) in xfMaps"
                    v-model="mount"
                    :label="String(item.id)"
                    :key="i"
                    v-show="!isPublic || (isPublic && item.client.includes(client))"
                    @input="handleSelect(item)"
                >
                    <img class="u-pic" :src="showMountIcon(item.id)" :alt="item.name" />
                    <span class="u-txt">
                        {{ item.id ? item.name : "全部" }}
                    </span>
                </el-radio>
            </div>
        </el-dialog>
        <AddPz v-model="addShow" />
    </div>
</template>

<script>
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { tags } from "@/assets/data/pz/query_types.json";
import { debounce } from "lodash";
// components
import AddPz from "@/components/pz/mobile/AddPz.vue";
export default {
    name: "MobileCommonHeader",
    components: {
        AddPz,
    },
    props: {
        isPublic: {
            // 是否为配装大厅
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {
                mount: "0",
                search: "",
                tags: [],
                star: false,
            },
            tags,
            mount: "0",

            show: false,
            addShow: false,
            showSearch: false,
            tagShow: false,
        };
    },
    computed: {
        xfMaps() {
            let xfMaps = [];
            let common = {};
            Object.values(xf_map).forEach((value) => {
                if (!value.id) {
                    common = value;
                } else {
                    xfMaps.push(value);
                }
            });

            // 移除山居剑意
            return [common, ...xfMaps].filter((xf) => xf.id !== 10145);
        },
        client() {
            return this.$store.state.client || "std";
        },
    },
    watch: {
        form: {
            handler: debounce(function () {
                this.$emit("change", this.form);
            }, 500),
            deep: true,
        },
        showSearch() {
            this.$emit('resize')
        },
        tagShow() {
            this.$emit('resize')
        }
    },
    methods: {
        showMountIcon(val) {
            let id = val || 0;
            return __imgPath + "image/mount/" + id + ".png";
        },
        handleTagClick(tag) {
            if (this.form.tags.includes(tag)) {
                this.form.tags = this.form.tags.filter((item) => item !== tag);
            } else {
                this.form.tags.push(tag);
            }
        },
        handleShow() {
            this.show = true;
            this.mount = String(this.form.mount);
        },
        handleSelect(item) {
            this.form.mount = item.id;
            this.show = false;
        },
        handleStar() {
            this.form.star = !this.form.star;
        },
        handleAdd() {
            this.addShow = true;
        },
        handleSearchIconClick() {
            this.showSearch = !this.showSearch;
        },
        handleTagShow() {
            this.tagShow = !this.tagShow;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/mobile/common.less";
</style>
