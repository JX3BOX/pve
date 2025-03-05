<template>
  <div class="m-battle-combat-log">
    <h2 class="m-title">战斗记录</h2>
    <div class="m-box">
      <div class="m-title">奇穴配置</div>
      <div class="qx-container"></div>
    </div>
    <div class="m-box"> 
      <combat />
    </div>
  </div>
</template>
<script>
import JX3_QIXUE from '@jx3box/jx3box-talent'
import { getTalentVersions } from '@/service/battle/talent.js'
import $ from 'jquery'
import combat from '@/components/battle/combat/combat.vue'
export default {
  name: 'log',
  props: [],
  data: function() {
    return {}
  },
  computed: {},
  methods: {},
  mounted: function() {
    getTalentVersions().then((res) => {
      this.versions = res.data
      this.version = this.versions && this.versions.length && this.versions[0]['version']

      this.driver = new JX3_QIXUE({
        version: this.version,
        editable: true,
      })

      const vm = this
      $(document).on('JX3_QIXUE_Change', function(e, ins) {
        let __data = {}
        __data.version = ins.version
        __data.xf = ins.xf
        __data.sq = ins.sq.join(',')
        vm.code = JSON.stringify(__data)
        // console.log(ins)
      })
    })
  },
  components: {
    combat,
  },
}
</script>
<style scoped lang="less">
@import '../~@/assets/css/battle/components/combat.less';
</style>
