<template>
    <div class="mer-manage">
        <div class="title">
            <span>支付宝H5</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <div class="search-name">商户号</div>
                <el-input class="inline-input" v-model="data.mch_id" placeholder="请输入商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">备注</div>
                <el-input class="inline-input" v-model="data.msg" placeholder="请输入备注" clearable></el-input>
                <div class="search-btn" @click="searchBtn">搜索</div>
            </div>
        </div>

        <div class="table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    label="商户号"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="msg"
                    label="备注"
                    width="280">
                </el-table-column>
                <el-table-column
                    prop="min"
                    label="单笔最小值"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="max"
                    label="单笔最大值"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="total"
                    label="交易金额上限"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="today"
                    label="今日交易金额"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="账户状态"
                    width="100">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <el-button @click="handleSet(scope.row)" type="text" size="small">更新</el-button>
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
        <!-- 更新支付宝账户 -->
        <el-dialog title="更新账户信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="单笔最小值:" :label-width="formLabelWidth">
                    <el-input v-model="form.min" style="width:220px"></el-input>
                </el-form-item>
                <el-form-item label="单笔最大值:" :label-width="formLabelWidth">
                    <el-input v-model="form.max" style="width:220px"></el-input>
                </el-form-item>
                <el-form-item label="交易金额上限:" :label-width="formLabelWidth">
                    <el-input v-model="form.total" style="width:220px"></el-input>
                </el-form-item>
                <el-form-item label="账户状态:" :label-width="formLabelWidth">
                    <el-select v-model="enable" placeholder="请选择">
                        <el-option label="激活" value="true"></el-option>
                        <el-option label="关闭" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户号:" :label-width="formLabelWidth">
                    <el-input v-model="mch_id" style="width:220px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setZfbhb">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import { zfbhb,changeZfbhb } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            rolesId: localStorage.rolesId,
            tableData: [],
            currentPage: 1,
            total: 0,
            money: '',
            data: {
                mch_id: '',
                msg: '',
                offset: 0,
                limit: 10
            },
            dialogFormVisible: false,
            id: null,
            form: {
                min: '',
                max: '',
                total: ''
            },
            enable: null,
            mch_id: null,
            formLabelWidth: '150px'    
        }
    },
    methods: {
        getList() {
            if(this.data.msg === '') {
                delete this.data.msg
            }
            if(this.data.mch_id === '') {
                delete this.data.mch_id
            }
            zfbhb(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.min) {
                        ele.min = ele.min/100
                    }
                    if(ele.max) {
                        ele.max = ele.max/100
                    }
                    if(ele.total) {
                        ele.total = ele.total/100
                    }
                    if(ele.today) {
                        ele.today = ele.today/100
                    }
                    if(ele.enable) {
                        ele.state = '激活'
                    }else{
                        ele.state = '冻结'
                    }
                })
            })
        },
        searchBtn() {
            this.data.offset = 0
            this.getList()
        },

        handleSet(row) {
            this.dialogFormVisible = true
            this.id = row.id
            this.form.min = row.min
            this.form.max = row.max
            this.form.total = row.total
            this.enable = row.enable.toString() 
            this.mch_id = row.mch_id || null
        },
        setZfbhb() {
            let data = this.form
            for( let key in data ) {
                data[key] = data[key]*100
            }
            data.enable = this.enable
            data.mch_id = this.mch_id
            changeZfbhb(this.id,data).then(res => {
                this.$message.success('更新成功！！')
                this.dialogFormVisible = false
                this.getList()
            })
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
        font-size: 24px
        font-weight: bold
    .search
        display: flex
        margin-top: 20px
        .search-ct
            margin-left: 60px
            font-size: 14px
            .search-name
                font-size: 14px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 220px
            .time
                width: 50px
            .search-btn
                display: inline-block
                width: 80px
                height: 35px
                margin-top: 60px
                line-height: 35px
                text-align: center
                color: #fff
                background: #00BFA6;
                border-radius: 25px;
                font-size: 14px
                margin: 0 0 0 30px
        .search-ct:first-child
            margin-left: 0
    .table
        margin-top: 40px
        width: 1100px
        .block
            padding: 30px 0
            text-align: center 
</style>
