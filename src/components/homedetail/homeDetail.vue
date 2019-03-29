<template>
    <div class="data-detail">
        <div class="stat-wrapper">
            <div class="data-wrapper">
                <div class="title">
                    <span>支付数据：</span>
                    <el-select v-model="value1" placeholder="请选择" @change="changeEnterDate">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="pay-box">
                    <!-- <div class="content">
                        <div class="cont-title">成功收款金额</div>
                        <div class="money"><span class="number">{{enterDate.suc_money}}</span>万元</div>
                    </div>
                    <div class="content">
                        <div class="cont-title">成功订单量</div>
                        <div class="money"><span class="number">{{enterDate.suc_count}}</span>笔</div>
                    </div>
                    <div class="content">
                        <div class="cont-title">未成功收款金额</div>
                        <div class="money"><span class="number">{{enterDate.fail_money}}</span>万元</div>
                    </div>
                    <div class="content">
                        <div class="cont-title">未成功订单量</div>
                        <div class="money"><span class="number">{{enterDate.fail_count}}</span>笔</div>
                    </div> -->
                    <el-card shadow="always" class="content">
                        <div class="title">成功数据</div>
                        <div class="cont-title">收款金额：<span>{{enterDate.suc_money}}</span> 万元</div>
                        <div class="cont-title">订单量：<span>{{enterDate.suc_count}}</span> 笔</div>
                    </el-card>
                    <el-card shadow="always" class="content">
                        <div class="title">失败数据</div>
                        <div class="cont-title">收款金额：<span>{{enterDate.fail_money}}</span> 万元</div>
                        <div class="cont-title">订单量：<span>{{enterDate.fail_count}}</span> 笔</div>
                    </el-card>
                    <el-card shadow="always" class="content">
                        <div class="title">支付分润</div>
                        <div class="btn"><el-button type="primary" size="small" @click="dialogTableVisible1 = true">查看</el-button></div>
                    </el-card>
                    <el-card shadow="always" class="content">
                        <div class="title">统计</div>
                        <div class="cont-title">成功率：<span>{{enterDate.rate}}</span> %</div>
                        <div class="cont-title">总手续费：<span>{{enterDate.charge}}</span> 元</div>
                        <div class="cont-title">支付收益：<span>{{enterDate.profit}}</span> 元</div>
                    </el-card>
                </div>
                <!-- <div class="pay-box">
                    <div class="content">
                        <div class="cont-title">总手续费</div>
                        <div class="money"><span class="number">{{enterDate.charge}}</span>元</div>
                    </div>
                    <div class="content">
                        <div class="cont-title">成功率</div>
                        <div class="money"><span class="number">{{enterDate.rate}}</span>%</div>
                    </div>
                    <div class="content">
                        <div class="cont-title">支付分润</div>
                        <div class="btn"><el-button type="primary" size="small" @click="dialogTableVisible1 = true">查看</el-button></div>
                    </div>
                    <div class="content">
                        <div class="cont-title">支付收益</div>
                        <div class="money"><span class="number">{{enterDate.profit}}</span>元</div>
                    </div>
                </div> -->
            </div>
        </div>

        <el-dialog title="代理商支付分润" :visible.sync="dialogTableVisible1">
            <el-table :data="gridData1">
                <el-table-column property="mch_id" label="商户号" width="300"></el-table-column>
                <el-table-column property="money" label="金额(元)" ></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="代理商代付分润" :visible.sync="dialogTableVisible2">
            <el-table :data="gridData2">
                <el-table-column property="mch_id" label="商户号" width="300"></el-table-column>
                <el-table-column property="money" label="金额(元)"></el-table-column>
            </el-table>
        </el-dialog>


        <div class="chart">
            <div class="chart-wrapper" >
                <div class="chart-title">每小时交易金额</div>
                <div class="chart-ct">
                    <div id="c1"></div>
                </div>
            </div>
            <div class="chart-wrapper" >
                <div class="chart-title">每小时交易数量</div>
                <div class="chart-ct">
                    <div id="c2"></div>
                </div>
            </div>
        </div>
        <div class="chart">
            <div class="chart-wrapper" >
                <div class="chart-title">
                    <span>时间:</span>
                    <el-select v-model="value" placeholder="请选择" style="margin-left: 10px" @change="changeDate">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="chart-ct chart-ct1">
                    <div id="channel" style="width: 100%;height:400px;"></div>
                    <!-- <div id="mountNode"></div> -->
                </div>
            </div>
            <div class="chart-wrapper" >
                <div class="chart-title">
                    <span v-if="channel_id == ''">所有通道</span>
                    <span v-else>通道--{{channel_name}}</span>
                </div>
                <div class="chart-ct chart-ct1">
                    <div id="mch" style="width: 100%;height:400px;"></div>
                </div>
            </div>
        </div>
        <div class="chart" v-if="mch_id != ''">
            <div class="chart-wrapper" >
                <div class="chart-title">
                    <span>商户--{{mch_id}}</span>
                    <span style="margin-left: 10px" v-if="channel_id != ''">通道--{{channel_name}}</span>
                </div>
                <div class="chart-ct chart-ct1">
                    <div id="status" style="width: 100%;height:400px;"></div>
                </div>
            </div>
        </div>
    </div>
       
