<template>
    <div class="mer-manage">
        <div class="title">
            <span>挂单列表</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <div class="search-name">昵称</div>
                <el-input class="inline-input" v-model="data.name" placeholder="请输入昵称" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">金额</div>
                <el-input class="inline-input" v-model="money" placeholder="请输入金额" clearable></el-input>
                <div class="search-btn" @click="searchBtn">搜索</div>
                <div class="search-btn" @click="addBtn">新增</div>
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
                    prop="name"
                    label="名称"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="金额"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="order_time"
                    label="订单时间"
                    width="200">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <el-button @click="handleSet(scope.row)" type="text" size="small" class="el-btn" v-if="scope.row.enable == false">未处理</el-button>
                    <el-button @click="handleSet(scope.row)" type="text" size="small"  v-if="scope.row.enable == true">已处理</el-button>
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
import { missList,addMissList,doList } from '../../config/api'
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
                name: '',
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        getList() {
            if(this.data.name == '') {
                delete this.data.name
            }
            if(this.money != '') {
                this.data.money = this.money*100
            }else{
                delete this.data.money
            }
            missList(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    if( ele.order_time ) {
                        ele.order_time = changeData(ele.order_time)
                    }
                    if(ele.money) {
                        ele.money = ele.money/100
                    }
                })
            })
        },
        addBtn() {
            this.$router.push('/home/addmiss')
        },
        searchBtn() {
            this.data.offset = 0
            this.getList()
        },

        handleSet(row) {
            doList(row.id).then( res => {
                this.$message.success('处理成功！！')
                this.getList()
            })
        },
        //删除个码
        // handleDel(row) {
        //     this.$confirm('确定删除吗?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         delQr(row.id).then( res => {
        //             this.$message({
        //                 message: '删除成功！',
        //                 type: 'success'
        //             });
        //             this.getList()
        //         })
        //     }).catch(() => {
        //         this.$message({
        //             type: 'info',
        //             message: '已取消删除'
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
        width: 1000px
        .el-btn
            color: red
        .block
            padding: 30px 0
            text-align: center 
</style>
