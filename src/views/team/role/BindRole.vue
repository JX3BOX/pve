<template>
    <div class="v-role-bind">
        <h1 class="m-title">
            <i class="el-icon-connection"></i>
            <span class="u-txt">绑定角色</span>
            <!-- <div class="u-op">
                <router-link to="/role/add" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div> -->
            <div class="u-op">
                <el-button
                    slot="reference"
                    class="u-back"
                    size="mini"
                    icon="el-icon-arrow-left"
                    @click="goBack"
                >返回列表</el-button>
            </div>
        </h1>
        <el-tabs v-model="tab" type="card">
            <el-tab-pane label="插件绑定（仅正式服可用）" name="std">
                <span slot="label">插件绑定<span class="u-tab-tip">（仅正式服可用）</span></span>
                <div class="m-token" v-loading="loading">
                    <h2 class="u-title">
                        绑定令牌
                        <span class="u-desc">( 10分钟内有效，超时请刷新页面 )</span>
                    </h2>
                    <span
                        class="u-token"
                        title="点击复制"
                        v-clipboard:copy="token"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    >
                        <i class="el-icon-document-copy"></i>
                        {{ token }}
                    </span>
                </div>
                <div class="m-tutorial">
                    <h2 class="u-title">
                        <i class="el-icon-question"></i> 绑定步骤
                    </h2>
                    <p>
                        打开【茗伊插件集】-【团队】-【团队平台】
                        <br />【点击绑定】并【填入上方密钥】以绑定角色到魔盒账号
                        <br />可以将多个角色绑定至同一个魔盒账号
                    </p>
                    <img class="u-demo" :src="demo_url" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="自定义创建" name="origin">
                <roleform :data="form" @submit="submit" btn_txt="创建" :processing="processing" />
            </el-tab-pane>
        </el-tabs>
        <!-- <div class="m-custom-tip">
            <el-alert type="info" :closable="false">
                <i class="el-icon-info"></i> 添加一个不属于自己账号的角色，可尝试添加<router-link to="/role/add">自定义角色</router-link>
            </el-alert>
        </div>-->
    </div>
</template>

<script>
import { getToken } from "@/service/team/role.js";
import { __imgPath, __ossMirror } from "@jx3box/jx3box-common/data/jx3box.json";
import roleform from "@/components/team/role/roleform.vue";
import { createRole } from "@/service/team/role.js";
export default {
    name: "BindRole",
    props: [],
    data: function () {
        return {
            token: "INVALIDTESTTOKEN",
            demo_url: __ossMirror + "upload/post/2021/7/4/6658485.png",
            loading: false,
            tab : location.href.includes('origin') ? 'origin' : 'std',

            form: {
                name: "",
                server:
                    (localStorage &&
                        localStorage.getItem("team_role_default_server")) ||
                    "",
                mount: "0",
                body_type: "1",
                note: "",
                custom: 1,
            },
            processing: false,
        };
    },
    computed: {},
    methods: {
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: val.text,
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
        submit: function () {
            this.processing = true;
            createRole(this.form)
                .then((res) => {
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                    this.$router.push("/role/manage");
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        goBack : function (){
            this.$router.push('/role/manage')
        }
    },
    mounted: function () {
        this.loading = true;
        getToken()
            .then((res) => {
                this.token = res.data.data.token;
            })
            .finally(() => {
                this.loading = false;
            });
    },
    components: {
        roleform
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/role/bind_role.less";
</style>
