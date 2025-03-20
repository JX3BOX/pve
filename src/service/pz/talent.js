import axios from "axios";
import { __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import { $cms } from "@jx3box/jx3box-common/js/https";

function getLatestTalentVersion() {
    return axios.get(__ossRoot + "data/qixue/index.json").then((res) => {
        return res.data && res.data[0].version;
    });
}

function getUserTalents(opt) {
    return $cms().get(`/api/cms/app/talents`, {
        params: opt,
    });
}

function getUserTalent(id) {
    return $cms().get(`/api/cms/app/talent/${id}`);
}

function addTalent(data) {
    return $cms().post("/api/cms/app/talent", data);
}

function getDefaultTalent(mount, client){
    return $cms().get(`/api/cms/bps/talent/pz_${mount}_${client}`)
}

export { getLatestTalentVersion, getUserTalents, getUserTalent, addTalent, getDefaultTalent };
