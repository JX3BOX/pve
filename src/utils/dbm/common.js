import JX3BOX_URL from "@jx3box/jx3box-common/data/jx3box.json";
const { __ossRoot, __Links, __imgPath, __iconPath } = JX3BOX_URL;

export function getImage(type, val) {
    return `${__imgPath}image/${type}/${val}.png`;
}

export function getLoginUrl() {
    return "/account/login?redirect=" + location.href;
}

export function hashObject(obj) {
    if (obj === null || typeof obj !== "object") {
        return String(obj);
    }
    const keys = Object.keys(obj).sort();
    let hashString = "";
    for (const key of keys) {
        const value = obj[key];
        hashString += key + hashObject(value);
    }
    return hashString;
}
export const sleep = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));
