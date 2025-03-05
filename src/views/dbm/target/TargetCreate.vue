<template>
    <div class="p-pkg p-pkg-build" v-loading="loading">
        <div class="m-header">
            <h1 class="u-title"> 创建目标监控 </h1>
            <p class="u-desc">
                创建云数据，支持在线浏览数据内容，点击查看<a href="/tool/17401" target="_blank">「帮助文档」</a>。
            </p>
        </div>
        <div class="m-content">
            <el-form
                class="m-basic-form"
                label-width="120px"
                ref="pkgForm"
                hide-required-asterisk
                :label-position="layout"
                :model="pkg"
                :rules="rules"
                status-icon
            >
                <el-form-item label="数据包标题" prop="title">
                    <span slot="label"
                        ><span class="u-client i-client" :class="'i-client-' + pkg.client">{{
                            clients[pkg.client]
                        }}</span
                        >标题</span
                    >
                    <el-input v-model="pkg.title" placeholder="必填" :maxlength="50" show-word-limit class="u-title">
                    </el-input>
                </el-form-item>
                <!-- 订阅信息 -->
                <pkg-subscribe></pkg-subscribe>
                <!-- 扩展信息 -->
                <pkg-extend ref="extend"></pkg-extend>
                <!-- 其它设置 -->
                <pkg-other></pkg-other>
            </el-form>
        </div>
        <div class="m-publish">
            <el-button
                class="u-btn"
                type="primary"
                icon="el-icon-check"
                @click="publish"
                v-loading="loading"
                :disabled="!isLogin"
            >
                <span class="u-txt">创建</span>
            </el-button>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";

import { publishPkg, getFirstPkg, checkName } from "@/service/dbm/pkg.js";

// components
import PkgSubscribe from "@/components/dbm/pkg/form/pkg_subscribe.vue";
import PkgExtend from "@/components/dbm/pkg/form/pkg_extend.vue";
import PkgOther from "@/components/dbm/pkg/form/pkg_other.vue";

export default {
    name: "TargetCreate",
    props: [],
    components: {
        PkgSubscribe,
        PkgExtend,
        PkgOther,
    },
    data: function () {
        return {
            clients: __clients,

            isLogin: User.isLogin(),
            loading: false,
            layout: window.innerWidth < 1024 ? "top" : "left",

            rules: {
                title: [
                    { required: true, message: "请输入数据包标题", trigger: "blur" },
                    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
                ],
                name: [
                    { required: true, message: "请输入订阅名", trigger: "blur" },
                    { trigger: "blur", validator: this.checkPkgName },
                ],
            },
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
            target_tags: "target_tags"
        }),
    },
    mounted() {
        this.init();
    },
    methods: {
        publish: function () {
            this.$refs.pkgForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const data = {
                        ...this.pkg,
                        pkg_tag: this.target_tags
                    }
                    publishPkg(data)
                        .then((res) => {
                            this.$message({
                                message: "提交成功",
                                type: "success",
                            });
                            this.$router.push({ name: "target_edit", params: { id: res.data.data.id } });
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });
        },
        init() {
            this.$store.commit("RESET_PKG", { is_raw: 1, type: 2 })
            getFirstPkg().then((res) => {
                if (!res.data.data) {
                    this.$store.commit("SET_PKG", {
                        ...this.pkg,
                        title: `${User.getInfo().name}的目标监控数据`,
                        name: "默认版",
                    });
                }
            });
        },
        checkPkgName(rule, value, callback) {
            if (value) {
                checkName({ key: `${User.getInfo()?.name}#${value}` }).then((res) => {
                    if (res.data?.data) {
                        callback(new Error("该订阅名已存在"));
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/pkg/build.less";
</style>
