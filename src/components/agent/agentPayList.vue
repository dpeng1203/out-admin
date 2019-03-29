<template>
    <div class="mer-manage">
        <div class="title">
            <span>代付代理商</span>
        </div>  
        <div class="search">
            <!-- <div class="search-ct">
                <div class="search-name">支付类型</div>
                <el-select v-model="data.type" placeholder="请选择" class="pay-state">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
            <div class="search-ct">
                <div class="search-name">代理商商户号</div>
                <el-input class="inline-input" v-model="data.mch_id" placeholder="请输入父商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">子商户号</div>
                <el-input class="inline-input" v-model="data.sub_id" placeholder="请输入子商户号" clearable></el-input>
            </div>
            <div class="search-btn" @click="searchBtn">搜索</div>
            <div class="search-btn" @click="addAgentBox = true">新增</div>
        </div>
        <!-- <div class="add-btn" @click="addBtn">新增</div> -->
        <div class="table">
            <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    label="代理商商户号"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    label="代理商名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sub_id"
                    label="子账号"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="sub_name"
                    label="子商户名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sup_rate"
                    label="代理商代付费率"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="sub_rate"
                    label="子账户代付费率"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="bank_rate"
                    label="代付费率差"
                    width="110">
                </el-table-column>
                <el-table-column
                label="操作"
                
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="warning" size="small">删除</el-button>
                    <!-- <el-button @click="handleCheckChild(scope.row)" type="success" size="small">子账户</el-button> -->
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
                <!-- <el-form-item label="支付类型" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择支付类型" style="width: 220px">
                        <el-option label="支付" value="1"></el-option>
                        <el-option label="代付" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                 <el-form-item label="父商户号" :label-width="formLabelWidth">
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
            // options1: [
            //     {
            //         value: "1",
            //         label: '支付'
            //     }, {
            //         value: "2",
            //         label: '代付'
            //     }
            // ],
            form: {
                type: "2",
                mch_id: '',
                sub_id: ''
            },
            data: {
                type: 2,
                mch_id: '',
                sub_id: '',
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        tableRowClassName({row,rowIndex}) {
            if(row.sup_rate > row.sub_rate) {
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
                    ele.sup_rate = ele.sup_rate/100 + '%'
                    ele.sub_rate = ele.sub_rate/100 + '%'
                    ele.bank_rate = ele.bank_rate/100 + '%'
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
        font-size: 24px
        font-weight: bold
    .search
        display: flex
        margin-top: 20px
        .search-ct
            margin-left: 60px
            .search-name
                font-size: 14px
                line-height: 18.2px
                padding-bottom: 10px
            .inline-input
                width: 220px
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
            margin: 30px 0 0 30px
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
        max-width: 1100px
        .block
            padding: 30px 0
            text-align: center 
</style>

