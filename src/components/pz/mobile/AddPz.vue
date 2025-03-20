<template>
    <el-dialog :visible="value" title="新配装方案" custom-class="m-add-pz" center fullscreen @close="handleClose" append-to-body>
        <div class="m-first-step" v-show="!step">
            <div class="u-top-label">选择客户端</div>
            <div class="u-client-container">
                <div
                    class="u-item"
                    v-for="item in clientMaps"
                    :key="item.value"
                    :class="{ 'is-active': form.client === item.value }"
                    @click="handleClientClick(item)"
                >
                    {{ item.name }}
                </div>
            </div>
            <div class="u-top-label">选择门派心法</div>
            <div class="m-school-container">
                <div
                    class="m-pz-school"
                    v-for="(item, i) in schools"
                    :key="i"
                    @click.stop="handleSchoolSelect(item)"
                    v-show="schoolmap[item.name].client.includes(form.client)"
                    :class="{ 'is-active': selectedSchool.name === item.name }"
                >
                    <img class="u-school-icon" :src="showSchoolIcon(item.name)" :alt="item.name" />
                    <span class="u-school-name">{{ item.name }}</span>
                </div>
            </div>
            <div class="m-xf-container" v-show="selectedSchool">
                <div
                    class="u-item"
                    v-for="item in selectedSchool.mounts"
                    :key="item.mount"
                    @click="handleMountClick(item)"
                    :class="{ 'is-active': form.mount === item.mount }"
                >
                    <img class="u-mount-icon" :src="item.mount | showMountIcon" :alt="item.name" />
                    <span class="u-text">{{ item.name }}</span>
                </div>
            </div>
            <div class="m-actions">
                <el-button type="primary" @click="handleNext" :disabled="!form.mount" round>下一步</el-button>
            </div>
        </div>
        <div class="m-second-step" v-show="step">
            <div class="u-top-label">方案名称</div>
            <el-input class="u-title-input" v-model="form.title" placeholder="请输入方案名称"></el-input>

            <template v-if="form.client !== 'std'">
                <div class="u-top-label">体型选择</div>
                <div class="m-xf-container m-role-container">
                    <div
                        class="u-item"
                        v-for="item in role_types"
                        :key="item.mount"
                        @click="handleRoleClick(item)"
                        :class="{ 'is-active': form.role_type === item.value }"
                    >
                        <img class="u-school-icon" v-if="selectedSchool" :src="showRole(item.value)" :alt="item.name" />
                        <span class="u-text">{{ item.text }}</span>
                    </div>
                </div>
            </template>

            <div class="u-top-label">是否公开</div>
            <div class="m-public-container">
                <div
                    class="u-item"
                    v-for="item in publicMaps"
                    :key="item.value"
                    :class="{ 'is-active': form.status === item.value }"
                    @click="handlePublicClick(item)"
                >
                    <span class="u-label">{{ item.name }}</span>
                    <span class="u-desc">{{ item.desc }}</span>
                </div>
            </div>

            <div class="u-alert">{{ alert }}</div>

            <div class="m-actions">
                <el-button type="primary" round @click="handlePrev" :loading="saveLoading">上一步</el-button>
                <el-button type="primary" round @click="handleSubmit" :loading="saveLoading" :disabled="!canSubmit"
                    >创建配装</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>

<script>
import school from "@jx3box/jx3box-data/data/xf/school.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { addPz } from "@/service/pz/schema.js";
import { role_types } from "@/assets/data/pz/equip_settings";
import SETTINGS from "@/pages/pz/setting.json";
import schoolmap from "@jx3box/jx3box-data/data/xf/school.json";

import { Toast } from "vant"
export default {
    name: "AddPz",
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {
                title: "",
                client: "std",
                content: {},
                mount: "",
                global_level: "",
                status: 1,
                role_type: 1,
            },
            saveLoading: false,
            step: 0,
            // 门派
            schoolmap,
            schools: [],
            selectedSchool: "",
            clientMaps: [
                { name: "重制", value: "std" },
                { name: "缘起", value: "origin" },
            ],
            publicMaps: [
                { name: "公开", value: 1, desc: "分享至配装大厅" },
                { name: "私密", value: 0, desc: "配装仅自己可见" },
            ],
            role_types,
        };
    },
    computed: {
        alert({ form }) {
            return `将创建 ${form.client === "std" ? "重制版" : "缘起"} ${xfid[form.mount]} ${form.global_level}级 ${
                form.status ? "公开" : "私密"
            }的 配装`;
        },
        canSubmit({ form }) {
            return form.title && form.mount;
        },
    },
    watch: {
        "form.client": {
            immediate: true,
            handler(val) {
                this.form.global_level = SETTINGS[val + "_global_level"];
            },
        },
        value() {
            this.form.global_level = SETTINGS[this.form.client + "_global_level"];
        },
    },
    mounted() {
        this.buildSchools();
    },
    methods: {
        buildSchools() {
            const _school = [];

            Object.entries(school).forEach(([key, value]) => {
                const data = {
                    name: key,
                    mounts: [],
                    school_id: value.school_id,
                };

                // 移除藏剑重剑 xfid === 10145 山居剑意
                data.mounts = value.mounts
                    .filter((x) => x !== 10145)
                    .map((v) => {
                        return {
                            name: xfid[v],
                            mount: v,
                        };
                    });

                _school.push(data);
            });
            this.schools = _school;
        },
        showSchoolIcon(school) {
            return __imgPath + "image/school/" + school + ".png";
        },
        showRole(role_type) {
            return __imgPath + "image/roles/" + this.selectedSchool.school_id + "-" + role_type + ".png";
        },
        // 选择门派
        handleSchoolSelect(item) {
            this.selectedSchool = item;
            this.form.mount = item.mounts[0].mount;
        },
        // 心法选择
        handleMountClick(item) {
            this.form.mount = item.mount;
        },
        // 选择客户端
        handleClientClick(item) {
            this.form.client = item.value;
            this.selectedSchool = "";
            this.form.mount = "";
        },
        handleRoleClick(item) {
            this.form.role_type = item.value;
        },
        // 关闭
        handleClose() {
            this.form = this.$options.data().form;
            this.step = 0;
            this.selectedSchool = "";
            this.$emit("input", false);
        },
        // 下一步
        handleNext() {
            this.step = 1;
        },
        // 上一步
        handlePrev() {
            this.step = 0;
            this.form.title = "";
            this.form.role_type = 1;
        },
        handlePublicClick(item) {
            this.form.status = item.value;
        },
        handleSubmit() {
            const data = {
                title: this.form.title,
                client: this.form.client,
                content: this.form.content,
                mount: this.form.mount,
                global_level: this.form.global_level,
                status: this.form.status,
            };
            if (this.form.client === "origin") {
                data.role_type = this.form.role_type;
            }
            this.saveLoading = true;
            addPz(data)
                .then((res) => {
                    Toast({ position: 'top', message: '创建成功' });
                    let id = res.data.data.id
                    this.$store.commit("SET_STATE", {
                        key: "mount",
                        value: this.form.mount,
                    });
                    this.$router.push(`/detail/${id}`);
                })
                .catch((err) => {
                    this.$message.error(err.message);
                })
                .finally(() => {
                    this.saveLoading = false;
                });
        },
    },
};
</script>
