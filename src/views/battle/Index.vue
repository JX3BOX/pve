<template>
    <div class="v-index">
        <div class="m-index-header">
            <img class="u-logo" svg-inline src="@/assets/img/battle/battle.svg" />
            <h1 class="u-name">剑三战斗统计</h1>
            <p class="u-desc">JX3 Combat Log Analyzer</p>
            <a href class="u-video el-button el-button--default is-plain is-disabled">
                <i class="el-icon-video-camera"></i> 入门教程
            </a>
        </div>
        <div class="m-index-content">
            <h2 class="u-title"><i class="el-icon-cold-drink"></i> 应用介绍</h2>
            <div class="u-desc">
                <p>
                    <i class="u-icon el-icon-sugar"></i> 超清晰全面的多维度分析， <b>即开即用无任何依赖</b>，
                    支持云存档、查看权限自定义
                </p>
                <p>
                    <i class="u-icon el-icon-sugar"></i> 【PVE ·
                    团队统计分析】团队/首领/个人的伤害、治疗、承疗、承伤等统计超全面360º无死角分析！
                </p>
                <p>
                    <i class="u-icon el-icon-sugar"></i> 【PVE ·
                    首领行为分析】智能分析首领时间轴、涵盖全小怪神出鬼没与伤害、开荒做数据更轻松！
                </p>
                <p>
                    <i class="u-icon el-icon-sugar"></i> 【PVE ·
                    团队行为分析】团队每个成员全时间链行为分析，所有buff/debuff获取与技能释放详情一览无余！
                </p>
                <p>
                    <i class="u-icon el-icon-sugar"></i> 【PVP ·
                    竞技多维分析】完整复盘，重要细节不错过，好师傅带徒儿神器，更有疑似外挂检测！
                </p>
            </div>
            <h2 class="u-title"><i class="el-icon-discover"></i> 使用指南</h2>
            <div class="u-desc">
                <p>
                    <i class="u-icon el-icon-sugar"></i>
                    <a href="/tool/22318" target="_blank">《茗伊战斗统计数据获取指南》</a>
                    <span class="u-rec">★ 推荐</span>
                </p>
                <p>
                    <i class="u-icon el-icon-sugar"></i>
                    <a href="/tool/22458" target="_blank">《官方战斗统计数据获取指南》</a>
                </p>
            </div>

            <div class="u-go">
                <p>准备好了吗？</p>
                <el-button class="u-upload" type="primary" @click="toUpload">
                    <span>
                        <i class="el-icon-upload"></i>
                        上传数据
                    </span>
                    <em>Upload Combat Log</em>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        toUpload: function () {
            this.$router.push("upload");
        },
    },
    created: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/battle/index.less";
</style>
