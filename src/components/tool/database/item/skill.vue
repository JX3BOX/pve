<template>
    <div class="m-database-item m-database-item__skill">
        <!-- 项目基本信息 -->
        <div class="m-item">
            <img class="u-icon" :title="'IconID:' + data.IconID" :src="iconLink(data.IconID)" />
            <div class="u-title">
                <div class="u-name">
                    <span class="u-name-primary">{{ data.Name }}</span>
                    <span class="u-name-secondary" v-if="data.SkillName"> ({{ data.SkillName }})</span>
                </div>
                <div class="u-rt-tags">
                    <span v-if="refCount" class="u-ref-count">
                        <i class="el-icon-connection"></i> 引用指数 {{ refCount }}</span
                    >
                    <el-tag size="small" @click.stop="copy('SkillID')">
                        <i class="el-icon-document-copy u-copy"></i>
                        <span class="u-id" title="点击快速复制">ID:{{ data.SkillID }}</span>
                    </el-tag>
                </div>
            </div>
            <div class="u-desc-text">
                <p class="u-desc-content" v-html="desc ? desc.toString().replace(/\\n/g, '<br>') : ''"></p>
                <div class="u-desc-talent" v-if="show_parse && data.parse" v-html="data.parse.talent_desc"></div>
            </div>
            <div class="u-primary">
                <span class="u-primary-items">
                    <span class="u-primary-item"> Level: {{ data.Level }} </span>
                    <span class="u-primary-item"> Remark: {{ data.Remark }} </span>
                    <span class="u-primary-item" v-if="data.HelpDesc">HelpDesc : {{ data.HelpDesc }}</span>
                    <span class="u-primary-item" v-if="data.SimpleDesc">SimpleDesc : {{ data.SimpleDesc }}</span>
                    <span class="u-primary-item" v-if="data.SpecialDesc">SpecialDesc : {{ data.SpecialDesc }}</span>
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
                <template v-for="(val, key) in second_filtered_data">
                    <span class="u-prop" :key="key">
                        <el-tooltip effect="dark" :content="key" placement="top">
                            <em>
                                {{ fieldLabel(key) }}
                            </em>
                        </el-tooltip>
                        <span v-html="val ? val.toString().replace(/\\n/g, '，') : ''"></span>
                    </span>
                </template>
            </div>
            <!-- 项目操作 -->
            <div class="m-operation" v-if="isLogin">
                <el-button
                    v-if="!star_id"
                    class="u-button u-star"
                    icon="el-icon-star-off"
                    plain
                    @click="star('skill', data.SkillID, data.Level)"
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
                    @click="toDbm('skill', data.SkillID, data.Level)"
                >
                    在线构建
                </el-button>
            </div>
        </template>
    </div>
</template>
<script>
import itemMixin from "./mixin";
import lodash from "lodash";

export default {
    name: "ItemSkill",
    mixins: [itemMixin],
    data: () => ({
        show_parse: true,
    }),
    computed: {
        desc() {
            if (this.show_parse && this.data.parse) {
                return this.data.parse.desc;
            }
            return this.filterRaw(this.data.Desc);
        },
        second_filtered_data() {
            return lodash.omit(this.data, ["parse"]);
        },
    },
    methods: {},
};
</script>
<style lang="less">
@import "~@/assets/css/tool/database/item.less";
.m-database-item__skill {
    .u-desc-text {
        display: flex;
        flex-direction: column;
    }

    .u-desc-talent {
        .fz(13px, 1.8);
        white-space: pre-wrap;
    }

    .u-desc-content {
        .fz(13px, 1.8);
        flex-grow: 1;
        margin: 0 0 5px 0;
        white-space: pre-wrap;
    }
}
</style>
