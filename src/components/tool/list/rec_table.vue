<template>
    <div class="m-index-rec" v-if="ac && data && data.length">
        <h5 class="u-title">
            <span>工具版公告与推荐置顶</span>
        </h5>
        <div class="u-ac" v-html="ac" v-if="ac"></div>
        <el-row v-if="data && data.length">
            <el-col :span="6" v-for="(item, i) in data" :key="i">
                <div class="u-rec">
                    <a :href="item.link" target="_blank" :style="item.color | highLight">
                        <img :src="item.icon | iconLink" v-if="item.icon" />
                        {{ item.label }}
                    </a>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getMenuGroup, getBread } from "@/service/tool/helper.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
const empty_item = {
    color: "",
    label: "",
    link: "",
    icon: "",
};
export default {
    name: "rec_table",
    props: [],
    components: {},
    data: function () {
        return {
            data: [],
            ac: "",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        init: function () {
            // let suffix = this.client == "origin" ? "-origin" : "";
            getMenuGroup("tool_rec").then((res) => {
                this.data = res.data.data.menus || [];

                let _fix = this.data.length % 4;
                if (_fix) {
                    for (let i = 0; i < 4 - _fix; i++) {
                        this.data.push(empty_item);
                    }
                }
            });
            getBread("tool_ac").then((res) => {
                this.ac = res.data.data.html;
            });
        },
    },
    filters: {
        highLight: function (val) {
            if (val) {
                return "color:" + val + ";font-weight:bold;";
            }
            return "";
        },
        iconLink,
    },
    watch: {
        client: {
            immediate: true,
            handler: function () {
                this.init();
            },
        },
    },
};
</script>

<style lang="less">
.m-index-rec {
    .mb(20px);
    @border: #dfe6f7;

    background-color: #fafbfc;
    border: 1px solid @border;
    border-bottom: none;
    .r(4px);

    .u-title {
        margin: 0;
        .x;
        .fz(12px, 2.5);
        border-bottom: 1px solid @border;
        span {
            color: #fff;
            background-color: #6f42c1;
            font-weight: normal;
            padding: 2px 5px;
            .r(2px);
        }
    }
    .u-ac {
        border-bottom: 1px solid @border;
        padding: 10px;
        .fz(12px,2);
    }
    .u-rec {
        img {
            .size(20px);
            .y;
        }
        // border:1px solid @border;
        border-right: 1px solid @border;
        border-bottom: 1px solid @border;
        a {
            .db;
            .fz(12px, 20px);
            padding: 8px 10px;
            &:hover {
                .bold;
                color: @pink;
                background-color: #fff;
            }
            .h(20px);
        }
    }
    .el-col .u-rec a {
        .nobreak;
    }
    .el-col:nth-child(4n) {
        .u-rec {
            border-right: 0;
        }
        // .ml(-1px);
        // .mt(-1px);
    }
}
@media screen and (max-width: @phone) {
    .m-index-rec .el-col {
        .w(50%);
    }
    .m-index-rec .el-col:nth-child(2n) .u-rec {
        border-right: none;
    }
}
</style>
