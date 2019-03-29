<template>
    <div class="mer-manage">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>选择子账户</span>
        </div>  
        <div class="table">
            <el-table
                :data="tableData"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="mch_id"
                    label="商户id"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="mch_name"
                    label="商户名称"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    >
                </el-table-column>
            </el-table>
            <div class="add-btn" @click="saveBtn">确定</div>
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
import { childAgent,lineAgent } from '../../config/api'
export default {
    name: 'addChildAgent',
    data() {
        return{
            mch_id: '',
            tableData: [],
            currentPage: 1,
            total: 0,
            data: {
                offset: 0,
                limit: 10
            },
            selChild: []
        }
    },
    methods: {
        getList() {
            childAgent(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    
                    
                })
            })
        },
        //选择子账户
        handleSelectionChange(val) {
            this.selChild = val
        },

        handleSizeChange(val) {
            this.data.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.data.offset = (val - 1) * this.data.limit
            this.getList()
        },
        saveBtn() {
            let sub_id = []
            this.selChild.forEach( ele => {
                if(ele.mch_id) {
                    sub_id.push(ele.mch_id)
                }
            })
            let data = {
                mch_id: this.mch_id,
                sub_ids: sub_id
            }
            lineAgent(data).then( res => {
                 this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                this.$router.push({path:'/home/childAgent',query: {id: this.mch_id}})
            })
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
        width: 600px
        .block
            padding: 30px 0
            text-align: center 
</style>