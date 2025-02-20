<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link to="/tool"><i class="el-icon-receiving"></i></router-link>
            <router-link to="/app/database"><i class="el-icon-reading"></i></router-link>
            <router-link to="/app/design"><i class="el-icon-picture-outline-round"></i></router-link>
            <a href="/dbm"><i class="el-icon-news"></i></a>
            <a href="/jcl"><i class="el-icon-data-line"></i></a>
            <a href="/battle"><i class="el-icon-data-analysis"></i></a>
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
