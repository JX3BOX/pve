<template>
    <div class="m-parse-import" :class="{ disabled: !isLogin }" @click="login">
        <el-upload
            class="u-import"
            drag
            accept=".jx3dat,.json"
            :on-change="imported"
            :disabled="!isLogin"
            action=""
            :auto-upload="false"
            :multiple="false"
        >
            <i class="u-icon el-icon-upload" v-if="valid === null"></i>
            <i class="u-icon" v-else>{{ showFileExt }}</i>
            <div class="el-upload__text">
                <template v-if="file">
                    <b class="u-name">{{ file.name }}</b>
                    <p>当前选择文件大小 : {{ showFileSize }}</p>
                </template>
                <template v-else>
                    <p v-if="isLogin">将文件拖到此处，或<em>点击上传</em></p>
                    <p v-else>要使用本功能，请先登录</p>
                    <p class="u-tip">
                        <i class="el-icon-warning-outline"></i>
                        游戏内导出数据时请选择加密压缩格式<b>之外</b>的模式<b>（仅支持团队监控数据）</b>，否则无法正常解析。
                    </p>
                </template>
            </div>
        </el-upload>
        <el-button
            class="u-btn"
            type="primary"
            icon="el-icon-switch-button"
            @click="start"
            :disabled="!isLogin || !file"
            >开始解析</el-button
        >
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "parseImport",
    props: [],
    data: () => ({
        isLogin: User.isLogin(),
        file: "",
        valid: null,
    }),
    computed: {
        showFileSize() {
            if (!this.file) return false;
            const units = ["B", "KB", "MB"];
            let size = this.file.size;
            let i = 0;
            while (size > 1024) {
                size /= 1024;
                i++;
            }
            return `${size.toFixed(2)} ${units[i]}`;
        },
        showFileExt() {
            if (!this.file) return "";
            return this.file.name.split(".").pop().toUpperCase();
        },
    },
    methods: {
        login() {
            if (!this.isLogin) {
                User.toLogin();
            }
        },
        imported(file) {
            this.file = file;
            this.$store.commit("SET_PARSE_FILE", this.file);
        },
        start() {
            this.$emit("start");
        },
    },
    watch: {
        "$store.state.parse_file": {
            handler: function (val) {
                this.file = val;
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/parse/parse_import.less";
</style>
