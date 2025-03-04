<template>
    <div class="m-conditions" :gutter="10">
        <!-- <el-button class="u-create" icon="el-icon-circle-plus-outline" type="success" size="small" @click="toBuild"
            >新建数据项</el-button
        > -->
        <template>
            <div class="u-condition u-map">
                <span class="u-prepend el-input-group__prepend">地图</span>
                <el-select v-model="params.map" filterable placeholder="请选择" size="small" clearable multiple collapse-tags>
                    <el-option
                        v-for="index in mapKeys"
                        :key="index"
                        :label="mapIndex[index] + '(' + index + ')'"
                        :value="index"
                    >
                        <span class="u-label">{{ mapIndex[index] }}</span>
                        <span class="u-value">{{ index }}</span>
                    </el-option>
                </el-select>
            </div>
        </template>
        <slot></slot>
        <template v-if="isDBType && typeSelected">
            <div class="u-condition u-id">
                <el-input v-model.lazy="params.dwID" placeholder="" size="small" :disabled="!isDBType" clearable>
                    <span slot="prepend">ID/名称</span>
                </el-input>
            </div>
        </template>
        <template v-if="isDBType && typeSelected && hasLevel">
            <div class="u-condition u-level">
                <el-input
                    v-model.number.lazy="params.nLevel"
                    placeholder=""
                    size="small"
                    :disabled="!isDBType"
                    clearable
                >
                    <span slot="prepend">等级</span>
                </el-input>
            </div>
        </template>
        <template v-if="isTalk">
            <div class="u-condition">
                <el-input
                    v-model.lazy="params.szTarget"
                    placeholder="NPC名称"
                    size="small"
                    :disabled="!isTalk"
                    clearable
                >
                    <span slot="prepend">喊话对象</span>
                </el-input>
            </div>
        </template>
        <template v-if="!isDBType">
            <div class="u-condition">
                <el-input
                    v-model.lazy="params.szContent"
                    placeholder="模糊匹配"
                    size="small"
                    :disabled="isDBType"
                    clearable
                >
                    <span slot="prepend">{{ isTalk ? "喊话内容" : "消息内容" }}</span>
                </el-input>
            </div>
        </template>
        <template v-if="!isMine">
            <div class="u-condition u-map u-author">
                <span class="u-prepend el-input-group__prepend">作者</span>
                <el-select
                    v-model="params.user_id"
                    popper-class="u-author-pop"
                    :remote-method="filterUser"
                    remote
                    filterable
                    placeholder="昵称"
                    size="small"
                    clearable
                >
                    <el-option v-for="item in users" :key="item.ID" :label="item.display_name" :value="item.ID">
                        <div class="u-author-option">
                            <img class="u-avatar" :src="showAvatar(item.user_avatar)" alt="" />
                            <span class="u-value">{{ item.display_name }}</span>
                        </div>
                    </el-option>
                </el-select>
            </div>
        </template>
        <template v-if="!isMine">
            <el-switch
                class="u-fork-switch"
                v-model="params.fork"
                active-color="#13ce66"
                active-text="显示派生条目"
                :active-value="1"
                :inactive-value="0"
            >
            </el-switch>
        </template>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserList } from "@/service/dbm/user.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "conditions",
    props: {
        isExternal: {
            type: Boolean,
            default: false,
        },
        externalType: {
            type: String,
            default: "ALL",
        },
    },
    data: () => ({
        keyword: "",
        users: [],
    }),
    computed: {
        ...mapState({
            mapKeys: "mapKeys",
            mapIndex: "mapIndex",
            params: "item_list_params",
        }),
        type: function () {
            return this.isExternal ? this.externalType : this.params.type;
        },
        typeSelected: function () {
            return this.type != "ALL";
        },
        isDBType: function () {
            return !["TALK", "CHAT"].includes(this.type);
        },
        hasLevel: function () {
            return ["BUFF","DEBUFF","CASTING"].includes(this.type);
        },
        isTalk: function () {
            return this.type == "TALK";
        },
        isMine: function () {
            return this.$route.name == "item_mine";
        },
    },
    watch: {
        keyword: function (val) {
            if (isNaN(val)) {
                this.params.dwID = "";
                this.params.szName = val;
            } else {
                this.params.dwID = val;
                this.params.szName = "";
            }
        },
    },
    methods: {
        reset: function () {
            this.$store.commit("RESET_ITEM_LIST_PARAMS");
        },
        filterUser: function (query) {
            if (query !== "") {
                getUserList({ name: query }).then((res) => {
                    this.users = res.data.data?.list || [];
                });
            } else {
                this.users = [];
            }
        },
        showAvatar,
        toBuild() {
            this.$router.push({
                name: "item_create",
                query: {
                    type: this.type,
                },
            });
        },
    },
    mounted: function () {
        this.reset();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_conditions.less";
</style>
