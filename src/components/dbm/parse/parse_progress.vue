<template>
    <div class="m-parse-progress">
        <el-progress
            class="u-progress"
            :text-inside="true"
            :stroke-width="24"
            :percentage="progress"
            status="success"
        ></el-progress>
        <ul class="u-msg-list">
            <li class="u-msg" v-for="(txt, i) in msg" :key="i">{{ txt }}</li>
        </ul>
        <div class="u-op" v-if="done">
            <el-button type="primary" icon="el-icon-plus" @click="toStatus('view')">新增模式</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="toStatus('update')">更新模式</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ParseProgress",
    props: [],
    data: function () {
        return {
            // 进程
            progress: 0,
            msg: [],
            done: false,
        };
    },
    computed: {
        file: function () {
            return this.$store.state.file;
        },
    },
    methods: {
        toStatus(status) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            this.$emit("status", status);
        },
        update(data) {
            const { message, progress, options } = data;
            if (progress !== undefined) this.progress = Math.round(progress);
            if (message) {
                if (options?.append) this.msg[this.msg.length - 1] += message;
                else this.msg.push(message);
            }
            if (progress === 100) this.done = true;
        },
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/parse/parse_progress.less";
</style>
