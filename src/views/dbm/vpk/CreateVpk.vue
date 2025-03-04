<template>
        <div class="p-vpk-create p-vpk-build">
            <div class="m-header">
                <h1 class="u-title"> 创建语音包 </h1>
                <p class="u-desc">
                    创建语音包，支持在线自动转换格式，点击查看<a href="/tool/57764" target="_blank">「帮助文档」</a>。
                </p>
            </div>

            <div class="m-vpk-ac">
                <span class="u-title"><img svg-inline src="@/assets/img/dbm/common/ac.svg" />特别说明</span>
                <div class="u-content" v-html="ac"></div>
            </div>

            <div class="m-vpk-form--create m-vpk-body">
                <VpkFrom @update="syncForm" :data="form"></VpkFrom>
                <el-alert class="m-vpk-limit" center :closable="false" v-if="level < 2">
                    为了创建和谐友好的社区环境，本功能暂时仅面向Lv.2及以上用户开放。<br />
                    如何获得社区经验？<a href="/notice/28917" target="_blank">《社区经验获取指南》</a>、<a
                        href="/dashboard/tasks"
                        target="_blank"
                        >《任务中心》</a
                    >
                </el-alert>
                <div class="u-buttons">
                    <el-button class="u-submit" type="primary" @click="createVpk" :disabled="level < 2">创建</el-button>
                </div>
            </div>
        </div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import VpkFrom from "@/components/dbm/vpk/form.vue";
import { createVpk } from "@/service/dbm/vpk.js";
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "CreateVpk",
    props: [],
    components: {
        VpkFrom,
    },
    data: function () {
        return {
            form: {
                title: "",
                description: "",
                tags: [],
                allow_comment: 1,
                allow_gift: 1,
                client: location.href.includes("origin") ? "origin" : "std"
            },
            ac: "",

            userAssets: null,
        };
    },
    computed: {
        level() {
            return User.getLevel(this.userAssets?.experience);
        },
    },
    watch: {},
    methods: {
        syncForm(data) {
            this.form = data;
        },
        loadAc() {
            getBreadcrumb("dbm_vpk_ac").then((res) => {
                this.ac = res || "";
            });
        },
        createVpk() {
            if (!this.form.title) {
                this.$notify({
                    title: "标题不能为空",
                    message: "请填写语音包标题",
                    type: "warning",
                });
                return;
            }
            const data = {
                title: this.form.title,
                description: this.form.description,
                allow_comment: this.form.allow_comment,
                allow_gift: this.form.allow_gift,
                client: this.form.client,
            };
            if (this.form.tags.length) {
                data.tags = this.form.tags;
            }
            createVpk(data).then((res) => {
                this.$notify({
                    title: "创建成功",
                    message: "语音包创建成功，开始上传文件吧",
                    type: "success",
                });
                const id = res.data.data.id;
                this.$router.push(`/vpk/build/${id}`);
            });
        },
    },
    mounted: function () {
        this.loadAc();

        User.getAsset().then((res) => {
            this.userAssets = res;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/build.less";
</style>
