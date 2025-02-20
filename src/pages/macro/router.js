import Vue from "vue";
import VueRouter from "vue-router";
import DefaultLayout from "@/layouts/macro/ListLayout.vue";
import SingleLayout from "@/layouts/macro/SingleLayout.vue";

Vue.use(VueRouter);

const routes = [

    // 列表
    {
        name: "list",
        path: "/",
        component: DefaultLayout,
        redirect: {
            name: 'index'
        },
        children: [
            {
                name: "index",
                path: "",
                component: () => import("@/views/macro/Index.vue"),
            },
            {
                name: "bucket",
                path: "/bucket",
                component: () => import("@/views/macro/Bucket.vue"),
            },
            {
                name: "fav",
                path: "/fav",
                component: () => import("@/views/macro/Fav.vue"),
            },
            {
                name: "landspace",
                path: "/landspace",
                component: () => import("@/views/macro/Landspace.vue"),
            },
            {
                name: "rank",
                path: "/rank",
                component: () => import("@/views/macro/Rank.vue"),
            },
        ]
    },

    // 详情
    {
        name: "post",
        path: "/:id(\\d+)",
        component: SingleLayout,
        redirect: {
            name: 'detail'
        },
        children: [
            {
                name: "detail",
                path: "",
                component: () => import("@/views/macro/Single.vue"),
            }
        ]
    },

    // 应用
    {
        name: "macroeditor",
        path: "/macroeditor",
        component: () => import("@/views/macro/MacroEditor.vue")
    },
    {
        name: "talent",
        path: "/talent",
        component: () => import("@/views/macro/Talent.vue")
    },
    {
        name: "talent2",
        path: "/talent2",
        component: () => import("@/views/macro/Talent2.vue")
    },
    {
        name: "meridians",
        path: "/meridians",
        component: () => import("@/views/macro/Meridians.vue")
    },
];

const router = new VueRouter({
    routes,
    mode: 'history',
    // base: '/macro'
});

export default router;
