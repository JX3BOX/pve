import { $node } from "@jx3box/jx3box-common/js/https.js";

const $ = $node({ mute: true });

export const getIndex = () => $.get("/");
export const getResource = (client, type, id) => $.get(`/resource/${client}/${type}.${id}`);
export const getResources = (client, type, ids, fields) => $.post(`/resources/${client}/${type}`, { ids, fields });
export const findResource = (client, type, name) => $.get(`/${type}/name/${name}`, { params: { client } });
export const getMapList = () => $.get("/map?fields=MapName,MapType,ID&no-page=1");
