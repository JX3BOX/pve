import { $team, $cms } from "@jx3box/jx3box-common/js/https.js";

export function getRank(achieveId, params) {
    return $team().get(`/api/team/race/achieve/` + achieveId + `/top100`, {
        params: params,
    });
}

export function getEvents(params) {
    return $team().get(`/api/team/rank/events`, {
        params: params,
    });
}

export function getActs(params) {
    return $cms().get(`/api/cms/team/raids?server=&search=&time=-1&per=20&is_public=1`, {
        params: params,
    });
}

export function getTeams(params) {
    return $team().get(`/api/team/public`, {
        params: params,
    });
}



import axios from "axios";
import { __next } from "@jx3box/jx3box-common/data/jx3box.json";
const API = __next + "api/fb/rank/";

export function getDateRank(id) {
    let limit = 100;
    if (id == 7529) limit = 66;
    return axios.get(API + id, {
        params: {
            pageSize: limit,
        },
    });
}

export function getMiniRank(id) {
    return axios.get(API + id, {
        params: {
            pageSize: 10,
        },
    });
}

