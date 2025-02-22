import Vue from "vue";
import VueRouter from "vue-router";

const ManageOrg = () => import("@/views/team/org/ManageOrg.vue");
const ListOrg = () => import("@/views/team/org/ListOrg.vue");
const AddOrg = () => import("@/views/team/org/AddOrg.vue");
const EditOrg = () => import("@/views/team/org/EditOrg.vue");
const ViewOrg = () => import("@/views/team/org/ViewOrg.vue");
const VerifyOrg = () => import("@/views/team/org/VerifyOrg.vue");
const ViewMyOrg = () => import("@/views/team/org/ViewMyOrg.vue");

const BindRole = () => import("@/views/team/role/BindRole.vue");
const ListRole = () => import("@/views/team/role/ListRole.vue");
const AddRole = () => import("@/views/team/role/AddRole.vue");
const EditRole = () => import("@/views/team/role/EditRole.vue");
const ViewRole = () => import("@/views/team/role/ViewRole.vue");
const GroupRole = () => import("@/views/team/role/GroupRole.vue");

const ListMember = () => import("@/views/team/member/ListMember.vue");

const ManageDkp = () => import("@/views/team/dkp/ManageDkp.vue");
const MyDkp = () => import("@/views/team/dkp/MyDkp.vue");

const AddPlan = () => import("@/views/team/plan/AddPlan.vue");
const ListPlan = () => import("@/views/team/plan/ListPlan.vue");
const AllPlan = () => import("@/views/team/plan/AllPlan.vue");

const ListSnapshot = () => import("@/views/team/snapshot/ListSnapshot.vue");
const AddSnapshot = () => import("@/views/team/snapshot/AddSnapshot.vue");

const AddRaid = () => import("@/views/team/raid/AddRaid.vue");
const EditRaid = () => import("@/views/team/raid/EditRaid.vue");
const ManageRaid = () => import("@/views/team/raid/ManageRaid.vue");
const ListRaid = () => import("@/views/team/raid/ListRaid.vue");
const ViewRaid = () => import("@/views/team/raid/ViewRaid.vue");
const MyTeamRaid = () => import("@/views/team/raid/MyTeamRaid.vue");

const ApplyList = () => import("@/views/team/apply/ApplyList.vue");
const ApplySingle = () => import("@/views/team/apply/ApplySingle.vue");
const Battle = () => import("@/views/team/battle/index.vue");
const myBattle = () => import("@/views/team/battle/myBattle.vue");

Vue.use(VueRouter);

const routes = [
    { name: "index", path: "/", meta: { isPublic: true }, component: ListOrg },
    { name: "manage_org", path: "/org/manage", meta: { isPublic: false }, component: ManageOrg },
    { name: "list_org", path: "/org/list", meta: { isPublic: true }, component: ListOrg },
    { name: "add_org", path: "/org/add", meta: { isPublic: false }, component: AddOrg },
    { name: "edit_org", path: "/org/edit/:id", meta: { isPublic: false }, component: EditOrg },
    { name: "view_org", path: "/org/:id", meta: { isPublic: true }, component: ViewOrg },
    { name: "verify_org", path: "/org/verify/:id", meta: { isPublic: false }, component: VerifyOrg },
    { name: "view_my_org", path: "/my/org/:id", meta: { isPublic: false }, component: ViewMyOrg },

    { name: "bind_role", path: "/role/bind", meta: { isPublic: false }, component: BindRole },
    { name: "list_role", path: "/role/manage", meta: { isPublic: false }, component: ListRole },
    { name: "add_role", path: "/role/add", meta: { isPublic: false }, component: AddRole },
    { name: "edit_role", path: "/role/edit/:id", meta: { isPublic: false }, component: EditRole },
    { name: "group_role", path: "/role/group", meta: { isPublic: false }, component: GroupRole },
    { name: "view_role", path: "/role/:id", meta: { isPublic: false }, component: ViewRole },

    { name: "list_member", path: "/member/list/:tab?", meta: { isPublic: false }, component: ListMember },

    { name: "manage_dkp", path: "/dkp/manage", meta: { isPublic: false }, component: ManageDkp },
    { name: "my_dkp", path: "/dkp/my", meta: { isPublic: false }, component: MyDkp },

    { name: "add_plan", path: "/plan/add", meta: { isPublic: false }, component: AddPlan },
    { name: "edit_plan", path: "/plan/edit/:id", meta: { isPublic: false }, component: AddPlan },
    { name: "list_plan", path: "/plan/list", meta: { isPublic: false }, component: ListPlan },
    { name: "all_plan", path: "/plan/:id/all", meta: { isPublic: false }, component: AllPlan },

    { name: "list_snapshot", path: "/snapshot/list", meta: { isPublic: false }, component: ListSnapshot },
    { name: "add_snapshot", path: "/snapshot/add", meta: { isPublic: false }, component: AddSnapshot },
    { name: "edit_snapshot", path: "/snapshot/edit/:id", meta: { isPublic: false }, component: AddSnapshot },

    { name: "add_raid", path: "/raid/add", meta: { isPublic: false }, component: AddRaid },
    { name: "edit_raid", path: "/raid/edit/:id", meta: { isPublic: false }, component: EditRaid },
    { name: "manage_raid", path: "/raid/manage", meta: { isPublic: false }, component: ManageRaid },
    { name: "my_raid", path: "/raid/my", meta: { isPublic: false }, component: MyTeamRaid },
    { name: "list_raid", path: "/raid/list", meta: { isPublic: true }, component: ListRaid },
    { name: "view_raid", path: "/raid/:id", meta: { isPublic: true }, component: ViewRaid },

    { name: "apply_list", path: "/apply/list", meta: { isPublic: false }, component: ApplyList },
    { name: "apply_single", path: "/apply/:id", meta: { isPublic: false }, component: ApplySingle },

    { name: "Battle", path: "/battle", meta: { isPublic: false }, component: Battle },
    { name: "myBattle", path: "/myBattle", meta: { isPublic: false }, component: myBattle },
];

const router = new VueRouter({
    mode: "history",
    base: "/team",
    routes,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
// Avoided redundant navigation to current location 报错
export default router;
