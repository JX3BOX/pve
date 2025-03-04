<template>
    <div class="v-upload">
        <subheader class="m-upload-header" title="上传数据" desc="Upload JX3 Combat Log"></subheader>
        <div class="m-upload-body">
            <!-- 步进显示 -->
            <el-steps :active="step" simple finish-status="success" class="m-upload-step">
                <el-step title="选择方向" icon="el-icon-setting"></el-step>
                <el-step title="上传数据" icon="el-icon-upload2"></el-step>
                <el-step title="分析数据" icon="el-icon-s-promotion"></el-step>
            </el-steps>

            <!-- 选择类型 -->
            <div class="m-upload-select-type" v-if="step == FIRST_STEP">
                <el-radio-group v-model="subject">
                    <el-radio :label="key" border v-for="(item, key) in types" :key="key" :disabled="!item.enable">
                        <i :class="item.icon"></i>
                        <div class="u-desc">
                            <b>{{ item.name }}</b>
                            <span>{{ item.desc }}</span>
                            <em>{{ item.remark }}</em>
                        </div>
                    </el-radio>
                </el-radio-group>
            </div>

            <!-- 上传文件 -->
            <div class="m-upload-upload" v-if="step == FIRST_STEP + 1">
                <el-upload
                    drag
                    action="/upload"
                    :multiple="allowMultiUpload"
                    :auto-upload="false"
                    :accept="accept"
                    :file-list="fileList"
                    :on-change="uploadFile"
                    ref="upload"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                        <div class="el-upload__tip" slot="tip">只能上传{{ allowExt }}文件</div>
                    </div>
                </el-upload>
                <div class="u-doc">
                    <a :href="docLink" target="_blank"><i class="el-icon-info"></i> 点击查看如何获取对应数据文件</a>
                </div>
            </div>

            <!-- 分析进度 -->
            <div class="m-upload-processing" v-if="step == LAST_STEP">
                <!-- 分析按钮 -->
                <div class="m-upload-btns m-upload-start" v-if="!done">
                    <el-button class="u-start" @click="start" icon="el-icon-switch-button" type="primary"
                        >开始分析</el-button
                    >
                </div>
                <!-- 进度展示 -->
                <template v-else>
                    <!-- 分析组件/用于显示进度等 -->
                    <analysis @success="success" ref="analysis"></analysis>
                    <div class="m-upload-btns">
                        <el-button class="u-reset" @click="reset" icon="el-icon-refresh-left" plain>重置</el-button>
                        <el-button
                            class="u-view"
                            @click="view"
                            icon="el-icon-position"
                            type="primary"
                            :disabled="!ready"
                            >查看结果</el-button
                        >
                    </div>
                </template>
            </div>

            <!-- 步进控制 -->
            <div class="u-btns" v-if="step != LAST_STEP">
                <el-button class="u-prev" plain @click="goPrev" :disabled="step <= FIRST_STEP" icon="el-icon-arrow-left"
                    >上一步</el-button
                >
                <el-button class="u-next" type="primary" @click="goNext" :disabled="step >= LAST_STEP">
                    下一步
                    <i class="el-icon-arrow-right"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import types from "@/assets/data/battle/types";
import subheader from "@/components/battle/subheader.vue";
import analysis from "@/components/battle/analysis.vue";

export default {
    name: "Upload",
    data: function () {
        return {
            // 选项
            types,

            // 数据库字段
            type: "tinymins",
            subject: "stat",
            allowExt: "jx3dat",

            // 步骤
            step: 0,
            LAST_STEP: 2,
            FIRST_STEP: 0,

            // 上传
            fileList: [],
            done: false,

            // 最后一步的进度
            processing: 0,
            // status: 0进行中，1步骤成功，2步骤失败，3最终成功
            readyMap: [
                {
                    desc: "读取文件",
                    status: 0,
                },
            ],
            ready: false,
        };
    },
    computed: {
        docLink: function () {
            return types[this.subject]["doc"];
        },
        accept: function () {
            return types[this.subject]["ext"];
        },
        allowMultiUpload: function () {
            return this.subject == "official";
        },
    },
    methods: {
        goPrev: function () {
            if (this.step <= this.FIRST_STEP) return;
            this.step -= 1;
        },
        goNext: function () {
            if (this.step >= this.LAST_STEP) return;
            // 开始分析
            if (this.step == 1) {
                if (!this.$store.state.file) {
                    this.$alert("请先上传需要分析的文件", "提醒", {
                        confirmButtonText: "确定",
                    });
                    return;
                }
                this.step += 1;
            } else {
                this.step += 1;
            }
        },
        uploadFile: function (file, fileList) {
            if (this.subject != "official") {
                this.fileList = [file];
                this.$store.commit("set", {
                    key: "file",
                    val: file,
                });
            } else {
                const [suffix, statType, fightID] = /_(\d)_(\d+)\.jx3dat/.exec(file.name) ?? [file.name, -1, -1];
                if (fightID == -1) {
                    this.clearUpload("官方战斗统计数据格式应为xxxx_{统计类型}_{战斗ID}.jx3dat");
                }
                if (fileList.some((file) => !file.name.endsWith(`_${fightID}.jx3dat`))) {
                    this.clearUpload("请上传同一场战斗的数据文件（同一场战斗产生的数据文件尾部的数字一样）");
                }
                file.type = statType;
                this.$store.commit("set", {
                    key: "file",
                    val: fileList,
                });
            }
        },
        clearUpload: function (alert) {
            this.fileList = [];
            this.$alert(alert, "提示", {
                confirmButtonText: "确定",
            });
        },
        view: function () {
            this.$store.commit("set", {
                key: "current",
                val: "",
            });
            this.$router.push({
                name: "combat",
            });
        },
        start: function () {
            // 拿到blob之后剩下的东西交给analysis组件
            this.$store.commit("set", {
                key: "info",
                val: { type: this.type, subject: this.subject },
            });
            // done为true之后初始化analysis组件，开始读文件/分析的流程写在analysis组件的mounted里
            this.done = true;
        },
        success: function () {
            this.ready = true;
        },
        reset: function () {
            this.subject = "stat";
            this.$store.state.file = "";
            this.$store.commit("patch", {
                data: "",
                analysis: "",
                info: {},
            });
            this.step = 0;
            this.processing = 0;
            this.done = false;
            this.readyMap = [
                {
                    desc: "读取文件",
                    status: 0,
                },
            ];
            delete window.$store;
        },
        setStep: function (step) {
            this.step = step;
        },
    },
    watch: {
        subject: {
            handler: function () {
                const item = types[this.subject];
                this.type = item.type;
                const info = this.$store.state.info;
                this.$store.commit("SET_INFO", {
                    ...info,
                    type: this.type,
                    subject: this.subject,
                });
                this.allowExt = item.ext.substring(1);
            },
            immediate: true,
        },
    },
    components: {
        subheader,
        analysis,
    },
    mounted: function () {
        // 每次进入后清空当前文件
        this.reset();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/upload.less";
</style>
