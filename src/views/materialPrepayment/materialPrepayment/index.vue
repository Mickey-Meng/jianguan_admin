<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-table :header-cell-style="headercellStyle"
          :cell-style="cellStyle" v-loading="qsloading" :data="measurementNoList" @row-click="rowQsClick">
        <el-table-column label="ID" align="center" prop="id" v-if="false"/>
        <el-table-column label="期数" align="center" prop="name" min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center" prop="status" min-width="30">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
      </el-table>
      </el-col>
      <el-col :span="18">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="材料编号" prop="clbh">
          <el-input
            v-model="queryParams.clbh"
            placeholder="请输入材料编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
          <el-form-item label="材料名称" prop="clmc">
          <el-input
            v-model="queryParams.clmc"
            placeholder="请输入材料名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="标段编号" prop="bdbh">
          <el-input
            v-model="queryParams.bdbh"
            placeholder="请输入标段编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <!-- <el-form-item label="期次编号" prop="jlqsbh">
          <el-input
            v-model="queryParams.jlqsbh"
            placeholder="请输入计量期次编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <!--
        <el-form-item label="编号" prop="clbh">
          <el-input
            v-model="queryParams.clbh"
            placeholder="请输入材料编号/预付款编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      <el-form-item label="单价" prop="dj">
          <el-input
            v-model="queryParams.dj"
            placeholder="请输入单价"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="数量" prop="sl">
          <el-input
            v-model="queryParams.sl"
            placeholder="请输入数量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="金额" prop="je">
          <el-input
            v-model="queryParams.je"
            placeholder="请输入金额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预付比例" prop="yfbl">
          <el-input
            v-model="queryParams.yfbl"
            placeholder="请输入预付比例"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预付金额" prop="yfje">
          <el-input
            v-model="queryParams.yfje"
            placeholder="请输入预付金额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="材料来源" prop="clly">
          <el-input
            v-model="queryParams.clly"
            placeholder="请输入材料来源"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="单据编号" prop="djbh">
          <el-input
            v-model="queryParams.djbh"
            placeholder="请输入单据编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="质保书编号" prop="zbsbh">
          <el-input
            v-model="queryParams.zbsbh"
            placeholder="请输入质保书编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label=" 抽检报告编号" prop="cjbgbh">
          <el-input
            v-model="queryParams.cjbgbh"
            placeholder="请输入 抽检报告编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="dict in dict.type.data_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        -->
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
              v-hasPermi="['materialPrepayment:materialPrepayment:add']"
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
              v-hasPermi="['materialPrepayment:materialPrepayment:edit']"
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
              v-hasPermi="['materialPrepayment:materialPrepayment:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['materialPrepayment:materialPrepayment:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table :header-cell-style="headercellStyle"
          :cell-style="cellStyle" v-loading="loading" :data="materialPrepaymentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" align="center" prop="id" v-if="false"/>
          <!-- <el-table-column label="标段编号" align="center" prop="bdbh" /> -->
          <!-- <el-table-column label="计量期次编号" align="center" prop="jlqsbh" /> -->
          <el-table-column label="材料编号" align="center" min-width="100" :show-overflow-tooltip="true" prop="clbh" />
          <el-table-column label="材料名称" align="center" min-width="120" :show-overflow-tooltip="true" prop="clmc" />
          <el-table-column label="单位" align="center" min-width="80" :show-overflow-tooltip="true" prop="dw" />
          <el-table-column label="单价" align="center" prop="dj">
            <template slot-scope="scope">
                {{ dealNumberFormat(scope.row.dj) }}
              </template>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="sl" />
          <el-table-column label="金额" align="center" prop="je" />
          <el-table-column label="预付比例" align="center" prop="yfbl"  />
          <el-table-column label="预付金额" align="center" prop="yfje">
            <template slot-scope="scope">
              {{ dealNumberFormat(scope.row.yfje) }}
            </template>
          </el-table-column>
          <el-table-column label="材料来源" align="center" prop="clly"  />
          <el-table-column label="单据编号" align="center" prop="djbh"  />
          <el-table-column label="质保书编号" align="center" prop="zbsbh" min-width="120" />
          <el-table-column label="抽检报告编号" align="center" prop="cjbgbh" min-width="120" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
          <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['materialPrepayment:materialPrepayment:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['materialPrepayment:materialPrepayment:remove']"
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
      </el-col>
    </el-row>


    <!-- 添加或修改材料预付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh" >
             <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
             </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期次编号" prop="jlqsbh">
            <el-select v-model="form.jlqsbh" placeholder="请选择期次">
            <el-option
              v-for="item in jlqsbhOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
             </el-select>
           </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料编号" prop="clbh">
             <el-input v-model="form.clbh" placeholder="预付款编号" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
              <el-form-item label="材料名称" prop="clmc">
            <el-input v-model="form.clmc" placeholder="请输入材料名称" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="单位" prop="dw">
              <el-input v-model="form.dw" placeholder="请输入单位名称" />
               </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="dj">
              <el-input v-model="form.dj" placeholder="请输入单价" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="sl">
          <el-input v-model="form.sl" placeholder="请输入数量" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额" prop="je">
          <el-input v-model="form.je" placeholder="请输入金额" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预付比例" prop="yfbl">
          <el-input v-model="form.yfbl" placeholder="请输入预付比例" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预付金额" prop="yfje">
          <el-input v-model="form.yfje" placeholder="请输入预付金额" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料来源" prop="clly">
          <el-input v-model="form.clly" placeholder="请输入材料来源" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="单据编号" prop="djbh">
          <el-input v-model="form.djbh" placeholder="请输入单据编号" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="质保书编号" prop="zbsbh">
          <el-input v-model="form.zbsbh" placeholder="请输入质保书编号" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label=" 抽检报告编号" prop="cjbgbh">
          <el-input v-model="form.cjbgbh" placeholder="请输入 抽检报告编号" />
        </el-form-item>
        </el-col>
<!--        <el-col :span="12">
          <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.data_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        </el-col>-->
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
import { listMaterialPrepayment, getMaterialPrepayment, delMaterialPrepayment, addMaterialPrepayment, updateMaterialPrepayment } from "@/api/materialPrepayment/materialPrepayment";
import { listMeasurementListNo} from "@/api/measurementNo/measurementNo";
import { dealNumberFormat } from "@/utils/utils.js";

export default {
  name: "MaterialPrepayment",
  dicts: ['data_status'],
  data() {
    return {
      // 中间计量期数管理表格数据
      measurementNoList: [],
       // 遮罩层
       qsloading: true,
       jlqsbhOptions:[],
      //选中期数
      xzQsId: "",
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 材料预付款表格数据
      materialPrepaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        jlqsbh: undefined,
        clbh: undefined,
        clmc: undefined,
        dw: undefined,
        dj: undefined,
        sl: undefined,
        je: undefined,
        yfbl: undefined,
        yfje: undefined,
        clly: undefined,
        djbh: undefined,
        zbsbh: undefined,
        cjbgbh: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "ID不能为空", trigger: "blur" }
        ],
        bdbh: [
          { required: true, message: "标段编号不能为空", trigger: "blur" }
        ],
        jlqsbh: [
          { required: true, message: "计量期次编号不能为空", trigger: "blur" }
        ],
        clbh: [
          { required: true, message: "材料编号，预付款编号不能为空", trigger: "blur" }
        ],
        clmc: [
          { required: true, message: "材料名称不能为空", trigger: "blur" }
        ],
        dw: [
          { required: true, message: "材料名称不能为空", trigger: "blur" }
        ],
        dj: [
          { required: true, message: "单价不能为空", trigger: "blur" }
        ],
        sl: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        je: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        yfbl: [
          { required: true, message: "预付比例不能为空", trigger: "blur" }
        ],
        yfje: [
          { required: true, message: "预付金额不能为空", trigger: "blur" }
        ],
        clly: [
          { required: true, message: "材料来源不能为空", trigger: "blur" }
        ],
        djbh: [
          { required: true, message: "单据编号不能为空", trigger: "blur" }
        ],
        zbsbh: [
          { required: true, message: "质保书编号不能为空", trigger: "blur" }
        ],
        cjbgbh: [
          { required: true, message: " 抽检报告编号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      },
      headercellStyle: {
          fontFamily: 'PingFangSC-Regular',
          background: '#F7F8FB',
          color: '#12182A',
          fontWeight: 600,
          height: '44px',
          fontSize: '14px',
      },
      cellStyle: {
          fontFamily: 'PingFangSC-Regular',
          color: '#3A4566',
          height: '44px',
          fontSize: '14px',
      },
      dealNumberFormat
    };
  },
  created() {
    this.getList();
    this.getPeriodsList();
  },
  methods: {
    /** 查询材料预付款列表 */
    getList() {
      this.loading = true;
      listMaterialPrepayment(this.queryParams).then(response => {
        this.materialPrepaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询中间计量期数管理列表 */
    getPeriodsList() {
      this.qsloading = true;
      listMeasurementListNo().then(response => {
        this.measurementNoList = response.data;
        this.qsloading = false;
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
        bdbh: undefined,
        jlqsbh: undefined,
        clbh: undefined,
        clmc: undefined,
        dw: undefined,
        dj: undefined,
        sl: undefined,
        je: undefined,
        yfbl: undefined,
        yfje: undefined,
        clly: undefined,
        djbh: undefined,
        zbsbh: undefined,
        cjbgbh: undefined,
        status: "0",
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
    rowQsClick(record,index){
      this.xzQsId=record.id;
      this.queryParams.jlqsbh = record.id;
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
    /** 新增按钮操作 */
    handleAdd() {
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.reset();
      this.open = true;
      this.title = "添加材料预付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMaterialPrepayment(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改材料预付款";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMaterialPrepayment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMaterialPrepayment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除材料预付款编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMaterialPrepayment(ids);
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
      this.download('materialPrepayment/materialPrepayment/export', {
        ...this.queryParams
      }, `materialPrepayment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
