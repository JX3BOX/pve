<template>
    <fold-block class="m-pkg-subscribe" name="type" desc="订阅信息" icon="el-icon-cpu" :fold="false" :fixed="true">
        <el-form-item label="订阅名" prop="name" :inline-message="true">
            <div class="m-pkg-subscribe__key">
                <el-input
                    v-model="pkg.name"
                    @change="onNameChange"
                    placeholder="填写订阅名称"
                    :maxlength="10"
                    show-word-limit
                >
                    <template #prepend> {{ user.name }}# </template>
                </el-input>
                <el-tooltip
                    class="item"
                    popper-class="u-name__tooltip"
                    effect="dark"
                    :content="tips.key"
                    placement="top"
                >
                    <span class="u-desc"><i class="el-icon-question"></i></span>
                </el-tooltip>
            </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-switch :active-value="0" active-text="公开" :inactive-value="1" v-model="pkg.status"></el-switch>
            <el-tooltip
                class="item"
                effect="dark"
                content="不管公开或私有，用户在已知名称的情况下都可以成功加载"
                placement="top"
            >
                <span class="u-desc"><i class="el-icon-warning"></i></span>
            </el-tooltip>
        </el-form-item>

        <el-form-item label="语言" prop="lang" v-if="pkg.client === 'std'">
            <el-radio-group v-model="pkg.lang">
                <el-radio label="cn">简体中文</el-radio>
                <el-radio label="tr">繁体中文</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="模式" prop="is_raw">
            <el-radio-group v-model="pkg.is_raw" :disabled="isEditMode">
                <el-radio :label="0" v-if="!isTarget">云数据</el-radio>
                <el-radio :label="1" v-if="!isMark">本地数据</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="数据" prop="file" v-if="pkg.is_raw == 1 && isEditMode">
            <div class="m-raw-file">
                <!-- <div class="u-warning">
                    <i class="el-icon-warning-outline"></i>
                    当前数据文件将作为
                    <b>{{ pkg.key }}</b
                    >的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                </div> -->
                <input class="u-data-input" type="file" id="data_upload" @change="uploadDBM" accept=".jx3dat" />
                <el-button type="primary" icon="el-icon-paperclip" size="small" @click="selectDBM"
                    >选择数据文件</el-button
                >
                <span class="u-data-remark">{{ file.name }}</span>

                <div class="u-file" v-if="currentFile">
                    <span class="u-file__label">当前文件：</span>
                    <span class="u-file__value"
                        ><i class="el-icon-document"></i>{{ pkg.pkg_record && pkg.pkg_record.file_name }}</span
                    >
                    <i class="el-icon-download u-file__download" @click="onDownload"></i>
                </div>
            </div>
        </el-form-item>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import { mapState } from "vuex";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "PkgSubscribe",
    components: { FoldBlock },
    data() {
        return {
            tips: {
                key: "“默认版”将作为你的昵称加载；可以使用指挥版、团员版等作为名称。最多使用10字符。",
            },
            file: {},
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
        }),
        user() {
            return User.getInfo();
        },
        isEditMode() {
            return this.$route.name?.includes("edit");
        },
        currentFile() {
            return this.pkg?.pkg_record?.file;
        },
        isTarget() {
            return this.$route.name.includes("target");
        },
        isMark() {
            return this.$route.name.includes("mark");
        }
    },
    methods: {
        onNameChange(val) {
            this.pkg.name = val.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "");
        },
        selectDBM() {
            const fileInput = document.getElementById("data_upload");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDBM(e) {
            const file = e.target.files[0];
            this.file = file;

            this.$store.commit("SET_PKG_FILE", file);
        },
        onDownload() {
            const url = this.pkg.pkg_record?.file;
            const a = document.createElement("a");
            a.href = url;
            a.download = this.pkg.pkg_record?.remark + this.pkg.pkg_record?.version;
            a.click();
            a.remove();
        },
    },
};
</script>
