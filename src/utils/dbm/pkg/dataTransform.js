import { isArray } from "lodash";

export const Array2String = (keys, data) => {
    if (!data) return;
    let result = {};
    keys.forEach((key) => {
        if (isArray(data[key])) result[key] = data[key].join(",");
    });
    return result;
};

export const String2Array = (keys, data) => {
    let result = {};
    keys.forEach((key) => {
        result[key] = data[key].split(",");
    });
    return result;
};
