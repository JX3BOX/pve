<template>
    <div class="m-database-filter">
        <div class="w-card-title">筛选条件</div>
        <div class="m-filters">
            <div class="u-client">
                <el-radio-group v-model="clientModel" size="small">
                    <el-radio-button label="std">重制</el-radio-button>
                    <el-radio-button label="origin">缘起</el-radio-button>
                </el-radio-group>
            </div>
            <div class="u-keyword">
                <div class="u-input-label">ID / 名称</div>
                <el-input placeholder="请输入 ID 或 名称" v-model="queryModel.keyword" clearable> </el-input>
            </div>
            <div class="u-level">
                <div class="u-input-label">等级</div>
                <el-input placeholder="请输入等级" v-model="queryModel.level" clearable> </el-input>
            </div>
            <div class="u-map" v-if="type == 'npc'">
                <div class="u-input-label">地图</div>
                <el-input placeholder="请输入NPC所在地图" v-model="queryModel.map" clearable> </el-input>
            </div>
            <div v-for="(field, index) in extraField" :key="index" class="u-extra-field">
                <template v-if="field == '_Types' && type == 'buff'">
                    <div class="u-input-label">{{ field }}</div>
                    <el-select v-model="queryModel[field]" filterable clearable>
                        <el-option v-for="(type, index) in buff_types" :key="index" :label="type" :value="type">
                        </el-option>
                    </el-select>
                </template>
                <template v-else>
                    <div class="u-input-label">{{ field }}</div>
                    <el-input :placeholder="field" v-model="queryModel[field]" clearable> </el-input>
                </template>
            </div>
            <el-select
                v-model="extraField"
                size="mini"
                class="u-add-field"
                filterable
                clearable
                multiple
                collapse-tags
                placeholder="添加查询条件"
                @change="onAddField"
            >
                <el-option
                    v-for="(field, index) in selectableFields"
                    :key="index"
                    :label="field.label"
                    :value="field.field"
                >
                    <span class="u-label">{{ field.label }}</span>
                    <span class="u-field">{{ field.field }}</span>
                </el-option>
            </el-select>

            <div class="u-opr">
                <div class="u-strict">
                    <el-switch
                        v-model.number="queryModel.strict"
                        active-text="精确匹配"
                        :inactive-value="0"
                        :active-value="1"
                    ></el-switch>
                </div>
                <el-button class="u-btn" type="primary" size="small">搜索</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import buff_types from "@/assets/data/tool/database/buff_types.json";

export default {
    name: "DatabaseFilter",
    props: {
        type: {
            type: String,
            default: "buff",
        },
        client: {
            type: String,
            default: "std",
        },
        query: Object,
    },
    data: () => ({
        buff_types,

        extraField: [],
    }),
    computed: {
        ...mapState({
            fields: (state) => state.database_fields,
            user_group: (state) => state.user_group,
        }),
        clientModel: {
            get() {
                return this.client;
            },
            set(val) {
                this.$emit("update:client", val);
            },
        },
        queryModel: {
            get() {
                return this.query;
            },
            set(val) {
                this.$emit("update:query", val);
            },
        },
        selectableFields() {
            const exclude = ["SkillID", "BuffID", "Level", "Name", "Map"];
            if (!this.fields[this.type]) return [];
            return Object.values(this.fields[this.type]).filter(
                (item) => item.group <= this.user_group && !exclude.includes(item.field)
            );
        },
    },
    methods: {
        onAddField(fields) {
            const defaultField = ["keyword", "level", "strict", "map"];
            const query = {};
            for (let key in this.queryModel) {
                if (!defaultField.includes(key) && !this.extraField.includes(key)) continue;
                if (this.type === "npc" && key === "map") {
                    query.map = this.queryModel[key] ?? "";
                    continue;
                }
                query[key] = this.queryModel[key] ?? "";
            }
            for (let field of fields) {
                if (query[field] === undefined) query[field] = "";
            }
            this.queryModel = query;
        },
    },
    watch: {
        selectableFields: {
            deep: true,
            handler() {
                this.extraField = [];
            },
        },
    },
};
</script>
<style lang="less">
.el-select-dropdown {
    .u-label {
        .fl;
    }
    .u-field {
        .fr;
        color: #8492a6;
        font-size: 13px;
    }
}

.m-database-filter {
    .u-client .el-radio-group {
        width: 100%;

        .el-radio-button {
            width: 50%;
        }

        .el-radio-button__inner {
            width: 100%;
        }
    }
    .m-filters {
        padding: 10px;
    }
    .m-filters > div {
        .mb(12px);
    }
    .u-opr {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .u-input-label {
        .fz(12px, 14px);
        .mb(6px);
        .bold;
        color: #999;
    }
    .u-btn {
        .w(80px);
    }
    .u-add-field {
        width: 100%;
    }
    .u-extra-field {
        width: 100%;
        .el-select {
            width: 100%;
        }
    }
}
</style>
