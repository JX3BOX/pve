import { $node, axios } from "@jx3box/jx3box-common/js/https";
const $ = $node();
// const $ = axios.create({
//     baseURL: 'http://localhost:7002/',
// })

const getEnhance = (query) => {
    return $.get(`/enchant/primary`, {
        params: query,
    });
};

const getStones = (query) => {
    return $.get(`/enchant/stone`, {
        params: query,
    });
};

const getEquips = (subtype, query) => {
    return $.get(`/equip/${subtype}`, {
        params: query,
    });
};

const getSet = (id, query) => {
    return $.get(`/equip/set/${id}`, {
        params: query,
    });
};

const getEquipDrop = (tab_type, id, client) => {
    return $.get(`/equip/${tab_type}/${id}`, {
        params: {
            client,
        },
    });
};

const getResource = (client, type, ids) => {
    return $.post(`/resource/${client}/${type}`, {
        ids,
    });
};

export { getEnhance, getStones, getEquips, getSet, getEquipDrop, getResource };
