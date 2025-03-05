<template>
    <fold-block class="m-item-lua" name="lua" desc="参考源码" icon="el-icon-document" :fold="true">
        <Prism language="lua" :code="luaTable">{{ luaTable }}</Prism>
        <el-button plain icon="el-icon-document-copy" class="u-lua-copy" @click="copy"></el-button>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import { toLuaTable } from "@/utils/dbm/item.js";
import { Message } from "element-ui";
import "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-lua.min.js";
import Prism from "vue-prism-component";

export default {
    name: "ItemLua",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        luaTable: "return {}",
    }),
    components: {
        Prism,
        FoldBlock,
    },
    watch: {
        item: {
            deep: true,
            immediate: true,
            handler: function (item) {
                this.luaTable = toLuaTable(item);
            },
        },
    },
    methods: {
        copy() {
            navigator.clipboard.writeText(this.luaTable);
            Message.success("已复制到剪贴板");
        },
    },
};
</script>

<style lang="less">
.m-item-lua {
    .mt(60px);
    .pr;

    .u-lua-copy {
        .pa;
        right: 10px;
        top: 36px;
        opacity: 0.5;
        .size(48px);
        padding: 0;
        transition: all 0.2s ease-in-out;
        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
