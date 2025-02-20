import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

import { compatibilityRoute } from "@/utils/compatibility.js";

const routes = [
    // userdata
    {
        name: "userdata",
        path: "/userdata",
        component: () => import("@/views/tool/UserData.vue"),
        meta: {
            type: "userdata",
        },
    },
    // jx3dat
    {
        name: "jx3dat",
        path: "/jx3dat",
        component: () => import("@/views/tool/Jx3Dat.vue"),
        meta: {
            type: "jx3dat",
        },
    },
    {
        name: "jx3dat_single",
        path: "/jx3dat/:id",
        component: () => import("@/views/tool/Jx3DatSingle.vue"),
    },
    {
        name: "jx3dat_rank",
        path: "/jx3dat/rank",
        component: () => import("@/views/tool/Jx3DatRank.vue"),
    },
    // app
    {
        name: "app",
        path: "/app",
        component: () => import("@/views/tool/App.vue"),
    },
    {
        name: "database",
        path: "/app/database",
        component: () => import("@/views/tool/Database.vue"),
    },
    {
        name: "design",
        path: "/app/design",
        component: () => import("@/views/tool/Design.vue"),
        redirect: {
            name: "icon",
        },
        children: [
            {
                name: "emotion",
                path: "/app/design/emotion",
                component: () => import("@/components/tool/design/emotion.vue"),
            },
            {
                name: "icon",
                path: "/app/design/icon",
                component: () => import("@/components/tool/design/icons.vue"),
                meta: {
                    hasRight: true,
                },
            },
            {
                name: "map",
                path: "/app/design/map",
                component: () => import("@/components/tool/design/map.vue"),
            },
            {
                name: "vector",
                path: "/app/design/vector",
                component: () => import("@/components/tool/design/vector.vue"),
            },
            {
                name: "wallpaper",
                path: "/app/design/wallpaper",
                component: () => import("@/components/tool/design/wallpaper.vue"),
            },
        ],
    },
    {
        name: "translator",
        path: "/app/translator",
        component: () => import("@/views/tool/Translator.vue"),
    },
    // tool
    {
        name: "index",
        path: "",
        component: () => import("@/views/tool/Tool.vue"),
        meta: {
            type: "tool",
        },
    },
    {
        name: "tool_single",
        path: "/:id",
        component: () => import("@/views/tool/Single.vue"),
    },
];

const router = new VueRouter({
    routes,
    mode: "history",
    // base: "/tool",
});

router.beforeEach((to, from, next) => {
    const path = compatibilityRoute(to.path);

    if (path !== to.path) {
        // console.log('compatibilityRoute', path)
        location.replace(path);
    } else {
        // console.log('next', path , to.path)
        next();
    }
});

export default router;
