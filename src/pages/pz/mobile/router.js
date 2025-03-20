import Vue from "vue";
import VueRouter from "vue-router";

// pages
import Home from "./index.vue";

Vue.use(VueRouter);

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

const routes = [
    {
        path: "/mine",
        name: "Mine",
        component: () => import("@/views/pz/mobile/Mine"),
    },
    {
        path: "/public",
        name: "Public",
        component: () => import("@/views/pz/mobile/Public"),
    },
    {
        path: "/detail/:id",
        name: "detail",
        component: () => import("@/views/pz/mobile/Detail"),
    }
]

const router = new VueRouter({
    mode : 'history',
    base : '/pz/mobile',
    routes,

});

// 重定向至我的配装
router.beforeEach((to, from, next) => {
    if (to.path === "/") {
        next({ path: "/mine" });
    }
    next();
})

export default router;
