<template>
    <div class="m-nav__header">
        <a class="u-btn u-btn--add el-button el-button--primary" @click="createData">
            <i class="el-icon-plus"></i>
            <span>创建新数据</span>
        </a>
        <a class="u-btn u-btn-database el-button el-button--primary is-plain" href="/app/database" target="_blank"><i class="el-icon-receiving"></i><span>剑三数据库</span></a>

        <el-dialog :visible.sync="show" append-to-body @close="onClose" title="创建" class="m-dbm-create">
            <div class="m-nav__dialog">
                <h6 class="m-router-title">DBM</h6>
                <div class="m-router" @click="onItemClick">
                    <router-link class="m-router-item" :to="{ name: 'pkg_create' }">
                        <span><i class="el-icon-cloudy"></i> <span class="u-text">数据包</span></span>
                        <em class="u-desc">DBM Package</em>
                    </router-link>
                    <router-link class="m-router-item" :to="{ name: 'item_create' }">
                        <span><i class="el-icon-files"></i> <span class="u-text">元数据</span></span>
                        <em class="u-desc">DBM Meta</em>
                    </router-link>
                    <router-link class="m-router-item" :to="{ name: 'create_vpk' }">
                        <span><i class="el-icon-service"></i> <span class="u-text">语音包</span></span>
                        <em class="u-desc">DBM Vpk</em>
                    </router-link>
                </div>
                <h6 class="m-router-title">Other</h6>
                <div class="m-router" @click="onItemClick">
                    <router-link class="m-router-item" :to="{ name: 'target_create' }">
                        <span><i class="el-icon-aim"></i> <span class="u-text">目标监控</span></span>
                        <em class="u-desc">DBM Target</em>
                    </router-link>
                    <router-link class="m-router-item" :to="{ name: 'mark_create' }">
                        <span><i class="el-icon-map-location"></i> <span class="u-text">场景标记</span></span>
                        <em class="u-desc">Scene Mark</em>
                    </router-link>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "MyComponent",
    emits: ["update:modelValue"],
    data() {
        return {
            show: false,
        };
    },
    methods: {
        onClose() {
            this.show = false;
        },
        createData() {
            this.show = true;
        },
        onItemClick(e) {
            // 点击到了子元素 关闭弹窗
            if (e.target !== e.currentTarget) {
                this.show = false;
            }
        },
    },
    mounted() {
        // Your mounted hook code here
    },
};
</script>

<style lang="less" scoped>
/* Your CSS code here */
</style>
