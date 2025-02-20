import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

const routes = [
    { name: "index", path: "/", component: () => import("@/views/bps/Index.vue") },
    { name: "highlights", path: "/highlights", component: () => import("@/views/bps/Highlights.vue") },
    { name: "post", path: "/:id(\\d+)", component: () => import("@/views/bps/Single.vue") },

    { name: "skill", path: "/skill", component: () => import("@/views/bps/Skill.vue") },

    { name: "kungfu", path: "/kungfu", component: () => import("@/views/bps/Kungfu.vue") },
    { name: "recipe", path: "/recipe", component: () => import("@/views/bps/Recipe.vue") },

    { name: "haste", path: "/haste", component: () => import("@/views/bps/Haste.vue") },
    { name: "dps", path: "/dps", component: () => import("@/views/bps/Dps.vue") },
    { name: "ladder", path: "/ladder", component: () => import("@/views/bps/Ladder.vue") },

    { name: "raw", path: "/raw", component: () => import("@/views/bps/Raw.vue") },
    { name: "lua", path: "/lua", component: () => import("@/views/bps/Lua.vue") },
    { name: "changelog", path: "/changelog", component: () => import("@/views/bps/ChangeLog.vue") },

    // { name: "collection", path: "/collection", component: () => import("@/views/bps/Collection.vue") },
    // { name: "collection-single", path: "/collection/:id?", component: () => import('@/components/collection/collection_single.vue') },

    // { name: "group", path: "/group", component: () => import("@/views/bps/Group.vue") },
    // { name: "story", path: "/story", component: () => import("@/views/bps/Story.vue") },
];

const router = new VueRouter({
    routes,
    mode: 'history',
    // base: '/bps'
});

export default router;
