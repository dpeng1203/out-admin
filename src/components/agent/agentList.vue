<template>
    <div class="mer-manage">
        <div class="title">
            <span>支付代理商</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.mch_id" placeholder="请输入代理商商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <el-input class="inline-input" v-model="data.sub_id" placeholder="请输入子商户号" clearable></el-input>
            </div>
            <div class="search-btn" @click="searchBtn">搜索</div>
            <div class="search-btn" @click="addAgentBox = true">新增</div>
        </div>
        <div class="table">
            <el-table
                :data="tableData"
                border
                size="small"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                    type="index"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    align="center"
                    label="代理商商户号"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    align="center"
                    label="代理商名称"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="sub_id"
                    align="center"
                    label="子账号"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="sub_name"
                    align="center"
                    label="子商户名称"
                    width="120">
                </el-table-column>
                <!-- 支付列表 -->
                <el-table-column
                    prop="sup_wx_rate"
                    align="center"
                    label="代理商微信费率"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="sub_wx_rate"
                    align="center"
                    label="子账户微信费率"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="wx_rate"
                    align="center"
                    label="微信费率差"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="sup_alipay_rate"
                    align="center"
                    label="代理商支付宝费率"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="sub_alipay_rate"
                    align="center"
                    label="子账户支付宝费率"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="alipay_rate"
                    align="center"
                    label="支付宝费率差"
                    width="110">
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
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
                 <el-form-item label="代理商商户号" :label-width="formLabelWidth">
                    <el-input v-model="form.mch_id" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                 <el-form-item label="子商户号" :label-width="formLabelWidth">
                    <el-input v-model="form.sub_id" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAgentBox = false">取 消</el-button>
                <el-button type="primary" @click="addAgent">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import changeData from '../../config/formatData'
import { agentList,lineAgent,delChildAgent } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            tableData: [],
            currentPage: 1,
            total: 0,
            addAgentBox: false,
            formLabelWidth: '120px',
            form: {
                type: "1",
                mch_id: '',
                sub_id: ''
            },
            data: {
                type: 1,
                mch_id: '',
                sub_id: '',
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        tableRowClassName({row,rowIndex}) {
            if(row.sup_wx_rate > row.sub_wx_rate || row.sup_alipay_rate > row.sub_alipay_rate) {
                return 'success'
            }
            return ''
        },
        getList() {
            for( var key in this.data) {
                if(this.data[key] === '') {
                    delete this.data[key]
                }
            }
            agentList(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    ele.sup_wx_rate = ele.sup_wx_rate/100 + '%'
                    ele.sub_wx_rate = ele.sub_wx_rate/100 + '%'
                    ele.wx_rate = ele.wx_rate/100 + '%'
                    ele.sup_alipay_rate = ele.sup_alipay_rate/100 + '%'
                    ele.sub_alipay_rate = ele.sub_alipay_rate/100 + '%'
                    ele.alipay_rate = ele.alipay_rate/100 + '%'
                })
            })
        },
        searchBtn() {
            this.data.offset = 0
            this.getList()
        },
        //删除
        handleClick(row) {
            
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delChildAgent(row.id).then( res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.searchBtn()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        //查看子账户
        // handleCheckChild(row) {
        //     this.$router.push({path: '/home/childAgent',query: {id: row.mch_id}})
        // },
        handleSizeChange(val) {
            this.data.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.data.offset = (val - 1) * this.data.limit
            this.getList()
        },
        addAgent() {
            lineAgent(this.form).then( res => {
                this.$message.success('成功！！')
                this.addAgentBox = false
                this.form.mch_id = ''
                this.form.sub_id = ''
                this.searchBtn()
            })
            
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
            line-height: 35px
            text-align: center
            color: #fff
            background: #e6a23c;
            border-radius: 5px;
            font-size: 14px
            margin: 0 0 0 30px
        .search-ct:first-child
            margin-left: 0
    .add-btn
        width: 120px
        height: 40px
        margin-top: 60px
        line-height: 40px
        text-align: center
        color: #fff
        background: #00BFA6;
        border-radius: 25px;
        font-size: 14px
        margin-top: 30px 
    .table
        margin-top: 40px
        width: 1350px
        .block
            padding: 30px 0
            text-align: center 
</style>

