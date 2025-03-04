import { cloneDeep } from "lodash";
import defaultItemPayload from "./default_item_payload.json";

const defaultItem = {
    id: 0,
    type: "BUFF",
    map: [],
    payload: cloneDeep(defaultItemPayload),
    status: 0,
    title: "",
    desc: "",

    // 前端设定，不会被保存
    allMap: false,
    keepLR: true,
    defaultProps: ["szName", "nIcon", "nFrame", "aFocus"],
    defaultPropsStatus: {
        szName: false,
        nIcon: false,
        nFrame: false,
        aFocus: false,
    },
};

export default defaultItem;
