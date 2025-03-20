<template>
    <el-dialog
        :visible.sync="show"
        width="40vw"
        custom-class="m-addpz-dialog"
        :close-on-click-modal="false"
        append-to-body
    >
        <div slot="title" class="m-pz-title">新配装方案</div>
        <div class v-if="!mount">
            <el-row>
                <el-col :span="colspan" v-for="item in schools" :key="item.school" v-show="schoolmap[item.name].client.includes(client)">
                    <div class="m-pz-kungfu">
                        <div class="m-pz-school">
                            <img
                                class="u-school-icon"
                                :src="item.name | showSchoolIcon"
                                :alt="item.name"
                            />
                            <span class="u-text">{{ item.name }}</span>
                        </div>
                        <div class="m-pz-mount">
                            <div
                                class="u-item"
                                v-for="mount in item.mounts"
                                :key="mount.mount"
                                @click="handleMountClick(mount)"
                            >
                                <img
                                    class="u-mount-icon"
                                    :src="mount.mount | showMountIcon"
                                    :alt="mount.name"
                                />
                                <span class="u-text">{{ mount.name }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <template v-else>
            <el-button size="small" @click="reset" icon="el-icon-arrow-left">返回选择</el-button>
            <p class="m-plan-name">
                <span>当前客户端</span>
                <!-- <el-tooltip effect="dark" content="点击左上角切换重制/缘起版本" placement="top-start">
                    <i class="el-icon-info m-client-info"></i>
                </el-tooltip> -->
            </p>
            <el-radio-group v-model="currentClient" size="mini" class="m-plan-client">
                <el-radio-button label="std">重制</el-radio-button>
                <el-radio-button label="origin">缘起</el-radio-button>
            </el-radio-group>

            <p class="m-plan-name">
                <span>基础模板</span>
            </p>
            <el-select placeholder="选择基础模板" v-model="selectedTemplate" style="width: 100%;">
                <el-option value="" label="">&lt;空白模板&gt;</el-option>
                <el-option v-for="item in publicPzList" :value="item.id" :key="item.id" :label="item.title">
                    <div class="m-pz-template">
                        <span class="u-title" :title="item.title">
                            <span class="u-label u-zlp" v-if="item.zlp">{{ item.zlp }}</span>
                            {{ item.title }}
                        </span>
                        <span
                            class="u-author-name"
                        >
                            <img class="u-author-avatar" :src="showAvatar(item)" alt />
                            {{ (item.pz_author_info && item.pz_author_info.display_name) || "" }}
                        </span>
                    </div>
                </el-option>
            </el-select>

            <template>
                <p class="m-plan-name">等级</p>
                <el-radio-group size="mini" v-model="global_level">
                    <el-radio-button  :key="global_level" :label="global_level">
                        {{ global_level }}
                    </el-radio-button>
                </el-radio-group>
            </template>

            <template v-if="currentClient === 'origin'">
                <p class="m-plan-name">体型</p>
                <el-radio-group size="mini" v-model="role_type">
                    <el-radio-button v-for="role in role_types" :key="role.value" :label="role.value">
                        {{ role.text }}
                    </el-radio-button>
                </el-radio-group>
            </template>

            <p class="m-plan-name">方案名称</p>
            <el-input v-model="name" placeholder="输入方案名称"></el-input>
            <div class="u-warning m-plan-tips" v-if="hasError">
                <i class="el-icon-warning-outline"></i> 请填入方案名称
            </div>

            <div slot="footer">
                <el-button
                    class="m-plan-btn"
                    type="primary"
                    @click="confirm"
                    size="small"
                    :disabled="hasError"
                    :loading="loading"
                >确认</el-button>
                <el-button class="m-plan-btn" type="default" @click="show = false" size="small" :disabled="loading">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { school_contains_mount } from '@jx3box/jx3box-data/data/xf/relation.json'
import xfid from '@jx3box/jx3box-data/data/xf/xfid.json'
import mount_map from '@jx3box/jx3box-data/data/xf/xf.json'
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { role_types } from '@/assets/data/pz/equip_settings'
import SETTINGS from '@/pages/pz/setting.json'
import schoolmap from '@jx3box/jx3box-data/data/xf/school.json'
import { getPublicPzList, getPz, addPz } from "@/service/pz/schema.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "AddPzDialog",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "visible",
        event: "updateVisible",
    },
    watch: {
        visible: function (val) {
            this.show = val;
        },
        show: function (val) {
            if (val) this.reset();

            this.$emit("updateVisible", val);
        },
        client: {
            deep: true,
            immediate: true,
            handler(val) {
                this.currentClient = val;
                this.global_level = SETTINGS[val + '_global_level']
            }
        },
        currentClient: function (val){
            this.global_level = SETTINGS[val + '_global_level']
        }
    },
    data() {
        return {
            show: false,
            showTitleDialog: false,
            mount: "",
            name: "",
            saveLoading: false,

            currentClient: '',

            // 门派
            schoolmap,
            schools: [],

            // 体型
            role_type: 1,
            role_types,

            global_level: 0,

            publicPzList: [],
            selectedTemplate: '',
            loading: false,
        };
    },
    computed: {
        hasError: function () {
            return !this.name;
        },
        client: function (){
            return this.$store.state.client
        },
        colspan: function () {
            return window.innerWidth < 768 ? 12 : 6;
        },
        data: function () {
            return {
                title: this.name,
                client: this.currentClient,
                content: {},
                mount: this.mount,
                global_level: this.global_level,
                status: 1,
            };
        },
    },
    filters: {
        showSchoolIcon: function (school) {
            return __imgPath + "image/school/" + school + ".png";
        },
    },
    methods: {
        handleMountClick: function (mount) {
            this.mount = mount_map[mount.name]['id'];
            // this.name = `${mount.name}配装`;
            this.loadPublic()
        },
        reset: function () {
            this.mount = "";
            this.name = "";
            this.currentClient = this.client
            this.role_type = "1"
        },
        confirm: async function () {
            let data = {}

            const templatePz = await this.loadSchema()

            data = {
                ...templatePz,
                ...this.data,
                content: templatePz.content,
                star: 0,
                status: 1,
            }
            if (this.selectedTemplate) data.fork_id = this.selectedTemplate
            if (this.currentClient === 'origin') data.role_type = this.role_type

            this.loading = true;
            addPz(data).then((res) => {
                let id = res.data.data.id
                this.show = false;
                this.$store.commit("SET_STATE", {
                    key: "mount",
                    value: this.mount,
                });
                this.$router.push(`/edit/${id}`);
            }).finally(() => {
                this.loading = false;
            });
        },
        buildSchools: function () {
            const _school = [];

            Object.entries(school_contains_mount).forEach(([key, value]) => {
                const data = {
                    name: key,
                    mounts: []
                }

                // 移除藏剑重剑 xfid === 10145 山居剑意
                data.mounts = value.filter(x => x !== 10145).map(v => {
                    return {
                        name: xfid[v],
                        mount: v
                    }
                })

                _school.push(data)
            })
            this.schools = _school;
        },
        init: function () {
            this.buildSchools();
        },
        loadPublic() {
            const params = {
                zlp: SETTINGS.current_zlp,
                page: 1,
                client: this.currentClient,
                per: 20,
                star: 1,
                mount: this.mount,
            }
            getPublicPzList(params).then(res => {
                this.publicPzList = res.data.data.list
            })
        },
        showAvatar: function (row) {
            return showAvatar(row?.pz_author_info?.user_avatar);
        },
        async loadSchema() {
            if (!this.selectedTemplate) return {}
            const res = await getPz(this.selectedTemplate);

            return res.data.data;
        }
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/add_pz_dialog.less";
</style>
