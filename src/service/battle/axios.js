import { $helper, $cms, $next, $team } from "@jx3box/jx3box-common/js/https.js";
import axios from "axios";
import { __server, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
const $ = axios.create({
    baseURL: __server,
    withCredentials: true,
});

const $img = axios.create({
    baseURL: __imgPath,
});

export { $, axios, $img, $helper, $cms, $next, $team };
