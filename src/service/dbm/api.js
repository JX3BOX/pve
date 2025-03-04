import { axios } from "@jx3box/jx3box-common/js/https";

const getCookie = (name) => {
    let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
}

export const $dbm = axios.create({
    withCredentials: true,
    baseURL: process.env.NODE_ENV === "production" ? 'https://dbm.jx3box.com' : "/",
    // 获取cookie中的season_token
    // headers: {
    //     Authorization: "Bearer " + getCookie("season_token"),
    // }
    auth: {
        username: getCookie("season_token"),
        password: "next common request"
    }
});

export const $pull = axios.create({
    withCredentials: true,
    baseURL: process.env.NODE_ENV === "production" ? 'https://pull.jx3box.com' : "/",
    // 获取cookie中的season_token
    // headers: {
    //     Authorization: "Bearer " + getCookie("season_token"),
    // }
    auth: {
        username: getCookie("season_token"),
        password: "next common request"
    }
})
