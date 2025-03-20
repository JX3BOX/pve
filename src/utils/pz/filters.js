// 全局过滤器
import dayjs from "dayjs";
import { __imgPath, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { authorLink, showAvatar, iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";

const formatTime = (val) => {
    return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
};

const showMountIcon = (val) => {
    let id = val || 0;
    return __imgPath + "image/xf/" + id + ".png";
};

const showMountName = (val) => {
    const xf = Object.values(xf_map).find((x) => x.id == val);
    return xf.name;
};

const showItemIcon = (val) => {
    return iconLink(val);
};

export { formatTime, showMountIcon, authorLink, showMountName, showAvatar, showItemIcon, iconLink, getLink };
