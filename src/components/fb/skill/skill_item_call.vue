<template>
    <div class="m-skill-item-call">
        <!-- 调用函数名 -->
        <b>{{ call.call }}</b>

        <!-- 参数列表 -->
        <span>(</span>
        <span class="u-call-arg" v-for="(arg, i) in call.args" :key="i">
            <template v-if="arg.type == 'CallExpression'">
                <em>
                    <span class="u-fn">{{ arg.base.name }}</span>(
                    <args :args="arg.arguments" />)
                </em>
            </template>
            <arg :arg="arg" v-else />
            <em v-if="i < call.args.length - 1" class="u-call-op">,</em>
        </span>
        <span>)</span>
    </div>
</template>

<script>
import args from "@/components/fb/skill/skill_item_call_args.vue";
import arg from "@/components/fb/skill/skill_item_call_arg.vue";
export default {
    name: "skill_item_call",
    props: ["data"],
    data: function () {
        return {};
    },
    computed: {
        call: function () {
            return this.data;
        },
    },
    methods: {},
    mounted: function () {},
    components: {
        args,
        arg,
    },
};
</script>

<style scoped lang="less">
.u-fn {
    color: #93f;
}
.u-call-op {
    color: #f00;
}
</style>
