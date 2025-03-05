<template>
  <div class="m-battle-combat-user">
    <div class="u-box">
      <a href="" target="_blank" class="u-img">
        <img src="https://cdn.jx3box.com/2019/12/JX3ClientX64_2019-12-01_18-24-01.png" />
        <i class="c-avatar-frame s"><img src="https://img.jx3box.com/image/avatar/flower_6/flower_6-s.png"/></i>
      </a>
      <div class="u-info">
        <div class="u-name">魔盒官方账号魔盒官方账号魔盒官方账号魔盒官方账号</div>
        <div class="u-uid">UID: 892893892</div>
      </div>
    </div>
    <div class="u-card">
      <div class="u-title">
        <span>已绑角色</span>
        <a href="" target="_blank" style="float: right; padding: 3px 0" type="text">去绑定</a>
      </div>
      <div v-for="o in 4" :key="o" class="u-item">
        <img class="u-img" src="https://img.jx3box.com/image/roles/4-6.png" />
        <div class="u-info">
          <span class="u-txt">角色名：筱儿角色名筱儿角色名筱儿角色名：筱儿角色名：筱儿</span>
          <span class="u-txt">门派：七秀</span>
          <span class="u-txt">服务器：蝶恋花</span>
        </div>
      </div>
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
