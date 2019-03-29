<template>
    <div class="bill-list">
        <div class="title">
            <span>回调确认</span>
        </div>
        
        <div class="search">
            <div class="search-ct">
                <div class="search-name">状态</div>
                <el-select v-model="data.status" placeholder="请选择" class="pay-state">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct" v-if="rolesId != 1002">
                <div class="search-name">账户id</div>
                <el-input class="inline-input" v-model="data.auth_id" placeholder="请输入账户id" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">昵称</div>
                <el-input class="inline-input" v-model="data.nick_name" placeholder="请输入昵称" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">手机号</div>
                <el-input class="inline-input" v-model="data.phone" placeholder="请输入手机号" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">商户订单号</div>
                <el-input class="inline-input" v-model="data.mch_order_id" placeholder="请输入商户订单号" clearable></el-input>
            </div>
        </div>
        <div class="search">
            
             <div class="search-ct">
                <div class="search-name">系统订单号</div>
                <el-input class="inline-input" v-model="data.sys_order_id" placeholder="请输入系统订单号" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">选择日期范围</div>
                <el-date-picker
                    v-model="value7"
                    type="daterange"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    >
                </el-date-picker>
                <div class="rapid-btn" @click="searchToday">今日</div>
                <div class="rapid-btn" @click="searchYest">昨日</div>
                <div class="rapid-btn" @click="searchWeek">本周</div>
                <div class="rapid-btn" @click="searchLastWeek">上周</div>
                <div class="rapid-btn" @click="searchMonth">本月</div>
                <div class="rapid-btn" @click="searchLastMonth">上月</div>
                <div class="search-btn" @click="searchBtn">搜索</div>
                <div class="search-btn" @click="refresh">刷新</div>
            </div>
        </div>
        <div class="table">
            <el-table
                :data="tableData"
                border
                style="width: 100%"
               >
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
                    prop="qr_owner"
                    label="收款人"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="reserve_word"
                    label="付款备注号"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="mch_order_id"
                    label="商户订单号"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="sys_order_id"
                    label="系统订单号"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="下单金额"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="msg"
                    label="实付金额"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="100">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button> -->
                    <el-button @click="handleClickReissue(scope.row)" type="success" size="small" v-if="scope.row.status == '待支付' || scope.row.status == '超时关闭'">确认付款</el-button>
                    <el-button @click="handleClickRollback(scope.row)" type="primary" size="small" v-if="scope.row.super_order_id && scope.row.super_order_id.indexOf('unknown') === 0">回滚</el-button>
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
                    :total="total_count">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <el-form>
                <el-form-item label="下单金额">
                    <el-input v-model="row.money" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="实付金额">
                    <el-input v-model="row.real_money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="finish">确 定</el-button>
                <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import hostName from '../../config/hostName'
