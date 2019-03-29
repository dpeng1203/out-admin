<template>
    <div class="mer-manage">
        <div class="title">
            <span>收款码管理</span>
        </div>  
        <div class="up-or-down" v-if="showUp && rolesId == 1002">
            <el-button-group>
                <el-button type="primary" v-if="up" @click="loginUp">上线</el-button>
                <el-button type="primary" v-if="!up" disabled>上线</el-button>
                <el-button type="primary" v-if="!up" @click="loginDown">下线</el-button>
                <el-button type="primary" v-if="up" disabled>下线</el-button>
            </el-button-group>
        </div>
        <div class="search">
            <div class="search-ct" v-if="rolesId != 1002">
                <div class="search-name">账户Id</div>
                <el-input class="inline-input" v-model="data.auth_id" placeholder="请输入id" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">手机</div>
                <el-input class="inline-input" v-model="data.phone" placeholder="请输入手机号码" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">昵称</div>
                <el-input class="inline-input" v-model="data.nick_name" placeholder="请输入账户名称" clearable></el-input>
                <div class="search-btn" @click="searchBtn">搜索</div>
                <div class="search-btn" @click="addBtn" v-if="rolesId == 1002">新增</div>
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
                    prop="auth_id"
                    label="账户id"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="uid"
                    label="uid"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="code_url"
                    label="收款链接"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="code_name"
                    label="备注"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="online"
                    label="是否在线"
                    width="100">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button>
                    <el-button @click="handleSet(scope.row)" type="text" size="small">设置uid</el-button>
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
import { qrList,delQr,up,down,loginNum } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            rolesId: localStorage.rolesId,  //角色权限
            showUp: false,       //上下线按钮
            up: false,           //上线下线
            tableData: [],
            currentPage: 1,
            total: 0,
            data: {
                nick_name: '',
                phone: '',
                auth_id: '',
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        loginUp() {
            up().then(res => {
                this.$message.success('已上线')
                this.getList()
            })
        },
        loginDown() {
            loginNum().then(res => {
                this.$confirm(`目前在线人数${res.data}人，确定下线吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    down().then( res => {
                        this.$message.success('已下线')
                        this.getList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            })
        },
        getList() {
            if(this.data.nick_name == '') {
                delete this.data.nick_name
            }
            if(this.data.phone == '') {
                delete this.data.phone
            }
            if(localStorage.rolesId == 1002) {
                this.data.auth_id = localStorage.id
            }
            qrList(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                if(this.tableData.length == 0) {
                    this.showUp = false
                }else{
                    this.showUp = true
                    this.up = !this.tableData[0].enable
                }
                this.tableData.forEach( ele => {
                    if( ele.create_time ) {
                        ele.create_time = changeData(ele.create_time)
                    }
                    if(ele.enable) {
                        ele.online = '上线'
                    }else{
                        ele.online = '下线'
                    }
                })
            })
        },

        searchBtn() {
            this.data.offset = 0
            this.getList()
        },
        //删除个码
        handleDel(row) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delQr(row.id).then( res => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
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
        //设置uid
        handleSet(row) {
            this.$router.push({path: '/home/setUid',query: {qrId: row.id}})
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
        addBtn() {
            this.$router.push('/home/addQr')
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
    position: relative
    .up-or-down
        position: absolute
        top: 0
        right: 30px

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
                width: 100px
                height: 35px
                margin-top: 60px
                line-height: 35px
                text-align: center
                color: #fff
                background: #00BFA6;
                border-radius: 25px;
                font-size: 14px
                margin: 0 0 0 60px
        .search-ct:first-child
            margin-left: 0
    .table
        margin-top: 40px
        width: 1250px
        .block
            padding: 30px 0
            text-align: center 
</style>
