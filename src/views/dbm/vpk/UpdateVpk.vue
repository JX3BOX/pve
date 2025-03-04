<template>
    <div class="p-vpk-update p-vpk-build">
        <div class="m-header">
            <h1 class="u-title"> 构建语音包 </h1>
            <p class="u-desc">
                构建语音包，支持在线自动转换格式，点击查看<a href="/tool/57764" target="_blank">「帮助文档」</a>。
            </p>
            <div class="u-ops">
                <el-button class="u-view" icon="el-icon-view" size="small" type="primary" @click="viewVpk"
                    >查看</el-button
                >
                <el-button class="u-back" plain icon="el-icon-arrow-left" size="small" @click="goBack">返回</el-button>
            </div>
        </div>

        <div class="m-vpk-body" v-loading="loading">
            <FoldBlock desc="基本设置" icon="el-icon-setting" :fold="true">
                <VpkFrom class="m-vpk-form--create" @UpdateVpk="syncForm" :data="form"></VpkFrom>
            </FoldBlock>

            <FoldBlock desc="语音设置" icon="el-icon-folder-opened" :fold="false" class="m-vpk-voice-wrapper">
                <el-radio-group v-model="type" size="small" class="u-type-select">
                    <el-radio-button label="single">单条上传</el-radio-button>
                    <el-radio-button label="batch">批量上传</el-radio-button>
                </el-radio-group>
                <VpkVoice ref="vpkVoice" :type="type" @onUploaded="onUploaded" :super="isSuper" />
            </FoldBlock>

            <div class="u-buttons" v-if="type == 'single'">
                <el-button class="u-submit" plain @click="saveVpk" :disabled="isSuper">保存为草稿</el-button>
                <el-button class="u-submit" type="primary" @click="updateVpk">发布</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getMyVpk, updateVpk, getManageVpk, updateManageVpk } from "@/service/dbm/vpk";
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import VpkFrom from "@/components/dbm/vpk/form.vue";
import VpkVoice from "@/components/dbm/vpk/voice.vue";
export default {
    name: "UpdateVpk",
    props: [],
    components: {
        VpkFrom,
        FoldBlock,
        VpkVoice,
    },
    data: function () {
        return {
            form: {
                title: "",
                description: "",
                tags: [],
                allow_comment: 1,
                allow_gift: 1,
            },
            // 上传类型
            type: "single",
            loading: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        uuid() {
            return this.form.uuid;
        },
        isSuper() {
            return !!this.$route.query.super;
        },
    },
    watch: {
        id: {
            handler: function (val) {
                val && this.loadVpk(val);
            },
            immediate: true,
        },
    },
    methods: {
        syncForm(data) {
            this.form = data;
        },
        loadVpk(val) {
            this.loading = true;
            const getVpk = this.isSuper ? getManageVpk : getMyVpk;
            getVpk(val)
                .then((res) => {
                    this.form = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updateVpk() {
            // TODO:
            // if (this.$refs.vpkVoice?.getVoiceCount() < 32) {
            //     this.$message.warning("语音数量不足32条，请添加语音或先保存为草稿");
            //     return;
            // }
            const putVpk = this.isSuper ? updateManageVpk : updateVpk;
            putVpk(this.id, this.form).then((res) => {
                this.$message.success("提交成功，请等待审核");
                if (this.isSuper) {
                    this.$router.push(`/vpk/manage/${this.id}`);
                } else {
                    this.$router.push(`/vpk/mine/${this.id}`);
                }
            });
        },
        saveVpk() {
            updateVpk(this.id, this.form, {
                mode: "draft",
            }).then((res) => {
                this.$message.success("保存草稿成功");
            });
        },
        viewVpk() {
            if (this.form.status == 1) {
                this.$router.push(`/vpk/${this.id}`);
            } else {
                this.$router.push(`/vpk/mine/${this.id}`);
            }
        },
        goBack() {
            window.history?.length ? this.$router.go(-1) : this.$router.push("/vpk");
        },
        onUploaded() {
            this.type = "single";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/build.less";
</style>
