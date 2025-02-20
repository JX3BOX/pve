import axios from 'axios'
const __team = 'https://team.api.jx3box.com/'

function getEvents() {
    return axios.get(__team + "api/team/rank/events", {
        // params: params,
    });
}

function getTeams() {
    return axios.get(__team + "api/team/public", {
        params: {
            recruit: 1, //有招募的
            pageSize : 10,
            tag : '可教学'
        },
    });
}

export { getEvents, getTeams };
