<template>
  <div class="m-battle-combat-equ">
    <div class="u-title">武器装备</div>
    <div class="u-box">
      <a href="" target="_blank" v-for="o in 20" :key="o" class="u-item">
        <img src="https://icon.jx3box.com/icon/1224.png" />
        <div class="u-name">装备{{ o }}</div>
      </a>
    </div>
  </div>
</template>
<script>
//import somemod from '@/components/battle/somemod.vue';
export default {
  name: 'user',
  props: [],
  data: function() {
    return {}
  },
  computed: {},
  methods: {},
  mounted: function() {},
  components: {},
}
</script>
<style scoped lang="less">
@import '../~@/assets/css/battle/components/combat.less';
</style>
