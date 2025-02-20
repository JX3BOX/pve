<template>
    <div class="m-fb-npc-v2">
        <p class="u-ac" v-html="ac"></p>
        <ul class="u-list">
            <li v-for="(item, i) in list" :key="i">
                <a :href="item.link" target="_blank" :style="{ color: item.color }">
                    <img :src="item.icon | iconLink" />
                    {{ item.label }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getMenuGroup, getBread } from "@/service/fb/helper.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "NPCv2",
    props: [],
    components: {},
    data: function() {
        return {
            ac: "",
            list: [],
        };
    },
    computed: {},
    methods: {
        init: function() {
            getBread("fb-npc-ac").then((res) => {
                this.ac = res.data.data.html;
            });
            getMenuGroup("fb-npc").then((res) => {
                this.list = res.data.data.menus;
            });
        },
    },
    filters: {
        iconLink,
    },
    created: function() {
        this.init();
    },
    mounted: function() {},
};
</script>

<style scoped lang="less">
.u-ac {
    background-color: #fafbfc;
    border: 1px solid #dfe6f7;
    border-radius: 4px;
    padding: 10px;
    .fz(14px, 2);
}
.u-list {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
        .mb(10px);
        border-bottom: 1px solid #eee;
    }
    a {
        .db;
        .fz(14px, 2);
        &:hover {
            color: @pink;
        }
    }
    img {
        .r(3px);
        .y;
        .size(24px);
    }
}
</style>
