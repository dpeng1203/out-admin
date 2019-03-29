<template>
    <div class="account-manage">
        <div class="title">
            <span>提现管理</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.phone" placeholder="请输入手机号" clearable></el-input>
            </div>
             <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_id" placeholder="请输入商户号" clearable></el-input>
                <div class="search-btn" @click="searchBtn">搜索</div>
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
                    width="50">
                </el-table-column>
                
                <el-table-column
                    prop="mch_id"
                    align="center"
                    label="商户号"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    label="姓名"
                    show-overflow-tooltip
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    align="center"
                    label="商户全称"
                    show-overflow-tooltip
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="open_bank"
                    align="center"
                    label="银行卡类型"
                    show-overflow-tooltip
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="bankcard_number"
                    align="center"
                    label="银行卡号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="money"
                    align="center"
                    label="金额(元)"
                    width="80">
                </el-table-column>
                 <el-table-column
                    prop="type"
                    align="center"
                    label="代付类型"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="msg"
                    align="center"
                    label="备注"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="state"
                    align="center"
                    label="提现状态"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    align="center"
                    label="创建时间"
                    width="170">
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClickSucc(scope.row)" type="text" size="small" v-if="scope.row.state == '待处理'">到账</el-button>
                    <el-button @click="handleClickFail(scope.row)" type="text" size="small" v-if="scope.row.state == '待处理'">拒绝</el-button>
                    <!-- <el-button @click="handleClickSys(scope.row)" type="success" size="small" v-if="scope.row.state == '待处理'">系统代付</el-button> -->
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
        <el-dialog title="系统代付" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="通道名称" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option  v-for="item in payBankList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSysPay">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>若商户提现至先锋备付金，到账成功，将自动增加至商户代付余额，请勿重复入账！！！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureCash">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import { auditList,auditOk,payBankList,cashSys } from '../../config/api'
export default {
    name: 'cashList',
    data() {
        return{
            tableData: [],
            currentPage: 1,
            total: 0,
            data: {
                phone: null,
                mch_id: null,
                offset: 0,
                limit: 10
            },
            dialogVisible: false,
            selId: '',                  
            dialogFormVisible: false,
            cash_log_id: '',        //列表id
            form: {
                region: ''
            },
            formLabelWidth: '120px' ,
            payBankList: []
        }
    },
    methods: {
        getList() {
            auditList(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money && ele.money != '') {
                        ele.money = ele.money/100
                    }
                    if(ele.state == 0) {
                        ele.state = '待处理'
                    }else if(ele.state == 1) {
                        ele.state = '提现成功'
                    }else if(ele.state == 2){
                        ele.state = '提现失败'
                    }else if(ele.state == 9){
                        ele.state = '处理中'
                    }
                    if(ele.type == 1) {
                        ele.type = '手工代付'
                    } else if(ele.type == 2) {
                        ele.type = '平安'
                    } else if(ele.type == 3) {
                        ele.type = '先锋'
                    } else if(ele.type == 4) {
                        ele.type = 'cnt代付'
                    }
                    if( ele.create_time ) {
                        ele.create_time = changeData(ele.create_time)
                    }
                })
            })
        },

        searchBtn() {
            this.data.offset = 0
            this.getList()
        },
        //  成功到账
        handleClickSucc(row) {
            this.dialogVisible = true
            this.selId = row.id
            // this.$confirm('是否确认到账成功?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            // type: 'warning'
            // }).then(() => {
            //     let data = {
            //         cash_log_id: row.id,
            //         success: true
            //     }
            //     auditOk(data).then(res => {
            //         this.$message({
            //             type: 'success',
            //             message: '到账成功!'
            //         });
            //         this.getList()
            //     })
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });          
            // }); 
        },
        //  成功到账
        sureCash() {
            let data = {
                cash_log_id: this.selId,
                success: true
            }
            auditOk(data).then(res => {
                this.$message({
                    type: 'success',
                    message: '到账成功!'
                });
                this.dialogVisible = false
                this.getList()
            })
        },
        //拒绝到账
        handleClickFail(row) {
            this.$confirm('是否确认拒绝到账?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                let data = {
                    cash_log_id: row.id,
                    success: false
                }
                auditOk(data).then(res => {
                    this.$message({
                        type: 'success',
                        message: '已拒绝!'
                    });
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            }); 
        },
        //系统代付
        handleClickSys(row) {
            this.dialogFormVisible = true
            this.cash_log_id = row.id
            let data = {
                offset: 0,
                limit: 10000
            }
            payBankList(data).then( res => {
                this.payBankList = res.data.data_list
                this.payBankList = this.payBankList.filter( ele => {
                    return ele.state 
                })
            })
        },
        //确认代付
        sureSysPay() {
            this.dialogFormVisible = false
            let data = {
                cash_log_id: this.cash_log_id,
                bank_pay_id: this.form.region
            }
            cashSys(data).then( res => {
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
        }

    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang='sass' scoped>
.account-manage
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
        width: 1400px
        .block
            padding: 30px 0
            text-align: center 
</style>
