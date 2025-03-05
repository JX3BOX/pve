<template>
    <fold-block class="m-pkg-data" name="data" desc="元数据" icon="el-icon-files" :fold="false" :fixed="false">
        <div class="m-data-form">
            <el-tabs v-model="active" type="card" @tab-click="onTabClick">
                <el-tab-pane label="包信息" name="__meta">
                    <el-form-item label="角色名" prop="szAuthor" class="u-txt">
                        <el-input
                            v-model="pkg.pkg_meta.szAuthor"
                            placeholder="请填写角色名，用于数据加载时的提示名字"
                            :maxlength="20"
                            show-word-limit
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="服务器" prop="szServer" class="u-txt">
                        <el-select v-model="pkg.pkg_meta.szServer" filterable placeholder="请选择" :allow-create="true" size="small">
                            <el-option v-for="item in servers" :key="item" :label="item" :value="item"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="官方语音包" prop="szOfficialVoicePacketUUID" class="u-txt">
                        <vpk-select
                            v-model="pkg.pkg_meta.szOfficialVoicePacketUUID"
                            field="uuid"
                            :extra-query="{ is_official: 1 }"
                            clearable
                        ></vpk-select>
                    </el-form-item>
                    <el-form-item label="自定义语音包" prop="szCustomVoicePacketUUID" class="u-txt">
                        <vpk-select
                            v-model="pkg.pkg_meta.szCustomVoicePacketUUID"
                            field="uuid"
                            :extra-query="{ is_official: 0 }"
                            clearable
                        ></vpk-select>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane v-for="item in fields" :key="item" :label="item" :name="item">
                    <el-input
                        v-model="pkg.items[item]"
                        :disabled="disabled"
                        :placeholder="placeholder[item]"
                        type="textarea"
                        rows="6"
                        :class="{ 'u-error': errors[item] }"
                        resize="none"
                        @input="(val) => onItemInput(val, item)"
                        @change="(val) => onItemInput(val, item)"
                        @blur="onItemBlur"
                    ></el-input>
                </el-tab-pane>
            </el-tabs>
            <div class="m-pkg-data__footer" v-if="active !== '__meta'">
                <div class="m-pkg-data__actions">
                    <div class="u-tip u-tip-error" v-if="hasError && isEditor">
                        <i class="el-icon-error"></i>
                        存在错误的元数据项ID，请检查对应的数据。
                    </div>
                    <el-button
                        icon="el-icon-edit"
                        plain
                        size="small"
                        @click="onItemsEdit"
                        :type="disabled ? 'default' : 'primary'"
                        v-if="isEditor"
                        >{{ disabled ? "编辑" : "确定" }}</el-button
                    >
                    <el-button size="small" type="primary" icon="el-icon-full-screen" @click="toMyPkg"
                        >可视化编辑</el-button
                    >
                </div>
                <div class="u-tip">
                    <i class="el-icon-warning"></i>
                    以上序列为元数据项ID，非游戏原始ID，以半角逗号“,”隔开。
                </div>
            </div>
        </div>

        <pkg-visual v-model="showVisual"></pkg-visual>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import pkg_visual from "./pkg_visual.vue";
import VpkSelect from "@/components/dbm/vpk/vpk_select.vue";

