// 格式化 <text xx>
function extractTextContent(str){
    // 匹配分段
    const regex = /<Text>text=(.*?)font=(\d+).*?<\/text>/mgsiy
    let matches = [];
    let match;
    while (match = regex.exec(str)) {
        matches.push(match);
    }

    // 格式化分段
    let result = []
    for(let group of matches){
        result.push({
            font : ~~group[2],
            text : group[1].slice(1,-2).replace(/[\\n]/g,'')
        })
    }
    return result
}

export {
    extractTextContent
}