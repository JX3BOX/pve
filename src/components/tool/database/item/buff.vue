<template>
    <div class="m-database-item m-database-item__buff">
        <!-- 项目基本信息 -->
        <div class="m-item">
            <img class="u-icon" :title="'IconID:' + data.IconID" :src="iconLink(data.IconID)" />
            <div class="u-title">
                <div class="u-section">
                    <span class="u-name-primary">{{ data.Name }}</span>
                    <span class="u-name-secondary" v-if="data.BuffName"> ({{ data.BuffName }})</span>
                </div>
                <div class="u-section">
                    <span class="u-buff-tag is-buff" v-if="data.CanCancel">BUFF</span>
                    <span class="u-buff-tag is-debuff" v-else>DEBUFF</span>
                    <template v-if="data._Types && data._Types.length">
                        <span
                            class="u-buff-tag"
                            :style="buffTypeColor(type)"
                            v-for="(type, index) in data._Types"
                            :key="index"
                        >
                            {{ type }}</span
                        >
                    </template>
                </div>
                <div class="u-section">
                    <span v-if="refCount" class="u-ref-count">
                        <i class="el-icon-connection"></i> 引用指数 {{ refCount }}</span
                    >
                    <el-tag size="small" @click.stop="copy('BuffID')">
                        <i class="el-icon-document-copy u-copy"></i>
                        <span class="u-id" title="点击快速复制">ID:{{ data.BuffID }}</span>
                    </el-tag>
                </div>
            </div>
            <div class="u-desc-text">
                <p class="u-desc-content">{{ data.Desc }}</p>
                <span v-if="detach_type" class="u-detach">{{ detach_type }}</span>
            </div>
            <div class="u-primary">
                <span class="u-primary-items">
                    <span class="u-primary-item"> Level: {{ data.Level }} </span>
                    <span class="u-primary-item"> Remark: {{ data.Remark }} </span>
                </span>
            </div>
            <el-button
                v-if="showDetail"
                class="u-props-toggle"
                :class="{ 'is-active': showProps }"
                @click="toggleProps"
            >
                <i class="el-icon-view"></i>
                <span v-if="showProps">收起属性</span>
                <span v-else>查看属性</span>
            </el-button>
        </div>
        <!-- 项目详情，仅在单页展示 -->
        <template v-if="showDetail">
            <!-- 详细字段列表 -->
            <div class="m-detail" v-if="showProps">
                <span class="u-prop" v-for="(item, index) in display_props" :key="index">
                    <!-- 属性名 -->
                    <el-tooltip v-if="item.keyDesc" effect="dark" :content="item.key" placement="top">
                        <em class="u-prop-key" :class="{ isAdv: item.isAdv }">
                            {{ item.keyDesc }}
                        </em>
                    </el-tooltip>
                    <em v-else class="u-prop-key">{{ item.key }}</em>
                    <!-- 属性值 -->
                    <el-tooltip v-if="item.valueDesc" effect="dark" placement="top">
                        <div v-html="item.valueDesc" slot="content"></div>
                        <span>{{ item.value }}</span>
                    </el-tooltip>
                    <span v-else>{{ item.value }}</span>
                </span>
            </div>
            <!-- 项目操作 -->
            <div class="m-operation" v-if="isLogin">
                <el-button
                    v-if="!star_id"
                    class="u-button u-star"
                    icon="el-icon-star-off"
                    plain
                    @click="star('buff', data.BuffID, data.Level)"
                >
                    收藏数据
                </el-button>
                <el-button
                    v-else-if="isLogin"
                    class="u-button u-stared"
                    icon="el-icon-star-on"
                    plain
                    @click="cancelStar"
                >
                    取消收藏
                </el-button>
                <el-button
                    class="u-button u-to-dbm"
                    icon="el-icon-connection"
                    plain
                    @click="toDbm('buff', data.BuffID, data.Level)"
                >
                    在线构建
                </el-button>
            </div>
        </template>
    </div>
</template>
<script>
import itemMixin from "./mixin";
import detach_types from "@/assets/data/tool/database/detach_types.json";
import props_buff from "@/assets/data/tool/database/props_buff.json";
import buff_types_colors from "@/assets/data/tool/database/buff_type_colors.json";

export default {
    name: "ItemBuff",
    mixins: [itemMixin],
    data: () => ({
        detach_types,
        props_buff,
    }),
    computed: {
        detach_type: function () {
            const type = this.data?.DetachType;
            if (type && this.detach_types[type]) return this.detach_types[type];
            return null;
        },
        display_props: function () {
            const result = [];
            // buff属性
            for (let i = 1; i <= 15; i++) {
                if (this.data[`BeginAttrib${i}`] === null) continue;
                const attrDesc = this.attrLabel(this.data[`BeginAttrib${i}`]);
                let value = this.data[`BeginValue${i}A`];
                if (this.data[`BeginValue${i}B`] !== null) value += ` | ${this.data[`BeginValue${i}B`]}`;
                const attr = {
                    key: `BeginAttrib${i}`,
                    keyDesc: "Buff属性" + i,
                    value: attrDesc + " | " + value,
                    valueDesc: `BeginAttrib${i}: ${this.data[`BeginAttrib${i}`]} <br />
                        BeginValue${i}A: ${this.data[`BeginValue${i}A`]} <br />
                        BeginValue${i}B: ${this.data[`BeginValue${i}B`] ?? ""}`,
                };
                result.unshift(attr);
            }
            // 常规属性
            for (const key in this.data) {
                if (!this.propsFilter(key)) continue;
                result.push({
                    key,
                    keyDesc: this.fieldLabel(key),
                    value: this.data[key],
                    valueDesc: this.attrLabel(this.data[key]),
                    isAdv: this.props_buff[key] && this.props_buff[key]["adv"],
                });
            }
            return result;
        },
    },
    methods: {
        propsFilter(key) {
            if (["BeginValue", "BeginAttrib"].some((item) => key.startsWith(item))) return false;
            return true;
        },
        buffTypeColor(type) {
            const color = buff_types_colors[type];
            return {
                borderColor: color + "44",
                backgroundColor: color + "22",
                color: color,
            };
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/tool/database/item.less";
.m-database-item__buff {
    .u-desc-text {
        display: flex;
        align-items: center;
    }

    .u-desc-content {
        .fz(13px, 1.8);
        flex-grow: 1;
        margin: 0 0 5px 0;
    }

    .u-buff-tag {
        .r(4px);
        .fz(10px);
        font-weight: normal;
        display: inline-block;
        padding: 0 10px;
        border: 1px solid;
        border-color: #7cb3fc;
        background-color: #e0edfd;
        color: #2081ff;

        &.is-buff {
            border-color: rgb(189, 253, 159);
            background-color: #dbffca;
            color: #49c10f;
        }

        &.is-debuff {
            border-color: #ffd9a1;
            background-color: #ffeacc;
            color: #fba524;
        }
    }
}
</style>
