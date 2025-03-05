import { __ossRoot, __Links, __imgPath, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import props from "@/assets/data/dbm/item_payload_props.json";
import dbmap from "@/assets/data/dbm/type_database_map.json";

function getIcon(iconid) {
    if (iconid) {
        return __iconPath + "icon/" + iconid + ".png";
    } else {
        return __iconPath + "icon/" + "undefined" + ".png";
    }
}

function hasProp(type, prop) {
    return props[type].includes(prop);
}

function getImage(type, val) {
    return `${__imgPath}image/${type}/${val}.png`;
}

function getDBlink(type, id, level) {
    let url = "https://www.jx3box.com/app/database/?";
    url += `type=${dbmap[type]}&`;
    url += `query=${id}&`;
    if (level !== "" && level !== undefined && level !== null) {
        url += `&level=${level}`;
    }
    return url;
}
const loginURL = __Links.account.login + "?redirect=" + location.href;

export { getIcon, hasProp, getImage, getDBlink, loginURL };
