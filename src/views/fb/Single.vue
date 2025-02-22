<template>
    <SingleLayout>
        <single :id="id"></single>
    </SingleLayout>
</template>

<script>
import single from "@/components/fb/single/single.vue";
import { getAppIcon, getAppID } from "@jx3box/jx3box-common/js/utils";
import SingleLayout from "@/layouts/fb/SingleLayout.vue";
export default {
    name: "Single",
    props: [],
    components: {
        single,
        SingleLayout,
    },
    data: function() {
        return {
            id: getAppID(),
        };
    },
    computed: {
        user_id: function () {
            return this.$store.state.user_id;
        },
    },
    methods: { getAppIcon },
}
</script>
