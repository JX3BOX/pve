<template>
    <div class="help-content">
        <div class="category">
            <div class="PVE">
                <div class="title">PVE</div>
                <HelpCard :obj="obj" />
            </div>
        </div>
        <HelpList />
        <div class="join">
            <div class="join-content">
                <div class="text">快把我拉进群吧~</div>
                <div class="qq" @click="copyQQ">QQ:12346789</div>
            </div>
            <div class="triangle"></div>
            <img class="join-img" :src="url + 'girlbot.png'" alt="" />
        </div>
    </div>
</template>

<script>
import HelpCard from "./HelpCard.vue";
import HelpList from "./HelpList.vue";
export default {
    name: "Help",
    components: {
        HelpCard,
        HelpList,
    },
    data() {
        return {
            url: "https://cdn.jx3box.com/design/pve/team/",
            obj: {
                title: "团长开团",
                content: {
                    zhiling: "#开团",
                    params: ["params1", "params2"],
                },
                example: "例：#开团 白帝江关第一车",
                simple: {
                    title: "团长开团",
                    content: {
                        zhiling: "#开团",
                        params: ["params1", "params2"],
                    },
                    example: "11111",
                },
            },
        };
    },
    methods: {
        async copyQQ() {
            try {
                await this.$copyText("12346789");
                this.$message.success("复制成功");
            } catch (error) {
                this.$message.error("复制失败");
            }
        },
    },
};
</script>

<style lang="less" scoped>
.help-content {
    display: flex;
    margin-left: 100px;
    height: 862px;
    .category {
        width: 640px;
        .title {
            margin: 24px 0;
            width: 100%;
            height: 53px;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 0px;
            line-height: 53px;
            color: rgba(255, 255, 255, 1);
            text-align: left;
        }
        .PVE {
            width: 100%;
        }
    }
    .join {
        width: 233px;
        height: 352px;
        align-self: flex-end;
        .join-content {
            width: 185px;
            height: 107px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 1);
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            .text {
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0px;
                color: rgba(56, 56, 56, 1);
                padding: 12px 0;
            }
            .qq {
                cursor: pointer;
                width: 161px;
                height: 50px;
                background: rgba(64, 128, 255, 1);
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 0px;
                line-height: 50px;
                color: rgba(255, 255, 255, 1);
                text-align: center;
                border-radius: 16px;
            }
        }
        .triangle {
            width: 0;
            height: 0;
            border-left: 11px solid transparent;
            border-right: 11px solid transparent;
            border-top: 13px solid rgba(255, 255, 255, 1);
            margin: 0 auto;
        }
        .join-img {
            width: 224px;
            height: 224px;
        }
    }
}
</style>
