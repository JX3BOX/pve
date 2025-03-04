import { $cms, $next } from "@jx3box/jx3box-common/js/https";
import axios from "axios";

const pull = process.env.NODE_ENV === "production" ? "https://pull.jx3box.com/" : "/"; //西山居服务器
// const pull = 'https://pull.jx3box.com/'
export const uploadHub = (formdata) => {
    return axios.post(pull + "api/plugins/my-team-mon/v2", formdata, {
        withCredentials: true,
    });
};

/**
 * 刷新缓存
 *
 * @param {*} key 订阅号
 */
export const refreshCache = (key) => {
    const base = process.env.NODE_ENV === "production" ? "https://pull.j3cx.com" : "http://preview.j3cx.jx3box.com";
    return axios.get(`${base}/api/dbm/feed`, {
        params: {
            key,
            _no_cache: 1,
        },
    });
};

/**
 * 数据包名称验证
 * @param {*} name
 * @returns
 */
export const checkName = (params) => {
    return $cms().get("/api/cms/dbm/checkout/pkg", { params });
};

/**
 * 发布数据包
 * @param {*} data
 * @returns
 */
export const publishPkg = (data) => {
    return $cms().post("/api/cms/dbm/pkg", data);
};

/**
 * 删除数据包
 * @param {*} id
 * @returns
 */
export const deletePkg = (id) => {
    return $cms().delete("/api/cms/dbm/pkg/" + id);
};

/**
 * 清空数据包
 * @param {*} id
 * @returns
 */
export const clearPkg = (id) => {
    return $cms().delete("/api/cms/dbm/pkg/" + id + "/empty");
};

/**
 * 获取数据包列表
 * @param {*} params
 * @returns
 */
export const getPkgList = (params) => {
    return $cms().get("/api/cms/dbm/pkg", { params });
};

/**
 * 首次创建查询
 * @param {*} params
 * @returns
 */
export const getFirstPkg = () => {
    return $cms().get("/api/cms/dbm/checkout/pkg/first");
};

/**
 * 查找指定用户包
 * @param {*} params
 * @returns
 */
export const getUserPkg = (params) => {
    return $cms().get("/api/cms/dbm/checkout/pkg/user", { params });
};

/**
 * 查找指定包的版本
 * @param {*} pkg_id 包id
 * @returns
 */
export const getPkgVersion = (pkg_id, params) => {
    return $cms().get(`/api/cms/dbm/checkout/pkg/${pkg_id}/version`, { params });
};

/**
 * 修改历史版本记录
 * @param {*} pkg_id
 * @param {*} uuid
 * @param {*} data
 */
export const updatePkgVersion = (pkg_id, uuid, data) => {
    return $cms().put(`/api/cms/dbm/pkg/${pkg_id}/history/${uuid}`, data);
};

/**
 * 删除历史版本记录
 * @param {*} pkg_id
 * @param {*} uuid
 */
export const deletePkgVersion = (pkg_id, uuid) => {
    return $cms().delete(`/api/cms/dbm/pkg/${pkg_id}/history/${uuid}`);
};

/**
 * 回档历史版本记录
 * @param {*} pkg_id
 * @param {*} uuid
 */
export const rollbackPkgVersion = (pkg_id, uuid) => {
    return $cms().put(`/api/cms/dbm/pkg/${pkg_id}/rollback/${uuid}`);
};

/**
 * 获取数据包
 * @param {*} pkg_id
 * @param {*} params
 * @returns
 */
export const getPkg = (pkg_id, params) => {
    return $cms().get(`/api/cms/dbm/pkg/${pkg_id}`, { params });
};

/**
 * 获取我的指定数据包
 * @param {*} pkg_id
 * @param {*} params
 * @returns
 */
export const getMyPkg = (pkg_id, params) => {
    return $cms().get(`/api/cms/dbm/pkg/${pkg_id}/raw`, { params });
};

/**
 * 更新数据包
 * @param {*} pkg_id
 * @param {*} data
 * @param {*} query
 * @returns
 */
export const updatePkg = (pkg_id, data, query) => {
    return $cms().put(`/api/cms/dbm/pkg/${pkg_id}`, data, {
        params: query,
    });
};

/**
 * 置顶自己的数据包
 * @param {*} pkg_id
 * @param {*} data
 * @returns
 */
export const topPkg = (pkg_id, data) => {
    return $cms().put(`/api/cms/dbm/pkg/${pkg_id}/patch`, data);
};

/**
 * 公开/私有自己的数据包
 * @param {*} pkg_id
 * @param {*} data
 * @returns
 */
export const setPkgStatus = (pkg_id, data) => {
    return $cms().put(`/api/cms/dbm/pkg/${pkg_id}/status`, data);
}

/**
 * 获取我的数据列表
 * @param {*} params
 * @returns
 */
export const getMyPkgList = (params) => {
    return $cms().get("/api/cms/dbm/pkg/mine", { params });
};

export const getPkgDependents = (pkg_id) => {
    return $cms().get(`/api/cms/dbm/build/pkg/${pkg_id}/dependents`);
}


/**
 * 获取候选列表 - items候选
 * @param {*} params
 * @returns
 */
