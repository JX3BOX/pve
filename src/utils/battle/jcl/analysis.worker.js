import { parseFile } from '@/utils/battle/jcl/parse.js';
import { analysis } from '@/utils/battle/jcl/analysis.js';
import { getResourceFromApi } from '@/utils/battle/jcl/resource';


// 在子线程向主线程传递进度信息
const updateStatus = function (desc, status, processing) {
    postMessage({
        type: 'statusUpdated',
        data: { desc, status, processing }
    })
}
// 在子线程向主线程传递结果
const updateResultData = function (data) {
    let response = {
        type: 'result',
        data
    }
    postMessage(response)
}

onmessage = async function (e) {
    // raw原始文件 -> logs数组
    let raw = e.data;
    updateStatus('构建事件列表', 0);
    let parser = parseFile(raw);
    let parseResult;
    while (true) {
        parseResult = parser.next();
        if (parseResult.done) {
            parseResult = parseResult.value;
            break;
        } else {
            updateStatus('构建事件列表', 0, 25 + parseResult.value * 0.25);
        }
    }
    let { logs, start } = parseResult;
    updateStatus('构建事件列表', 1, 40);

    updateStatus('战斗详情分析', 0);
    let analyser = analysis(logs, start);
    let result;
    while (true) {
        result = analyser.next();
        if (result.done) {
            result = result.value;
            break;
        } else {
            updateStatus('战斗详情分析', 0, 50 + result.value * 0.25);
        }
    }
    updateStatus('战斗详情分析', 1, 75);

    updateStatus('获取展示用资源', 0);
    let resources = await getResourceFromApi(result.resourceList, result.client);
    result.resources = resources;
    delete result.resourceList;
    updateStatus('获取展示用资源', 1, 90);
    updateStatus('整理结果', 0);
    updateResultData(result);
    close();
}
