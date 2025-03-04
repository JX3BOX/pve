import forceids from "@jx3box/jx3box-data/data/xf/forceid.json";
function getTeamArray(data) {
    let list = [];

    let namelist = data.NAME_LIST;
    let forcelist = data.FORCE_LIST;
    for (let item in forcelist) {
        // 过滤NPC
        if (forcelist[item]) {
            let _ = {
                id: item,
                name: namelist[item],
                forceID: forcelist[item],
                forceName: forceids[forcelist[item]],
            };
            list.push(_);
        }
    }

    return list;
}

function getTeamMap(data) {
    let list = {};

    let namelist = data.NAME_LIST;
    let forcelist = data.FORCE_LIST;
    for (let item in forcelist) {
        // 过滤NPC
        if (forcelist[item]) {
            list[item] = {
                id: item,
                name: namelist[item],
                forceID: forcelist[item],
                forceName: forceids[forcelist[item]],
            };
        }
    }

    return list;
}

export { getTeamArray, getTeamMap };
