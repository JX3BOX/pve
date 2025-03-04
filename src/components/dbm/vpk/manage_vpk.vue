<template>
    <div class="m-vpk-manage">
        <el-form ref="form" :model="form" label-position="top">
            <el-divider content-position="left">状态变更</el-divider>
            <el-radio-group v-model="form.status" size="small">
                <el-radio-button :label="1">通过</el-radio-button>
                <el-radio-button :label="0">审核中</el-radio-button>
                <el-radio-button :label="-1">拒绝</el-radio-button>
            </el-radio-group>
            <el-divider content-position="left">特殊标记</el-divider>
            <div class="u-special">
                <el-switch v-model="form.star" :active-value="1" :inactive-value="0" active-text="精选"></el-switch>
                <el-switch
                    v-model="form.is_official"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="官方"
                ></el-switch>
                <el-switch
                    v-model="form.sticky"
                    :active-value="sticky"
                    :inactive-value="0"
                    active-text="置顶"
                ></el-switch>
            </div>
            <el-divider content-position="left">客户端</el-divider>
            <el-radio-group v-model="form.client" size="small">
                <el-radio-button label="all">双端</el-radio-button>
                <el-radio-button label="std">重制</el-radio-button>
                <el-radio-button label="origin">缘起</el-radio-button>
            </el-radio-group>
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
                        <span class="u-btn" @click="removeBanner"> <i class="el-icon-circle-close"></i> 移除海报 </span>
                    </span>
                </el-input>
            </div>
            <el-divider content-position="left">危险操作</el-divider>
            <el-button type="danger" @click="remove" size="small">永久删除</el-button>
        </el-form>
        <div class="m-footer">
            <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            <el-button plain @click="close">取消</el-button>
        </div>
    </div>
</template>

<script>
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
import { manageVpk, removeVpk } from "@/service/dbm/vpk";
import { pick } from "lodash";
export default {
    name: "VpkManage",
    components: {},
    data: function () {
        return {
            form: {
                status: 0,
                star: 0,
                is_official: 0,
                sticky: 0,
                banner: "",
                client: "all",
            },
            loading: false,

            uploadurl: __cms + "api/cms/upload",
            banner_preview: "",
        };
    },
    computed: {
        vpk: function () {
            return this.$store.state.vpk;
        },
        id: function () {
            return this.vpk?.id;
        },
        data: function () {
            return pick(this.vpk, ["status", "star", "is_official", "sticky", "banner", "client"]);
        },
        sticky: function () {
            return Date.now();
        },
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler: function (data) {
                this.form = data;
            },
        },
    },
    methods: {
        // 上传
        uploadSuccess: function (res, file, list) {
            this.banner_preview = URL.createObjectURL(file.raw);
            this.form.banner = vpk.banner;
        },
        uploadFail: function (err, file, fileList) {
            this.$message.error("上传失败");
        },
        removeBanner: function () {
            this.form.banner = "";
        },
        submit: function () {
            this.loading = true;
            manageVpk(this.id, this.form)
                .then((res) => {
                    this.$message.success("操作成功");
                    this.$emit("close");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        close: function () {
            this.$emit("close");
        },
        remove: function () {
            this.$alert("确定永久删除吗？该操作不可恢复", "警告", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        removeVpk(this.id).then((res) => {
                            this.$message.success("操作成功");
                            this.$emit("close");
                            this.$router.push("/vpk/list");
                        });
                    }
                },
            });
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.m-vpk-manage {
    .u-special {
        .flex;
        gap: 40px;
    }
}
</style>
