<template>
    <div class="card">
        <template v-if="item">
            <div class="card-header">
                <div class="card-header-left">
                    <!-- <el-popover placement="top" width="400" trigger="manual" v-model="dialogVisible">
                        <div style="display: flex; flex-wrap: wrap">
                            <div class="icon" v-for="item in xfmaps" :key="item.id">
                                <img
                                    :src="`https://img.jx3box.com/image/xf/${item.id}.png`"
                                    alt=""
                                    @click="handleReplace(item.id)"
                                />
                            </div>
                        </div>
                        <img
                            :src="`https://img.jx3box.com/image/xf/${item.id}.png`"
                            alt=""
                            class="icon"
                            slot="reference"
                            @click="dialogVisible = !dialogVisible"
                        />
                    </el-popover> -->
                </div>
                <div class="card-header-right">
                    {{ item.game_role.length > 6 ? item.game_role.slice(0, 6) + "..." : item.game_role }}
                </div>
            </div>
            <div class="card-fotter">{{ item.remark.length > 8 ? item.remark.slice(0, 8) + "..." : item.remark }}</div>
        </template>
        <template v-else>
            <div class="null-text">虚位以待</div>
        </template>
    </div>
</template>
<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

export default {
    name: "Card",
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            dialogVisible: false,
        };
    },
    computed: {
        xfmaps() {
            delete xfmap["山居剑意"];
            delete xfmap["通用"];
            return xfmap;
        },
    },
    methods: {
        handleReplace(id) {
            this.dialogVisible = false;
            // this.$emit("replace", id);
        },
    },
};
</script>
<style lang="less" scoped>
.card {
    width: 150px;
    height: 66px;
    box-sizing: border-box;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(89, 89, 89, 1) 0%, rgba(5, 5, 5, 1) 49.85%);
    display: flex;
    flex-wrap: wrap;
    .card-header {
        width: 150px;
        height: 44px;
        border-radius: 8px;
        background: rgba(229, 229, 229, 1);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 4px;
        .card-header-left {
            width: 36px;
            height: 36px;
            margin-right: 4px;
        }
        .card-header-right {
            height: 21px;
            font-size: 14px;
            font-weight: 700;
            line-height: 21px;
            color: rgba(56, 56, 56, 1);
        }
    }
    .card-fotter {
        width: 150px;
        height: 22px;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
    }
    .null-text {
        width: 56px;
        height: 21px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 21px;
        color: rgba(255, 255, 255, 0.5);
        align-self: center;
        margin: 0 auto;
    }
}
</style>
