<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <p class="system-message">
          <svg-icon icon-class="sysMsg" class="el-input__icon input-icon" class-name="card-panel-icon" />
          <span class="label">系统公告:</span> <span class="message">{{message}}</span>
        </p>
      </el-col>
      <el-col :sm="12" :lg="12">
        <todo/>
      </el-col>
      <el-col :sm="12" :lg="12">
        <common-functions/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <todo-list/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import todo from '@/views/workspace/todo';
import commonFunctions from '@/views/workspace/commonFunctions';
import todoList from '@/views/workspace/todoList';

export default {
  name: "Index",
  components: {

    // todo, commonFunctions, todoList
  },
  data() {
    return {
      // 版本号
      message: '暂无公告'
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  background: #f8f6f6;
  padding: 0 20px;
  height: 100%;
  .col-item {
    margin-bottom: 20px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .system-message {
    font-size: 12px;
    font-weight: 600;
    .label {
      color:rgb(92, 166, 222);
    }
    .message {
      color: #d82315;
    }
  }
}
</style>

