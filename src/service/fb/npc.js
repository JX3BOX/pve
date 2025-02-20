import { $node } from "@jx3box/jx3box-common/js/https";
const $ = $node();

// import axios from "axios";
// const $ = axios.create({
//     baseURL: "http://localhost:7002/",
// });

function getMapNpc(fb, params) {
    return $.get("/npc/map/" + fb, {
        params: params,
    });
}

function getBoss(map_id, client = "std") {
    return $.get("/fb/boss", {
        params: {
            MapID: map_id,
            client: client,
        },
    });
}

export { getMapNpc, getBoss };
