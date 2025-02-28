<template>
    <div class="m-single-side">
        <PostTopic v-if="id" type="tool" :id="~~id" />
        <PostDirectory id="directory" />
        <PostVersion :post="post"></PostVersion>
        <PostCollection v-if="showSideCollection" :store="collection_data" />
    </div>
</template>

<script>
import PostDirectory from "@jx3box/jx3box-common-ui/src/single/PostDirectory.vue";
import PostVersion from "@jx3box/jx3box-common-ui/src/single/PostVersion.vue";
import PostCollection from "@jx3box/jx3box-common-ui/src/single/PostCollection.vue";
import PostTopic from "@jx3box/jx3box-common-ui/src/single/PostTopic.vue";
export default {
    name: "single_side",
    props: ["id", "post"],
    data: function () {
        return {};
    },
    components: {
        PostDirectory,
        PostCollection,
        PostTopic,
        PostVersion,
    },
    computed: {
        hasDirectory: function () {
            return this.$store.state.extend?.directory;
        },
        showSideCollection: function () {
            let hasCollection = this.$store.state.post?.post_collection;
            let foldTopCollection = !this.$store.state.post?.collection_collapse;
            return hasCollection && foldTopCollection;
        },
        collection_data: function () {
            return this.$store.state.extend?.collection_data;
        },
    },
};
</script>

<style lang="less">
.m-single-side {
    padding: 20px;
}
.m-single-directory {
    .mb(20px);
}
</style>
