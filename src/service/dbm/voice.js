import { $pull } from "./api";
import { $next } from "@jx3box/jx3box-common/js/https";

// 上传语音
export function uploadVoice(data) {
    return $pull.post("/api/dbm/voice/upload", data)
}

// 用户获取语音包的语音列表
export function getMyVoiceList(id) {
    return $next().get(`/api/next2/dbm/vpk/my/${id}/voices`);
}


// 用户清空语音包下的符合某个slug的所有语音条目】
export function clearVpkVoice(id, slug) {
    return $next().delete(`/api/next2/dbm/vpk/my/${id}/slug`, {
        params: {
            slug
        }
    });
}

// ========= 公共 ============
// 获取语音包的语音列表
export function getVoiceList(id) {
    return $next().get(`/api/next2/dbm/vpk/public/${id}/voices`);
}

// ========== 管理 ===========
// 获取所有的语音
export function getAllVoiceList(params) {
    return $next().get(`/api/next2/dbm/vpk/manager/voices`, {
        params
    });
}
// 获取语音包的语音列表
export function getManageVoiceList(id) {
    return $next().get(`/api/next2/dbm/vpk/manager/${id}/voices`);
}

// 审核一条语音
export function auditVoice(id, voice_id, action) {
    return $next().put(`/api/next2/dbm/vpk/manager/${id}/voices/${voice_id}/opt/${action}`)
}

// 删除一条语音
export function deleteVoice(id, voice_id) {
    return $next().delete(`/api/next2/dbm/vpk/manager/${id}/voices/${voice_id}`)
}
