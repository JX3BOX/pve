<template>
    <div class="help-card">
        <div class="title">{{ obj.title }}</div>
        <div class="content-container">
            <div class="content">
                <div class="zhiling">
                    {{ obj.content.zhiling }}
                </div>
                <div class="params">
                    <div class="param" v-for="param in obj.content.params" :key="param">
                        {{ param }}
                    </div>
                </div>
            </div>
            <div class="buttons">
                <div class="copy-white button" @click="copyWhite">复制白字</div>
                <div class="copy-all button" @click="copyAll">复制全部</div>
            </div>
        </div>
        <div class="example" :innerHTML="obj.example">
        </div>
    </div>
</template>

<script>
export default {
    name: "HelpCard",
    props: {
        obj: {
            type: Object,
            default: () => {
                return {
                    title: "",
                    content: {},
                    example: "",
                    tips: [],
                    simple: {
                        title: "",
                        content: {},
                        example: "",
                        tips: [],
                    },
                };
            },
        },
    },
    methods: {
        async copyWhite() {
            try {
                await this.$copyText(this.obj.content.zhiling);
                this.$message.success("复制成功");
            } catch (error) {
                this.$message.error("复制失败");
            }
        },
        async copyAll() {
            try {
                await this.$copyText(this.obj.content.zhiling + " " + this.obj.content.params.join(" "));
                this.$message.success("复制成功");
            } catch (error) {
                this.$message.error("复制失败");
            }
        },
    },
};
</script>

<style lang="less" scoped>
.help-card {
    width: 640px;
    padding: 24px;
    box-sizing: border-box;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(64, 64, 64, 1) 0%, rgba(87, 87, 87, 1) 100%);
    .title {
        width: 100%;
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        letter-spacing: 0px;
        color: rgba(255, 255, 255, 1);
    }
    .content-container {
        margin-top: 12px;
        width: 592px;
        height: 50px;
        border-radius: 24px;
        background: rgba(0, 0, 0, 1);
        display: flex;
        justify-content: space-between;
        .content {
            display: flex;
            align-items: center;
            .zhiling {
                font-size: 12px;
                font-weight: 700;
                color: rgba(255, 255, 255, 1);
                margin-right: 8px;
                margin-left: 16px;
            }
            .params {
                display: flex;
                .param {
                    border-radius: 4px;
                    background: rgba(64, 128, 255, 0.3);
                    font-size: 12px;
                    padding: 0px 4px 0px 4px;
                    font-weight: 400;
                    color: rgba(94, 180, 255, 1);
                    margin-right: 8px;
                }
            }
        }
        .buttons {
            display: flex;
            font-size: 12px;
            cursor: pointer;
            .button {
                width: 72px;
                height: 50px;
                color: rgba(255, 255, 255, 1);
                text-align: center;
                line-height: 50px;
            }
            .copy-white {
                &:hover {
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid rgba(69, 131, 255, 1);
                    box-shadow: 0px 0px 15px rgba(69, 131, 255, 0.4) inset;
                    color: rgba(0, 0, 0, 1);
                }
            }
            .copy-all {
                box-sizing: border-box;
                width: 76px;
                text-align: left;
                padding-left: 12px;
                border-radius: 0 24px 24px 0;
                &:hover {
                    background: rgba(64, 128, 255, 1);
                }
            }
        }
    }
}
</style>
