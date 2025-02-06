<template>
    <div class="m-single-meta m-tool-meta" v-if="hasFile">
        <div class="m-single-meta__main">
            <div class="m-meta-item" v-for="item in data" :key="item.name">
                <template v-if="item.mode == 1 || item.mode == undefined">
                    <span class="u-name"><i class="el-icon-box"></i>{{ item.name || "未命名文件" }}</span>
                    <span class="u-remark">{{ item.remark || "" }}</span>
                    <span
                        class="u-download-btn el-button el-button--primary el-button--small"
                        target="_blank"
                        v-show="item.file"
                        @click="onDownload(item)"
                    >
                        <i class="el-icon-download"></i>
                        <span>本地下载</span>
                    </span>
                </template>
                <template v-if="item.mode == 0">
                    <span class="u-name"><i class="el-icon-box"></i>{{ item.name || "未命名文件" }}</span>
                    <span class="u-remark">{{ item.remark || "" }}</span>
                    <a
                        class="u-download-btn el-button el-button--primary el-button--small"
                        :href="item.file"
                        target="_blank"
                        v-show="item.file"
                    >
                        <i class="el-icon-link"></i>
                        <span>前往下载</span>
                    </a>
                </template>
            </div>
        </div>
        <div class="m-single-meta__side">
            <!-- 文首警告 -->
            <div class="m-single-notice">
                <div class="m-notice-header">
                    <i class="el-icon-warning"></i>
                    <span class="u-header">特别说明</span>
                    <a class="u-report" :href="feedback" target="_blank">快捷举报</a>
                </div>
                <div class="m-description">
                    <div class="m-content" v-html="nl2br(content)">
                    </div>
                    <img class="u-description-bg" src="@/assets/img/tool/single/box_deyi.svg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getBreadcrumb } from '@jx3box/jx3box-common/js/api_misc';
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import FileSaver from "file-saver"
export default {
    name: "single_meta",
    props: {
        post: {
            type: Object,
            default: () => {},
        },
    },
    data: function () {
        return {
            feedback: "/feedback?refer=" + encodeURIComponent(window.location.href),
            content: "",
        };
    },
    computed: {
        isTool: function () {
            return this.post?.post_subtype == "1";
        },
        data() {
            const data = this.post?.post_meta?.data || [];
            if (data && this.post?.post_meta?.down) {
                data.map((item) => {
                    item.file = this.post?.post_meta?.down;
                });
            }
            return data;
        },
        hasFile(){
            return this.post.post_subtype == '1' || this.post.post_subtype == '2'
        }
    },
    mounted() {
        this.loadToolDesc();
    },
    methods: {
        loadToolDesc() {
            try {
                const tips = sessionStorage.getItem("tool_download_warning");
                if (tips) {
                    this.content = tips;
                    return;
                }
                getBreadcrumb("tool_download_warning").then((res) => {
                    this.content = res
                    sessionStorage.setItem(
                        "tool_download_warning",
                        res
                    );
                });
            } catch (err) {}
        },
        nl2br(str) {
            return str.replace(/[\r\n]/g, "<br>");
        },
        onDownload(item) {
            const url = resolveImagePath(item.file);

            FileSaver.saveAs(url, item.file.split("/").pop());
        },
    },
};
</script>
