<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="合同清单" name="first">
        <contract-list v-if="activeName === 'first'"/>
      </el-tab-pane>
      <el-tab-pane label="章节汇总" name="second">
        <sections-list v-if="activeName === 'second'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import contractList from './components/contractList';
import sectionsList from './components/sectionsList';
export default {
  name: "ContractBill",
  components: {
    contractList, sectionsList
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    height: 100%;
    .el-tabs {
      height: 100%;
      ::v-deep .el-tabs__content {
        height: calc(100% - 30px);
        >div {
          height: 100%;
        }
      }
    }
  }
</style>
