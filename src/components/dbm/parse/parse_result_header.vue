<template>
    <div class="m-parse-result__header">
        <h1 class="m-parse-title">{{ parse_file.name }}</h1>
        <div class="u-header-buttons">
            <el-button
                class="u-btn--switch"
                plain
                icon="el-icon-refresh"
                size="mini"
                type="primary"
                @click="switchMode"
            >
                切换模式
            </el-button>
            <el-button class="u-btn--reset" plain icon="el-icon-delete" size="mini" type="warning" @click="reset">
                清空重置
            </el-button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ParseResultHeader",
    props: {
        loading: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        ...mapState({
            parse_status: (state) => state.parse_status,
            parse_file: (state) => state.parse_file,
            parse_result: (state) => state.parse_result,
        }),
        showSwitch() {
            return ["view", "update"].includes(this.parse_status);
        },
    },
    methods: {
        reset() {
            this.$store.commit("RESET_PARSER");
        },
        switchMode() {
            if (this.parse_status == "view") {
                this.$store.commit("SET_PARSE_STATUS", "update");
            } else if (this.parse_status == "update") {
                this.$store.commit("SET_PARSE_STATUS", "view");
            }
        },
    },
};
</script>
