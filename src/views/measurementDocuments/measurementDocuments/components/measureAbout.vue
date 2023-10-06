<template>
    <div>
        <el-table :height="250" v-loading="loading" :header-cell-style="headercellStyle" :cell-style="cellStyle"
            :data="tableData">
            <el-table-column label="子目号" align="center" prop="zmh" min-width="140" :show-overflow-tooltip="true" />
            <el-table-column label="子目名称" align="center" prop="meaLedgerBreakdownDetail.zmmc" min-width="140"
                :show-overflow-tooltip="true" />
            <el-table-column label="单位" align="center" prop="meaLedgerBreakdownDetail.dw" min-width="100" />
            <el-table-column label="分解数量" align="center" prop="meaLedgerBreakdownDetail.fjsl" min-width="140" />
            <el-table-column label="变更分解数量" align="center" prop="meaLedgerBreakdownDetail.bgfjsl" min-width="140" />
            <el-table-column label="本期计量数量" align="center" prop="bqjlsl" min-width="140" />
            <el-table-column label="累计数量" align="center" prop="meaLedgerBreakdownDetail.yjlsl" min-width="140" />
            <el-table-column label="累计计量比例" align="center" prop="ljjlbl" min-width="160">
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.ljjlbl" :show-text="true" :color="'#0F63FF'" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { measurementAboutList } from '@/api/measurementDocumentsDetail/measurementDocumentsDetail';
import calc from '@/utils/calc.js'
export default {
    data() {
        return {
            loading: false,
            tableData: [],
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
        }
    },
    methods: {
        measurementAboutList(query) {
            this.tableData = []
            const params = {
                pzbh: query
            }
            this.loading = true;
            measurementAboutList(params).then(response => {
                if (response.rows.length) {
                    this.tableData = response.rows.map(item => {
                        if (item.meaLedgerBreakdownDetail) {
                            if(item.meaLedgerBreakdownDetail.isChange==1){
                              const ljjlbl = calc.div(item.meaLedgerBreakdownDetail.yjlsl || 0, item.meaLedgerBreakdownDetail.bgfjsl || 0)
                              item.ljjlbl = calc.mul(Number(ljjlbl.toFixed(4)), 100);
                            }else {
                              const ljjlbl = calc.div(item.meaLedgerBreakdownDetail.yjlsl || 0, item.meaLedgerBreakdownDetail.fjsl || 0)
                              item.ljjlbl = calc.mul(Number(ljjlbl.toFixed(4)), 100);
                            }

                        } else {
                            item.ljjlbl = 0
                        }
                        return item;
                    })
                }
            }).finally(() => {
                this.loading = false;
            })
        }
    }
}
</script>

<style></style>
