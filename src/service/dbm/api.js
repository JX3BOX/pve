import { axios } from "@jx3box/jx3box-common/js/https";

const getCookie = (name) => {
    let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
};

export const $dbm = axios.create({
    withCredentials: true,
    baseURL: "https://dbm.jx3box.com",
    auth: {
        username: getCookie("season_token"),
        password: "next common request",
    },
});

export const $pull = axios.create({
    withCredentials: true,
    baseURL: "https://pull.jx3box.com",
    auth: {
        username: getCookie("season_token"),
        password: "next common request",
    },
});
