<template>
    <div @blur.capture="spanBlur">
        <h5 class="u-title">
            <span>
                <i class="el-icon-s-flag"></i>
                正式队员
            </span>
            <!-- <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="handleButtonAdd('add')"
                v-if="canManage"
            >添加队员</el-button> -->
        </h5>
        <div class="m-raid-corebox" :class="{qkmode : canManage}" v-if="members && members.length">
            <div class="m-raid-flag">
                <i class="i-flag" v-for="(f) in col" :key="f">{{f}}</i>
            </div>
            <draggable
                tag="ul"
                class="m-raid-members"
                v-model="members"
                v-bind="{...drag_options, sort: canManage}"
                handle=".u-member"
                :animation="100"
                :class="'row-' + row"
                :draggable="false"
            >
                <div
                    class="u-member"
                    v-for="(member,i) in members"
                    :key="i"
                    :class="{'is-group-start':isGroupStart(i)}"
                    @contextmenu.prevent="(event) => handleContextMenuOpen(event, {member, i})"
                >
                    <i class="u-group-start" v-if="isGroupStart(i,row)">{{isGroupStart(i,row)}}</i>

                    <span class="u-member-func">{{ roleFunc(member.role_func) }}</span>

                    <img
                        class="u-member-leader"
                        v-if="isLeader(member) || (!leader && i === 0)"
                        src="@/assets/img/team/raid/leader.png"
                        alt="leader"
                        title="队长"
                    />
                    <img
                        class="u-member-core"
                        v-if="isCore(member)"
                        src="@/assets/img/team/raid/core.png"
                        alt="core"
                        title="阵眼"
                    />
                    <span class="u-member-primary">
                        <el-popover
                            popper-class="m-raid-members-xfbox"
                            placement="top"
                            trigger="click"
                            :popper-options="{
                                'boundariesElement': 'body'
                            }"
                            v-if="canManage"
                        >
                            <div class="u-xf-content">
                                <span
                                    v-for="xf in xf_map"
                                    :key="xf.id"
                                    @click="changeMemberXf(member, xf.id)"
                                >
                                    <img
                                        class="u-member-icon"
                                        :src="xf.id | showMountIcon"
                                        :alt="xf.name"
                                        :title="xf.name"
                                        :class="{'u-selected-member-icon': member.mount === xf.id}"
                                    />
                                </span>
                            </div>
                            <img
                                slot="reference"
                                class="u-member-icon"
                                :src="member['mount'] | showMountIcon"
                                :alt="member['mount'] | showMountName"
                            />
                        </el-popover>
                        <img
                            v-else
                            class="u-member-icon"
                            :src="member['mount'] | showMountIcon"
                            :alt="member['mount'] | showMountName"
                        />
                        <span class="u-member-role">
                            <router-link
                                class="u-member-name-link"
                                tag="a"
                                target="_blank"
                                v-if="member.role_id && !editing[i] && linkVisible"
                                :to="`/role/${member.role_id}`"
                            >
                                <i class="el-icon-link"></i>
                            </router-link>
                            <span
                                v-if="!editing[i]"
                                class="u-member-name"
                            >{{showMemberName(member['name'])}}</span>
                                <!-- @click.stop="handleChangeName(member, i)" -->
                            <el-select
                                v-show="editing[i]"
                                placeholder="请选择或输入团员名"
                                v-model="tempMember.name"
                                allow-create
                                filterable
                                remote
                                clearable
                                size="mini"
                                style="width:160px;"
                                :remote-method="remoteMethod"
                                :loading="loading"
                                :ref="'name' + i"
                                @change="handleMemberChange"
                            >
                                <el-option
                                    v-for="(role, index) in roles"
                                    :key="index"
                                    :label="role.name"
                                    :value="role.ID"
                                >
                                    <div style="display: inline-flex;align-items: center;">
                                        <img
                                            style="margin-right: 8px;"
                                            width="24"
                                            height="24"
                                            :src="role.mount | showSchoolIcon"
                                        />
                                        <span>{{ role.name }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </span>
                        <span
                            class="u-member-remark"
                            v-if="member['remark'] && !editing[i]"
                        >[{{member['remark']}}]</span>
                    </span>
                    <!-- <span class="u-member-op" v-if="canManage">
                        <el-tooltip class="item" effect="dark" content="设置" placement="top-start">
                            <i
                                class="u-member-setting el-icon-setting"
                                @click="handleSetting(member, i)"
                            ></i>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="设为替补队员"
                            placement="top-start"
                        >
                            <el-popconfirm
                                title="是否将该角色转为替补成员？"
                                @confirm="pending(member, i)"
                            >
                                <i class="u-member-reset el-icon-first-aid-kit" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="重置" placement="top-start">
                            <el-popconfirm title="是否将该项重置为空白角色？" @confirm="handleReset(i)">
                                <i class="u-member-reset el-icon-refresh-left" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                            <el-popconfirm title="是否删除该角色？" @confirm="handleDelete(i)">
                                <i class="u-member-delete el-icon-delete" slot="reference"></i>
                            </el-popconfirm>
                        </el-tooltip>
                    </span> -->
                    <!-- 显示此位置关联的替补 -->
                    <!-- <span
                        class="u-member-pending"
                        v-if="member['pending'] && member['pending']['length']"
                    >
                        <i class="el-icon-user-solid"></i>
                        {{member['pending']['length']}}
                    </span>-->
                </div>
                <div
                    v-if="members.length > 0 && members.length < row * col"
                    title="新增队员"
                    @click="handleAdd('add')"
                    class="u-member u-member-add"
                >
                    <i class="el-icon-plus u-member-add-icon"></i>
                </div>
            </draggable>
        </div>
        <div class="m-raid-null" v-else>
            <i class="el-icon-warning-outline"></i> 当前没有任何名单
        </div>

        <member-setting
            :title="title"
            :visible="visible"
            :data="selectedMember"
            :teamId="teamId"
            mode="normal"
            @close="handleDialogCancel"
            @updateRole="handleSave"
        />

        <!-- 右键菜单 -->
        <contextMenu
            id="cotext-menu"
            @ctx-open="onCtxOpen"
            ref="ctxMenu"
            class="m-raid-contextmenu"
        >
            <div class="item" @click="setEdit">
                <i class="el-icon-edit-outline"></i>
                编辑角色
            </div>
            <div class="item" @click="setCore">
                <i class="el-icon-star-off"></i>
                {{ selectedMember && selectedMember.is_core ? '取消阵眼' : '设为阵眼' }}
            </div>
            <div class="item" @click="setRemark">
                <i class="el-icon-edit"></i>
                {{ selectedMember && selectedMember.remark ? '修改备注' : '添加备注' }}
            </div>
        </contextMenu>
    </div>
</template>

<script>
import { getRoles } from "@/service/team/raid.js";
import MemberSetting from "@/components/team/raid/RaidMemberSetting.vue";
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";
import school_mount from "@jx3box/jx3box-data/data/xf/schoolid.json";
import draggable from "vuedraggable";
import cloneDeep from "lodash/cloneDeep";
import contextMenu from "vue-context-menu";
const item_demo = {
    role_func: "",
    name: "",
    mount: "",
    is_core: false,
    pending: [],
    remark: "",
    role_id: 0,
};

export default {
    name: "RaidNormal",
    props: ["data", "teamId", "leader", "row", "col"],
    components: {
        MemberSetting,
        draggable,
        contextMenu,
    },
    data() {
        return {
            members: [],

            // 弹层
            visible: false,
            title: "新增队员",

            // 右键菜单
            selectedMember: null,
            selectedIndex: undefined,
            action: "",

            // 拖拽
            drag_options: {
                handle: ".u-member",
            },

            // 可选名单列表（用于快速选择）
            roles: [],

            // 快速设置
            editing: {},
            tempMember: {
                role_func: "",
                name: "",
                mount: "",
                is_core: false,
                pending: [],
                remark: "",
                role_id: 0,
            },

            // 预设、杂项
            xf_map,
            loading: false,
        };
    },
    computed: {
        isEditing() {
            return Object.values(this.editing).some((e) => e);
        },
        routerName() {
            return this.$route.name;
        },
        canManage() {
            return this.$store.state.canManage;
        },
        linkVisible() {
            return this.$store.state.isTeammate;
        },
        allRoles() {
            return this.$store.state.roles;
        },
    },
    methods: {
        // 单项
        // ===============================
        // 设置
        handleSetting(member, index) {
            this.title = "角色设置";
            this.selectedMember = member;
            this.selectedIndex = index;
            this.visible = true;
        },
        handleDialogCancel() {
            this.visible = false;
            this.selectedMember = null;
            this.action = "";
        },
        // 重置
        handleReset(index) {
            this.$set(this.members, index, cloneDeep(item_demo));
        },
        // 删除
        handleDelete(index) {
            this.members.splice(index, 1);
        },
        // 设为替补
        pending: function (member, index) {
            this.$bus.$emit("pending", member);
            this.$set(this.members, index, cloneDeep(item_demo));
        },

        // 列表
        // ===============================
        // 添加队员
        handleAdd() {
            this.members.push(cloneDeep(item_demo));
        },
        // 弹窗添加队员
        handleButtonAdd(action) {
            this.title = "新增队员";
            this.action = action;
            this.selectedMember = null;
            this.visible = true;
            // this.members.push(cloneDeep(item_demo));
        },
        // 拖拽引发update
        handleDraggableUpdate() {
            this.$emit("updateMembers", this.members);
        },

        // UI表现杂项
        // ===============================
        // 是否为队长
        isLeader(val) {
            return this.leader && this.leader === val.name;
        },
        // 是否为阵眼
        isCore(member) {
            return member.is_core;
        },
        // 角色职能
        roleFunc(val) {
            switch(val) {
                case '内攻':
                    return '内';
                case '外攻':
                    return '外';
                case '坦克':
                    return '坦';
                case '治疗':
                    return '奶';
                default:
                    return ''
            }
        },
        isGroupStart: function (i, row) {
            if ((i + row) % row == 0) {
                return (i + row) / row;
            } else {
                0;
            }
        },
        showMemberName: function (name) {
            if (this.linkVisible || !name) {
                return name;
            } else {
                return name.slice(0, 1) + "******";
            }
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
                this.$refs.ctxMenu.open(event, { ...obj });
            }
        },
        // 右键编辑
        setEdit() {
            this.title = '角色设置';
            this.visible = true;
        },
        // 设为阵眼
        setCore() {
            this.selectedMember.is_core = !this.selectedMember.is_core;
            this.$set(this.members, this.selectedIndex, this.selectedMember);
            this.selectedMember = null;
        },
        // 设置备注
        setRemark() {
            this.$prompt("请输入备注", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: this.selectedMember.remark,
                inputValidator: (val) => {
                    if (val.length > 20) {
                        return "备注内容应不超过20个字符";
                    }
                },
            }).then(({ value }) => {
                this.selectedMember.remark = value;
                this.$set(
                    this.members,
                    this.selectedIndex,
                    this.selectedMember
                );
                this.handleTranform(
                    this.selectedMember,
                    this.selectedIndex,
                    "remark"
                );
                this.selectedMember = null;
            });
        },

        // 快速设置单项
        // ===============================
        // 设置心法
        changeMemberXf(member, targetXf) {
            member.mount = String(targetXf);
        },
        // 设置名字
        handleChangeName(member, i) {
            if (!this.canManage) return;
            this.tempMember = cloneDeep(member);
            this.selectedIndex = i;
            this.$set(this.editing, i, true);
        },
        handleChangeNameBlur(i) {
            this.$set(this.editing, i, false);
            this.roles = cloneDeep(this.allRoles);
        },
        // 下拉选择
        handleMemberChange(val) {
            if (!this.tempMember.name) return;
            this.tempMember.role_id = 0;
            const [member] = this.roles
                ? this.roles.filter((role) => role.ID === val)
                : [];

            if (member) {
                this.tempMember.name = member.name;
                this.tempMember.role_id = member.ID;
                this.tempMember.mount = String(school_mount[member.mount][0]);
            }

            this.$set(this.members, this.selectedIndex, this.tempMember);

            this.$nextTick(() => {
                this.tempMember = item_demo;
                this.$refs[`name${this.selectedIndex}`][0].blur();
                this.editing[this.selectedIndex] = false;
                this.selectedIndex = undefined;
            });
        },

        // 选项加载
        // ===============================
        // 远程获取角色
        remoteMethod(query) {
            if (query !== "") {
                this.loading = true;
                getRoles(this.teamId, query).then((res) => {
                    this.roles = res.data.data.list;
                    this.loading = false;
                });
            } else {
                this.roles = cloneDeep(this.allRoles);
            }
        },
        spanBlur() {
            this.editing = {};
        },

        // 发布|保存
        // ===============================
        handleSave(member) {
            const action = this.action;
            if (action === "add") {
                if (this.members.length < this.col * this.row) {
                    this.members.push(member);
                } else {
                    this.$message({
                        type: "warning",
                        message: "成员数已达模板上限，不能继续添加",
                    });
                }
            }
            if (!action) {
                this.$set(this.members, this.selectedIndex, member);
            }
            this.selectedMember = null;
            this.visible = false;
        },
    },
    model: {
        prop: "data",
        event: "updateMembers",
    },
    watch: {
        data: {
            immediate: true,
            deep : true,
            handler(val) {
                this.members = val;
            },
        },
        members: {
            deep: true,
            handler(val) {
                this.$emit("updateMembers", val);
            },
        },
        col: function (val) {
            this.$forceUpdate();
        },
        allRoles: {
            deep: true,
            handler(val) {
                if (val) {
                    this.roles = cloneDeep(val);
                }
            },
        },
    },
};
</script>
