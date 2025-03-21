import { $cms } from "@jx3box/jx3box-common/js/https";

function publishData(data) {
    return $cms().post(`/api/cms/battle`, data);
}

function getMyData(page) {
    return $cms().get(`/api/cms/battles/my`, {
        params: {
            page,
        },
    });
}

function delData(id) {
    return $cms().delete(`/api/cms/battle/${id}`);
}

function updateData(id, data) {
    return $cms().put(`/api/cms/battle/${id}`, data);
}

export { publishData, getMyData, delData, updateData };
