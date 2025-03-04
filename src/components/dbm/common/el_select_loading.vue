<template>
    <el-option ref="el" class="el-select-loading" value="" v-if="hasMore" disabled>
        <template>
            <i class="el-icon-loading"></i>
            <span class="el-select-loading__tips">{{ loadingText || "正在加载" }}</span>
        </template>
    </el-option>
</template>

<script>
export default {
    name: "ElSelectLoading",
    props: {
        hasMore: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadingText: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        observer: null,
    }),
    methods: {
        install() {
            const target = this.$refs?.el?.$el?.parentElement?.parentElement;
            if (!target) throw new Error("target not found");
            const callback = (entries) => {
                if (this.loading || !this.hasMore || !entries[0].isIntersecting) return;
                this.$emit("load-more");
            };
            const options = {
                root: target,
                rootMargin: "0px",
            };
            this.observer = new IntersectionObserver(callback, options);
            this.observer.observe(this.$refs.el.$el);
        },
        uninstall() {
            this.observer.unobserve(this.$refs.el);
        },
    },
    mounted() {
        const interval = setInterval(() => {
            try {
                this.install();
                clearInterval(interval);
            } catch (e) {}
        }, 200);
    },
    unmounted() {
        this.uninstall();
    },
};
</script>
