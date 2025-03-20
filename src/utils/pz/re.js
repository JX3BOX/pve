export const extractString = (regex, str) => {
    // 匹配分段
    let matches = [];
    let match;
    while (match = regex.exec(str)) {
        matches.push(match);
    }

    return matches
}