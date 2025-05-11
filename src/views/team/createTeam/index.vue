<template>
    <div class="create-team">
        <div class="title">
            <div class="bot-text">魔盒QQ机器人</div>
            <div :class="{ 'help-option': true, optin: true, active: selected === 'help' }" @click="selected = 'help'">
                <p>指令手册</p>
                <img class="icon" src="~@/assets/img/team/chat-1-line.png" alt="" />
            </div>
            <div :class="{ 'team-option': true, optin: true, active: selected === 'team' }" @click="selected = 'team'">
                <p>开团管理</p>
                <img class="icon" src="~@/assets/img/team/group-line.png" alt="" />
            </div>
        </div>
        <div class="content">
            <Help v-if="selected === 'help'" />
            <Team v-if="selected === 'team'" :selectedItem="selectedItem" />
        </div>
        <img class="girl" :src="url + 'girl.png'" alt="" />
    </div>
</template>
<script>
import Card from "./Card.vue";
import Help from "./Help.vue";
import Team from "./Team.vue";
export default {
    name: "CreateTeam",
    components: {
        // Card,
        Help,
        Team,
    },
    data() {
        return {
            url: "https://cdn.jx3box.com/design/pve/team/",
            selected: this.$route.query.id ? "team" : "help",
            selectedItem: null,
        };
    },
    computed: {},
    methods: {
        selectItem(item) {
            this.selectedItem = item;
        },
    },
};
</script>

<style scoped lang="less">
@url: "https://cdn.jx3box.com/design/pve/team/";
@font-face {
    font-family: "Smiley Sans";
    src: url("@{url}SmileySans-Oblique.ttf.woff2") format("woff2");
}
.create-team {
    width: 1920px;
    max-width: calc(1920px - 100vw + 100%);
    height: 862px;
    background: linear-gradient(180deg, rgba(6, 6, 6, 1) 50.15%, rgba(39, 63, 102, 1) 100%);
    position: relative;
    display: flex;
    .title {
        padding-left: 300px;
        width: 200px;
        .bot-text {
            margin: 24px 0;
            font-size: 36px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 43.2px;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            font-family: "Smiley Sans";
        }
        .optin {
            border-radius: 12px;
            cursor: pointer;
            width: 200px;
            height: 83px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(255, 255, 255, 1);
            .icon {
                width: 24px;
                height: 24px;
                margin-left: 10px;
            }
        }
        .team-option.active {
            background: linear-gradient(270deg, rgba(255, 141, 26, 0) 0%, rgba(255, 141, 26, 1) 100%);
        }
        .help-option.active {
            background: linear-gradient(270deg, rgba(64, 128, 255, 0) 0%, rgba(64, 128, 255, 1) 100%);
        }
    }
    .girl {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 558px;
        height: 581px;
    }
}
</style>
