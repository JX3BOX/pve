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

export function getWeekStartDate() {
    // 获取当前日期
    var today = new Date();

    // 获取当前日期是一周中的第几天，其中周日为0，周一为1，以此类推
    var day = today.getDay();

    // 计算与周一的时间差（毫秒）
    var timeDiff = today.getTime() - (day - 1) * 24 * 60 * 60 * 1000;

    // 创建新的日期对象，表示当前周一
    var monday = new Date(timeDiff);
    return dateFormat(monday);
}

export function getWeekEndDate() {
    // 获取当前日期
    var today = new Date();

    // 获取当前日期是一周中的第几天，其中周日为0，周一为1，以此类推
    var day = today.getDay();

    // 计算与下一个周日的时间差（毫秒）
    var timeDiff = (7 - day) * 24 * 60 * 60 * 1000;

    // 创建新的日期对象，表示当前周日
    var sunday = new Date(today.getTime() + timeDiff);

    // 输出当前周日的日期和时间
    return dateFormat(sunday);
}

export function polish(val) {
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
