import { $node } from "@jx3box/jx3box-common/js/https";
const $ = $node();

// import axios from "axios";
// const $ = axios.create({
//     baseURL: "http://localhost:7002/",
// });

function getBoss(map_id, client = "std") {
    return $.get("/fb/boss", {
        params: {
            MapID: map_id,
            client: client,
        },
    });
}

function getDrop(bossindex, client = "std") {
    return $.get("/fb/drop/" + bossindex, {
        params: {
            client: client,
        },
    })
}

function getDropV2(mapid, params) {
    return $.get(`/fb/drop/v2/${mapid}`, {
        params: params
    })
}

function getResource(type, client, data) {
    return $.post(`/resource/${client}/${type}`, data)
}

export { getDrop, getBoss, getDropV2, getResource };
