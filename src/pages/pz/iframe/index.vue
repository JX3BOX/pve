<template>
    <a class="c-pz-iframe" :class="mode" :href="url" :target="target" v-loading="loading">
        <Horizontal v-if="mode === 'horizontal'" :schema="schema" />
        <Vertical :schema="schema" v-else />
    </a>
</template>

<script>
import Horizontal from "@/components/pz/canvas/Horizontal.vue";
import Vertical from "@/components/pz/canvas/Vertical.vue";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getPz } from "@/service/pz/schema.js";

import { jbbb2schema } from "@/utils/pz/iframe.js";
import { Base64 } from "js-base64";
export default {
    name: "PzIframe",
    components: {
        Horizontal,
        Vertical,
    },
    data: function () {
        return {
            schema: null,
            done: false,
            loading: false,
        };
    },
    computed: {
        params() {
            return new URLSearchParams(location.search);
        },
        id: function () {
            return this.params?.get("id");
        },
        mode: function () {
            return this.params?.get("mode") || "horizontal";
        },
        code: function () {
            return this.params?.get("code");
        },
        disableClick: function () {
            return this.params?.get("disableClick");
        },
        url: function () {
            return this.disableClick ? "javascript:;" : getLink("pz", this.id);
        },
        target: function () {
            return this.disableClick ? "_self" : "_blank";
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadPz();
                }
            },
        },
        code: {
            immediate: true,
            handler(val) {
                if (val && !this.id) {
                    let code = Base64.decode(val);
                    try {
                        code = JSON.parse(code);
                        jbbb2schema(code).then((schema) => {
                            console.log(schema);
                            this.schema = schema;
                            this.done = true;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
        },
        done: function (val) {
            if (val && window.parent) {
                window.parent.postMessage({ id: this.id, mode: this.mode, schema: this.schema }, "*");
            }
        },
    },
    methods: {
        loadPz: function () {
            this.loading = true;
            getPz(this.id)
                .then((res) => {
                    const data = res?.data?.data;
                    // XXX: 有些数据content可能经过多次转义（暂时不知道哪来的，先适配一下）
                    if (data) {
                        if (typeof data.content === "string") data.content = JSON.parse(data.content);
                        if (typeof data.snapshot === "string") data.snapshot = JSON.parse(data.snapshot);
                        if (typeof data.talent_code === "string") data.talent_code = JSON.parse(data.talent_code);
                        if (typeof data.talent_pzcode === "string") data.talent_pzcode = JSON.parse(data.talent_pzcode);
                    }
                    this.schema = data;
                    this.done = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
html{
    width:100%;
    height: 100%;
    overflow: auto;
}
body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}
.c-pz-iframe {
    .db;
    &.horizontal {
        .size(1280px,720px);
        &>div {
            height: 100%;
            width: 100%;
        }
    }
    &.vertical {
        .size(750px,3468px);
        &>div {
            height: 100%;
            width: 100%;
        }
    }
    text-align: center;
    .m-overview-save {
        .none;
    }
}
</style>
