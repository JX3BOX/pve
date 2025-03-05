/**
 * 这个文件的函数负责文件解析, 从jcl文件到logs变量的过程
 */
import { parseJx3dat } from 'luat2json';
import { JCL_TYPE } from './jclType';
import { getLogTime } from './analysis'

/**
 * 传入一条JCL日志的type，以及最后面的那个luatable，解析为包含键值对的对象
 * @param {number} type
 * @param {string} detail
 * @returns {Object}
 */
function parseDetail(type, detail) {
    detail = parseJx3dat(`return ${detail}`);
    let parseFunc = JCL_TYPE[type]?.[1];
    return parseFunc ? parseFunc(detail) : detail;
}

/**
 * 传入一条JCL日志记录的字符串，解析为一个对象，包括最基本的信息以及日志的详细信息
 * {f: 帧, s: 时间(秒), m: 毫秒, t: 类型, d: 详细信息}
 * @param {*} data
 * @returns {object[]}
 */
function parseSingleLog(data) {
    if (data === '') return;
    let [_, LFC, time, micro, type, detail] = data.split('\t');
    let typeSignal;
    [LFC, time, micro, typeSignal] = [LFC, time, micro, type].map(x => parseInt(x));
    let parsedDetail = parseDetail(typeSignal, detail);
    return {
        f: LFC,
        s: time,
        m: micro,
        t: typeSignal,
        d: parsedDetail,
    }
}

/**
 * 全局过滤器，有些日志不需要展示
 */
const sysMsgBlackList = [
    '不经意间触发奇遇',
    'GM公告',
    '因为获得帮会天工树涅槃分支',
    '恭喜大侠，获得 [赞·群龙之首]',
    '身上的装备耐久度降低',
    /“.+”.+在.+对“.+”.+释放了传说中的烟花【.+】/,
    /“.+”.+在.+对“.+”.+使用了传说中的【.+】/,
    /“.+”.+在.+释放了传说中的烟花【.+】/,
    /触发奇遇【.+】/
];
function globalLogFilter(log) {
    if (log.t === 18) {
        let content = log.d.c;
        for (let sb of sysMsgBlackList) {
            if (typeof sb === 'string' && content.includes(sb)) return false;
            if (typeof sb === 'object' && sb.test(content)) return false;
        }
    }
    if (log.t === 13) {
        if (log.d.i === 0) return false;
    }
    return true;
}

/**
 * 传入文件的字符串内容，解析为一个对象数组，数组中每一个元素为JCL文件的一条记录
 * 或许是O(n)
 * @param {*} file_string
 * @returns {object[]}
 */
export function* parseFile(file_string) {
    let lines = file_string.split('\n');
    let length = lines.length;
    let logs = [];
    let start;
    for (let i = 0; i < length; i++) {
        if (i % 1000 === 0) yield i / length * 100;
        let line = lines[i];
        if (!line) continue; //空行跳过
        let log = parseSingleLog(line);
        if (!globalLogFilter(log)) continue;  //不符合全局过滤器跳过
        if (log.t === 1 && log.d.i) {  // 找到开始标记，设定开始时间，并且修改之前的时间
            start = getLogTime(log);
            logs = logs.map((r) => {
                r.f = r.f - start.f;
                r.s = r.s - start.s;
                r.m = r.m - start.m;
                return r;
            });
        }
        if (start) {   // 如果已经找到开始标记，就把时间减去开始时间
            log.f = log.f - start.f;
            log.s = log.s - start.s;
            log.m = log.m - start.m;
        }
        logs.push(log);
    }
    return { logs, start };
}
