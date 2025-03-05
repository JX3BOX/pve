<template>
  <div class="m-battle-rank">
    <div class="m-title">{{title}}</div>
    <div class="m-box">
      <a class="u-link" v-for="(item, i) in xfmap" :key="i" :href="toLink(i)" :class="{ on: isActive(item.name) }">
        <i class="u-pic"><img :src="item.id | xficon" :alt="item.name"/></i>
        <span class="u-txt">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>
<script>
import xfmap from '@jx3box/jx3box-data/data/xf/xf.json'
import { __imgPath } from '@jx3box/jx3box-common/data/jx3box.json'
export default {
  name: 'rank',
  props: ['title'],
  data: function() {
    return { xfmap }
  },
  computed: {},
  methods: {
    isActive: function(name) {
      return this.$store.state.subtype == name
    },
    toLink: function(val) {
      return '#/combat/' + val
    },
  },
  filters: {
    xficon: function(val) {
      return __imgPath + 'image/xf/' + val + '.png'
    },
  },
  components: {},
}
</script>
<style scoped lang="less">
@import '~@/assets/css/battle/components/rank.less';
</style>
