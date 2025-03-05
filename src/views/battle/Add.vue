<template>
    <div class="m-battle-add">
        <subheader class="m-upload-header" title="云端保存" desc="Battle Statistical Analysis"> </subheader>
        <el-divider content-position="left">战斗记录信息</el-divider>
        <el-form>
            <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="请输入标题" :maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.desc" placeholder="请输入描述" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="阅读权限">
                <el-radio-group v-model="form.visible">
                    <el-radio :label="0">公开</el-radio>
                    <el-radio :label="1">私有</el-radio>
                    <el-radio :label="2">仅亲友可见</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="u-buttons">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit" :disabled="!canUpdate">上传</el-button>
                <p class="u-tips">
                    <!-- 刚进入页面的时候需要开子线程把raw变成UInt8Array花时间 -->
                    <template v-if="deflateProgress == -1">
                        <span>正在准备压缩...... </span>
                        <i class="el-icon-loading"></i>
                    </template>
                    <!-- 用户填写信息的时候异步压缩文件 -->
                    <template v-else-if="deflateProgress != 100">
                        <span>正在压缩文件...... </span>
                        <i class="el-icon-loading"></i>
                        <span> {{ deflateProgress }} %</span>
                    </template>
                    <template v-else-if="uploading && !ossConfig">
                        <span>正在获取上传令牌...... </span>
                        <i class="el-icon-loading"></i>
                    </template>
                    <!-- 上传进度提示 -->
                    <template v-else-if="uploading">
                        <span>正在上传...... </span>
                        <i class="el-icon-loading"></i>
                    </template>
                </p>
            </div>
        </el-form>
    </div>
</template>

<script>
import PakoWorker from "@/utils/battle/pako.worker.js";
import { getUploadToken, addBattle } from "@/service/battle/team";
import { luadata } from "@jx3box/jx3-luadata";
import OSS from "ali-oss";

import subheader from "@/components/battle/subheader.vue";

export default {
    name: "battleAdd",
    components: {
        subheader,
    },
    computed: {
        type() {
            return this.$route.params.type;
        },
    },
    data() {
        return {
            raw: "",
            deflatedData: null,
            deflateProgress: -1,
            uploading: false,

            targetPath: "", //文件上传的目标路径
            ossConfig: null,

            form: {
                title: "",
                desc: "",
                visible: 1,
                type: "",
                subject: "stat",
                version: "v2",
                raw: "",
            },
        };
    },
    computed: {
        canUpdate() {
            return this.deflateProgress == 100 && !this.uploading;
        },
        fileType() {
            return this.$route.params.type;
        },
        subject() {
            return this.$store.state.info.subject;
        },
    },
    methods: {
        deflate() {
            let worker = new PakoWorker();
            worker.onmessage = (e) => {
                e = e.data;
                if (e.type == "progress") {
                    this.deflateProgress = e.data;
                } else if (e.type == "result") {
                    this.deflatedData = e.data;
                }
            };
            worker.postMessage({
                cmd: "deflate",
                raw: 'return ' + luadata.serialize(this.raw),
            });
        },
        getToken() {
            return getUploadToken(this.form.type)
                .then((res) => {
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    let data = res.data.data;
                    this.targetPath = data.filepath;
                    this.form.raw = data.onlineURL;
                    this.ossConfig = {
                        endpoint: data.endpoint ?? "oss-cn-hangzhou.aliyuncs.com",
                        region: data.region ?? "cn-hangzhou",
                        accessKeyId: data.token.AccessKeyId,
                        accessKeySecret: data.token.AccessKeySecret,
                        stsToken: data.token.SecurityToken,
                        bucket: data.bucket,
                    };
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("上传令牌获取失败，请勿频繁操作");
                });
        },
        upload() {
            return this.getToken()
                .then(() => {
                    if (!this.ossConfig) return;
                    // 上传操作
                    const client = new OSS(this.ossConfig);
                    const data = new Blob([this.deflatedData], { type: "application/gzip" });
                    return client.put(this.targetPath, data);
                })
                .then(() => {
                    return addBattle(this.form);
                })
                .then(() => {
                    return this.$confirm("已上传完毕，估计需要1~3分钟同步结束之后才能访问。", "成功", {
                        confirmButtonText: "确定",
                        type: "success",
                    });
                });
        },
        submit() {
            if (!this.form.title) {
                this.$message.error("标题不能为空");
                return;
            }
            this.uploading = true;
            this.upload()
                .then(() => {
                    this.$store.commit("RESET");
                    delete window.$store;
                    setTimeout(() => {
                        this.$router.push({ name: "mine" });
                    }, 1000);
                })
                .catch((err) => {
                    console.log(err);
                    this.uploading = false;
                    this.$message.error("上传失败，请F12打开控制台反馈报错信息");
                });
        },
        cancel() {
            this.$router.back();
        },
    },
    mounted() {
        this.raw = this.$store.state.raw;
        this.form.type = this.fileType;
        this.form.subject = this.subject;
        if (!this.raw) this.$router.push({ name: "upload" });
        this.deflate();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/add.less";
</style>
