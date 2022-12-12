<template>
  <div class="form-process">
    <wti-form :fields="fields" :all-disabled="disabled" :border-form="false" label-position="right" label-width="110px" :data="originData">
      <template #file>
        <file v-if="!disabled"/>
        <div v-else class="history-file"> 
            <div class="history-list">
                <div class="history-value-list" v-if="fileList && fileList.length > 0">
                    <div class="history-value-item" v-for="(file, i) in fileList" :key="i">
                        <a :href="file.url" target="_blank">
                            <div class="history-value-icon">
                                <i class="el-icon-paperclip"></i> 
                            </div>
                            <div class="history-value-text">
                                {{ file.name }}
                            </div>
                        </a>
                    </div>
                </div>
                <div v-else>-</div>
            </div>
        </div>
      </template>
      <template #table>
        <el-table
          v-if="originData.detailBos"
          :data="originData.detailBos"
          height="250"
          :header-cell-style="headercellStyle"
          :cell-style="cellStyle"
          border
          style="width: 100%">
          <el-table-column
            v-for="(col, i) in columnData"
            :key="i"
            :prop="col.key"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :show-overflow-tooltip="col.tooltip || false">
            <template slot-scope="scope">
                {{ col.format === 'money' ? dealNumberFormat(scope.row[col.key]) || '-' : scope.row[col.key] || '-' }}
            </template>
          </el-table-column>
      </el-table>
      </template>
    </wti-form>
  </div>
</template>

<script>
import fields from '../config/ledgerChange';
import { dealNumberFormat } from "@/plugins/utils.js";
export default {
  dicts: ['data_status', 'ledger_change_type', 'ledger_change_level'],
  props: {
    originData: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      defaule: false
    }
  },
  data () {
    return {
      fields: [],
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
      columnData: [
          {
              key: 'bdbh',
              label: '标段编号',
              align: 'center',
              minWidth: '90',
              tooltip: true
          },
          {
              key: 'zmh',
              label: '子目号',
              align: 'center',
              minWidth: '100',
              tooltip: true
          },
          {
              key: 'zmmc',
              label: '子目名称',
              align: 'center',
              minWidth: '160',
              tooltip: true
          },
          {
              key: 'gcbw',
              label: '工程部位',
              align: 'center',
              minWidth: '100',
              tooltip: false
          },
          {
              key: 'htdj',
              label: '合同单价',
              align: 'center',
              format: 'money',
              minWidth: '120',
              tooltip: false
          },
          {
              key: 'shsl',
              label: '审核数量',
              align: 'center',
              minWidth: '110',
              tooltip: false
          },
          {
              key: 'xzsl',
              label: '修正数量',
              align: 'center',
              minWidth: '110',
              tooltip: false
          },
          {
              key: 'xzje',
              label: '修正金额',
              format: 'money',
              align: 'center',
              minWidth: '120',
              tooltip: false
          },
          {
              key: 'dw',
              label: '单位',
              align: 'center',
              minWidth: '110',
              tooltip: false
          },
          {
              key: 'shje',
              label: '审核金额',
              format: 'money',
              align: 'center',
              minWidth: '120',
              tooltip: false
          },
      ],
      data: [],
      fileList: [],
      dealNumberFormat
    }
  },
  mounted () {
    const fieldsCopy = JSON.parse(JSON.stringify(fields));
    setTimeout(() => {
      this.$nextTick(() => {
        fieldsCopy[0].children.forEach(field => {
          if (field.type === 'normal-select') {
            const options = this.dict.type[field.dicKey].map(item => {
              return {
                value: item.value,
                label: item.label
              }
            })
            this.$set(field, 'options', options);
          }
        });
      })
    }, 2000);
    this.fields = fieldsCopy;
    if (this.originData.fj) {
      this.fileList = JSON.parse(this.originData.fj);
    }
  },
}
</script>
<style lang="scss" scope>
.history-file {
    font-family: PingFangSC-Regular;
    font-size: 0.9rem;
    color: #3A4566;
    font-weight: 400;
    line-height: 36px;
    display: flex;
    .history-label {
        width: 50px;
    }
    .history-list {
        width: calc(100% - 50px);
    }
    .history-value-list {
        .history-value-item {
            display: inline-block;
            position: relative;
            padding-left: 18px;
            margin-right: 30px;
            .history-value-icon {
                width: 16px;
                height: 16px;
                position: absolute;
                left: 0;
                top: 2px;
                img {
                    width: 100%;
                }
            }
            .history-value-text {
                display: inline-block;
                font-family: PingFangSC-Regular;
                font-size: 0.9rem;
                color: #0F63FF;
                width: 100%;
                word-break: break-all;
            }
        }
        .history-value-item:first-child {
            margin-left: 0;
        }
    }
}
</style>