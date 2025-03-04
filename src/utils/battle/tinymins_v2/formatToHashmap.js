import struct from "@/assets/data/battle/struct";
import lodash from "lodash";
// 将json还原为语义化的map
function formatToHashmap(raw) {
    const data = {};
    for (let i in raw) {
        data[struct[i]] = raw[i];
    }
    return data;
}

export default formatToHashmap;
