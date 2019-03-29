<template>
    <div class="bill-list">
        <div class="title">
            <span>充值管理</span>
        </div>
        
        <div class="search">
            <div class="search-ct">
                <el-select v-model="data.status" placeholder="请选择状态" class="pay-state">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_ids" placeholder="请输入商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_order_id" placeholder="请输入商户订单号" clearable></el-input>
            </div>
             <div class="search-ct">
                <el-input class="inline-input" v-model="data.sys_order_id" placeholder="请输入系统订单号" clearable></el-input>
            </div>
            <div class="search-ct">
                <el-select v-model="data.pay_type" placeholder="请选择支付类型" class="pay-state">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <el-date-picker
                    class="time"
                    v-model="value7"
                    type="daterange"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    >
                </el-date-picker>
                <!-- <div class="rapid-btn" @click="searchToday">今日</div>
                <div class="rapid-btn" @click="searchYest">昨日</div>
                <div class="rapid-btn" @click="searchWeek">本周</div>
                <div class="rapid-btn" @click="searchLastWeek">上周</div>
                <div class="rapid-btn" @click="searchMonth">本月</div>
                <div class="rapid-btn" @click="searchLastMonth">上月</div> -->
                <div class="search-btn" @click="searchBtn">搜索</div>
                <!-- <div class="search-btn" @click="refresh">刷新</div> -->
                <div class="search-btn" @click="excel">导出</div>
            </div>
        </div>
        <div class="search">
            
        </div>
        <!-- <div class="num-wrapper">
            <div class="num">成交总金额：<span>{{ total }}</span> 元</div>
            <div class="num">成交总手续费：<span>{{ mchCharge }}</span> 元</div>
            <div class="num">成交总笔数：<span>{{ count }}</span> 笔</div>
        </div> -->
        <div class="table">
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                size="small"
                
                :row-class-name="tableRowClassName">
                <el-table-column
                    type="index"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    label="商户号"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    label="商户名称"
                    show-overflow-tooltip
                    align="center"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="mch_order_id"
                    align="center"
                    show-overflow-tooltip
                    label="商户订单号"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="sys_order_id"
                    align="center"
                    label="系统订单号"
                    width="180">
                </el-table-column>
                
                <el-table-column
                    prop="channel"
                    label="通道"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="money"
                    align="center"
                    label="金额"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="mch_charge"
                    align="center"
                    label="手续费"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    align="center"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="订单状态"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="is_success"
                    label="回调状态"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                    <el-button @click="handleClickReissue(scope.row)" type="text" size="small" v-if="scope.row.state == '待支付' || scope.row.state == '超时关闭'">补单</el-button>
                    <el-button @click="handleClickRollback(scope.row)" type="text" size="small" v-if="scope.row.super_order_id && scope.row.super_order_id.indexOf('unknown') === 0">回滚</el-button>
                    <el-button @click="handleClickNotify(scope.row)" type="text" size="small">回调</el-button>
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
        
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import hostName from '../../config/hostName'
import { moneySum,billList,reissue,getMch,rollback,notify } from '../../config/api'
export default {
    name: "billDetail",
    data() {
        let that = this
        return{
            state2: '',
            mchList: [],         //查询商户列表
            total_count: 0,
            currentPage: 1,
            total: '',
            mchCharge: '',
            count: '',
            options1: [{
                value: '',
                label: '请选择'
                },{
                value: '1',
                label: '待支付'
                }, {
                value: '2',
                label: '交易进行中'
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
            options2: [{
                value: '',
                label: '请选择'
                },{
                value: 'alipay',
                label: '支付宝'
                }, {
                value: 'wx',
                label: '微信'
                }],
            data: {
                mch_ids: null,
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
            value7: null,
            excelUrl: ''
        }
    },
    methods: {
        tableRowClassName({row,rowIndex}) {
            if(row.super_order_id && row.super_order_id.indexOf('unknown') === 0) {
                return 'success'
            }
            return ''
        },
        getSum() {
            moneySum(this.data).then((res) => {
                this.total = Number(res.data.sum)/100 || 0
                this.mchCharge = Number(res.data.mch_charge)/100 || 0
                this.count = res.data.count || 0
            })
        },
        //商户收搜
        handleSelect(item) {
            this.data.mch_name = item.value
            this.getBillList()
            // this.getSum()
        },
        //关键字查询
        querySearch(queryString, cb) {
            this.mchList = []
            getMch(queryString).then( res => {
                let list = res.data
                list.forEach( ele => {
                    let obj = {}
                    obj.value = ele
                    this.mchList.push(obj)
                })
            })
            cb(this.mchList)
        },
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
            this.data.mch_ids = null
            this.data.status = null
            this.data.mch_order_id = null
            this.data.sys_order_id = null
            this.data.pay_type = null
            this.data.start_time = null
            this.data.end_time = null
            this.data.offset = 0
            this.getBillList()
        },
        //导出excel
        excel() {
            if(this.value7 != null) {
                this.data.start_time = this.value7[0]
                this.data.end_time = this.value7[1]
                var dateee = new Date(this.data.start_time).toJSON();
                this.data.start_time = new Date(+new Date(dateee)).toISOString()
                var dateee1 = new Date(this.data.end_time).toJSON();
                this.data.end_time = new Date(+new Date(dateee1)).toISOString()
            } else{
                this.data.start_time = null
                this.data.end_time = null
            }
            for( var key in this.data) {
                if(this.data[key] === null || this.data[key] === '') {
                    delete this.data[key]
                }
            }
            // billExcel(this.data).then(res =>{
            this.excelUrl = hostName + '/bill/export?'
            Object.keys(this.data).map((key)=>{
                this.excelUrl += key + '=' + this.data[key] +'&';    
            })
            console.log(this.excelUrl)
            window.location.href = this.excelUrl
            // })

        },
        //交易列表
        getBillList() {
            billList(this.data).then((res) => {
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money && ele.money != '') {
                        ele.money = ele.money/100
                    }
                    if(ele.mch_charge && ele.mch_charge != '') {
                        ele.mch_charge = ele.mch_charge/100
                    }
                    if( ele.create_time ) {
                        ele.create_time = changeData(ele.create_time)
                    }
                    if( ele.trade_time ) {
                        ele.trade_time = changeData(ele.trade_time)
                    }
                    if(ele.is_success) {
                        ele.is_success = '回调成功'
                    }
                    if(ele.state == 1) {
                        ele.state = '待支付'
                    }else if(ele.state == 2) {
                        ele.state = '交易进行中'
                    }else if(ele.state == 3) {
                        ele.state = '交易成功'
                    }else if(ele.state == 4) {
                        ele.state = '交易失败'
                    }else if(ele.state == 9) {
                        ele.state = '超时关闭'
                    }else{
                        ele.state = '状态异常'
                    }
                })
                this.total_count = res.data.total_count
            })
        },
        // 补单
        handleClickReissue(row) {
            this.$confirm('确认补单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    sys_order_id: row.sys_order_id
                }
                reissue(data).then( res => {
                    this.getBillList()
                })
                this.$message({
                    type: 'success',
                    message: '补单成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
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
                rollback(data).then( res => {
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
        handleClick(row) {
            this.$router.push({path: '/home/oneBillDetail',query: {billInfo: row}})
        },
        // 发起回调
        handleClickNotify(row) {
            this.$confirm('确认发起回调?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    mch_order_id: row.mch_order_id
                }
                notify(data).then(res => {
                    this.$message.success('成功！！')
                })
            })
            
        },
        
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
        // this.getSum()
        this.getBillList()
    }

}
</script>

<style lang='sass' scoped>
.bill-list
    color: #3D4060;
    padding-left: 30px
    .title 
        font-size: 20px
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
            margin-left: 15px
            .search-name
                font-size: 12px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 160px
            .pay-state
                width: 150px
            .time
                width: 250px
            .rapid-btn
                display: inline-block
                width: 40px
                height: 35px
                line-height: 35px
                text-align: center
                border: 1px solid #e6a23c
                color: #e6a23c
                border-radius: 5px;
                font-size: 14px
                margin-left: 2px
                cursor: pointer
            .search-btn
                display: inline-block
                width: 60px
                height: 35px
                line-height: 35px
                text-align: center
                color: #fff
                background: #e6a23c;
                border-radius: 5px;
                font-size: 14px
                margin: 0 0 0 10px
        .search-ct:first-child
            margin-left: 0
           
    .table
        margin-top: 40px
        width: 1415px
        .block
            padding: 30px 0
            text-align: center 
  
</style>
