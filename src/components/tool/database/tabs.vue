<template>
    <el-tabs class="m-database-tabs" v-model="typeModel" type="card" @tab-click="changeType">
        <el-tab-pane label="Buff" name="buff">
            <span slot="label">
                <img class="u-icon" svg-inline src="@/assets/img/tool/database/skill3.svg" />
                <b>Buff</b>
                <em class="u-count">{{ stat.buff }}</em>
            </span>
        </el-tab-pane>
        <el-tab-pane label="技能" name="skill">
            <span slot="label">
                <img class="u-icon" svg-inline src="@/assets/img/tool/database/skill4.svg" />
                <b>技能</b>
                <em class="u-count">{{ stat.skill }}</em>
            </span>
        </el-tab-pane>
        <el-tab-pane label="NPC" name="npc">
            <span slot="label">
                <img class="u-icon" svg-inline src="@/assets/img/tool/database/skull.svg" />
                <b>NPC</b>
                <em class="u-count">{{ stat.npc }}</em>
            </span>
        </el-tab-pane>
        <el-tab-pane label="交互物件" name="doodad">
            <span slot="label">
                <img class="u-icon" svg-inline src="@/assets/img/tool/database/doodad.svg" />
                <b>交互物件</b>
                <em class="u-count">{{ stat.doodad }}</em>
            </span>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import { mapState } from "vuex";

export default {
    name: "DatabaseTabs",
    props: {
        client: {
            type: String,
            default: "std",
        },
        type: {
            type: String,
            default: "std",
        },
        hasRight: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "type",
        event: "change",
    },
    computed: {
        ...mapState(["database_stat"]),
        stat() {
            return this.database_stat.count;
        },
        typeModel: {
            get() {
                return this.type;
            },
            set(val) {
                this.$emit("update:type", val);
            },
        },
    },
    methods: {
        changeType() {
            this.$emit("change", this.type);
        },
    },
};
</script>
<style lang="less">
.m-database-tabs {
    .el-tabs__item {
        user-select: none;

        a {
            color: @color;
        }
    }

    .u-icon {
        .size(20px);
        .y(-3px);
        .mr(5px);
    }
    .u-count {
        font-style: normal;
        font-weight: normal;
        .fz(12px);
        color: #888;
        &:before {
            content: "(";
            padding: 0 3px 0 5px;
        }
        &:after {
            content: ")";
            padding: 0 3px 0 5px;
        }
    }
    .is-active {
        color: @primary;
        svg {
            fill: @primary;
        }
    }
    &.el-tabs--card > .el-tabs__header .el-tabs__item {
        transition: none;
    }
    .el-tabs__item:hover {
        svg {
            fill: @primary;
        }
        color: @primary;
        a {
            color: @primary;
        }
    }
    .u-tip {
        padding: 10px 0;
        a {
            color: @primary;
            .underline(@primary);
        }
    }
}
</style>
