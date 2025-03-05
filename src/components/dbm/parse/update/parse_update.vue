<template>
    <div class="m-parse-update-pkg">
        <!-- 头部 -->
        <parse-result-header :loading="loading"></parse-result-header>
        <el-steps v-bind="stepStatus" align-center simple class="m-parse-update-steps">
            <el-step title="选择对比的包" icon="el-icon-folder-opened"></el-step>
            <el-step title="处理数据" icon="el-icon-magic-stick"></el-step>
            <el-step title="选择更新条目" icon="el-icon-check"></el-step>
            <el-step title="更新元数据" icon="el-icon-upload"></el-step>
        </el-steps>
        <!-- 选择对比包 -->
        <parse-pkg-select v-if="status === 'select'" @confirm="onSelect"></parse-pkg-select>
        <!-- 拉数据/对比的进度展示 -->
        <parse-pull
            v-if="status === 'pull'"
            :pkg_id="select_pkg"
            @success="onSuccess"
            @cancel="status = 'select'"
        ></parse-pull>
        <!-- 修改展示 -->
        <parse-merge
            :diffs="compare_result"
            v-if="status === 'merge'"
            @cancel="status = 'select'"
            @next="onDiff"
        ></parse-merge>
        <!-- 推送进度 -->
        <parse-push
            v-if="status === 'push'"
            :diffs="diffs"
            :pkg_id="select_pkg"
            @cancel="status = 'merge'"
            @success="onPush"
        >
        </parse-push>
    </div>
</template>

<script>
import { mapState } from "vuex";

import ParseResultHeader from "@/components/dbm/parse/parse_result_header.vue";
import ParsePkgSelect from "@/components/dbm/parse/update/parse_select.vue";
import ParsePull from "@/components/dbm/parse/update/parse_pull.vue";
import ParseMerge from "@/components/dbm/parse/update/parse_merge.vue";
import ParsePush from "@/components/dbm/parse/update/parse_push.vue";

const STATUS_MAP = {
    select: "选择对比包",
    pull: "拉取数据",
    merge: "选择更新条目",
    push: "更新云端",
};

export default {
    name: "ParseUpdate",
    components: { ParseResultHeader, ParsePkgSelect, ParsePull, ParseMerge, ParsePush },
    data: () => ({
        status: "select",
        select_pkg: null,
        compare_result: [],
        diffs: [],

        loading: true,
    }),
    methods: {
        nextStep() {
            const status = Object.keys(STATUS_MAP);
            this.status = status[status.indexOf(this.status) + 1];
        },
        onSelect(pkg_id) {
            this.select_pkg = pkg_id;
            this.nextStep();
        },
        onSuccess(data) {
            this.compare_result = data;
            this.nextStep();
        },
        onDiff(diffs) {
            this.diffs = diffs;
            this.nextStep();
        },
        onPush() {
            this.$alert("更新已推送完毕，请前往目标包发版", {
                type: "success",
            });
            this.$router.push({ name: "pkg_detail_raw", params: { id: this.select_pkg } });
        },
    },
    computed: {
        stepStatus() {
            const status = Object.keys(STATUS_MAP);

            return {
                active: status.indexOf(this.status),
            };
        },
        ...mapState({
            parse_file: (state) => state.parse_file,
            parse_result: (state) => state.parse_result,
        }),
    },
};
</script>

<style lang="less">
.m-parse-update-pkg {
    .m-parse-update-steps {
        .mb(20px);
    }

    .m-parse-update-opr {
        .mt(20px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
