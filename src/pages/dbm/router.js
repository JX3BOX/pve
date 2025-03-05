import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
    { name: "index", path: "/", component: () => import("@/views/dbm/Index.vue"), meta: { title: "在线构建" } },

    // 元数据
    { name: "item", path: "/item", redirect: "/item/list" },
    { name: "item_list", path: "/item/list", component: () => import("@/views/dbm/item/ItemList.vue"), meta: { with_sticky: true } },
    { name: "item_mine", path: "/item/mine", component: () => import("@/views/dbm/item/ItemMine.vue"), meta: { auth: true, with_sticky: true } },

    { name: "item_create", path: "/item/create", component: () => import("@/views/dbm/item/ItemEdit.vue"), meta: { auth: true } },
    { name: "item_edit", path: "/item/edit/:id", component: () => import("@/views/dbm/item/ItemEdit.vue"), meta: { auth: true } },

    { name: "item_detail", path: "/item/:id", component: () => import("@/views/dbm/item/ItemDetail.vue"), meta: { is_single: true } },
    { name: "item_detail_raw", path: "/item/:id/raw", component: () => import("@/views/dbm/item/ItemDetail.vue"), meta: { auth: true } },


    // 数据包
    { name: "pkg", path: "/pkg", redirect: "/pkg/list" },
    { name: "pkg_detail", path: "/pkg/:id(\\d+)", component: () => import("@/views/dbm/pkg/PkgDetail.vue"), meta: { is_single: true } },
    { name: "pkg_detail_raw", path: "/pkg/:id(\\d+)/raw", component: () => import("@/views/dbm/pkg/PkgDetail.vue") },

    { name: "pkg_list", path: "/pkg/list", component: () => import("@/views/dbm/pkg/PkgList.vue"), meta: { with_sticky: true } },
    { name: "pkg_mine", path: "/pkg/mine", component: () => import("@/views/dbm/pkg/PkgMine.vue"), meta: { auth: true, with_sticky: true } },

    { name: "pkg_create", path: "/pkg/create", component: () => import("@/views/dbm/pkg/PkgCreate.vue") },
    { name: "pkg_edit", path: "/pkg/edit/:id", component: () => import("@/views/dbm/pkg/PkgEdit.vue") },

    // 语音包
    { name: "vpk", path: "/vpk", redirect: "/vpk/list", meta: { title: "语音包" } },

    { name: "public_vpk", path: "/vpk/list", component: () => import("@/views/dbm/vpk/PublicVpk.vue"), meta: { title: "语音包", with_sticky: true } },
    { name: "my_vpk", path: "/vpk/mine", component: () => import("@/views/dbm/vpk/MyVpk.vue"), meta: { title: "我的语音包", auth: true, with_sticky: true } },

    { name: "create_vpk", path: "/vpk/build", component: () => import("@/views/dbm/vpk/CreateVpk.vue"), meta: { title: "构建语音包", auth: true } },
    { name: "update_vpk", path: "/vpk/build/:id", component: () => import("@/views/dbm/vpk/UpdateVpk.vue"), meta: { title: "更新语音包", auth: true } },
    { name: "manage_vpk", path: "/vpk/manage", component: () => import("@/views/dbm/vpk/Manage.vue"), meta: { title: "管理语音包", auth: true } },

    { name: "public_view_vpk", path: "/vpk/:id", component: () => import("@/views/dbm/vpk/ViewVpk.vue"), meta: { is_single: true } },
    { name: "mine_view_vpk", path: '/vpk/mine/:id', component: () => import("@/views/dbm/vpk/ViewVpk.vue"), meta: { is_single: true, auth: true } },
    { name: "manage_view_vpk", path: "/vpk/manage/:id", component: () => import("@/views/dbm/vpk/ViewVpk.vue"), meta: { is_single: true, auth: true } },

    // 目标监控
    { name: "target_create", path: "/target/create", component: () => import("@/views/dbm/target/TargetCreate.vue"), meta: { auth: true } },
    { name: "target_edit", path: "/target/edit/:id", component: () => import("@/views/dbm/target/TargetEdit.vue"), meta: { auth: true } },

    // 场景标记
    { name: "mark_create", path: "/mark/create", component: () => import("@/views/dbm/mark/MarkCreate.vue"), meta: { auth: true } },
    { name: "mark_edit", path: "/mark/edit/:id", component: () => import("@/views/dbm/mark/MarkEdit.vue"), meta: { auth: true } },

    // 扩展
    { name: "pkg_parse", path: "/pkg/parse", component: () => import("@/views/dbm/extend/PkgParse.vue"), meta: { auth: true } },
    { name: "pkg_rank", path: "/pkg/rank", component: () => import("@/views/dbm/extend/PkgRank.vue") },
    { name: "utils", path: "/utils", component: () => import("@/views/dbm/extend/Utils.vue") },
];

const router = new VueRouter({
    routes,
    mode: "history",
    base: "/dbm",
});

export default router;
