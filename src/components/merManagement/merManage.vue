<template>
    <div class="mer-manage">
        <div class="title">
            <span>商户管理</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <el-select v-model="data.audit_state" placeholder="请选择审核状态" class="inline-input">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <el-select v-model="data.mch_state" placeholder="请选择账户状态" class="inline-input">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_id" placeholder="请输入商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_name" placeholder="请输入商户名称" clearable></el-input>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.phone" placeholder="请输入手机号" clearable></el-input>
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
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    label="商户号"
                    align="center"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    label="商户名称"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="注册手机号"
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="账户余额"
                    align="center"
                    width="120">
                </el-table-column>
                
                <el-table-column
                    prop="audit_state"
                    label="审核状态"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="mch_state"
                    label="账户状态"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="channel_name"
                    align="center"
                    label="通道"
                    width="120">
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                >
                <template slot-scope="scope">
                    
                    <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                    <el-button @click="handleClickCutChannel(scope.row)" type="text" size="small">切换通道</el-button>
                    <el-button @click="handleClickResetPw(scope.row)" type="text" size="small">重置密码</el-button>
                    <el-button @click="handleClickCutState(scope.row)" type="text" size="small">{{scope.row.mch_state == '激活' ? '冻结' : '激活'}}</el-button>
                    
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
        <el-dialog title="切换通道" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="通道名称" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option  v-for="item in channelList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureChangeChannel">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <div class="tip">交易金额（元）:<span>{{mchMoney.recharge}}</span></div> 
            <div class="tip">分润金额（元）:<span>{{mchMoney.bonus}}</span></div> 
            <div class="tip">在途金额（元）:<span>{{mchMoney.pending}}</span></div> 
            <div class="tip">账户余额（元）:<span>{{mchMoney.total}}</span></div> 
            <div class="tip">代付金额（元）:<span>{{mchMoney.reservoir}}</span></div> 
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="代付充值" :visible.sync="dialogFormVisible1">
            <el-form :model="form">
                <el-form-item label="充值金额：" :label-width="formLabelWidth">
                    <el-input v-model="form.money" class="input-width" placeholder="请输入金额"></el-input>
                </el-form-item>
                <el-form-item label="密码：" :label-width="formLabelWidth">
                    <el-input v-model="form.password" class="input-width" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="hanlePay">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="充值记录" :visible.sync="dialogTableVisible" width="1000px">
            <el-table :data="gridData" >
                <el-table-column property="account_name" label="姓名" width="80"></el-table-column>
                <el-table-column property="account_no" label="银行卡号" width="160"></el-table-column>
                <el-table-column property="recevie_bank" label="备付金账户标识" width="120"></el-table-column>
                <el-table-column property="auth_name" label="操作人" width="80"></el-table-column>
                <el-table-column property="money" label="金额" width="100"></el-table-column>
                <el-table-column property="type" label="类型" width="130"></el-table-column>
                <el-table-column property="status" label="状态" width="100"></el-table-column>
                <el-table-column property="create_time" label="创建时间"></el-table-column>
                
            </el-table>
            <div class="block" style="text-align: center">
                <el-pagination layout="prev, pager, next" 
                :total="gridDataNum" 
                :page-size='rechargeData.limit'
                @current-change="handleCurChange"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import formatDate from '../../config/formatData'
