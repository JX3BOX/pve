<template>
    <div class="m-vpk-marker" v-if="!noMarker">
        <i class="u-status u-sticky" v-if="mode == 'public_list' && !!vpk.sticky"
            ><i class="el-icon-download"></i><span class="u-tiny-text">置顶</span></i
        >
        <i class="u-status u-status--pending" v-if="vpk.status == 0"
            ><i class="el-icon-lock"></i><span class="u-tiny-text">审核中</span></i
        >
        <i class="u-status u-status--deleted" v-if="vpk.status == -1"
            ><i class="el-icon-close"></i><span class="u-tiny-text">未通过</span></i
        >
        <i class="u-status u-status--draft" v-if="vpk.status == -2"
            ><i class="el-icon-edit"></i><span class="u-tiny-text">草稿</span></i
        >
        <!-- <i class="u-status u-status--success" v-if="mode == 'mine_list' && vpk.status == 1"
            ><i class="el-icon-check"></i><span class="u-tiny-text">已通过</span></i
        > -->
        <template v-if="mode == 'public_list' || mode == 'public_single'">
            <i class="u-status u-star" v-if="!!vpk.is_official"
                ><i class="el-icon-cpu"></i><span class="u-tiny-text">官方</span></i
            >
            <i class="u-status u-star" v-if="!!vpk.star"
                ><i class="el-icon-star-off"></i><span class="u-tiny-text">精选</span></i
            >
        </template>
    </div>
</template>

<script>
export default {
    name: "VpkMarker",
    props: ["vpk", "mode"],
    components: {},
    data: function () {
        return {};
    },
    computed: {
        noMarker() {
            return this.mode == "public_list" && !this.vpk.sticky && !this.vpk.is_official && !this.vpk.star;
        },
    },
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.m-vpk-marker {
    display: inline-flex;
    gap: 5px;
    .u-status {
        .flex;
        align-items: center;
        // gap: 3px;
        .fz(12px);
        font-style: normal;
        .r(2px);
        padding: 0 5px;
        line-height: 20px;
        height: 20px;
        box-sizing: border-box;
        .u-tiny-text {
            transform: scale(0.85) !important;
        }
    }
    .u-status--pending {
        border: 1px solid #ffc107;
        color: #ffc107;
        background-color: #fffbf2;
    }
    .u-status--deleted {
        border: 1px solid #cc0000;
        background-color: #cc0000;
        color:#fff;
    }
    .u-status--draft {
        border: 1px solid #999;
        background-color: #999;
        color:#fff;
    }
    .u-status--success {
        border: 1px solid #69c800;
        background-color: #69c800;
        color:#f6fff2;
    }
    .u-star {
        background-color: @purple;
        color: #fff;
    }
    .u-official {
        background-color: #c00;
        color: #fff;
    }
    .u-sticky {
        background-color: @purple;
        color: #fff;
        i {
            transform: rotate(180deg);
            .pr;top:1px;
        }
    }
}
</style>
