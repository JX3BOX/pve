<template>
    <div class="m-fb-skill-v2">
        <!-- <p class="u-ac" v-html="ac"></p> -->
        <ul class="u-list">
            <li v-for="(item, i) in list" :key="i" v-show="client == item.color">
                <a :href="item.link" target="_blank">
                    <img :src="iconLink(item.icon)" />
                    {{ item.label }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getMenuGroup, } from "@/service/fb/helper.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Skill_v2",
    props: [],
    components: {},
    data: function() {
        return {
            ac: "",
            list: [],
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client || "std";
        },
    },
    methods: {
        init: function() {
            // getBread("fb-skill-ac").then((res) => {
            //     this.ac = res.data.data.breadcrumb.html;
            // });
            getMenuGroup("fb-skill").then((res) => {
                this.list = res.data.data.menus;
            });
        },
        iconLink,
    },
    created: function() {
        this.init();
    },
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
