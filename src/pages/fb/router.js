import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("@/views/fb/Index.vue");
// const Drop = () => import('@/views/fb/Drop.vue')
const DropV2 = () => import("@/views/fb/Drop_v2.vue");
const JMap = () => import("@/views/fb/Map.vue");
const Npc = () => import("@/views/fb/Npc.vue");
const Skill = () => import("@/views/fb/Skill.vue");
const Attr = () => import("@/views/fb/Attr.vue");
const Story = () => import("@/views/fb/Story.vue");
const Cj = () => import("@/views/fb/Cj.vue");
// const Rank = () => import('@/views/fb/Rank.vue')
const Gem = () => import("@/views/fb/Gem.vue");
const Lua = () => import("@/views/fb/Lua.vue");
const Bahuang = () => import("@/views/fb/Bahuang.vue");
const Baizhan = () => import("@/views/fb/Baizhan.vue");
const ListLayout = () => import("@/layouts/fb/ListLayout.vue");
const Post = () => import("@/views/fb/Single.vue");

Vue.use(VueRouter);

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

const routes = [
    // default layout
    {
        name: "list",
        component: ListLayout,
        path: "/",
        redirect: {
            name: "index",
        },
        children: [
            { name: "index", path: "", component: Index, meta: { withoutRight: false } },
            { name: "drop", path: "/drop", component: DropV2, meta: { withoutRight: true } },
            { name: "drop_v2", path: "/drop_v2", component: DropV2, meta: { withoutRight: true } },
            { name: "map", path: "/map", component: JMap, meta: { withoutRight: true } },
            { name: "npc", path: "/npc", component: Npc, meta: { withoutRight: true } },
            { name: "skill", path: "/skill", component: Skill, meta: { withoutRight: true } },
            { name: "attr", path: "/attr", component: Attr, meta: { withoutRight: true } },
            { name: "story", path: "/story", component: Story, meta: { withoutRight: true } },
            { name: "cj", path: "/cj", component: Cj, meta: { withoutRight: true } },
            // { name: "rank", path: "/rank", component: Rank, meta: { withoutRight: true } },
            { name: "gem", path: "/gem", component: Gem, meta: { withoutRight: true } },
            { name: "lua", path: "/lua", component: Lua, meta: { withoutRight: true } },
        ],
    },

    { name: "bahuang", path: "/bahuang", component: Bahuang },

    { name: "baizhan", path: "/baizhan", component: Baizhan },

    { name: "post", path: "/:id(\\d+)", component: Post },
];

const router = new VueRouter({
    routes,
    mode: "history",
    // base: "/fb",
});

export default router;
