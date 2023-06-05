<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--工序库树列表-->
      <el-col :span="12" :xs="24">
        <produce-library ref="produceLibrary"/>
      </el-col>

      <!--关联的构建类型数据-->
      <el-col :span="12" :xs="24">
        <component-type ref="componentType"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import produceLibrary from "./produceLibrary";
import componentType from "./componentType";

export default {
  name: "produceTreeComponentType",
  components: { produceLibrary, componentType},
  data() {
    return {
      
    }
  }
}
</script>
