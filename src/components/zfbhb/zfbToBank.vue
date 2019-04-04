<template>
    <div class="mer-manage">
        <div class="title">
            <span>支付宝转银行卡</span>
        </div>  
        <div class="search">
            <div class="search-ct">
                <div class="search-name">状态</div>
                <el-select v-model="data.enable" placeholder="请选择" class="inline-input">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-ct">
                <div class="search-name">指定商户号</div>
                <el-input class="inline-input" v-model="data.owner_id" placeholder="请输入指定商户号" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">姓名</div>
                <el-input class="inline-input" v-model="data.name" placeholder="请输入姓名" clearable></el-input>
            </div>
            <div class="search-ct">
                <div class="search-name">卡号</div>
                <el-input class="inline-input" v-model="data.card" placeholder="请输入卡号" clearable></el-input>
            </div>
            <div class="search-btn" @click="searchBtn">搜索</div>
            <div class="search-btn" @click="addBank">新增</div>
        </div>
        <div class="table">
            <el-table
                :data="tableData"
                border
                size="small"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="owner_id"
                    label="指定商户号"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="bank_name"
                    label="银行名称"
                    show-overflow-tooltip
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="card"
                    label="卡号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="bank_mark"
                    label="银行标识符"
                    show-overflow-tooltip
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="enable"
                    label="状态"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="received"
                    label="今日收款（元）"
                    width="110">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="handleClickUpDate(scope.row)" type="text" size="small">更新</el-button>
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


        <el-dialog :title="title" :visible.sync="addAgentBox">
            <el-form :model="form">
                 <el-form-item label="指定商户号：" :label-width="formLabelWidth">
                    <el-input v-model="form.owner_id" autocomplete="off" style="width: 220px" placeholder="请输入指定商户号" clearable></el-input>
                </el-form-item>
                 <el-form-item label="姓名：" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" style="width: 220px" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
                 <el-form-item label="卡号：" :label-width="formLabelWidth">
                    <el-input v-model="form.card" autocomplete="off" style="width: 220px" placeholder="请输入卡号" clearable></el-input>
                </el-form-item>
                 <el-form-item label="银行名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.bank_name" autocomplete="off" style="width: 220px" placeholder="请输入银行名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="银行简称：" :label-width="formLabelWidth">
                    <el-input v-model="form.bank_mark" autocomplete="off" style="width: 220px" placeholder="请输入银行简称" clearable></el-input>
                </el-form-item>
                <el-form-item label="监听地址：" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off" style="width: 220px" placeholder="请输入监听地址" clearable></el-input>
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
import { zfbToBank,addZfbToBank,delZfbToBank,changeZfbToBank } from '../../config/api'
export default {
    name: 'accountManage',
    data() {
        return{
            title: '新增收款账户',
            tableData: [],
            currentPage: 1,
            total: 0,
            addAgentBox: false,
            formLabelWidth: '120px',
            options1: [
                {
                    value: "true",
                    label: '可用'
                }, {
                    value: "false",
                    label: '不可用'
                }
            ],
            form: {
                name: '',
                card: '',
                bank_mark: '',
                bank_name: '',
                address: '',
                owner_id: ''
            },
            data: {
                enable: null,
                name: '',
                card: '',
                owner_id: '',
                offset: 0,
                limit: 10
            }
        }
    },
    methods: {
        getList() {
            for( var key in this.data) {
                if(this.data[key] === '') {
                    delete this.data[key]
                }
            }
            zfbToBank(this.data).then((res) => {
                this.total = res.data.total_count
                this.tableData = res.data.data_list
                this.tableData.forEach( ele => {
                    ele.create_time = changeData(ele.create_time) 
                    ele.received = ele.received/100
                    if(ele.enable) {
                        ele.enable = '可用'
                    }else{
                        ele.enable = '不可用'
                    }
                    
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
                let data = {
                    card: row.card
                }
                delZfbToBank(data).then( res => {
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
        //更新
        handleClickUpDate(row) {
            this.title = '更新收款账户'
            this.form.name = row.name
            this.form.name = row.name
            this.form.card = row.card
            this.form.bank_mark = row.bank_mark
            this.form.bank_name = row.bank_name
            this.form.address = row.address
            this.form.owner_id = row.owner_id
            this.addAgentBox = true
        },
        //新增首款卡
        addBank() {
            this.title = '新增收款账户'
            this.form.name = ''
            this.form.card = ''
            this.form.bank_mark = ''
            this.form.bank_name = ''
            this.form.address = ''
            this.form.owner_id = ''
            this.addAgentBox = true
        },
        handleSizeChange(val) {
            this.data.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.data.offset = (val - 1) * this.data.limit
            this.getList()
        },
        addAgent() {
            // if(this.form.owner_id === '' || this.form.owner_id === undefined) {
            //     this.$message.error('请填写指定商户号！')
            //     return
            // }
            if(this.form.name === '') {
                this.$message.error('请填写姓名！')
                return
            }
            if(this.form.card === '') {
                this.$message.error('请填写卡号！')
                return
            }
            if(this.form.bank_name === '') {
                this.$message.error('请填写银行名称！')
                return
            }
            if(this.form.bank_mark === '') {
                this.$message.error('请填写银行简称！')
                return
            }
            if(this.form.address === '') {
                this.$message.error('请填写监听地址！')
                return
            }
            console.log(this.form)
            if(this.title == '新增收款账户') {
                addZfbToBank(this.form).then( res => {
                    this.$message.success('成功！！')
                    this.addAgentBox = false
                    this.searchBtn()
                })
            }else if(this.title == '更新收款账户') {
                changeZfbToBank(this.form).then(res => {
                    this.$message.success('成功！！')
                    this.addAgentBox = false
                    this.searchBtn()
                })
            }
            
            
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
        margin-top: 10px
        .search-ct
            margin-left: 20px
            .search-name
                font-size: 12px
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
        width: 1320px
        .block
            padding: 30px 0
            text-align: center 
</style>

