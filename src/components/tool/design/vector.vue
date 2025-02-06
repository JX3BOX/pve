<template>
    <div class="m-vector">
        <el-tabs v-model="active" type="card">
            <el-tab-pane v-for="item in vector" :key="item.name" :label="item.label" :name="item.name" lazy>
                <div class="m-vector-box">
                    <figure class="m-vector-item" v-for="img in getPreviewImgs(item)" :key="img.name">
                        <el-image class="u-img" fit="fill" :src="img.url"></el-image>
                        <figcaption class="u-img-name">{{ img.name }}</figcaption>
                        <a
                            class="u-download el-button el-button--default is-plain is-round"
                            :href="getImageUrl(item.name, img.id)"
                            target="_blank"
                            title="点击下载"
                            ><i class="el-icon-download"></i><span>Download</span></a
                        >
                    </figure>
                </div>
                <div class="m-design-author">
                    <b>Designed By : </b>
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
import { vector } from "@/assets/data/tool/design/vector";
import { getThumbnail, authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getUsers } from "@/service/tool/cms";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "DesignVector",
    props: [],
    components: {},
    data: function () {
        return {
            active: "",

            vector: cloneDeep(vector),
            authors: [],
        };
    },
    computed: {},
    watch: {
        vector: {
            deep: true,
            immediate: true,
            handler() {
                this.active = this.vector[0]?.name;
            },
        },
        active: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadAuthors();
                }
            },
        },
    },
    methods: {
        authorLink,
        showAvatar,
        getThumbnail(url) {
            return getThumbnail(url, [120, 120]);
        },
        getPreviewImgs(item) {
            const data = item.data.map((img) => {
                return {
                    name: img.name,
                    url: this.getImageUrl(item.name, img.id),
                    id: img.id,
                };
            });
            return data;
        },
        getImageUrl(name, img) {
            return `${__cdn}design/vector/${name}/${img}.svg`;
        },
        async loadAuthors() {
            const item = this.vector.find((item) => item.name == this.active);
            const ids = item.authors?.join(",");
            const res = await getUsers(ids);
            this.authors = res;
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/tool/design/vector.less";
</style>
