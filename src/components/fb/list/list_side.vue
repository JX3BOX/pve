<template>
    <div class="m-list-side">
        <!-- 群号 -->
        <RightSideMsg>
            <em>全服团长交流群</em> :
            <strong @click="onQQClick" class="u-link" title="点击复制">
                <a>{{ qq }}</a>
            </strong>
        </RightSideMsg>
        <!-- 团队天梯 -->
        <mini-ladder v-if="client === 'std'"></mini-ladder>
        <!-- 团队招募 -->
        <team-act v-if="client === 'origin'"></team-act>
    </div>
</template>

<script>
import miniLadder from "./mini_ladder.vue";
import teamAct from "./team_act.vue";
export default {
    name: "list_side",
    components: {
        miniLadder,
        teamAct
    },
    props: [],
    data: function () {
        return {
            qq: "785597424"
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        }
    },
    methods: {
        onQQClick() {
            navigator.clipboard.writeText(this.qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + this.qq,
                    type: "success",
                });
            })
        }
    },
    mounted: function () { },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/fb/side.less";
.m-list-side {
    .u-link {
        cursor: pointer;
    }
}
</style>
