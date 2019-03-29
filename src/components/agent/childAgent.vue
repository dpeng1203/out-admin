<template>
    <div class="mer-manage">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.push('/home/agentList')">
            <span>子账户管理</span>
        </div>  
        <div class="add-btn" @click="addBtn">新增</div>
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
                    prop="mch_name"
                    label="商户名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="交易金额"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="bounsMoney"
                    label="分润金额"
                    width="150">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
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

    </div>
</template>

<script>
import changeData from '../../config/formatData'
import { childAgent,delChildAgent } from '../../config/api'
export default {
    name: 'childAgent',
    data() {
        return{
            mch_id: '',
            childList: [],
            tableData: [],
            currentPage: 1,
            total: 0,
            data: {
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        getList() {
            this.data.mch_id = this.mch_id
            childAgent(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if(ele.money){
                        ele.money = ele.money/100
                    }
                    if(ele.bounsMoney){
                        ele.bounsMoney = ele.bounsMoney/100
                    }
                    
                })
            })
        },

        //删除子账户
        handleClick(row) {
            this.$confirm('确定删除此子账户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delChildAgent(row.sub_id).then( res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
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

        handleSizeChange(val) {
            this.data.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.data.offset = (val - 1) * this.data.limit
            this.getList()
        },
        addBtn() {
            this.$router.push({path: '/home/addChildAgent',query: {id: this.mch_id}})
            // childAgent(this.data).then( res => {
            //     this.tableData = res.data.data_list
            // })
        }

    },
    mounted() {
        this.mch_id = this.$route.query.id
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
        img
            width: 35px
            height: 35px
            cursor: pointer
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
        width: 1002px
        .block
            padding: 30px 0
            text-align: center 
</style>
