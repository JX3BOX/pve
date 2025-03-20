import { $cms, $helper } from "@jx3box/jx3box-common/js/https";

const addPz = (data) => {
    return $cms().post(`/api/cms/app/pz`, data);
};

const removePz = (id) => {
    return $cms().delete(`/api/cms/app/pz/${id}`);
};

function getPz(id) {
    return $cms({ mute: true }).get(`/api/cms/app/pz/${id}`);
}

function updatePz(id, data) {
    return $cms().put(`/api/cms/app/pz/${id}`, data);
}

function managePz(id, data) {
    return $cms().put(`/api/cms/app/pz/${id}/admin`, data);
}

function setStar(id ,data){
    return $cms().put(`/api/cms/manage/app/pz/${id}/star`, data)
}

function getMyPzList(params) {
    return $cms().get(`/api/cms/app/pz/my`, {
        params: params,
    });
}

function getPublicPzList(params) {
    return $cms().get(`/api/cms/app/pz`, {
        params: params,
    });
}

function getGlobalSetting(){
    return $cms().get('/api/cms/app/pz/setting')
}

function saveGlobalSetting(data){
    return $cms().post('/api/cms/app/pz/setting', data)
}

function setSticky(id, data){
    return $cms().put(`/api/cms/app/pz/${id}/sticky`, data)
}

function getHasteRecommend(mount, client = 'std'){
    return $cms().get(`/api/cms/app/pz/haste/${mount}`, {
        params: {
            client
        }
    })
}

// 自荐
function selfRecommend(id){
    return $cms({ mute: true }).post(`/api/cms/app/pz/self-rec`, {
        pz_id: id
    })
}

// 获取自荐详情
function getSelfRecommend(id){
    return $cms({ mute: true }).get(`/api/cms/app/pz/self-rec/pz-id/${id}`)
}

// 管理员更新配装
function updatePzAdmin(id, data){
    return $cms().put(`/api/cms/manage/app/pz/${id}`, data)
}

export { addPz, removePz, getPz, updatePz, getMyPzList, getPublicPzList, managePz, getGlobalSetting, saveGlobalSetting, setSticky, getHasteRecommend, selfRecommend, getSelfRecommend, setStar, updatePzAdmin };
