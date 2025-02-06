<template>
    <div class="m-icons-fav">
        <div class="m-title"><i class="el-icon-star-on u-icon"></i> 收藏图标</div>
        <el-alert class="m-icons-tips" v-if="!favList.length" title="没有收藏的图标，请搜索图标进行添加。" type="info" center show-icon :closable="false"></el-alert>

        <draggable v-model="favList" key="icon" class="m-icons-matrix" v-else @end="onEnd">
            <icon-item v-for="(icon, index) in favList" :icon="icon" :isFav="true" :key="index"></icon-item>
        </draggable>
    </div>
</template>

<script>
import { getMyFavIcons, setMyFavIcons } from "@/service/tool/icons.js";
import User from "@jx3box/jx3box-common/js/user.js";
import iconItem from "./item.vue";
import draggable from "vuedraggable";
export default {
    name: "fav",
    props: [],
    components: {
        iconItem,
        draggable,
    },
    data() {
        return {
            favList: [],
        }
    },
    computed: {
        uid: function() {
            return User.isLogin() ? User.getInfo().uid : 0;
        },
        storeFavList: function() {
            return this.$store.state.favList || [];
        },
    },
    watch: {
        storeFavList: {
            deep: true,
            immediate: true,
            handler() {
                 if (this.storeFavList.length) {
                    this.favList = this.storeFavList;
                } else if (localStorage.getItem("favList")) {
                    try {
                        const favList = localStorage.getItem("favList");
                        this.favList = JSON.parse(favList);
                    } catch(e) {
                        localStorage.setItem('favList', '')
                    }
                }
            }
        }
    },
    methods: {
        async getFavIcons() {
            let favList = [];
            let localFavList = localStorage.getItem("favList") || [];
            try {
                if (localFavList.length) {
                    localFavList = JSON.parse(localFavList);
                }
            } catch (e) {
                console.log(e)
                localFavList = []
            }
            if (this.uid) {
                // 从服务器读取
                await getMyFavIcons(this.client).then((data) => {
                    let serverValue = data;
                    if (serverValue) {
                        // 判断是否是旧版数据
                        if (serverValue.includes("[")) {
                            serverValue = serverValue.replace(/[\[\]"\ ]/g, "");
                        }
                        favList = serverValue.split(",");
                        favList = Array.from(new Set([...favList, ...localFavList]));
                    }
                });
            }

            localStorage.setItem("favList", JSON.stringify(Array.from(new Set([...favList, ...localFavList]))));
            this.$store.commit("storeFav", favList);
        },
        onEnd() {
            localStorage.setItem("favList", JSON.stringify(this.favList));
            this.$store.commit("storeFav", this.favList);
            const icons = this.favList.join(",");

            if (this.uid) {
                setMyFavIcons(icons,  this.client)
            }
        },
    },
    mounted() {
        this.getFavIcons();
    },
};
</script>

<style lang="less">
.m-icons-fav {
    padding: 10px;
    .m-title {
        padding: 10px;
        font-size: 14px;
        line-height: 16px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
    }
}
</style>
