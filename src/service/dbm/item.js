import { $cms } from "@jx3box/jx3box-common/js/https";
const $ = $cms();

// 元数据
export const getItem = (id) => $.get(`/api/cms/dbm/item/${id}`);
export const getItemMine = (params) => $.get(`/api/cms/dbm/item/mine`, { params });
export const getExternalItem = (params) => $.get(`/api/cms/dbm/item/external`, { params });
export const getItemList = (params) => $.get("/api/cms/dbm/item", { params });
export const getForkItemList = (id, params) => $.get(`/api/cms/dbm/item/${id}/fork`, { params });
export const createItem = (data) => $.post("/api/cms/dbm/item", data);
export const bulkCreateItem = (data) => $.post("/api/cms/dbm/item/bulk", data);
export const forkItem = (id) => $.post(`/api/cms/dbm/item/${id}/fork`);
export const updateItem = (id, data) => $.put(`/api/cms/dbm/item/${id}`, data);
export const bulkUpdateItem = (ids, data) => $.put("/api/cms/dbm/item/bulk", { ids, data });
export const bulkUpdateItemByUUID = (data) => $.put("/api/cms/dbm/item/bulk/uuid", data);
export const deleteItem = (id) => $.delete(`/api/cms/dbm/item/${id}`);
export const bulkDeleteItem = (ids) => $.delete(`/api/cms/dbm/item`, { data: { ids } });
export const bulkDeleteItemByUUID = (uuids) => $.delete(`/api/cms/dbm/item/uuid`, { data: { uuids } });
export const getRawItem = (id) => $.get(`/api/cms/dbm/item/${id}/raw`);
export const clearItem = () => $.delete(`/api/cms/dbm/item/all`)

// 查找指定元数据的概要
export const getItemSummary = (params) => $.get(`/api/cms/dbm/checkout/item`, { params });

// 语音包
export const getVpk = (id) => $.get(`/vpk/${id}`);

// ============= 管理 ===================
/**
 * 更新元数据
 *
 * @param {*} item_id
 * @param {*} data
 */
export const manageUpdateItem = (item_id, data) => $cms().put(`/api/cms/manage/dbm/item/${item_id}`, data);

/**
 * 删除元数据
 *
 * @param {*} item_id
 */
export const manageDeleteItem = (item_id) => $cms().delete(`/api/cms/manage/dbm/item/${item_id}`);
