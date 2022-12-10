<template>
  <div class="form-process">
    <wti-form :fields="fields" :all-disabled="disabled" :border-form="false" label-position="right" :data="originData">
      <template #file>
        <file v-if="!disabled"/>
        <div v-else class="history-file"> 
            <div class="history-list">
                <div class="history-value-list" v-if="originData.marketFileDTOList && originData.marketFileDTOList.length > 0">
                    <div class="history-value-item" v-for="(file, i) in originData.marketFileDTOList" :key="i">
                        <a :href="file.filePath" target="_blank">
                            <div class="history-value-icon">
                                <i class="el-icon-paperclip"></i> 
                            </div>
                            <div class="history-value-text">
                                {{ file.fileName }}
                            </div>
                        </a>
                    </div>
                </div>
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
          </el-table-column>
      </el-table>
      </template>
    </wti-form>
  </div>
</template>

<script>
import fields from '../config/measurementDocuments';
import file from '@/components/FileUpload/index';
export default {
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
  components: {
    file
  },
  data () {
    return {
      fields,
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
              key: 'zmh',
              label: '子目号',
              align: 'center',
              minWidth: '100',
              tooltip: true
          },
          {
              key: 'zmmc',
              label: '子目名称',
              align: 'left',
              minWidth: '120',
              tooltip: true
          },
          {
              key: 'fhsl',
              label: '复合数量',
              align: 'left',
              minWidth: '80',
              tooltip: false
          },
          {
              key: 'yjlsl',
              label: '已计量数量',
              align: 'left',
              minWidth: '80',
              tooltip: false
          },
          {
              key: 'bqyjlsl',
              label: '本期计量数量',
              format: 'money',
              align: 'right',
              minWidth: '80',
              tooltip: false
          },
      ],
      data: [],
    }
  },
  mounted () {
    if (this.disabled) {
      const data =  {
        'type': 'input',
        'key': 'djlx',
        'label': '台账分解编号',
        'size': 24
      };
      this.fields[0].children.splice(0, 0, data);
    }
  }
}
</script>
<style lang="scss" scope>
.history-file {
    font-family: PingFangSC-Regular;
    font-size: 0.9rem;
    color: #3A4566;
    font-weight: 400;
    line-height: 22px;
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