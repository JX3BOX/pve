import { $node } from "@jx3box/jx3box-common/js/https";
const $ = $node()

// import axios from "axios";
// const $ = axios.create({
//     baseURL: "http://localhost:7002/",
// });

function getInfo(name, client = "std") {
    return $.get("/fb/info", {
        params: {
            name: name,
            client: client,
        },
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

function getBossSkills(skills,client='std'){
    return $.get('/fb/skills',{
        params : {
            skills,
            client
        }
    })
}

export { getInfo, getBoss,getBossSkills };
