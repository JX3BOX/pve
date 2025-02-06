import axios from "axios";
import JX3BOX_URL from "@jx3box/jx3box-common/data/jx3box.json";
const { __server, __imgPath } = JX3BOX_URL;

const $ = axios.create({
    baseURL: __server,
    withCredentials: true,
});

const $img = axios.create({
    baseURL: __imgPath,
});


// 获取appjson
const getAppJson = async () => {
    let res = await $img.get("/logo/app.json");
    return res.data;
};

export { $, $img, getAppJson };
