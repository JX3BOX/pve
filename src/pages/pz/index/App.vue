<template>
    <div id="app" class="v-pz">
        <Header></Header>
        <Breadcrumb name="配装器" slug="pz" root="/pz" :publishEnable="false" :adminEnable="false" :feedbackEnable="true" :crumbEnable="true">
            <img slot="logo" svg-inline :src="getAppIcon('pz')" />
            <template slot="op-append">
                <template>
                    <div class="m-pz-admin" v-if="isSinglePage">
                        <el-button type="primary" class="u-star" :class="{ on: isStar }" :icon="isStar ? 'el-icon-star-on' : 'el-icon-star-off'" size="medium" @click="starSchema">{{
                            starText
                        }}</el-button>
                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button class="u-drop" type="primary" size="medium" icon="el-icon-setting">
                                管理<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="setting">
                                    <i class="el-icon-setting"></i> 设置
                                </el-dropdown-item>
                                <el-dropdown-item command="delete">
                                    <i class="el-icon-delete"></i> 删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </template>
        </Breadcrumb>
        <keep-alive include="Mine,Public">
            <router-view></router-view>
        </keep-alive>

        <schema-edit v-model="showEdit" v-if="hasRight"></schema-edit>
    </div>
</template>

<script>
const single_pages = ["view"];
import { removePz, setStar, getGlobalSetting } from "@/service/pz/schema.js";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import SchemaEdit from "@/components/pz/SchemaEdit.vue";
export default {
    name: "App",
    props: [],
    components: {
        SchemaEdit,
    },
    data: function() {
        return {
            isStar: false,

            showEdit: false,
        };
    },
    computed: {
        id: function() {
            return this.$route.params.id;
        },
        isSinglePage: function() {
            return single_pages.includes(this.$route.name);
        },
        starText: function() {
            return this.isStar ? "取消推荐" : "推荐";
        },
        hasRight() {
            return User.hasPermission("manage_pz")
        }
    },
    watch: {
        "$store.getters.isStar": function(val) {
            this.isStar = val;
        },
    },
    methods: {
        handleCommand(command) {
            const map = {
                delete: this.delSchema,
                setting: this.showEditDialog,
            }

            if (map[command]) {
                map[command]();
            }
        },
        showEditDialog() {
            this.showEdit = true;
        },
        delSchema: function() {
            this.$confirm(`确认删除该方案？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        removePz(this.id)
                            .then(() => {
                                done();
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    type: "success",
                                });
                            })
                            .finally(() => {
                                instance.confirmButtonLoading = false;
                            });
                    } else {
                        done();
                    }
                },
            });
        },
        starSchema: function() {
            const star = Number(!this.isStar);
            setStar(this.id, {
                star,
            }).then((res) => {
                this.$notify({
                    title: "成功",
                    message: "操作成功",
                    type: "success",
                });
                this.isStar = star;
            });
        },
        getAppIcon(key) {
            return `${__cdn}logo/logo-light/${key}.svg`;
        },
        checkSetting: function() {
            // 自动保存设定
            let cache = sessionStorage.getItem("pz_setting");
            if (!cache) {
                getGlobalSetting().then((res) => {
                    let setting = res.data.data;
                    this.$store.commit("SET_STATE", {
                        key: "setting",
                        value: setting,
                    });
                    sessionStorage.setItem("pz_setting", JSON.stringify(setting));
                });
            } else {
                this.$store.commit("SET_STATE", {
                    key: "setting",
                    value: JSON.parse(cache),
                });
            }
        },
        init: function() {
            if (User.isLogin()) {
                this.checkSetting();
            }
        },
    },
    mounted: function() {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/app.less";
@import "~@/assets/css/pz/common.less";
</style>
