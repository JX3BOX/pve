<template>
    <div class="m-wallpaper">
        <el-tabs v-model="active" type="card">
            <el-tab-pane v-for="item in wallpaper" :key="item.name" :name="item.name" :label="item.label">
                <div class="m-wallpaper-box">
                    <figure class="m-wallpaper-item" v-for="img in getPreviewImgs(item)" :key="img.name">
                        <el-image :src="getThumbnail(img.url)">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-loading"></i>
                            </div>
                        </el-image>
                        <figcaption class="u-img-name">{{ img.name }}</figcaption>
                        <div class="u-sizes">
                            <a
                                class="u-size-item"
                                :href="getImgUrl(item.name, size, img.name)"
                                v-for="size in item.sizes"
                                :key="size"
                                target="_blank"
                                title="点击查看原图"
                                >{{ format(size) }}</a
                            >
                        </div>
                    </figure>
                </div>
                <div class="m-design-author">
                    <b>Designed By :</b>
                    <div class="u-authors" v-if="authors && authors.length">
                        <a
                            class="u-author"
                            target="_blank"
                            :href="authorLink(item.ID)"
                            v-for="(item, i) in authors"
                            :key="i"
                        >
                            <img :src="showAvatar(item.user_avatar)" :alt="item.display_name" />
                            {{ item.display_name }}
                        </a>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { getThumbnail, authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getUsers } from "@/service/tool/cms";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "wallpaper",
    data() {
        return {
            wallpaper: null,
            active: "",
            authors: [],
        };
    },
    computed: {
        type() {
            const type = this.wallpaper.find((item) => item.name == this.active)?.type;
            console.log(type)
            return type || "jpg";
        },
    },
    watch: {
        active() {
            this.loadAuthors();
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        authorLink,
        showAvatar,
        getThumbnail(url) {
            // 16:9 缩略图 360x202
            return getThumbnail(url, [360, 202]);
        },
        getImgUrl(name, size, imgName) {
            return `${__cdn}design/wallpaper/${name}/${size}/${imgName}.${this.type}`;
        },
        getPreviewImgs(item) {
            return item.schools?.map((school) => {
                return {
                    url: this.getImgUrl(item.name, item.sizes[0], school, this.type),
                    name: school,
                };
            });
        },
        format(size) {
            return size?.replace("x", "×");
        },
        async loadAuthors() {
            if (!this.wallpaper) return;
            const item = this.wallpaper.find((item) => item.name == this.active);
            history.replaceState(null, "", `?tab=${item.name}`);
            const ids = item.authors?.join(",");
            const res = await getUsers(ids);
            this.authors = res;
        },
        load() {
            getBreadcrumb("app-design-wallpaper").then((res) => {
                this.wallpaper = JSON.parse(res || "[]");
                if (this.$route.query.tab) {
                    const foundItem = this.wallpaper.find((item) => item.name.includes(this.$route.query.tab));
                    this.active = foundItem?.name ?? this.wallpaper[0]?.name;
                } else {
                    this.active = this.wallpaper[0]?.name;
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/design/wallpaper.less";
</style>
