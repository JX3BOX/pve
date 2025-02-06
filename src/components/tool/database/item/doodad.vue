<template>
    <div class="m-database-item m-database-item__doodad">
        <!-- 项目基本信息 -->
        <div class="m-item">
            <img class="u-icon" :title="'IconID:' + 10909" :src="iconLink(10909)" />
            <div class="u-title">
                <span class="u-name">{{ data.Name }}</span>
                <div class="u-rt-tags">
                    <span v-if="refCount" class="u-ref-count">
                        <i class="el-icon-connection"></i> 引用指数 {{ refCount }}</span
                    >
                    <el-tag size="small" @click.stop="copy('ID')">
                        <i class="el-icon-document-copy u-copy"></i>
                        <span class="u-id" title="点击快速复制">ID:{{ data.ID }}</span>
                    </el-tag>
                </div>
            </div>
            <div class="u-primary u-primary__doodad">
                <span class="u-doodad-prop">
                    <em>地图</em>
                    {{ data.MapName }}
                </span>
                <span class="u-doodad-prop">
                    <em>说明</em>
                    {{ data.BarText }}
                </span>
                <span class="u-doodad-prop" v-if="data.Kind">
                    <em>类型</em>
                    {{ data.Kind }}
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
                <template v-for="(val, key) in data">
                    <span class="u-prop" :key="key">
                        <el-tooltip effect="dark" :content="key" placement="top">
                            <em>{{ fieldLabel(key) }}</em>
                        </el-tooltip>
                        {{ val }}
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
                    @click="star('doodad', data.ID)"
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
                    @click="toDbm('doodad', data.ID, data.Level)"
                >
                    在线构建
                </el-button>
            </div>
        </template>
    </div>
</template>
<script>
import itemMixin from "./mixin";
const advancedProps = ["Script"];
export default {
    name: "ItemDoodad",
    mixins: [itemMixin],
};
</script>
<style lang="less">
@import "~@/assets/css/tool/database/item.less";
.m-database-item__doodad {
    .u-primary__doodad {
        .fz(12px, 1.8);
        display: flex;
        gap: 16px;
        flex-grow: 1;

        em {
            font-style: normal;
            background-color: #eee;
            color: #999;
            padding: 0 5px;
            margin: 0 3px;
            .r(3px);
        }
    }
}
</style>
