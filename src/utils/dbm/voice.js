import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/dist/ffmpeg.min.js";
import { pubPrefix } from "../../../setting.json";
import store from "@/pages/dbm/store.js";

const ffmpeg = createFFmpeg({
    mainName: "main",
    corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js", // 启用单线程版本，不使用SharedArrayBuffer
});

// 判断文件是否为音频文件
export function isAudioFile(file) {
    const audio = new Audio();
    const canPlay = audio.canPlayType(file.type);
    return canPlay === "maybe" || canPlay === "probably";
}

// 将文件转换为ogg格式，返回转换后的文件二进制数据
export async function convertToOgg(file) {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    ffmpeg.FS("writeFile", file.name, await fetchFile(file));
    await ffmpeg.run("-i", file.name, "-acodec", "libvorbis", "output.ogg");
    const data = ffmpeg.FS("readFile", "output.ogg");
    const newFile = new File([data.buffer], "output.ogg", { type: "audio/ogg" });

    await ffmpeg.exit(); // 退出ffmpeg
    // 指定为ogg格式,文件名称为output.ogg
    return newFile;
}

// 渲染音频文件，添加前缀
export function getAudioLink(url) {
    if (url.startsWith("http") || url.startsWith("https")) return url;
    return pubPrefix + url;
}

// 根据slug获取slug的描述
export function getSlugName(slug) {
    if (!slug) return;
    if (slug.startsWith("VO:") || slug.startsWith("VC:")) {
        slug = slug.substring(3);
    }
    const slugs = store.state.slugs;
    for (let group of slugs) {
        for (let _slug of group.children) {
            if (_slug.value == slug) {
                return [group.label, _slug.label];
            }
        }
    }
    return [undefined, undefined];
}
