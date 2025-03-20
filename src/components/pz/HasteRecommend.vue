<template>
    <el-popover
        popper-class="m-haste-pop"
        trigger="manual"
        v-model="showPop"
        placement="right"
        :visible-arrow="false"
        :open-delay="50"
    >
        <div class="m-pop-content" v-if="data && data.html">
            <div class="u-attr-name">推荐加速</div>
            <div class="u-haste-content" v-html="data.html"></div>
        </div>
        <i
            class="el-icon-info"
            slot="reference"
            @mouseover="taggle"
            @mouseleave="taggle"
        ></i>
    </el-popover>
</template>

<script>
import { getHasteRecommend } from "@/service/pz/schema";
export default {
    name: "HasteRecommend",
    props: {
        client: {
            type: String,
            default: "std",
        },
        mount: {
            type: [String, Number],
            default: "",
        },
    },
    data() {
        return {
            data: {},

            showPop: false,
        };
    },
    computed: {},
    watch: {
        showPop(val) {
            if (val) this.init();
        },
    },
    methods: {
        taggle() {
            this.showPop = !this.showPop;
        },
        loadData() {
            getHasteRecommend(this.mount, this.client).then((res) => {
                this.data = res?.data?.data

                // 将加速推荐保存至本地sessionStorage
                sessionStorage.setItem(
                    `haste-${this.mount}`,
                    JSON.stringify(this.data)
                );
            });
        },
        init() {
            try {
                const hasteData = sessionStorage.getItem(`haste-${this.mount}`);
                if (hasteData) {
                    this.data = JSON.parse(hasteData);
                } else {
                    this.loadData();
                }
            } catch (e) {
                this.loadData();
            }
        },
    },
};
</script>

<style lang="less">
.m-haste-pop {
    padding: 10px;
    background-color: lighten(@q_background, 0.5);
    color: #fff;
    .fz(13px,20px);
    .u-attr-name {
        color: @q_score_orange;
    }
    p {
        margin: 0;
    }
}
</style>