export const getMyCandidateList = (params) => {
    return $cms().get("/api/cms/dbm/pkg/mine/to/items", { params });
};

/**
 * 获取候选列表 - modules候选
 * @param {*} params
 * @returns
 */
export const getMyModuleCandidateList = (params) => {
    return $cms().get("/api/cms/dbm/pkg/mine/to/modules", { params });
};

/**
 * 将元数据加入到数据包
 * @param {*} pkg_id
 * @param {*} item_id
 * @returns
 */
export const appendItemToPkg = (pkg_id, item_id) => {
    return $cms().post(`/api/cms/dbm/build/pkg/${pkg_id}/item/${item_id}`);
};

/**
 * 获取数据包中的元数据
 * @param {*} pkg_id
 * @param {*} ids
 * @returns
 */
export const getPkgItems = (pkg_id, params) => $cms().get(`/api/cms/dbm/build/pkg/${pkg_id}/items`, { params });

/**
 * 批量加入元数据
 * @param {*} pkg_id
 * @param {*} ids
 * @returns
 */
export const appendItemsToPkg = (pkg_id, ids) => $cms().post(`/api/cms/dbm/build/pkg/${pkg_id}/items`, ids);

/**
 * 批量加入元数据（通过uuid）
 * @param {*} pkg_id
 * @param {*} uuids
 * @returns
 */
export const appendItemsToPkgByUUID = (pkg_id, uuids) =>
    $cms().post(`/api/cms/dbm/build/pkg/${pkg_id}/items/uuid`, uuids);

/**
 * 移除数据包中的元数据
 * @param {*} pkg_id
 * @param {*} ids
 * @returns
 */
export const removeItemFromPkg = (pkg_id, ids) => {
    return $cms().delete(`/api/cms/dbm/build/pkg/${pkg_id}/items`, {
        data: { ids },
    });
};

/**
 * 移除数据包中的元数据（通过uuid）
 * @param {*} pkg_id
 * @param {*} ids
 * @returns
 */
export const removeItemFromPkgByUUID = (pkg_id, uuids) => {
    return $cms().delete(`/api/cms/dbm/build/pkg/${pkg_id}/items/uuid`, {
        data: { uuids },
    });
};

/**
 * 向数据包追加依赖包
 * @param {*} pkg_id
 * @param {*} data
 */
export const appendModuleToPkg = (pkg_id, data) => {
    return $cms().post(`/api/cms/dbm/build/pkg/${pkg_id}/modules`, data);
};

/**
 * 移除依赖包
 * @param {*} pkg_id
 * @param {*} ids
 */
export const removeModuleFromPkg = (pkg_id, ids) => {
    return $cms().delete(`/api/cms/dbm/build/pkg/${pkg_id}/modules`, {
        params: { ids },
    });
};

/**
 * 加载依赖列表
 * @param {*} pkg_id
 * @param {*} params
 * @returns
 */
export const getModuleList = (pkg_id, params) => {
    return $cms().get(`/api/cms/dbm/build/pkg/${pkg_id}/modules`, { params });
};

/**
 * 设置模块包
 * @param {*} pkg_id
 * @param {*} module_id
 * @param {*} data
 */
export const setModule = (pkg_id, module_id, data) => {
    return $cms().put(`/api/cms/dbm/build/pkg/${pkg_id}/module/${module_id}`, data);
};

/**
 * 获取指定的一批包的最新版本与依赖（用于批量构建）
 * @param {*} ids
 */
export const getBatchBuildInfo = (ids) => {
    return $cms().get(`/api/cms/dbm/pkg/build/batch`, { params: { ids } });
};

/**
 * 下载模块
 * @param {*} pkg_id
 * @param {*} module_id
 * @param {*} data
 */
export const downloadPkg = (file) => axios.get(file, { responseType: "arraybuffer" });

/**
 * 调试用 更新指数
 * @param {*} pkg_id
 * @param {*} module_id
 * @param {*} data
 */
export const pushSource = (data) => $cms().put(`/api/cms/manage/dbm/source/increase/bulk`, data);

// ============= 管理 =================
/**
 * 更新数据包
 *
 * @param {*} pkg_id
 * @param {*} data
 */
export const manageUpdatePkg = (pkg_id, data) => $cms().put(`/api/cms/manage/dbm/pkg/${pkg_id}`, data);

/**
 * 删除数据包
 *
 * @param {*} pkg_id
 */
export const manageDeletePkg = (pkg_id) => $cms().delete(`/api/cms/manage/dbm/pkg/${pkg_id}`);

// ============= Trending =================

/**
 * 获取多个数据包的下载趋势
 * @param {*} pkg_ids
 */
export const getPkgListTrend = (pkg_ids) => {
    if (pkg_ids.length == 0) {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    return $next().get(`/api/next2/dbm/pkg/list/trend`, { params: { id: pkg_ids } });
};

/**
 * 获取单个数据包的下载趋势
 * @param {*} pkg_id
 */
export const getPkgTrend = (pkg_id) => $next().get(`/api/next2/dbm/pkg/item/${pkg_id}/trend`);

// 获取排行榜
export function getPkgRank(category, params) {
    return $next().get(`/api/next2/dbm/pkg/rank/${category}`, { params });
}
