<template>
    <div class="m-battle-header">
        <div class="m-battle-header-left sub-block">
            <img class="u-logo" svg-inline src="@/assets/img/battle/battle.svg" />
            <span class="u-name">{{ title }}</span>
            <p class="u-desc">{{ desc }}</p>
        </div>
        <div class="m-battle-header-right sub-block"><slot></slot></div>
    </div>
</template>

<script>
export default {
    name: "subheader",
    props: ["title", "desc"],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.m-battle-header {
    border-bottom: 2px solid @color-link;
    padding-bottom: 5px;
    .pr;
}
.m-battle-header-left {
    .u-logo {
        .size(58px);
        .fl;
        .mt(-5px);
        .mr(10px);
    }
    .u-name {
        // font-weight: 300;
        .fz(22px);
        // color: #005bc1;
    }
    .u-desc {
        .fz(14px, 2);
        margin: 0;
        font-weight: 500;
        color: #666;
        // .nobreak;
        white-space: nowrap;
    }
}
.m-battle-header-right {
    .pa;.rb(0,5px);
}
</style>