</template>

<script>
import { chartData,picData,channelList,xfMoneySum,enterDate,outDate } from '../../config/api'
import G2 from '@antv/g2';
var echarts = require('echarts');
export default {
    data() {
        return{
            serverData: [],
            options: [
                {value: '0d',label: '今天'},{value: '1d',label: '昨天'},{value: '3d',label: '最近3天'},{value: '7d',label: '最近一周'},
                {value: '1m',label: '最近一月'},{value: '3m',label: '最近三月'},{value: '1y',label: '最近一年'}
            ],
            value: '3d',
            options1: [
                {value: '0d',label: '今天'},{value: '1d',label: '昨天'},{value: '3d',label: '最近3天'},{value: '7d',label: '最近一周'},
                {value: '1m',label: '最近一月'},{value: '3m',label: '最近三月'},{value: '1y',label: '最近一年'}
            ],
            value1: '0d',
            options2: [
                {value: '0d',label: '今天'},{value: '1d',label: '昨天'},{value: '3d',label: '最近3天'},{value: '7d',label: '最近一周'},
                {value: '1m',label: '最近一月'},{value: '3m',label: '最近三月'},{value: '1y',label: '最近一年'}
            ],
            value2: '0d',
            

            channel_id: '',         //圆饼图所选通道id
            channel_name: '',       //圆饼图所选通道名称
            mch_id: '',             //圆饼图所选商户id
            option: {
                title : {
                    text: '通道交易额比例',
                    // subtext: '纯属虚构',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}元 ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 0,
                    top: 20,
                    bottom: 20,
                    data: []
                },
                series : [
                    {
                        name: '通道',
                        type: 'pie',
                        radius : '55%',
                        center: ['40%', '60%'],
                        data:[],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            option1: {
                title : {
                    text: '商户交易额比例',
                    // subtext: '纯属虚构',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}元 ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: []
                },
                series : [
                    {
                        name: '商户',
                        type: 'pie',
                        radius : '55%',
                        center: ['40%', '60%'],
                        data:[],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            option2: {
                title : {
                    text: '商户交易成功率比例',
                    // subtext: '纯属虚构',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}元 ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: []
                },
                series : [
                    {
                        name: '商户',
                        type: 'pie',
                        radius : '55%',
                        center: ['40%', '60%'],
                        data:[],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            balance: '',
            freezeAmount: '',
            available: '',

            channel:{},              //    所有通道
            enterDate: {},
            outDate: {},
            gridData1: [],
            gridData2: [],
            dialogTableVisible1: false,
            dialogTableVisible2: false
        }
    },
    methods:{
        //交易金额图标
        getMoneyChart() {
            var chart = new G2.Chart({
                container: 'c1',
                forceFit: true,
                height: 300,
                padding: [ 20, 20, 95, 80 ]
            });
            chart.source(this.serverData, {
                hour: {
                    range: [0, 1]
                }                
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('sum', {
                label: {
                    formatter: function formatter(val) {
                        return val + '万元';
                    }
                }
            });
            chart.axis('hour', {
                label: {
                    formatter: function formatter(val) {
                        return val + '时';
                    }
                }
            });
            chart.line().position('hour*sum').color('status');
            chart.point().position('hour*sum').color('status').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        },
        //交易笔数图表
        getOrderChart() {
            var chart = new G2.Chart({
                container: 'c2',
                forceFit: true,
                height: 300,
                padding: [ 20, 20, 95, 80 ]
            });
            chart.source(this.serverData, {
                hour: {
                    range: [0, 1]
                }                
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('count', {
                label: {
                    formatter: function formatter(val) {
                        return val + '笔';
                    }
                }
            });
            chart.axis('hour', {
                label: {
                    formatter: function formatter(val) {
                        return val + '时';
                    }
                }
            });
            chart.line().position('hour*count').color('status');
            chart.point().position('hour*count').color('status').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        },
        //统计
        getData() {
            chartData().then( res => {
                this.serverData = res.data
                this.serverData.forEach( ele => {
                    ele.sum = ele.sum/100/10000
                    if(ele.status == 3) {
                        ele.status = '交易成功'
                    }else if(ele.status == 1) {
                        ele.status = '待支付'
                    }else {
                        ele.status = '交易失败'
                    }
                })
                this.getMoneyChart()
                this.getOrderChart()
            })
        },

        //精确js加法运算
        add(num1, num2) {
            const num1Digits = (num1.toString().split('.')[1] || '').length;
            const num2Digits = (num2.toString().split('.')[1] || '').length;
            const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
            return (num1 * baseNum + num2 * baseNum) / baseNum;
        },


        //数组去重
        unique1(arr){
            var hash=[];
            for (var i = 0; i < arr.length; i++) {
                if(hash.indexOf(arr[i])==-1){
                hash.push(arr[i]);
                }
            }
            return hash;
        },
        //h获得元饼图通道数据
        getPicData() {
            let data= {
                channel_id: null,
                mch_id: null,
                status: null,
                groupby: 1
            }
            picData(this.value,data).then(res => {
                let picData = res.data
                picData = picData.filter(ele => {
                    return ele.money != 0
                })
                this.option.legend.data = []
                picData.forEach(ele => {
                    ele.name = this.channel[ele.channel_id] 
                    ele.value = ele.money 
                    this.option.legend.data.push(ele.name)
                })
                this.option.series[0].data = picData
                var myChart = echarts.init(document.getElementById('channel'));
                myChart.off('click') // 这里很重要！！！
                myChart.setOption(this.option);
                myChart.on('click', (params) => {
                    // 控制台打印数据的名称
                    this.channel_id = params.data.channel_id
                    this.channel_name = params.name
                    this.mch_id = ''
                    this.getPicMerData()
                });
            })
        },
        //h获得元饼图商户数据
        getPicMerData() {
            let data = {}
            if(this.channel_id != '') {
                data= {
                    channel_id: this.channel_id,
                    mch_id: null,
                    status: null,
                    groupby: 3
                }
            }else{
                data= {
                    channel_id: null,
                    mch_id: null,
                    status: null,
                    groupby: 2
                }
            }
            picData(this.value,data).then(res => {
                let picData = res.data
                picData = picData.filter(ele => {
                    return ele.money != 0
                })
                this.option1.legend.data = []
                picData.forEach(ele => {
                    ele.value = ele.money
                    ele.name = '商户' + ele.mch_id
                    this.option1.legend.data.push(ele.name)
                })
                this.option1.series[0].data = picData
                var myChart = echarts.init(document.getElementById('mch'));
                myChart.off('click') // 这里很重要！！！如果不加off事件，就会叠加触发
                myChart.setOption(this.option1);
                myChart.on('click', (params) => {
                    // 控制台打印数据的名称
                    this.mch_id = params.data.mch_id 
                    this.getPicStateData()  
                });
            })
        },
        //商户交易成功率数据
        getPicStateData() {
            let data = {}
            if(this.channel_id == '') {
                data = {
                    channel_id: null,
                    mch_id: this.mch_id,
                    status: null,
                    groupby: 6
                }
            }else{
                data = {
                    channel_id: this.channel_id,
                    mch_id: this.mch_id,
                    status: null,
                    groupby: 7
                }
            }
             
            picData(this.value,data).then(res => {
                let picData = res.data
                picData = picData.filter(ele => {
                    return ele.money != 0
                })
                this.option2.legend.data = []
                picData.forEach(ele => {
                    ele.value = ele.money
                    if(ele.success) {
                        ele.name = '交易成功'
                    }else {
                        ele.name = '交易失败'
                    }
                    
                    this.option2.legend.data.push(ele.name)
                })
                this.option2.series[0].data = picData
                var myChart = echarts.init(document.getElementById('status'));
                myChart.setOption(this.option2);
            })
        },
        changeDate(val) {
            this.channel_id = ''
            this.channel_name = ''
            this.mch_id = ''
            this.getPicData()
            this.getPicMerData()
        },
        //获取通道
        getChannelList() {
            let data = {
                offset: 0,
                limit: 200
            }
            channelList(data).then( res => {
                let arr = res.data.data_list
                arr.forEach(ele => {
                    let key = ele.id
                    let val = ele.name
                    this.channel[key] = val
                })
            })
        },
        //支付数据
        getEnterDate() {
            enterDate(this.value1).then(res => {
                let date = res.data
                this.gridData1 = res.data.bonus
                this.gridData1.forEach(ele => {
                    ele.money = ele.money/100
                })
                date.fail_money = date.fail_money/100/10000
                date.suc_money = date.suc_money/100/10000
                date.charge = (date.charge/100).toFixed(2)
                date.profit = (date.profit/100).toFixed(2)
                if(date.suc_money === 0 && date.fail_money === 0) {
                    date.rate = '0.00'
                }else{
                    date.rate = (date.suc_money/(date.suc_money+date.fail_money)*100).toFixed(2)
                }
                date.fail_money= date.fail_money.toFixed(2)
                date.suc_money = date.suc_money.toFixed(2)
                this.enterDate = date
            })
        },
        //代付数据
        getOutDate() {
            outDate(this.value2).then(res => {
                let date = res.data
                this.gridData2 = res.data.bonus
                this.gridData2.forEach(ele => {
                    ele.money = ele.money/100
                })
                date.fail_money = date.fail_money/100/10000
                date.suc_money = date.suc_money/100/10000
                date.charge = (date.charge/100).toFixed(2)
                date.profit = (date.profit/100).toFixed(2)
                if(date.suc_money === 0 && date.fail_money === 0) {
                    date.rate = '0.00'
                }else{
                    date.rate = (date.suc_money/(date.suc_money+date.fail_money)*100).toFixed(2)
                }
                date.fail_money= date.fail_money.toFixed(2)
                date.suc_money = date.suc_money.toFixed(2)
                this.outDate = date
            })
        },
        changeEnterDate() {
            this.getEnterDate()
        },
        changeOutDate() {
            this.getOutDate()
        },
        //先锋账户余额
        getXfData() {
            xfMoneySum().then(res => {
                this.balance =  res.data.balance/100
                this.freezeAmount =  res.data.freezeAmount/100
                this.available =  res.data.available/100
            })
        }
    },
    mounted() {
        // this.getXfData()
        this.getEnterDate()
        // this.getOutDate()
        this.getChannelList()
        this.getData()
        this.getPicData()
        this.getPicMerData()
    }
}
</script>

<style lang='sass' scoped>
.data-detail
    color: #3D4060;
    padding-left: 30px
    .stat-wrapper
        .data-wrapper
            padding: 20px
            background: #f8f8fc
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.05)
            border-radius: 10px
            margin-bottom: 10px
            .title 
                font-size: 15px
                .xf-title
                    margin-left: 20px
                    b
                        color: red
                        font-size: 18px
            .pay-box
                display: flex
                margin-top: 10px
                .content
                    flex: 1
                    border: 2px #fff solid
                    background: #fff
                    border-radius: 3px
                    padding: 14px 20px 10px
                    color: #8492A6
                    font-size: 13px
                    font-weight: 400
                    margin-right: 5px
                    .cont-title
                        margin-top: 10px
                        color: #5F6E82
                        font-size: 16px
                        span
                            color: #e6a23c
                            font-size: 20px
                    .money
                        margin-top: 5px
                        .number
                            font-size: 40px
                            color: #475669
                            margin-right: 5px
                    .btn
                        display: block
                        padding-top: 30px
                        text-align: center
                // .content:hover
                //     border: 2px #e6a23c solid

    .chart
        display: flex
        align-items: center 
        margin-left: -20px
        .chart-wrapper
            flex: 1
            padding: 20px   
            margin-top: 10px
            margin-left: 20px
            display: inline-block
            background: #f8f8fc
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.05)
            border-radius: 10px
            .chart-title
                font-size: 15px
                // font-weight: bold
                height: 40px
                line-height: 40px
                margin: 0 0 10px 10px
            .chart-ct
                background: #fff
                border-radius: 10px
                width: 100%
                // height: 450px
                padding-top: 30px
                padding-right: 35px
</style>
