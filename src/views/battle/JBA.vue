<template>
    <div class="v-jba">
        <subheader class="m-upload-header" title="魔盒助手令牌" desc="JX3BOX Assistant Token"> </subheader>
        <div class="m-jba-token">
            <h2 class="u-title">获取临时令牌</h2>
            <span class="u-warn"><i class="el-icon-warning"></i> 此令牌用于魔盒助手身份校验，切勿泄漏。</span>
            <el-tooltip
                placement="top"
                content="此令牌用于魔盒助手身份校验，魔盒工作人员绝对不会向您索要该令牌，切勿泄露！"
            >
                <div
                    class="u-primary"
                    v-clipboard:copy="token"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                >
                    <span class="u-token">{{ token }}</span>
                    <span class="u-copy"><i class="el-icon-document-copy"></i></span>
                </div>
            </el-tooltip>

            <div class="u-desc" v-html="usage"></div>
        </div>
    </div>
</template>

<script>
import subheader from "@/components/battle/subheader.vue";
import { getNewToken } from "@/service/battle/team";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
export default {
    name: "JBA",
    components: { subheader },
    props: [],
    data: () => ({
        token: "************************************************************",
        usage: "",
    }),
    computed: {},
    methods: {
        onCopy() {
            this.$message.success("复制成功，切勿泄漏该Token！");
        },
        onError() {
            this.$message.error("复制失败");
        },
        loadUsage: function () {
            getBreadcrumb("battle-jba").then((data) => {
                this.usage = data;
            });
        },
        loadToken: function () {
            getNewToken()
                .then((res) => {
                    if (res.data.code !== 0) return;
                    this.token = res.data.data.token;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        init() {
            this.loadUsage();
            this.loadToken();
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jba.less";
</style>
