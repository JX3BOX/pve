<template>
    <div class="m-parse-filter">
        <div class="m-parse-filter__map">
            <span class="u-prepend el-input-group__prepend"><i class="el-icon-map-location"></i> 地图</span>
            <el-select
                v-model="params.map"
                filterable
                placeholder="请选择"
                size="small"
                clearable
                multiple
                collapse-tags
            >
                <el-option
                    v-for="index in mapKeys"
                    :key="index"
                    :label="mapIndex[index] + '(' + index + ')'"
                    :value="index"
                    class="m-parse-filter__map-option"
                    :class="{ 'u-empty-count': !mapCount[index] }"
                >
                    <span class="u-label">{{ mapIndex[index] }}</span>
                    <span class="u-count" v-if="mapCount[index]">({{ mapCount[index] }})</span>
                    <span class="u-value">{{ index }}</span>
                </el-option>
            </el-select>
        </div>
        <el-input
            class="u-keyword"
            v-model="params.keyword"
            placeholder="从名称、时间轴等进行检索，多个关键词使用空格分开即可"
            size="small"
            clearable
        >
            <span slot="prepend"><i class="el-icon-search"></i> 关键词</span>
        </el-input>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ParseFilter",
    props: ["type"],
    computed: {
        ...mapState({
            mapKeys: (state) => state.mapKeys,
            mapIndex: (state) => state.mapIndex,
            params: (state) => state.parse_filter,
            parse_result: (state) => state.parse_result,
        }),
        mapCount() {
            const all_data =
                (this.type === "ALL" ? Object.values(this.parse_result).flat() : this.parse_result[this.type]) || [];
            return all_data.reduce((map_count, item) => {
                const map = item.map?.[0];
                if (!map) return map_count;
                if (!map_count[map]) map_count[map] = 0;
                map_count[map]++;
                return map_count;
            }, {});
        },
    },
};
</script>

<style lang="less">
.m-parse-filter {
    .mb(15px);
    display: flex;
    align-items: center;
    gap: 15px;

    .el-input-group__prepend {
        padding: 0 10px;
    }
    .u-keyword {
        flex: 1;
    }
}
.m-parse-filter__map {
    .el-select {
        flex: 1;
    }
    .u-prepend {
        .fl;
        .w(70px);
        box-sizing: border-box;
        .fz(14px,30px);
    }

    .el-input__inner {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
@media screen and (max-width: @phone) {
    .m-parse-filter {
        flex-direction: column;
    }
    .m-parse-filter__map {
        width: 100%;
        .flex;
    }
}
.m-parse-filter__map-option {
    .u-count {
        .fz(13px, 20px);
        // color: #606266;
        color: #fba524;
        margin-left: 5px;
    }
    &.u-empty-count {
        opacity: 0.5;
    }
}
</style>
