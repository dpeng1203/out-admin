<template>
    <div class="mer-audit">
        <div class="mer-ct">
            <div class="title">
                <img src="../../assets/img/ic_back.png" alt="" @click="$router.push('/home/merManage')" class="go-back">
                <span>商户管理</span>
            </div>
            <div class="tabs">
                <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                    <el-tab-pane label="基础信息" name="first">
                        <merInfo :mch_id = 'mch_id' /> 
                    </el-tab-pane>
                    <el-tab-pane label="费率信息" name="second">
                        <div class="basic-wrapper">
                            <div class="basic-info">
                                <h2>充值费率</h2>
                                <div class="table">
                                    <el-table
                                        :data="tableData1"
                                        border
                                        size="small"

                                        >
                                        <el-table-column
                                            type="index"
                                            align="center"
                                            width="50">
                                        </el-table-column>
                                        <el-table-column
                                            prop="mch_id"
                                            label="商户号"
                                            align="center"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="app_name"
                                            align="center"
                                            label="应用名称"
                                            width="200">
                                        </el-table-column>
                                        <el-table-column
                                            prop="mch_name"
                                            align="center"
                                            label="商户名称"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="is_default"
                                            align="center"
                                            label="是否默认"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="rate"
                                            align="center"
                                            label="费率（%）"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            label="操作"
                                            align="center"
                                            >
                                            <template slot-scope="scope">
                                                <el-button @click="handleDel(scope.row)" type="text" size="small" v-if="scope.row.is_default != '是'">恢复默认</el-button>
                                                <el-button @click="handleChange(scope.row)" type="text" size="small">更新</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <!-- <div class="basic-info">
                                <h2>代付费率</h2>
                                <div class="table">
                                    <el-table
                                        :data="tableData2"
                                        border
                                        >
                                        <el-table-column
                                            type="index"
                                            width="50">
                                        </el-table-column>
                                        <el-table-column
                                            prop="mch_id"
                                            label="商户号"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="mch_name"
                                            label="商户名称"
                                            width="200">
                                        </el-table-column>
                                        <el-table-column
                                            prop="money"
                                            label="账户余额"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="reservoir"
                                            label="代付余额"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            prop="rate"
                                            label="费率（%）"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column
                                            label="操作"
                                            >
                                            <template slot-scope="scope">
                                                <el-button @click="handlePay(scope.row)" type="text" size="small">设置费率</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div> -->
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="提现列表" name="third">
                        <div class="basic-wrapper">
                            <div class="basic-info">
                                <h2>提现列表</h2>
                                <div class="table">
                                    <el-table
                                        :data="tableData"
                                        size="small"
                                        border
                                        style="width: 100%">
                                        <el-table-column
                                            type="index"
                                            align="center"
                                            width="50">
                                        </el-table-column>
                                        <el-table-column
                                            prop="create_time"
                                            align="center"
                                            label="创建时间"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="name"
                                            label="姓名"
                                            align="center"
                                            width="100">
                                        </el-table-column>
                                        <el-table-column
                                            prop="open_bank"
                                            align="center"
                                            label="开户行"
                                            width="130">
                                        </el-table-column>
                                        <el-table-column
                                            prop="sub_bank"
                                            align="center"
                                            label="开户支行"
                                            width="220">
                                        </el-table-column>
                                        <el-table-column
                                            prop="bankcard_number"
                                            align="center"
                                            label="银行卡号"
                                            width="200">
                                        </el-table-column>
                                        <el-table-column
                                            prop="money"
                                            align="center"
                                            label="金额(元)"
                                            width="100">
                                        </el-table-column>
                                        <el-table-column
                                            prop="state"
                                            align="center"
                                            label="是否到账"
                                        >
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
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import merInfo from './merchant'
import hostName from '../../config/hostName'
import { changeMerDetail,merAppRate,delAppRate,zdyRate,auditList,getPayRate,payRate } from '../../config/api'
export default {
    data() {
        return{
            mch_id: '',
            mch: {},
            activeName2: 'first',
            tableData1: [],
            tableData2: [],
            currentPage: 1,
            data: {
                app_name: null,
                status: null,
                offset: 0,
                limit: 10
            },
            total: null,
            tableData: [],
        }
    },
    components: {
        merInfo
    },
    methods: {
        //获得充值费率
        getMerAppRate() {
            let data = {
                mch_id: this.mch_id
            }
            merAppRate(data).then( res => {
                this.tableData1 = res.data
                this.tableData1.forEach(ele => {
                    if(ele.rate) {
                        ele.rate = ele.rate/100
                    }
                    if(ele.is_default) {
                        ele.is_default = '是'
                    } else{
                        ele.is_default = '否'
                    }
                })
            })
        },
        //获取代付费率
        // getPayRate() {
        //     let data = {
        //         mch_id: this.mch_id
        //     }
        //     getPayRate(data).then( res => {
        //         let obj = Object.assign(res.data, this.mch);
        //         this.tableData2 = []
        //         this.tableData2.push(obj)
        //         console.log(this.tableData2)
        //         this.tableData2.forEach(ele => {
        //             if(ele.rate) {
        //                 ele.rate = ele.rate/100
        //             }
        //         })
        //     })
        // },
        //设置商户代付费率
        handlePay(row) {
            this.$prompt('请输入商户代付费率(%)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let data = {
                    mch_id: row.mch_id,
                    rate: value * 100
                }
                payRate(data).then( res => {
                    // this.getPayRate()
                    this.$message({
                        type: 'success',
                        message: '设置成功！！'
                    });
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });       
            });
        },
        //获得提现列表
        getList() {
            let data = {
                mch_id: this.mch_id
            }
            auditList(data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money && ele.money != '') {
                        ele.money = ele.money/100
                    }
                    if(ele.state == 1) {
                        ele.state = '提现成功'
                    }else if(ele.state == 2){
                        ele.state = '提现失败'
                    }else {
                        ele.state = '提现中'
                    }
                })
            })
        },
        //切换tab
        handleClick(tab, event) {
            if(tab.index == 1) {
                this.getMerAppRate()
                // this.getPayRate()
            }
            if(tab.index == 2) {
                this.getList()
            }
        },
        //  回复费率
        handleDel(row) {
            let data = {
                app_id: row.app_id,
                mch_id: row.mch_id
            }
            delAppRate(data).then( res => {
                this.getMerAppRate()
            })
        },
        //设置费率
        handleChange(row) {
            this.$prompt(`请设置${row.app_name}的费率(%)：`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let data = [{
                    app_id: row.app_id,
                    rate: value*100,
                    mch_id: row.mch_id
                }]
                let postData = {
                    apps: data
                }
                zdyRate(postData).then( res => {
                    this.$message({
                        message: '设置成功！',
                        type: 'success'
                    });
                    this.getMerAppRate()
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消输入'
            });       
            });
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
        this.mch = this.$route.query.mch
        this.mch_id = this.$route.query.mch.mch_id
    }
}
</script>

<style lang="sass" scoped>
.mer-audit
    color: #3D4060
    .mer-ct 
        width: 1135px
        .title 
            text-align: left
            font-size: 20px
            font-weight: bold
            margin-left: 30px
            padding-bottom: 30px
            .go-back
                width: 35px
                height: 35px
        .tabs 
            margin-left: 30px
        .table
            margin-top: 10px
            padding-bottom: 30px
        .block
            padding: 30px 0
            text-align: center 
    
</style>