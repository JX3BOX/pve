import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("@/views/pz/Index.vue");
const Public = () => import("@/views/pz/Public.vue");
const Mine = () => import("@/views/pz/Mine.vue");
const Detail = () => import("@/views/pz/Detail.vue");
const Setting = () => import("@/views/pz/Setting.vue");
const Compare = () => import("@/views/pz/Compare.vue");

Vue.use(VueRouter);

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

const routes = [
    { name: "index", path: "/", component: Index, meta: { isPublic: true } },
    { name: "public", path: "/public", component: Public, meta: { isPublic: true } },
    { name: "mine", path: "/mine", component: Mine, meta: { isPublic: false } },
    { name: "view", path: "/view/:id", component: Detail, meta: { isPublic: true } },
    { name: "edit", path: "/edit/:id", component: Detail, meta: { isPublic: false } },
    { name: "setting", path: "/setting", component: Setting, meta: { isPublic: false } },
    { name: "compare", path: "/compare", component: Compare, meta: { isPublic: false } },
];

const router = new VueRouter({
    mode : 'history',
    base : '/pz',
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes('/#')) {
        next(to.fullPath.replace('/#', ''));
    }
    next()
});

export default router;
