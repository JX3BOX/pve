<template>
    <!-- 基本信息 -->
    <fold-block class="m-content-basic" name="basic" desc="基本信息" icon="el-icon-cpu" :fold="false">
        <!-- ID -->
        <el-form-item label="ID" prop="dwID" v-if="hasProp('dwID')" class="u-id">
            <span slot="label"> ID<b class="u-required">*</b> </span>
            <el-input
                v-model.number="item.payload.dwID"
                @keyup.enter.native="getResource"
                @blur="getResource"
                placeholder="请指定ID编号"
            ></el-input>
            <span class="u-desc">
                <i class="el-icon-info"></i>
                <span>可查阅</span>
                <a :href="databaseUrl" target="_blank">剑三数据库</a>
            </span>
        </el-form-item>
        <!-- 等级 -->
        <el-form-item prop="nLevel" v-if="hasProp('nLevel')" class="u-level">
            <span slot="label">
                <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    content="由于插件限制，BUFF以及技能类监控不设置等级的时候会无法捕捉到而无法触发对应时间，因此请不要置空"
                >
                    <div>等级 <i class="el-icon-info"></i></div>
                </el-tooltip>
            </span>
            <el-input
                v-model.number="item.payload.nLevel"
                @keyup.enter.native="getResource"
                @blur="getResource"
                placeholder="请指定等级"
            ></el-input>
            <el-checkbox
                class="u-check-level"
                v-model="item.payload.bCheckLevel"
                v-if="hasProp('bCheckLevel')"
                @change="getResource"
                >区分等级</el-checkbox
            >
        </el-form-item>
        <!-- 名称 -->
        <el-form-item label="名称" prop="szName" v-if="hasProp('szName')" class="u-name">
            <el-input v-model="item.payload.szName" :placeholder="name" :disabled="!item.defaultPropsStatus.szName">
                <span class="u-btn" slot="append" @click="switchDefaultProps('szName')"
                    ><i :class="item.defaultPropsStatus.szName ? 'el-icon-unlock' : 'el-icon-lock'"></i
                ></span>
            </el-input>
        </el-form-item>
        <!-- 图标 -->
        <el-form-item label="图标" prop="nIcon" v-if="hasProp('nIcon')" class="u-icon">
            <el-input
                v-model.number="item.payload.nIcon"
                :placeholder="iconID"
                :disabled="!item.defaultPropsStatus.nIcon"
            >
                <span class="u-pic" slot="prepend"><img :src="iconUrl" /></span>
                <span class="u-btn" slot="append" @click="switchDefaultProps('nIcon')"
                    ><i :class="item.defaultPropsStatus.nIcon ? 'el-icon-unlock' : 'el-icon-lock'"></i
                ></span>
            </el-input>
            <span class="u-desc">
                <i class="el-icon-info"></i>
                <span>可查阅</span>
                <a href="/app/design/icon" target="_blank">剑三图标大全</a>
            </span>
        </el-form-item>
        <!-- BOSS头像 -->
        <el-form-item label="图标" prop="nFrame" v-if="hasProp('nFrame')" class="u-icon">
            <el-input
                v-model.number="item.payload.nFrame"
                placeholder="仅从右侧选择"
                :disabled="!item.defaultPropsStatus.nFrame"
            >
                <span class="u-pic" slot="prepend">
                    <img :src="getImage('nFrame', item.payload.nFrame)" />
                </span>
                <span class="u-btn" slot="append" @click="switchDefaultProps('nFrame')"
                    ><i :class="item.defaultPropsStatus.nFrame ? 'el-icon-unlock' : 'el-icon-lock'"></i
                ></span>
            </el-input>
            <span class="u-desc" v-if="item.defaultPropsStatus.nFrame">
                <el-radio-group v-model="item.payload.nFrame" class="u-nframe">
                    <el-radio v-for="(item, i) in npcFrames" :key="i" :label="item.value">
                        <img :src="getImage('nFrame', item.value)" :title="item.label" />
                    </el-radio>
                </el-radio-group>
            </span>
        </el-form-item>
        <!-- 喊话对象 -->
        <el-form-item label="喊话对象" prop="szTarget" v-if="hasProp('szTarget')">
            <el-input v-model="item.payload.szTarget" placeholder="NPC名字"></el-input>
        </el-form-item>
        <!-- 喊话内容 -->
        <el-form-item
            :label="item.type == 'TALK' ? '喊话内容' : '消息内容'"
            prop="szContent"
            v-if="hasProp('szContent')"
        >
            <el-input v-model="item.payload.szContent" placeholder="内容" type="textarea"></el-input>
            <span class="u-desc">
                <i class="el-icon-info"></i>
                <b>$me</b>代表当前玩家名字，<b>$team</b>代表团队内玩家名字，<b>(.*?)</b>代表若干个字符
            </span>
        </el-form-item>
        <el-form-item label="保证换行" v-if="item.type == 'CHAT'">
            <el-switch v-model="item.keepLR" active-color="#13ce66"> </el-switch>
            <span class="u-desc"
                ><i class="el-icon-warning-outline"></i> 大部分系统消息需要开启此功能，如自定义内容时请关闭</span
            >
        </el-form-item>
        <!-- 匹配模式 -->
        <el-form-item label="子串搜索" prop="bSearch" v-if="hasProp('bSearch')">
            <el-switch v-model="item.payload.bSearch" active-color="#13ce66" @change="mexContent('bSearch')">
            </el-switch>
            <span class="u-desc"
                ><i class="el-icon-warning-outline"></i> 如不清楚该功能请勿开启，<a
                    :href="getLink('tool', 17359)"
                    target="_blank"
                    >了解作用</a
                ></span
            >
        </el-form-item>
        <el-form-item label="正则匹配" prop="bReg" v-if="hasProp('bReg')">
            <el-switch v-model="item.payload.bReg" active-color="#13ce66" @change="mexContent('bReg')"> </el-switch>
            <span class="u-desc"
                ><i class="el-icon-warning-outline"></i> 如不清楚该功能请勿开启，<a
                    :href="getLink('tool', 17359)"
                    target="_blank"
                    >了解作用</a
                ></span
            >
        </el-form-item>
        <!-- 源数据 -->
        <el-form-item label="源数据" v-if="resource" class="u-overview">
            <a class="u-resource-preview" :href="resourceUrl" target="_blank">
                <img class="u-icon" :src="iconLink(resource.IconID)" />
                <span class="u-name">{{ resource.Name || resource.BuffName || resource.SkillName }}</span>
                <span class="u-desc">{{ resource.Desc || resource.Remark }}</span>
            </a></el-form-item
        >
    </fold-block>
