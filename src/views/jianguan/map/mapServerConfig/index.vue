<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务名称" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="请输入服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务编码" prop="serverCode">
        <el-input
          v-model="queryParams.serverCode"
          placeholder="请输入服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务地址" prop="serverUrl">
        <el-input
          v-model="queryParams.serverUrl"
          placeholder="请输入地图服务地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务类型" prop="serverType">
        <el-input
          v-model="queryParams.serverType"
          placeholder="请输入服务类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否可见" prop="visiable">
        <el-input
          v-model="queryParams.visiable"
          placeholder="请输入是否可见"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="服务状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:mapServerConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:mapServerConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:mapServerConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:mapServerConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mapServerConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="false"/>
      <el-table-column label="服务名称" align="center" prop="serverName" />
      <el-table-column label="服务编码" align="center" prop="serverCode" />
      <el-table-column label="服务地址" align="center" prop="serverUrl" width="150"/>
      <el-table-column label="服务类型" align="center" prop="serverType" />
      <el-table-column label="是否可见" align="center" prop="visiable" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visiable"
            active-value="0"
            inactive-value="1"
            @change="handleChangeStatusOrVisiable('visiable', scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleChangeStatusOrVisiable('status', scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="属性信息" align="center" prop="attrbuites" />
      <el-table-column label="服务缩率图" align="center" prop="thumbnail" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:mapServerConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mapServerConfig:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改地图服务注册对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务名称" prop="serverName">
                <el-input v-model="form.serverName" placeholder="请输入服务名称" />
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="服务编码" prop="serverCode">
                <el-input v-model="form.serverCode" placeholder="请输入自定义服务id" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务地址" prop="serverUrl">
                <el-input v-model="form.serverUrl" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="服务类型">
                <el-select v-model="form.serverType" placeholder="请选择服务类型">
                  <el-option
                    v-for="dict in dict.type.map_server_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">

            <el-col :span="12">
              <el-form-item label="是否可见" prop="visiable">
                <el-input v-model="form.visiable" placeholder="请输入是否可见" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.value"
                  >{{dict.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>   
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务缩率图" prop="thumbnail">
                <el-input v-model="form.thumbnail" placeholder="请输入服务缩率图" />
              </el-form-item>
          </el-col>

          <el-col :span="12">
              <el-form-item label="属性信息" prop="attrbuites">
                <el-input v-model="form.attrbuites" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>          
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMapServerConfig, getMapServerConfig, delMapServerConfig, addMapServerConfig, updateMapServerConfig, changeStatusOrVisiable } from "@/api/jianguan/map/mapServerConfig";

export default {
  name: "MapServerConfig",
  dicts: ['sys_normal_disable', 'map_server_type'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 日期范围
      dateRange: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 地图服务注册表格数据
      mapServerConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serverName: undefined,
        serverCode: undefined,
        serverUrl: undefined,
        serverType: undefined,
        visiable: undefined,
        status: undefined,
        attrbuites: undefined,
        thumbnail: undefined,
        description: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serverName: [
          { required: true, message: "服务名称不能为空", trigger: "blur" }
        ],
        serverCode: [
          { required: true, message: "服务编码", trigger: "blur" }
        ],
        serverUrl: [
          { required: true, message: "地图服务地址不能为空", trigger: "blur" }
        ],
        serverType: [
          { required: true, message: "服务类型不能为空", trigger: "change" }
        ],
        visiable: [
          { required: true, message: "是否可见不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询地图服务注册列表 */
    getList() {
      this.loading = true;
      listMapServerConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.mapServerConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        serverName: undefined,
        serverCode: undefined,
        serverUrl: undefined,
        serverType: undefined,
        visiable: undefined,
        status: "0",
        attrbuites: undefined,
        thumbnail: undefined,
        description: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    // 用户状态Or是否可见修改
    handleChangeStatusOrVisiable(type, row) {
      let confirmMessage = '确认要"' + (row.status === "0" ? "启用" : "停用") + '""' + row.serverName + '"服务吗？';
      let data = {
        id: row.id,
        status: row.status
      }
      if ('visiable' === type) {
        confirmMessage = '确认要设置' + row.serverName + '服务为'+ (row.visiable === "0" ? "可见" : "隐藏") + '吗？';
        data = {
          id: row.id,
          status: row.visiable
        }
      }
      this.$modal.confirm(confirmMessage).then(function() {
        return changeStatusOrVisiable(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        if ('visiable' === type) {
          row.visiable = row.visiable === "0" ? "1" : "0";
        } else {
          row.status = row.status === "0" ? "1" : "0";
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加地图服务注册";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMapServerConfig(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改地图服务注册";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMapServerConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMapServerConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除地图服务注册编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMapServerConfig(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('map/mapServerConfig/export', {
        ...this.queryParams
      }, `mapServerConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
