<!-- 数据库版本的组件 -->
<template>
    <div class="m-versions">
        <div class="m-versions-header w-card-title"><i class="u-icon el-icon-s-grid"></i> 数据库版本</div>
        <div class="m-versions-content">
            <div class="u-empty" v-if="version.length == 0">数据加载中...</div>
            <div class="u-list">
                <el-tooltip placement="top" v-for="_type in all_types" :key="_type" :enterable="true">
                    <div slot="content" class="m-versions-content__popover">
                        <p v-for="data in version.filter((v) => v.type == _type)" :key="data.name">
                            <span class="u-detail-label">{{ data.label }}</span>
                            <span class="u-detail-time">更新于{{ showRecently(data.time) }}</span>
                            <br />
                        </p>
                    </div>
                    <div class="u-item">
                        <span class="u-item-type">{{ _type }}</span>
                        <span class="u-item-time">{{ showDisplayTime(_type) }}</span>
                    </div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { getStat } from "@/service/tool/node";
import { cloneDeep, uniq } from "lodash";
import { moment, showRecently, showDate } from "@jx3box/jx3box-common/js/moment";
import { mapState } from "vuex";

export default {
    name: "DatabaseVersions",
    computed: {
        ...mapState(["database_stat"]),
        version() {
            return this.database_stat.version;
        },
        count() {
            return this.database_stat.count;
        },
        client: function () {
            return this.$store.state.database_client;
        },
        all_types: function () {
            if (!this.version) return [];
            return uniq(this.version.map((item) => item.type));
        },
    },
    methods: {
        showRecently,
        showDisplayTime: function (type) {
            const recentlyTime = this.version
                .filter((item) => item.type == type)
                .sort((a, b) => moment(a.time).isBefore(moment(b.time)))[0];
            return showDate(recentlyTime.time);
        },
        getStat: function () {
            getStat(this.client).then((res) => {
                let data = res.data;
                this.database_stat["version"] = cloneDeep(data.version).sort((a, b) => a.label.length - b.label.length);
                delete data.version;
                this.database_stat["count"] = data;
            });
        },
    },
    watch: {
        client: {
            handler: function () {
                this.getStat();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/tool/database/versions.less";
</style>