import servers from "@jx3box/jx3box-data/data/server/server_list.json";
import { mapState } from "vuex";
import { itemsFields } from "@/assets/data/dbm/default_pkg.js";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "PkgItems",
    components: { FoldBlock, "pkg-visual": pkg_visual, VpkSelect },
    data() {
        return {
            servers: servers,
            active: "__meta",
            disabled: true,
            showVisual: false,

            errors: {
                BUFF: false,
                DEBUFF: false,
                CASTING: false,
                NPC: false,
                DOODAD: false,
                TALK: false,
                CHAT: false,
            },

            fields: itemsFields,
            placeholder: {
                BUFF: "有利气劲",
                DEBUFF: "不利气劲",
                CASTING: "武学招式",
                NPC: "系统角色",
                DOODAD: "交互物件",
                TALK: "角色喊话",
                CHAT: "系统频道",
            },
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
        }),
        hasError() {
            return Object.values(this.errors).some((item) => item);
        },
        isEditor() {
            return User.isEditor();
        },
        id() {
            return this.$route.params.id;
        },
    },
    methods: {
        onItemsEdit() {
            itemsFields.forEach((item) => {
                let value = this.pkg.items[item];
                // 需要检查是否存在错误的元数据项ID，替换全角逗号为半角逗号，同时将最后一个逗号去除
                let ids =
                    (value &&
                        value
                            .replace(/，/g, ",")
                            .replace(/,$/, "")
                            .split(",")
                            .filter((item) => item)) ||
                    [];
                if (ids?.some((id) => isNaN(id))) {
                    this.errors[item] = true;
                } else {
                    this.errors[item] = false;
                }
            });

            if (!this.hasError) {
                this.disabled = !this.disabled;
            }
        },
        onItemBlur() {
            itemsFields.forEach((item) => {
                let value = this.pkg.items[item];
                // 需要检查是否存在错误的元数据项ID，替换全角逗号为半角逗号，同时将最后一个逗号去除
                let ids =
                    (value &&
                        value
                            .replace(/，/g, ",")
                            .replace(/,$/, "")
                            .split(",")
                            .filter((item) => item)) ||
                    [];
                if (ids?.some((id) => isNaN(id))) {
                    this.errors[item] = true;
                } else {
                    this.errors[item] = false;
                }
            });
        },
        onTabClick() {},
        initItemsCount() {
            itemsFields.forEach((item) => {
                const elTextarea = document.querySelector(`#pane-${item} .el-textarea`);

                if (elTextarea) {
                    const span = document.createElement("span");
                    span.className = "el-input__count";
                    span.innerText = `${this.countItems(this.pkg?.items[item])}/300`;
                    elTextarea.appendChild(span);
                }
            });
        },
        countItems(val) {
            const ids =
                (val &&
                    val
                        .replace(/，/g, ",")
                        .replace(/,$/, "")
                        .split(",")
                        .filter((item) => item)) ||
                [];
            return ids.length;
        },
        onItemInput(val, item) {
            const count = this.countItems(val);
            const ids =
                (val &&
                    val
                        .replace(/，/g, ",")
                        .replace(/,$/, "")
                        .split(",")
                        .filter((item) => item)) ||
                [];
            const elTextarea = document.querySelector(`#pane-${item} .el-textarea`);
            const elCount = elTextarea.querySelector(".el-input__count");
            if (count > 300) {
                // 超过300个元数据项ID，不允许输入，并且截断至300个id
                this.pkg.items[item] = ids.slice(0, 300).join(",");
                elCount.style.color = "#c00";
                return;
            } else {
                elCount.innerText = `${count}/300`;
                elCount.style.color = "#909399";
            }
        },
        toMyPkg() {
            const target = this.$router.resolve({ name: "item_mine", query: { pkg_id: this.id } });
            window.open(target.href, "_blank");
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.initItemsCount();
        });
    },
};
</script>

<style lang="less">
.m-pkg-data {
    .u-error {
        .el-textarea__inner {
            border-color: #f56c6c;
        }
    }

    .el-textarea {
        &.is-disabled {
            .el-input__count {
                background: #f5f7fa;
            }
        }
    }
}
.m-pkg-data__footer {
    .flex;
    justify-content: space-between;
    .u-tip {
        .fz(12px);
        .flex;
        align-items: center;
        color: #888;
        i {
            .fz(16px);
            .y(-1px);
        }
    }

    .u-tip-error {
        color: #f56c6c;
    }
}
.m-pkg-data__actions {
    .mt(10px);
    .flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
