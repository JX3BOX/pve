<template>
    <div class="p-pkg p-pkg-build" v-loading="loading">
        <div class="m-header">
            <h1 class="u-title"> 构建数据包 </h1>
            <p class="u-desc">
                构建云数据，支持在线浏览数据内容，点击查看<a href="/tool/17401" target="_blank">「帮助文档」</a>。
            </p>
            <div class="u-ops">
                <pkg-history v-if="isEditMode" :pkg="pkg" @rollback="onRollback"></pkg-history>
            </div>
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
                <!-- 场景标记 -->
                <pkg-mark></pkg-mark>
                <!-- 扩展信息 -->
                <pkg-extend></pkg-extend>
                <!-- 其它设置 -->
                <pkg-other></pkg-other>
            </el-form>
        </div>
        <div class="m-publish">
            <el-button
                class="u-btn"
                type="primary"
                icon="el-icon-s-promotion"
                v-if="isEditMode"
                @click="publish()"
                :disabled="!isLogin"
            >
                <span class="u-txt">发版</span></el-button
            >
        </div>

        <pkg-publish v-model="showPublish" :pkgType="pkg.type"></pkg-publish>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
import { extendPkg } from "@/assets/data/dbm/default_pkg.js";
import { getMyPkg, checkName, getModuleList } from "@/service/dbm/pkg.js";
import bus from "@/utils/dbm/mitt.js";
import { serializer } from "luadata";
import { readJx3dat } from "@/utils/dbm/jx3dat.js";

// components
import pkg_subscribe from "@/components/dbm/pkg/form/pkg_subscribe.vue";
import pkg_extend from "@/components/dbm/pkg/form/pkg_extend.vue";
import pkg_other from "@/components/dbm/pkg/form/pkg_other.vue";
import pkg_publish from "@/components/dbm/pkg/form/pkg_publish.vue";
import pkg_history from "@/components/dbm/pkg/form/pkg_history.vue";
import pkg_mark from "@/components/dbm/pkg/form/pkg_mark.vue";

export default {
    name: "MarkEdit",
    props: [],
    components: {
        "pkg-subscribe": pkg_subscribe,
        "pkg-extend": pkg_extend,
        "pkg-other": pkg_other,
        "pkg-publish": pkg_publish,
        "pkg-history": pkg_history,
        "pkg-mark": pkg_mark,
    },
    data() {
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

            showPublish: false,

            done: false, // 加载完成
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
        }),
        isEditMode() {
            return this.$route.name == "mark_edit";
        },
        id: function () {
            return this.$route.params.id;
        },
    },
    mounted() {
        this.loadPkg();

        bus.on("module-update", async () => {
            await this.loadModules();
        });
    },
    methods: {
        publish: function () {
            this.$refs.pkgForm.validate((valid) => {
                if (valid) {
                    this.showPublish = true;
                }
            });
        },
        loadPkg() {
            if (!this.id) return;
            this.done = false;
            this.loading = true;
            getMyPkg(this.id)
                .then(async (res) => {
                    const data = res.data.data;
                    // 修正数据
                    data.pkg_meta = data.pkg_meta || extendPkg.pkg_meta;

                    this.$store.commit("SET_PKG", data);
                    if (data.type == 3) {
                        this.$store.commit("SET_MARK_MAP", data.pkg_tag.map(Number));
                        this.parseMarkData();
                    }
                    this.done = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async parseMarkData() {
            const url = this.pkg?.pkg_record?.["file"];
            if (!url) return;
            const buffer = Buffer.from(await fetch(url).then((res) => res.arrayBuffer()));
            const content = readJx3dat(buffer).content;
            const data = serializer.unserialize(content, { dictType: "object" });
            const target_data = data.map((item) => {
                return {
                    img: item.img,
                    remark: item.remark,
                    x: item.x,
                    y: item.y,
                    z: item.z,
                };
            });
            if (!target_data.length) {
                target_data.push({ img: "", remark: "", x: 0, y: 0, z: 0 });
            }
            this.$store.commit("SET_MARK_DATA", target_data);
        },
        checkPkgName(rule, value, callback) {
            if (value) {
                checkName({ key: `${this.pkg.author}#${value}` }).then((res) => {
                    const result = res.data?.data;
                    const isValid = !result || result?.id == this.id;
                    if (!isValid) {
                        callback(new Error("订阅名已存在"));
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        onRollback() {
            this.loadPkg();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/pkg/build.less";
@import "~@/assets/css/dbm/pkg/single.less";
</style>
