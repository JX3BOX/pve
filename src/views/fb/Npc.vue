<template>
    <div class="v-npc">
        <v1></v1>
        <!-- <v1 v-if="isAdmin"></v1> -->
        <!-- <v2 v-else></v2> -->
    </div>
</template>

<script>
import v1 from "./Npc_v1.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "NPC",
    props: [],
    components: {
        v1,
        // v2
    },
    data: function() {
        return {
            isAdmin: User.isAdmin(),
            // isAdmin : true
        };
    },
    computed: {},
    methods: {},
    filters: {},
    created: function() {},
    mounted: function() {},
};
</script>
