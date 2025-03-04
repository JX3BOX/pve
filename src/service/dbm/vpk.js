import { $next } from "@jx3box/jx3box-common/js/https";
const $ = $next();

// ============== 用户 =================
// 构建语音包
export function createVpk(data) {
    return $.post("/api/next2/dbm/vpk/my", data);
}
// 删除语音包
export function deleteVpk(id) {
    return $.delete(`/api/next2/dbm/vpk/my/${id}`);
}
// 更新语音包
export function updateVpk(id, data, params) {
    return $.put(`/api/next2/dbm/vpk/my/${id}`, data, {
        params
    });
}
// 根据id获取自己的语音包
export function getMyVpk(id) {
    return $.get(`/api/next2/dbm/vpk/my/${id}`);
}
// 获取自己的语音包列表
export function getMyVpkList(params) {
    return $.get("/api/next2/dbm/vpk/my", {
        params,
    });
}

// ============== 管理员 =================
// 管理员获取语音包
export function getManageVpk(id) {
    return $.get(`/api/next2/dbm/vpk/manager/${id}`)
}
// 管理员更新语音包
export function updateManageVpk(id,data) {
    return $.put(`/api/next2/dbm/vpk/manager/${id}`,data)
}
// 管理员管理语音包
export function manageVpk(id, data) {
    return $.put(`/api/next2/dbm/vpk/manager/${id}/opt`, data)
}
// 管理员删除语音包
export function removeVpk(id) {
    return $.delete(`/api/next2/dbm/vpk/manager/${id}`)
}
// 管理员批量获取登记语音包列表
export function getManageVpkList(params) {
    return $.get("/api/next2/dbm/vpk/manager/list", {
        params
    })
}
// 管理员查看语音包
export function checkVpk(id) {
    return $.get(`/api/next2/dbm/vpk/manager/${id}`)
}
// 管理员审批语音包
export function approveVpk(id, { field, value, remark }) {
    return $.put(`/api/next2/dbm/vpk/manager/${id}/opt/${field}/${value}`, {
        remark
    })
}



// ============== 公共 =================
// 根据id获取语音包
export function getVpkById(id) {
    return $.get(`/api/next2/dbm/vpk/public/${id}`);
}
// 公共语音包
export function getVpk(uuid) {
    return $.get(`/api/next2/dbm/vpk/public/uuid/${uuid}`);
}
// 获取公共语音包列表
export function getPublicVpkList(params) {
    return $.get("/api/next2/dbm/vpk/public/list", {
        params
    })
}
// 获取语音包下载历史
export function getVpkDownloadHistory(id) {
    return $.get(`/api/next2/dbm/vpk/public/${id}/download-history`)
}
