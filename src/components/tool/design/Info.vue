<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link v-for="item in menu" :key="item.routeName" :to="{name: item.routeName}"><i :class="item.icon"></i></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    props: [],
    data: function() {
        return {
            menu: [
                {
                    icon: "el-icon-grape",
                    name: "剑三图标库",
                    routeName: "icon"
                },
                {
                    icon: "el-icon-orange",
                    name: "剑三表情包",
                    routeName: "emotion"
                },
                {
                    icon: "el-icon-map-location",
                    name: "剑三地图库",
                    routeName: "map"
                },
                {
                    icon: "el-icon-cherry",
                    name: "魔盒矢量库",
                    routeName: "vector"
                },
                {
                    icon: "el-icon-watermelon",
                    name: "魔盒壁纸库",
                    routeName: "wallpaper"
                },
            ],
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
    },
    methods: {},
    mounted: function() {},
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
