<template>
    <div>
        <el-table :height="250" v-loading="loading" :header-cell-style="headercellStyle"
            :cell-style="cellStyle" :data="tableData">
            <el-table-column label="子目号" align="center" prop="zmh" min-width="140" :show-overflow-tooltip="true"/>
            <el-table-column label="子目名称" align="center" prop="zmmc" min-width="140" :show-overflow-tooltip="true"/>
            <el-table-column label="单位" align="center" prop="dw" min-width="100"/>
            <el-table-column label="可设量数量" align="center" prop="sjsl" min-width="140"/>
            <el-table-column label="本期计量数量" align="center" prop="fjsl" min-width="140"/>
            <el-table-column label="累计数量" align="center" prop="bgsl" min-width="140"/>
            <el-table-column label="累计计量比例" align="center" prop="fhsl" min-width="140"/>
        </el-table>
    </div>
</template>

<script>
import { measurementAboutList } from '@/api/measurementDocumentsDetail/measurementDocumentsDetail';
export default {
    data () {
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
        measurementAboutList (query) {
            const params = {
                pzbh: query
            }
            this.loading = true;
            measurementAboutList(params).then(response => {
                this.tableData = response.rows;
            }).finally(() => {
                this.loading = false;
            })
        } 
    }
}
</script>

<style>

</style>