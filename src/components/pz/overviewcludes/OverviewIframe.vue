<template>
    <div class="m-overview-code m-overview-iframe">
        <el-input class="u-code u-horizontal" :value="code" :rows="3">
            <span slot="prepend">
                <!-- 模式 -->
                <el-radio-group v-model="mode" size="small">
                    <el-radio-button label="horizontal">横版</el-radio-button>
                    <el-radio-button label="vertical">竖版</el-radio-button>
                </el-radio-group>
            </span>
        </el-input>
        <div class="u-toolbar">
            <el-button
                class="u-btn u-btn-copy"
                icon="el-icon-document-copy"
                @click="copy"
                size="small"
            >点击复制</el-button>
            <a href="/tool/32032" class="u-link-doc" target="_blank">
                <i class="el-icon-warning-outline"></i>使用帮助
            </a>
        </div>
    </div>
</template>

<script>
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { copyText } from "@/utils/pz/tools";
export default {
    name: "OverviewIframe",
    data: function () {
        return {
            mode: "horizontal",
            size : {
                horizontal : {width:1280,height:720},
                vertical : {width:750,height:3468}
            }
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        code: function () {
            return `<iframe src="${__Root}pz/iframe.html?id=${this.id}&mode=${this.mode}" scrolling="no" width="${this.size[this.mode].width}" height="${this.size[this.mode].height}" style="border:none;background:none;max-width:100%;overflow:hidden;"></iframe>`;
        },
    },
    methods: {
        copy: function () {
            copyText(this.code, "配装嵌入编码复制成功", this);
        },
    },
};
</script>
<style lang="less">
.m-overview-iframe {
    .el-input-group__prepend{
        // .fz(12px);
        padding-left: 3px;
        padding-right: 3px;
    }
    .u-code .el-input__inner {
        font-family: "Consolas", "Trebuchet MS", "Lucida Sans Unicode",
            "Lucida Grande", "Lucida Sans", Arial, sans-serif;
    }
    .u-horizontal {
        .mb(10px);
    }
}
</style>
