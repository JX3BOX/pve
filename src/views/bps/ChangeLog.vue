<template>
    <ListLayout>
        <SkillChange></SkillChange>
    </ListLayout>
</template>

<script>
import ListLayout from "@/layouts/bps/ListLayout.vue";
import SkillChange from "@/components/bps/skill-change.vue";
export default {
    name: "ChangeLog",
    components: {
        ListLayout,
        SkillChange
    }
}
</script>
