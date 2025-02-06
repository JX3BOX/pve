import { $cms } from "@jx3box/jx3box-common/js/https";

export const star = async (data) => $cms().post(`/api/cms/app/database/star`, data);

export const starCancel = async (id) => $cms().delete(`/api/cms/app/database/star/${id}`);

export const starList = async (type) => $cms().get(`/api/cms/app/database/star/${type}`);

export const getUsers = async (ids) => {
    const res = await $cms().get(`/api/cms/user/list/info`, {
        params: {
            list: ids,
        },
    });
    return res.data.data;
};

export const getRefCount = async (params) => await $cms().get(`/api/cms/dbm/source`, { params });

export const getDbmItemList = async (params) => await $cms().get(`/api/cms/dbm/item`, { params });

export const getDatabaseFields = async () => await $cms().get(`/api/cms/app/database/field`);

export const getBreadcrumbs = async (key) => $cms().get(`/api/cms/breadcrumb`, { params: { key } });

export const getConfigBanner = (params) => {
    return $cms().get(`api/cms/config/banner`, {
        params,
    });
}
