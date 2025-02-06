<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link to="/tool"><i class="el-icon-receiving"></i></router-link>
            <router-link to="/tool?subtype=1"><i class="el-icon-setting"></i></router-link>
            <router-link to="/tool?subtype=2"><i class="el-icon-paperclip"></i></router-link>
            <router-link to="/tool?subtype=3"><i class="el-icon-discover"></i></router-link>
            <router-link to="/tool?subtype=4"><i class="el-icon-collection"></i></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    props: [],
    data: function() {
        return {};
    },
};
</script>

<style lang="less">
.m-info {
    .fl;
    white-space: nowrap;
    overflow-x: auto;
}
@media screen and (max-width: @ipad) {
    .m-info {
        float: none;
    }
}
.m-info-router {
    .fr;
    .fz(1rem);
    a {
        .mr(10px);
        color: @darkblue;
        &:hover {
            color: @pink;
        }
    }
    .router-link-exact-active,
    .on {
        color: @pink;
    }
    .none;
}

@media screen and (max-width: @phone) {
    .m-info-router {
        .db;
        float: none;
        .x(right);
    }
}

</style>
