<template>
    <div class="help-list">
        <div class="nav-bar">
            <div :class="{ pve: true, active: active?.category === 'pve', button: true }">PVE</div>
            <div :class="{ pvp: true, active: active?.category === 'pvp', button: true }">PVP</div>
            <div :class="{ pvx: true, active: active?.category === 'pvx', button: true }">PVX</div>
            <div :class="{ other: true, active: active?.category === 'other', button: true }">其他</div>
        </div>
        <div class="help-detail">
            <div class="help-detail-item" v-for="(item, index) in helpList" :key="index" @mouseenter="active = item">
                <div :class="{ 'help-detail-item-title': true, active: active?.triggerKeyword === item.triggerKeyword }">{{ item.remark || item.triggerKeyword }}</div>
                <div class="hr"></div>
                <div :class="{ 'help-detail-item-content': true, active: active?.triggerKeyword === item.triggerKeyword }" @click="copy(item)">{{ item.triggerKeyword }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAllCommandList } from "@/service/team/qqbot";

export default {
    name: "HelpList",
    data() {
        return {
            active: null,
            helpList: [],
        };
    },
    mounted() {
        getAllCommandList().then((res) => {
            this.helpList = res.data.data.list;
        });
    },
    methods: {
        async copy(item) {
            try {
                await this.$copyText(item.triggerKeyword);
                this.$message.success("复制成功");
            } catch (error) {
                this.$message.error("复制失败");
            }
        },
    },
};
</script>

<style lang="less" scoped>
.help-list {
    margin-left: 48px;
    width: 340px;
    padding: 24px 0;
    .nav-bar {
        width: 100%;
        height: 44px;
        display: flex;
        justify-content: space-between;
        .button {
            cursor: pointer;
            width: 81px;
            height: 44px;
            border-radius: 12px;
            font-size: 24px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 44px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
        }
        .active {
            color: rgba(255, 255, 255, 1);
        }
        .pve.active {
            background: linear-gradient(90deg, rgba(67, 207, 124, 1) 0%, rgba(67, 207, 124, 0) 100%);
        }
        .pvp.active {
            background: linear-gradient(270deg, rgba(227, 60, 100, 0) 0%, rgba(227, 60, 100, 1) 100%);
        }
        .pvx.active {
            background: linear-gradient(270deg, rgba(255, 141, 26, 0) 0%, rgba(255, 141, 26, 1) 100%);
        }
        .other.active {
            background: linear-gradient(270deg, rgba(121, 72, 234, 0) 0%, rgba(121, 72, 234, 1) 100%);
        }
    }
    .help-detail {
        width: 100%;
        height: calc(100% - 44px);
        overflow-y: auto;
        scrollbar-width: none;
        box-sizing: border-box;
        padding: 12px 0;
        .help-detail-item {
            height: 24px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            align-items: center;
            .help-detail-item-title {
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.5);
                &.active {
                    color: rgba(255, 255, 255, 1);
                    font-weight: 700;
                }
            }
            .help-detail-item-content {
                cursor: pointer;
                border-radius: 12px;
                border: 1px solid rgba(64, 128, 255, 1);
                font-size: 14px;
                font-weight: 700;
                line-height: 24px;
                color: rgba(255, 255, 255, 1);
                padding: 0 8px;
                &.active {
                    color: rgba(255, 255, 255, 1);
                    background: rgba(64, 128, 255, 1);
                }
            }
            .hr {
                height: 0px;
                flex: 1;
                border: 1px dashed rgba(255, 255, 255, 0.5);
                margin: 0 12px;
            }
        }
    }
}
</style>
