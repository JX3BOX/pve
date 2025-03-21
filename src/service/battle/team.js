import { $team } from '@jx3box/jx3box-common/js/https.js';

const $ = $team({ mute: true });

export const getNewToken = () =>
    $.get('/api/team/new-token');

export const getBattle = (id) =>
    $.get(`/api/team/battle/${id}`)

export const getUploadToken = (filetype, gzip = true) =>
    $.get(`/api/team/battle/upload/${filetype}/sts-token`, { params: { gzip: gzip ? 1 : 0 } });

export const addBattle = (data) =>
    $.post(`/api/team/battle`, data)

export const updateBattle = (id, data) =>
    $.put(`/api/team/battle/${id}`, data)

export const deleteBattle = (id) =>
    $.delete(`/api/team/battle/${id}`)

export const getMyList = (params) =>
    $.get(`/api/team/battle/my-list`, { params })

export const getPublicList = ({ page = 1, type, subject, title, battle_id }) =>
    $.get(`/api/team/battle/public-list`, { params: { pageIndex: page, type, subject, title, battle_id } })

// 获取rank
export const getRank = (params) => {
    return $.get('/api/team/rank/events', { params })
}

// rank 绑定 battle
export const bindBattle = (battle_id, data) => {
    return $.put(`/api/team/battle/${battle_id}/rank-info`, data)
}

