import { $node, axios } from "@jx3box/jx3box-common/js/https";

const $ = $node();
// const $ = axios.create({
//     baseURL: "http://localhost:7002/api/node",
// });

export const getStat = async (client) => $.get(`/`, { params: { client } });

export const getNewest = async (type, params) => $.get(`/${type}/newest`, { params });

export const getResource = async (client, type, data, params) => {
    return $.post(`/resource/${client}/${type}`, data, {
        params,
    });
};

export const getResourceList = async (client, type, params) => {
    return $.get(`/resource/${client}/${type}/list`, { params });
};
