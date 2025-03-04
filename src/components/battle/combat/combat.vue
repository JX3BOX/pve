<template>
  <div class="m-battle-combat-combat">
    <el-table :data="list" style="width: 100%">
      <el-table-column align="center" label="【BOSS - 宓桃】 · 【 玩家 - 筱儿】 · 【时长 - 139秒】">
        <el-table-column prop="name" label="技能" width="120"> </el-table-column>
        <el-table-column prop="" label="输出占比" width="120"> </el-table-column>
        <el-table-column prop="" label="平均DPS" width="120"> </el-table-column>
        <el-table-column prop="" label="最高输出" width="300"> </el-table-column>
        <el-table-column prop="" label="使用次数" width="120"> </el-table-column>
        <el-table-column prop="" label="排行榜排名" width="120">
          <el-table-column prop="" label="输出榜" width="120"> </el-table-column>
          <el-table-column prop="" label="心法榜" width="120"> </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'combat',
  props: [],
  data: function() {
    return { list: [] }
  },
  computed: {},
  methods: {},

  mounted: function() {},

  components: {
    // Equip,
  },
}
</script>
<style scoped lang="less">
@import '../~@/assets/css/battle/components/combat.less';
</style>