import { callbackList,callbackFinish,callbackRoll } from '../../config/api'
export default {
    name: "billDetail",
    data() {
        let that = this
        return{
           
            rolesId: localStorage.rolesId,  //角色权限
            dialogVisible: false,       //确认付款弹框
            row: '',                   //待确认付款项
            total_count: 0,
            currentPage: 1,
            options1: [{
                value: '',
                label: '请选择'
                },{
                value: '1',
                label: '待支付'
                }, {
                value: '3',
                label: '交易成功'
                }, {
                value: '4',
                label: '交易失败'
                }, {
                value: '9',
                label: '超时关闭'
                }],
            data: {
                auth_id: null,
                nick_name: null,
                phone: null,
                status: null,
                mch_order_id: null,
                sys_order_id: null,
                pay_type: null,
                start_time: null,
                end_time: null,
                offset: 0,
                limit: 10
            },
            tableData: [],
            value7: null,       //时间范围
        }
    },
    methods: {
        
        //今日
        searchToday() {
            const end = new Date();
            const start = new Date(new Date().toLocaleDateString())
            start.setTime(start.getTime())
            this.value7 = [start,end]
            this.searchBtn()
        },
        // 昨日
        searchYest() {
            const start = new Date();
            const end = new Date(new Date().toLocaleDateString())
            end.setTime(end.getTime())
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            this.value7 = [start,end]
            this.searchBtn()
        },
        //本周
        searchWeek() {
            const end = new Date();
            const start = new Date(new Date().toLocaleDateString())
            const nowDayOfWeek = start.getDay()
            if(nowDayOfWeek == 0) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            }else{
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek - 1));
            }
            this.value7 = [start,end]
            this.searchBtn()
        },
        //上周
        searchLastWeek() {
            const start = new Date()
            const end = new Date(new Date().toLocaleDateString());
            const nowDayOfWeek = end.getDay()
            if(nowDayOfWeek == 0) {
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
            }else{
                end.setTime(end.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek - 1));
            }
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
            this.value7 = [start,end]
            this.searchBtn()
        },
        //本月
        searchMonth() {
            const end = new Date();
            const start = new Date();
            start.setDate(1);
            start.setHours(0);
            start.setSeconds(0);
            start.setMinutes(0);
            start.getTime();
            this.value7 = [start,end]
            this.searchBtn()
        },
        //上月
        searchLastMonth() {
            const start = new Date()
            const end = new Date();
            start.setDate(1);
            start.setHours(0);
            start.setSeconds(0);
            start.setMinutes(0);
            end.setDate(1);
            end.setHours(0);
            end.setSeconds(0);
            end.setMinutes(0);
            const month = start.getMonth()
            const year = start.getFullYear()
            if(month == 0) {
                start.setFullYear(year - 1)
                start.setMonth(11)
            }else{
                start.setMonth(month - 1)
            }
            this.value7 = [start,end]
            this.searchBtn()
        },
        //搜索
        searchBtn() {
            if(this.value7 != null) {
                this.data.start_time = this.value7[0]
                this.data.end_time = this.value7[1]
            } else{
                this.data.start_time = null
                this.data.end_time = null
            }
            for( var key in this.data) {
                if(this.data[key] === null || this.data[key] === '') {
                    delete this.data[key]
                }
            }
            this.data.offset = 0
            this.getBillList()
            // this.getSum()
        },
        //刷新
        refresh() {
            this.data.auth_id = null
            this.data.nick_name = null
            this.data.phone = null
            this.data.status = null
            this.data.mch_order_id = null
            this.data.sys_order_id = null
            this.data.pay_type = null
            this.data.start_time = null
            this.data.end_time = null
            this.data.offset = 0
            this.getBillList()
        },
        //交易列表
        getBillList() {
            for(var key in this.data) {
                if(this.data[key] === '' || this.data[key] === null) {
                    delete this.data[key]
                }
            }
            if(localStorage.rolesId == 1002) {
                this.data.auth_id = localStorage.id
            }
            callbackList(this.data).then((res) => {
                this.total_count = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money && ele.money != '') {
                        ele.money = ele.money/100
                    }
                    if(!ele.msg) {
                        ele.real_money = ele.money
                    }
                    
                    if( ele.create_time ) {
                        ele.create_time = changeData(ele.create_time)
                    }
                    if(ele.status == 1) {
                        ele.status = '待支付'
                    }else if(ele.status == 3) {
                        ele.status = '交易成功'
                    }else if(ele.status == 4) {
                        ele.status = '交易失败'
                    }else if(ele.status == 9) {
                        ele.status = '超时关闭'
                    }else{
                        ele.status = '状态异常'
                    }
                })
               
            })
        },
        // 补单
        handleClickReissue(row) {
            this.dialogVisible = true
            this.row = row
        },
        //确认付款
        finish() {
            let data = {
                sys_order_id: this.row.sys_order_id,
                money: this.row.real_money * 100
            }
            callbackFinish(data).then( res => {
                this.dialogVisible = false
                this.$message.success('确认ok！！')
                this.data.offset = 0
                this.getBillList()
            })
        },
        //回滚
        handleClickRollback(row) {
            this.$confirm('确认回滚?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    sys_order_id: row.sys_order_id
                }
                callbackRoll(data).then( res => {
                    this.data.offset = 0
                    this.getBillList()
                })
                this.$message({
                    type: 'success',
                    message: '回滚成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        // 详情
        // handleClick(row) {
        //     this.$router.push({path: '/home/oneBillDetail',query: {billInfo: row}})
        // },
        
        handleSizeChange(val) {
            this.data.limit = val
            this.getBillList()
        },
        handleCurrentChange(val) {
            this.data.offset = (val -1) * this.data.limit
            this.getBillList()
        }
    },
    mounted() {
        this.getBillList()
    }

}
</script>

<style lang='sass' scoped>
.bill-list
    color: #3D4060;
    padding-left: 30px
    .title 
        font-size: 24px
        font-weight: bold
    .num-wrapper
        margin-top: 30px
        font-size: 18px
        .num
            display: inline-block
            margin-right: 50px
            margin-top: 15px
            font-size: 14px
            span
                color: red
    .search
        display: flex
        margin-top: 20px
        .search-ct
            margin-left: 40px
            .search-name
                font-size: 12px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 200px
            .pay-state
                width: 200px
            .rapid-btn
                display: inline-block
                width: 40px
                height: 35px
                line-height: 35px
                text-align: center
                border: 1px solid #00DB00
                color: #00DB00
                border-radius: 5px;
                font-size: 14px
                margin-left: 2px
                cursor: pointer
            .search-btn
                display: inline-block
                width: 80px
                height: 35px
                line-height: 35px
                text-align: center
                color: #fff
                background: #00BFA6;
                border-radius: 25px;
                font-size: 14px
                margin: 0 0 0 10px
        .search-ct:first-child
            margin-left: 0
           
    .table
        margin-top: 40px
        width: 1300px
        .block
            padding: 30px 0
            text-align: center 
  
</style>
