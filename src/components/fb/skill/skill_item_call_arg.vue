<template>
    <span class="u-call-arg">
        <template v-if="arg.type == 'MemberExpression'">
            <em>
                {{ arg.base.name }}
                <b>{{ arg.indexer }}</b>
                {{ arg.identifier.name }}
            </em>
        </template>
        <template v-else-if="arg.type == 'NumericLiteral'">
            <em>{{ arg.value }}</em>
        </template>
        <template v-else-if="arg.type == 'Identifier'">
            <em>{{ arg.name }}</em>
        </template>
        <template v-else-if="arg.type == 'StringLiteral'">
            <em>{{ arg.raw }}</em>
        </template>
        <template v-else-if="arg.type == 'BinaryExpression'">
            <em>
                {{ arg.left.raw || arg.left.name
                }}
                <b class="u-call-op">{{ arg.operator }}</b>
                {{ arg.right.raw || arg.right.name }}
            </em>
        </template>
        <template v-else-if="arg.type == 'UnaryExpression'">
            <em>
                <b>{{ arg.operator }}</b>
                {{ arg.argument.raw || arg.argument.name }}
            </em>
        </template>
        <span v-else class="u-call-op">{{ arg }}</span>
    </span>
</template>

<script>
export default {
    name: "arg",
    props: ["arg"],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
.u-call-arg {
    em,
    b {
        .mr(0) !important;
    }
    em {
        color: #49c10f;
    }
}
.u-call-op {
    color: #f00;
}
</style>