</template>
<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import { itemHasProp } from "@/utils/dbm/item";
import { mapState } from "vuex";
import { getLink, iconLink } from "@jx3box/jx3box-common/js/utils";
import { getImage } from "@/utils/dbm/common";
import { getResource } from "@/service/dbm/node";
import typeDatabaseMap from "@/assets/data/dbm/type_database_map.json";
import defaultItemPayload from "@/assets/data/dbm/default_item_payload.json";
import npcFrames from "@/assets/data/dbm/npc_frames.json";

export default {
    name: "ItemBasic",
    components: { FoldBlock },
    computed: {
        ...mapState({
            item: "item",
            resource: "resource",
            client: "client",
        }),
        npcFrames: () => npcFrames,
        payload() {
            return this.item.payload;
        },
        databaseType() {
            return typeDatabaseMap[this.item.type];
        },
        databaseUrl() {
            if (typeDatabaseMap[this.item.type]) {
                return getLink(this.databaseType);
            }
            return "";
        },
        iconID() {
            if (this.payload.nIcon) return this.payload.nIcon;
            if (this.item.type === "DOODAD") return 10909;
            return this.resource.IconID ?? 13;
        },
        iconUrl() {
            return iconLink(this.iconID);
        },
        resourceUrl() {
            return getLink(this.databaseType, this.payload.dwID);
        },
        name: function () {
            return this.resource
                ? this.resource.Name || this.resource.BuffName || this.resource.SkillName
                : "自定义名称";
        },
    },
    methods: {
        iconLink,
        getLink,
        getImage,
        // 根据type控制字段显隐
        hasProp(prop) {
            return itemHasProp(this.item.type, prop);
        },
        // 切换默认字段锁定状态
        switchDefaultProps: function (key) {
            this.item.defaultPropsStatus[key] = !this.item.defaultPropsStatus[key];
            if (!this.item.defaultPropsStatus[key]) {
                this.payload[key] = defaultItemPayload[key];
            }
        },
        // 加载database数据
        getResource() {
            const { dwID: id, nLevel: level } = this.payload;
            if (!id) return;
            const key = this.payload.bCheckLevel && !isNaN(level) && level != "" ? `${id}_${level}` : id;
            if (this.resource && this.resource.__key == key) return;
            getResource(this.client, this.databaseType, key)
                .then((res) => {
                    const data = {
                        __key: key,
                        ...(res.data.length ? res.data[0] : res.data),
                    };
                    this.$store.state.resource = data;
                })
                .catch((err) => {
                    this.$message.error({
                        message: "数据库未找到匹配的数据，监控将可能不会生效",
                    });
                });
        },
        // 正则匹配/模糊匹配是互斥的
        mexContent: function (priority) {
            let left = priority == "bSearch" ? "bReg" : "bSearch";
            if (this.item.payload[priority]) {
                this.item.payload[left] = false;
            }
        },
    },
    watch: {},
    mounted() {},
};
</script>
<style lang="less">
.m-content-basic {
    .pr;

    .u-overview {
        .pa;
        .rt(0, 30px);
        .el-form-item__label {
            .none;
        }
    }
    .u-resource-preview {
        .db;
        .w(400px);
        .clearfix;
        min-height: 48px;

        .u-icon {
            .size(48px);
            .r(4px);
            .mr(10px);
            .fl;
        }

        .u-name {
            .db;
            .fz(13px, 2);
        }
        .u-desc {
            .db;
            .fz(13px, 1.2);
        }

        border: 1px solid @border;
        padding: 5px;
        .r(4px);
        background-color: @bg-light;
        &:hover {
            border-color: @color-link;
        }
    }
}
</style>
