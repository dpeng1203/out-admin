<template>
    <div class="mer-manage">
        <div class="title">
            <span>费率设置</span>
        </div>  
        <div class="sys-rate">系统费率</div>
        <div class="table">
            <el-table
                :data="tableData"
                border
                size="small"
                >
                <el-table-column
                    type="index"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="app_name"
                    align="center"
                    label="应用名称"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="rate"
                    align="center"
                    label="费率（%）"
                    width="150">
                </el-table-column>
            </el-table>
        </div>
        <div class="sys-rate">自定义费率(需要时选填)</div>
        
        <div class="input-wrapper" v-for="item in rate" :key="item.app_id">
            <el-select v-model="item.app_id" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="item.rate" placeholder="请输入费率（%）"></el-input>
        </div>
        <el-button class="add-btn" @click="addRate" v-if="!(rate.length == tableData.length)" >新增</el-button>
        <div class="sure-btn" @click="sure">确认</div>
    </div>
</template>

<script>
import { sysApp,zdyRate } from '../../config/api'
import formatDate from '../../config/formatData'
export default {
    data() {
        return{
            rate: [{
                app_id: null,
                rate: null
            }],
            options: [],
            tableData: [],
            input: '',
            select: '',
            data: {
                offset: 0,
                limit: 100000
            }
        }
    },
    methods: {
        getList() {
            sysApp(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach(ele => {
                    let obj = {}
                    obj.value = ele.id
                    obj.label = ele.app_name
                    this.options.push(obj)
                    if(ele.rate) {
                         ele.rate = ele.rate/100
                    }
                    if(ele.create_time) {
                        ele.create_time = formatDate(ele.create_time)
                    }
                })
            })
        },
        addRate() {
            if(this.rate[this.rate.length - 1].rate && this.rate[this.rate.length - 1].rate!='') {
                this.options = this.options.filter(ele => {
                    return ele.value != this.rate[this.rate.length - 1].app_id
                })
                let obj = {}
                obj.app_id = null
                obj.rate = null
                this.rate.push(obj)
            }else {
                this.$message({
                    message: '请选择应用名称与费率',
                    type: 'warning'
                });
            }
        },
        sure() {
            let apps = this.rate
            apps.forEach(ele => {
                ele.mch_id = this.$route.query.merId
                if(ele.rate) {
                    ele.rate = ele.rate*100
                }
            })
            let data = {
                apps: apps
            }
            if(apps[0].app_id != null && apps[0].app_id != '') {
                zdyRate(data).then( res => {
                    this.$message({
                        message: '设置成功！',
                        type: 'success'
                    });
                })
            }
            this.$router.push('/home/merManage')
        }

    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang='sass' scoped>
.mer-manage
    color: #3D4060;
    padding-left: 30px
    .title 
        font-size: 20px
        font-weight: bold
    .sys-rate
        font-size: 15px
        margin-top: 30px
        font-weight: bold
    .table
        margin-top: 10px
        width: 601px
        padding-bottom: 30px
        border-bottom: 1px solid #ccc 
    .add-btn
        margin-top: 10px 
    .input-wrapper
        margin-top: 10px
        width: 450px
        .el-input
            width: 220px
    .sure-btn
        display: block
        font-size: 14px
        background: #e6a23c
        border-radius: 5px
        color: #fff
        width: 150px    
        height: 40px 
        line-height: 40px
        margin-left: 30px 
        margin: 100px 0 100px 0
        text-align: center
</style>