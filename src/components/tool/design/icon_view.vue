<template>
    <div class="m-icons-view">
        <el-input placeholder="输入搜索条件，按 enter 进行搜索" v-model="search" class="input-with-select" clearable @keyup.enter.native="onSearch" @clear="onClear">
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>

        <div class="m-icons-matrix__view m-icons-matrix" v-loading="loading">
            <template v-for="index in listIndex">
                <el-popover v-if="listObj[index].ID" :key="index" trigger="hover" placement="top" popper-class="m-icon-pop" :visible-arrow="false">
                    <div class="m-icon-content">
                        <div class="m-icon-content__top">
                            <el-image :src="iconLink(index)" class="u-icon" alt="">
                                <i slot="error" class="el-icon-warning-outline u-error"></i>
                            </el-image>
                            <!-- @error="(e) => onIconError(e, index)" -->
                            <span class="u-id">ID: {{ index }}</span>
                        </div>
                        <div class="m-icon-content__bottom">
                            <div class="m-icon-content-item">
                                <span class="u-label">类别<small>Kind</small></span>
                                <span class="u-val">{{ listObj[index].Kind }}</span>
                            </div>
                            <div class="m-icon-content-item">
                                <span class="u-label">子类别<small>SubKind</small></span>
                                <span class="u-val">{{ listObj[index].SubKind }}</span>
                            </div>
                            <div class="m-icon-content-item" v-if="listObj[index].Tag1 || listObj[index].Tag2">
                                <span class="u-label">标签<small>Tag</small></span>
                                <span class="u-val">{{ iconTag(listObj[index]) }}</span>
                            </div>
                            <div class="m-icon-content-item">
                                <span class="u-label">文件<small>FileName</small></span>
                                <span class="u-val">{{ listObj[index].FileName }}</span>
                            </div>
                        </div>
                    </div>
                    <icon-item slot="reference" class="u-item" :icon="index" :isFav="false"></icon-item>
                </el-popover>
                <div class="m-icon__empty" v-else :key="index">
                    <div class="u-icon"></div>
                    <span class="u-id">{{ index }}</span>
                </div>
            </template>
        </div>
        <el-pagination
            v-if="search == '' && done"
            class="u-pagination"
            background
            layout="prev, pager, next,jumper"
            :total="total"
            :page-size="per"
            :current-page="page"
            hide-on-single-page
            @current-change="onPageChange"
            :pager-count="isMiniProgram ? 5 : 7"
            :small="isMiniProgram"
        >
        </el-pagination>
    </div>
</template>

<script>
import iconItem from "./item.vue";
import {getIcons, getIconLatest} from "@/service/tool/icons.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils.js";
import {mapState} from "vuex";
export default {
    name: "icons-view",
    components: {
        iconItem,
    },
    data() {
        return {
            icons: [],
            start: 1,
            end: 144,
            total: 0,
            search: "",
            loading: false,

            per: 144,
            page: 1,
            done: true
        };
    },
    computed: {
        ...mapState(["isMiniProgram"]),
        client() {
            return this.$store.state.client;
        },
        listIndex() {
            return this.search ? this.icons.map(item => item.ID) : Array.from({ length: this.per }, (v, k) => k + this.start).filter((i) => i <= this.total);
        },
        listObj() {
            return this.listIndex.reduce((obj, i) => {
                const item = this.icons.find((icon) => icon.ID === i);
                if (item) {
                    obj[i] = item;
                } else {
                    obj[i] = {
                        ID: "",
                        Kind: "",
                        SubKind: "",
                        Tag1: "",
                        Tag2: "",
                        FileName: "",
                    };
                }
                return obj;
            }, {});
        }
    },
    mounted() {
        this.loadLatest();
        this.loadData();
    },
    methods: {
        onSearch() {
            if (this.search) {
                this.start = 1;
                this.end = this.total;
                this.loadData();
            }
        },
        onClear() {
            this.start = 1;
            this.end = this.per;
            this.loadData();
        },
        loadLatest() {
            getIconLatest().then((res) => {
                this.total = res.data[0].ID;
            });
        },
        loadData() {
            this.loading = true;
            this.done = false;
            const params = {
                start: this.start,
                end: this.end,
                search: this.search,
            };
            getIcons(params).then((res) => {
                this.icons = res.data || [];
            }).finally(() => {
                this.loading = false;
                this.done = true;
            });
        },
        onPageChange(page) {
            this.page = page;
            this.start = (page - 1) * this.per + 1;
            this.end = page * this.per;
            this.loadData();
        },

        iconLink(id, client=this.client) {
            return iconLink(id, client);
        },
        iconTag({ Tag1, Tag2 }) {
            return [Tag1, Tag2].filter((i) => i).join("、");
        },
        onIconError(e, id) {
            e.target.src = this.iconLink(id, "std");
        },
    },
}
</script>

<style lang="less">
.m-icons-view {
    .u-pagination {
        .x;
        margin-top: 20px;
        max-width: 100%;
        overflow-x: auto;
    }
}
.m-icons-matrix__view {
    display: grid;
    grid-template-columns: repeat(18, 1fr);

    .u-icons-item {
        .flex;
        flex-direction: column;
        align-items: center;
    }
    .m-icon__empty {
        .flex;
        align-items: center;
        // justify-content: center;
        flex-direction: column;
    }
    .u-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: #f9fafc;
        border-radius: 6px;
        border: 1px solid #eee;
    }
}

.m-icon-pop{
    padding: 1px !important;
    border: 1px solid #68817e !important;
    background: none !important;
    border-radius: 0 !important;

    .m-icon-content__top {
        .u-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            .x;
            border-radius: 6px;
            border: 1px solid #68817e;
        }
    }

    .m-icon-content {
        background: rgba(0,0,0,.8);
        color: #fff;
        padding: 10px;
    }

    .u-id {
        margin-left: 10px;
        color: #ff0;
    }

    .u-label {
        .dbi;
        &::after {
            content: "：";
        }

        small::before {
            content: "（";
        }

        small::after {
            content: "）";
        }
    }

    .u-val {
        color: #ff0;
    }
}
</style>
