<template>
    <div class="v-skill">
        <v1 v-if="hasRight && client == 'std'"></v1>
        <v2 v-else></v2>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import v1 from "./Skill_v1.vue";
import v2 from "./Skill_v2.vue";
export default {
    name: "Skill",
    props: [],
    components: {
        v1,
        v2,
    },
    data: function () {
        return {
            isAdmin: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        isSuperAuthor: function () {
            return this.$store.state.isSuperAuthor;
        },
        hasRight: function () {
            return this.isAdmin || this.isSuperAuthor;
        },
    },
    mounted: function () {
        this.isAdmin = User.isAdmin();
    },
};
</script>
