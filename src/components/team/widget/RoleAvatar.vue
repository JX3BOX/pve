<template>
    <img :src="showAvatar(mount, body_type)" />
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "roleAvatar",
    props: ["mount", "body_type"],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        showAvatar: function (mount, body_type) {
            return (
                __cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png"
            );
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>
