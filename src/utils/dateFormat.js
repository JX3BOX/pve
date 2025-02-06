import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

/**
 * 简单的日期格式化
 *
 * @param {*} dt Date实例
 * @param {object} opt polished:是否补齐两位,separator:连接分隔符
 */
function dateFormat(dt, separator = "-", polished = true) {
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let date = dt.getDate();
    let str = polished
        ? `${year}${separator}${polish(month)}${separator}${polish(date)}`
        : `${year}${separator}${month}${separator}${date}`;
    return str;
}

function polish(val) {
    return val < 10 ? "0" + val : val;
}

export function showRecently(val) {
    return dayjs(val).fromNow();
}

export function showDate(val) {
    return dayjs(val).format("YYYY-MM-DD");
}

export function showTime(val) {
    return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
}

export default dateFormat;
