<template>
    <div class="m-manage-pkg">
        <el-divider content-position="left">基础信息</el-divider>
        <div class="m-form-item">
            <el-input class="u-author" v-model="form.user_id" placeholder="输入作者UID" size="small">
                <template #prepend>作者</template>
            </el-input>
            <el-input v-model="form.title" placeholder="输入标题" size="small">
                <template #prepend>标题</template>
            </el-input>
        </div>

        <el-divider content-position="left">字段变更</el-divider>
        <div class="m-form-item">
            <el-radio-group v-model="form.client" size="small">
                <el-radio-button label="std">重制</el-radio-button>
                <el-radio-button label="origin">缘起</el-radio-button>
            </el-radio-group>

            <el-radio-group v-model="form.lang" size="small">
                <el-radio-button label="cn">简体中文</el-radio-button>
                <el-radio-button label="tr">繁体中文</el-radio-button>
            </el-radio-group>

            <el-radio-group v-model="form.is_raw" size="small">
                <el-radio-button :label="0">云数据</el-radio-button>
                <el-radio-button :label="1">本地数据</el-radio-button>
            </el-radio-group>


        </div>

        <el-divider content-position="left">精选变更</el-divider>
        <div class="m-form-item">
            <el-switch v-model="form.star" :active-value="1" :inactive-value="0" active-text="编辑精选"></el-switch>

            <el-color-picker v-model="form.color" size="small"></el-color-picker>
        </div>

        <el-divider content-position="left">置顶开关</el-divider>
        <div class="m-form-item">
            <el-switch v-model="form.is_sticky" :active-value="1" :inactive-value="0" active-text="置顶"></el-switch>
            <el-switch v-model="form.is_jx3box" :active-value="1" :inactive-value="0" active-text="官方"></el-switch>
        </div>

        <el-divider content-position="left">封面海报</el-divider>
            <div class="c-admin-banner">
                <el-upload
                    class="c-admin-upload el-upload--picture-card"
                    :action="uploadurl"
                    :with-credentials="true"
                    :show-file-list="false"
                    :on-success="uploadSuccess"
                    :on-error="uploadFail"
                >
                    <img v-if="form.banner" :src="form.banner" />
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-input class="u-banner" v-model="form.banner" size="small">
                    <span slot="prepend">海报地址</span>
                    <span slot="append">
                        <span class="u-btn" @click="removeBanner">
                            <i class="el-icon-circle-close"></i> 移除海报
                        </span>
                    </span>
                </el-input>
            </div>

        <el-divider content-position="left">状态</el-divider>
        <div class="m-form-item">
            <el-radio-group v-model="form.status" size="small">
                <el-radio-button :label="0">公开</el-radio-button>
                <el-radio-button :label="1">仅自己可见</el-radio-button>
            </el-radio-group>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="onDelete">删除</el-button>
        </div>

        <div class="m-footer">
            <el-button @click="onClose" :disabled="loading">关闭</el-button>
            <el-button @click="onSave" type="primary" :loading="loading">保存</el-button>
        </div>
    </div>
</template>

<script>
import { manageUpdatePkg, manageDeletePkg, refreshCache } from "@/service/dbm/pkg";
import {
    __cms,
    __postType,
    __visibleMap,
} from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "ManageDrawer",
    data() {
        return {
            form: {
                user_id: "",
                title: "",
                is_raw: 0,
                client: "std",
                lang: "cn",
                status: 0,
                star: 0,
                color: "",
                is_sticky: 0,
                is_jx3box: 0,
            },

            uploadurl: __cms + "api/cms/upload",
            banner_preview: "",
            post_banner: "",

            loading: false
        };
    },
    computed: {
        pkg() {
            return this.$store.state.pkg;
        },
    },
    watch: {
        pkg: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.form = {
                        user_id: val?.user_id,
                        title: val?.title,
                        is_raw: val?.is_raw,
                        client: val?.client,
                        lang: val?.lang,
                        status: val?.status,
                        star: val?.pkg_extend?.star,
                        color: val?.pkg_extend?.color,
                        is_sticky: val?.is_sticky,
                        is_jx3box: val?.is_jx3box,
                        banner: val?.pkg_extend?.banner,
                    };
                }
            },
        },
    },
    methods: {
        onDrawerShow() {
            this.drawer = true;
        },
        // 上传
        uploadSuccess: function (res, file, list) {
            this.banner_preview = URL.createObjectURL(file.raw);
            this.form.banner = res.data[0];
        },
        uploadFail: function (err, file, fileList) {
            this.$message.error("上传失败");
            console.log(err);
        },
        removeBanner: function () {
            this.form.banner = "";
        },
        onClose() {
            this.$emit("close");
        },
        onSave() {
            this.loading = true
            manageUpdatePkg(this.pkg.id, this.form).then(async (res) => {
                this.$message.success("保存成功");
                this.$emit("update");
                await refreshCache(this.pkg.key);
            }).finally(() => {
                this.loading = false
            });
        },
        onDelete() {
            this.$confirm("此操作将永久删除该数据包, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    manageDeletePkg(this.pkg.id).then(async (res) => {
                        this.$message.success("删除成功");
                        this.$emit("close");

                        await refreshCache(this.pkg.key);

                        this.$router.push({
                            name: "pkg_list"
                        })
                    });
                })
                .catch(() => {});
        }
    },
};
</script>

<style lang="less">
</style>
