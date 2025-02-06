import { __ossRoot, __Links, __imgPath, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";

export function getImage(type, val) {
    return `${__imgPath}image/${type}/${val}.png`;
}
