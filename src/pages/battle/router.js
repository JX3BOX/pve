import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("@/views/battle/Index.vue");
const Upload = () => import("@/views/battle/Upload.vue");
const Combat = () => import("@/views/battle/Combat.vue");
const PublicList = () => import("@/views/battle/PublicList.vue");
const Mine = () => import("@/views/battle/Mine.vue");
const Preferences = () => import("@/views/battle/Preferences.vue");
const JBA = () => import("@/views/battle/JBA.vue");

const Add = () => import("@/views/battle/Add.vue");
const Search = () => import("@/views/battle/Search.vue");

Vue.use(VueRouter);

// 兼容外链
if(location.pathname.startsWith('/battle/view')){
    const id = location.pathname.split('/').pop();
    location.href = location.origin + '/battle/#/combat/' + id;
}

const routes = [
    { name: "root", path: "/", redirect: "/index" },
    { name: "index", path: "/index", component: Index },
    { name: "upload", path: "/upload", component: Upload },
    { name: "combat", path: `/combat/:id?`, component: Combat },

    { name: "public", path: "/public", component: PublicList },
    { name: "mine", path: "/mine", component: Mine },
    { name: "preferences", path: "/preferences", component: Preferences },
    { name: "jba", path: "/jba", component: JBA },

    { name: "add", path: "/add/:type", component: Add },
    { name: "search", path: "/search", component: Search },
];

const router = new VueRouter({
    // mode: "history",
    // base: '/team',
    routes,
});

export default router;