import { merList,cutMchState,channelList,changeMchChannel,resetMchPW,recharge,payRate,rechargeList } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            tableData: [],
            gridData: [],
            currentPage: 1,
            total: 0,
            gridDataNum: 0,
            options1: [{
                value: null,
                label: '请选择审核状态'
                },{
                value: '0',
                label: '待审核'
                }, {
                value: '1',
                label: '审核成功'
                }, {
                value: '2',
                label: '审核失败'
                }],
            options2: [{
                value: null,
                label: '请选择账户状态'
                },{
                value: 'enable',
                label: '激活'
                }, {
                value: 'disable',
                label: '冻结'
                }],
            data: {
                phone: null,
                mch_name: null,
                mch_state: null,
                mch_id: null,
                audit_state: null,
                offset: 0,
                limit: 10
            },
            rechargeData: {
                mch_id: '',
                offset: 0,
                limit: 10
            },
            dialogVisible: false,
            mchMoney: {},
            dialogFormVisible: false,
            dialogTableVisible: false,
            dialogFormVisible1: false,
            form: {
                region: '',
                money: '',
                password: ''
            },
            formLabelWidth: '120px' ,
            channelList: [] ,
            mch_id: '',
            row: {}
        }
    },
    methods: {
        //商户列表
        getList() {
            for(var key in this.data) {
                if(this.data[key] === '') {
                    delete this.data[key]
                }
            }
            merList(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money) {
                        ele.money = ele.money/100
                    }
                    if(ele.reservoir) {
                        ele.reservoir = ele.reservoir/100
                    }
                    if(ele.mch_state == 'enable') {
                        ele.mch_state = '激活'
                    } else{
                        ele.mch_state = '冻结'
                    }
                    if(ele.audit_state == 0) {
                        ele.audit_state = '待审核'
                    }else if(ele.audit_state == 1) {
                        ele.audit_state = '审核成功'
                    }else {
                        ele.audit_state = '审核失败'
                    }
                })
            })
        },
        // 通道列表
        getChannelList() {
            let data = {
                offset: 0,
                limit: 10000
            }
            channelList(data).then((res) => {
                this.channelList = res.data.data_list
                this.channelList = this.channelList.filter( ele => {
                    return ele.state 
                })
            })
        },
        //切换通道
        handleClickCutChannel(row) {
            this.dialogFormVisible = true
            this.getChannelList()
            this.mch_id = row.mch_id
        },
        //选择通道
        sureChangeChannel() {
            this.dialogFormVisible = false
            if(this.form.region != '') {
                let data = {
                    mch_id: this.mch_id,
                    channel_id: this.form.region
                }
                changeMchChannel(data).then( res => {
                    this.getList()
                })
            }
        },
        // 切换商户状态
        handleClickCutState(row) {
            this.$confirm('确定切换商户状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    mch_id: row.mch_id,
                    open: row.mch_state == '激活' ? false : true
                }
                cutMchState(data).then( res => {
                    this.$message({
                        type: 'success',
                        message: '切换成功!'
                    });
                    this.getList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        //  重置密码
        handleClickResetPw(row) {
            this.$prompt('请输入新密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let data ={
                    mch_id: row.mch_id,
                    password: value
                }
                resetMchPW(data).then( res => {
                    this.$message({
                        type: 'success',
                        message: '设置成功！'
                    });
                })
                
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消输入'
            });       
            });
        },
        searchBtn() {
            this.data.offset = 0
            this.getList()
        },
        //代付充值
        // handleClickVecharge(row) {
        //     this.dialogFormVisible1 = true
        //     this.mch_id = row.mch_id
        // },
        //确认充值
        // hanlePay() {
        //     if(this.form.money == '') {
        //         this.$message.error('请输入金额')
        //         return
        //     }
        //     if(this.form.password == '') {
        //         this.$message.error('请输入密码')
        //         return
        //     }
        //     let data = {
        //         mch_id: this.mch_id,
        //         money: this.form.money * 100,
        //         password: this.form.password
        //     }
        //     recharge(data).then( res => {
        //         this.$message({
        //             type: 'success',
        //             message: '充值成功!'
        //         });
        //         this.dialogFormVisible1 = false
        //         this.dialogVisible = true
        //         this.mchMoney = res
        //         this.mchMoney.recharge = this.mchMoney.recharge/100
        //         this.mchMoney.bonus = this.mchMoney.bonus/100
        //         this.mchMoney.total = this.mchMoney.total/100
        //         this.mchMoney.pending = this.mchMoney.pending/100
        //         this.mchMoney.reservoir = this.mchMoney.reservoir/100
        //         this.getList()
        //     })
        // },
        //充值记录
        // handleTable(row) {
        //     this.row = row
        //     this.dialogTableVisible = true
        //     this.rechargeData.mch_id = row.mch_id
        //     rechargeList(this.rechargeData).then( res => {
        //         this.gridData = res.data.data_list
        //         this.gridDataNum = res.data.total_count
        //         console.log(this.gridDataNum)
        //         this.gridData.forEach( ele => {
        //             if(ele.money) {
        //                 ele.money = ele.money/100
        //             }
        //             ele.create_time = formatDate(ele.create_time)
        //             if(ele.type == 1) {
        //                 if(ele.recevie_bank&&ele.recevie_bank!='') {
        //                     ele.type = '线下充值-商户'
        //                 }else{
        //                     ele.type = '线下充值-系统'
        //                 }
        //             }else if(ele.type == 2) {
        //                 ele.type = '余额转换'
        //             }
        //             if(ele.status == 1) {
        //                 ele.status = '进行中'
        //             }else if(ele.status == 2) {
        //                 ele.status = '充值失败'
        //             }else if(ele.status == 3) {
        //                 ele.status = '充值成功'
        //             }
        //             if(ele.recevie_bank === 'UPOPJS') {
        //                 ele.recevie_bank = '银联'
        //             }else if(ele.recevie_bank === 'NUCC') {
        //                 ele.recevie_bank = '网联'
        //             }
        //         })
        //     })
        // },

        handleClick(row) {
            this.$router.push({path: '/home/merDetail',query: {mch: row}})
        },
        //设置商户代付费率
        // handleClickPayRate(row) {
        //     this.$prompt('请输入商户代付费率(%)', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //     }).then(({ value }) => {
        //         let data = {
        //             mch_id: row.mch_id,
        //             rate: value * 100
        //         }
        //         payRate(data).then( res => {
        //             this.$message({
        //                 type: 'success',
        //                 message: '设置成功！！'
        //             });
        //         })
                
        //     }).catch(() => {
        //         this.$message({
        //             type: 'info',
        //             message: '已取消'
        //         });       
        //     });
        // },
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
        handleCurChange(val) {
            this.rechargeData.offset = (val - 1) * this.rechargeData.limit
            this.handleTable(this.row)
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
        font-size: 24px
        font-weight: bold
    .search
        display: flex
        margin-top: 20px
        .search-ct
            margin-left: 20px
            .search-name
                font-size: 13px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 180px
            .search-btn
                display: inline-block
                width: 100px
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
        width: 1315px
        .block
            padding: 30px 0
            text-align: center 
    .tip
        margin-top: 10px
        span
            margin-left: 30px
            color: red
    .input-width
        width: 220px
</style>
