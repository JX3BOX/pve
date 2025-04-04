<template>
    <div class="m-raid-tobebox">
        <h5 class="u-title">
            <span>
                <i class="el-icon-news"></i>
                申请名单
                <span class="u-count">({{ count }})</span>
            </span>
        </h5>
        <div class="m-raid-corebox" v-if="data && data.length">
            <ul class="m-raid-members">
                <div
                    class="u-member"
                    v-for="(member, i) in data"
                    :key="i"
                    @contextmenu.prevent="(event) => handleContextMenuOpen(event, { member, i })"
                >
                    <!-- <el-tooltip class="item" effect="dark" :content="" placement="top-start"> -->
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        popper-class="m-raid-members__tobe-item"
                    >
                        <!-- POP -->
                        <member-pop :member="member" />

                        <!-- 格子 -->
                        <span class="u-member-primary" slot="reference">
                            <img
                                v-if="member['mount']"
                                class="u-member-icon"
                                :src="member['mount'] | showMountIcon"
                                :alt="member['mount'] | showMountName"
                            />
                            <span class="u-member-role">
                                <router-link
                                    class="u-member-name-link"
                                    tag="a"
                                    target="_blank"
                                    v-if="member.role_id && linkVisible"
                                    :to="`/role/${member.role_id}`"
                                >
                                    <i class="el-icon-link"></i>
                                </router-link>
                                <span
                                    class="u-member-name"
                                    v-clipboard:copy="showMemberName(member['name'])"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError"
                                    >{{ showMemberName(member["name"]) }}</span
                                >
                            </span>
                            <span class="u-member-remark" v-if="member['remark']">[{{ member["remark"] }}]</span>
                        </span>
                        <!-- </el-tooltip> -->
                    </el-popover>
                    <span class="u-member-op" v-if="canManage">
                        <el-tooltip class="item" effect="dark" content="设为正式队员" placement="top-start">
                            <el-popconfirm title="是否将该角色转为正式成员？" @confirm="pass(member, i)">
                                <i class="u-member-reset el-icon-check" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="设为替补队员" placement="top-start">
                            <el-popconfirm title="是否将该角色转为替补成员？" @confirm="pending(member, i)">
                                <i class="u-member-reset el-icon-first-aid-kit" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="拒绝申请" placement="top-start">
                            <el-popconfirm title="是否拒绝申请？" @confirm="reject(member, i)">
                                <i class="u-member-delete el-icon-close" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                    </span>
                </div>
            </ul>
        </div>
        <div class="m-raid-null" v-else><i class="el-icon-warning-outline"></i> 当前没有任何名单</div>

        <!-- 右键菜单 -->
        <contextMenu id="context-menu" @ctx-open="onCtxOpen" ref="ctxMenu" class="m-raid-contextmenu">
            <div class="item" @click="pass(selectedMember, selectedIndex)">
                <i class="el-icon-check"></i>
                批准
            </div>
            <div class="item" @click="pending(selectedMember, selectedIndex)">
                <i class="el-icon-first-aid-kit"></i>
                待定
            </div>
            <div class="item" @click="reject(selectedMember, selectedIndex)">
                <i class="el-icon-close"></i>
                拒绝
            </div>
        </contextMenu>
    </div>
</template>

<script>
import { rejectMember, covertTobe2Sub, covertTobe2Normal } from "@/service/team/raid.js";
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";
import contextMenu from "vue-context-menu";
import MemberPop from "./MemberPop.vue";
export default {
    name: "RaidTobe",
    props: ["id", "teamId", "isForceMatch", "canAdd", "canReplace"],
    components: {
        contextMenu,
        "member-pop": MemberPop,
    },
    data() {
        return {
            // 数据列表
            data: [],

            // 右键菜单
            selectedMember: null,
            selectedIndex: undefined,

            // 预设、杂项
            xf_map,
        };
    },
    computed: {
        raid_id() {
            return this.id;
        },
        canManage() {
            return this.$store.state.canManage;
        },
        linkVisible() {
            return this.$store.state.isTeammate;
        },
        count() {
            return this.data?.length;
        },
        members() {
            return this.$store.state.tobeMembers;
        },
        normalMembers() {
            return this.$store.state.normalMembers;
        },
    },
    watch: {
        members: {
            deep: true,
            immediate: true,
            handler(val) {
                this.data = val;
            },
        },
    },
    mounted() {
        this.$bus.$on("updateTobe", (data) => {
            this.data = [...this.data, data];
        });
    },
    beforeDestroy() {
        this.$bus.$off("updateTobe");
    },
    methods: {
        // 操作
        // ===============================
        // 转为正式队员
        async pass(member, i) {
            const { canAdd, canReplace } = this;
            const apply_id = member?.id;

            try {
                /**
                 * 逻辑梳理
                 * 1. 如果可以添加 canAdd = true
                 *   1.1 如果可以替换 canReplace = true
                 *      1.1.1 能找到指定心法且is_valid为false，则替换 targetMember存在
                 *      1.1.2 没有指定心法，则添加
                 *   1.2 如果不能替换，则添加
                 * 2. 如果不能添加，则提示
                 */
                if (canAdd) {
                    if (canReplace) {
                        let targetMember = this.isForceMatch
                        ? this.normalMembers.find((m) => m.mount == member.mount && !m.is_valid)
                        : this.normalMembers.find((m) => m.mount == member.mount && !m.is_valid) ||
                          this.normalMembers.find((m) => !m.is_valid);

                        if (targetMember) {
                            let replaceId = targetMember?.id;
                            this.$emit("pass", { member, from: "tobe", isReplace: true });
                            await covertTobe2Normal(this.raid_id, apply_id, replaceId);
                            this.data.splice(i, 1);
                        } else {
                            this.$emit("pass", { member, from: "tobe", isReplace: false });
                            await covertTobe2Normal(this.raid_id, apply_id);
                            this.data.splice(i, 1);
                        }
                    } else {
                        this.$emit("pass", { member, from: "tobe" });
                        await covertTobe2Normal(this.raid_id, apply_id);
                        this.data.splice(i, 1);
                    }
                } else {
                    this.$notify({
                        type: "warning",
                        title: "提示",
                        message: "当前团队人数已满或无匹配职责空位",
                    });
                }
            } catch (e) {
                console.log("covertTobe2Normal", e);
            }
        },
        // 设为替补
        pending(member, i) {
            covertTobe2Sub(this.raid_id, member?.id).then(() => {
                this.$emit("pending", member);
                this.data.splice(i, 1);
            });
        },
        // 删除候选（拒绝申请）
        reject(member, i) {
            rejectMember(this.raid_id, member?.id).then(() => {
                this.$notify({
                    title: "操作成功",
                    message: `已拒绝${member?.name || ""}的申请`,
                    type: "success",
                });
                this.data.splice(i, 1);
            });
        },
        // 复制昵称
        onCopy(val) {
            this.$notify({
                title: "复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError() {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },

        // 右键设置
        // ===============================
        // 打开右键菜单
        onCtxOpen({ member, i }) {
            this.selectedMember = member;
            this.selectedIndex = i;
        },
        handleContextMenuOpen(event, obj) {
            if (!this.isEditing && this.canManage) {
                this.$refs?.ctxMenu?.open(event, { ...obj });
            }
        },

        // 过滤设置
        // ===============================
        showMemberName(name) {
            if (this.linkVisible) {
                return name;
            } else {
                return name.slice(0, 1) + "******";
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/raid/tobe.less";
</style>
