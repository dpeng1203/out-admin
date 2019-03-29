<template>
    <div class="mer-manage">
        <div class="title">
            <span>产品管理</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <el-select v-model="data.status" placeholder="请选择状态">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.app_name" placeholder="请输入内容" clearable></el-input>
                <div class="search-btn" @click="searchBtn">搜索</div>
                <div class="search-btn" @click="addAgentBox = true">新增</div>
            </div>
        </div>

        <div class="table">
            <el-table
                :data="tableData"
                border
                size="small"
                style="width: 100%">
                <el-table-column
                    type="index"
                    align="center"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="app_name"
                    label="应用名称"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="费率（%）"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,50,100, 200, 300, 400]"
                    :page-size="data.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="添加子账户" :visible.sync="addAgentBox">
            <el-form :model="form">
                 <el-form-item label="应用名称" :label-width="formLabelWidth">
                    <el-input v-model="form.app_name" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                 <el-form-item label="费率（%）" :label-width="formLabelWidth">
                    <el-input v-model="form.rate" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAgentBox = false">取 消</el-button>
                <el-button type="primary" @click="addApp">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import { sysApp,addSysApp } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            tableData: [],
            currentPage: 1,
            total: 0,
            options1: [{
                value: null,
                label: '请选择状态'
                },{
                value: '0',
                label: '关闭'
                }, {
                value: '1',
                label: '开启'
                }],
            addAgentBox: false,
            formLabelWidth: '120px',
            form: {
                app_name: null,
                rate: null
            },
            data: {
                app_name: null,
                status: null,
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        getList() {
            if(this.data.app_name == '') {
                delete this.data.app_name
            }
            sysApp(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.status && ele.status == true) {
                        ele.status = '开启'
                    }else {
                        ele.status = '关闭'
                    }
                    if(ele.rate) {
                        ele.rate = ele.rate/100
                    }
                    if( ele.create_time ) {
                        ele.create_time = changeData(ele.create_time)
                    }
                })
                console.log(res)
            })
        },

        addApp() {
            this.form.rate = this.form.rate*100
            addSysApp(this.form).then( res => {
                 this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.addAgentBox = false
                this.getList()
            })
        },

        searchBtn() {
            this.data.offset = 0
            this.getList()
        },

        handleClick(row) {
            console.log(row);
            this.$router.push({path: '/home/changeSysApp',query: {detail: row}})
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.data.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.data.offset = (val - 1) * this.data.limit
            this.getList()
        },
        addBtn() {
            this.$router.push('/home/addSysApp')
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
    .search
        display: flex
        margin-top: 20px
        .search-ct
            margin-left: 20px
            .search-name
                font-size: 14px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 180px
            .search-btn
                display: inline-block
                width: 80px
                height: 35px
                margin-top: 60px
                line-height: 35px
                text-align: center
                color: #fff
                background: #e6a23c;
                border-radius: 5px;
                font-size: 14px
                margin: 0 0 0 30px
        .search-ct:first-child
            margin-left: 0
    .table
        margin-top: 40px
        width: 1002px
        .block
            padding: 30px 0
            text-align: center 
</style>
