<template>
    <div class="add-peopel">
        <div class="title">
            <!-- <span @click="$router.go(-1)"> < </span> -->
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>修改应用</span>
        </div>
        <div class="wrapper">
            <div class="item">
                <span class="name">应用名称</span>
                <input type="text" placeholder="请输入姓名" v-model="data.app_name">
            </div>
            <div class="item">
                <span class="name">费率（%）</span>
                <input type="text" placeholder="请输入地推端账号" v-model="data.rate">
            </div>
            <div class="item">
                <span class="name">状态</span>
                <el-select v-model="data.status" placeholder="请选择" class="state">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="btn" @click="addSysAppBtn">保存</div>
    </div>
</template>

<script>
import { changeSysApp } from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            rePw: '',
            options1: [{
                value: false,
                label: '关闭'
                }, {
                value: true,
                label: '开启'
                }],

            data: {
                app_name: null,
                rate: null,
                status: null
            }
        }
    },
    methods: {
        addSysAppBtn() {
            this.data.rate = this.data.rate*100
            if(this.data.status == '开启') {
                this.data.status = true
            }else if(this.data.status == '关闭'){
                this.data.status = false
            }
            if(this.data.create_time) {
                delete this.data.create_time
            }
            if(this.data.modify_time) {
                delete this.data.modify_time
            }
            changeSysApp(this.data).then( res => {
                 this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                this.$router.push('/home/sysApp')
            })
        },
    },
    mounted() {
        this.data = this.$route.query.detail
    }
}
</script>

<style lang='sass' scoped>
.add-peopel
    color: #3D4060;
    .title 
        font-size: 20px
        font-weight: bold
        margin-left: 25px
        img
            width: 35px
            height: 35px
    .wrapper
        padding: 40px 0 0 30px
        .item 
            margin-top: 30px
            font-size: 14px
            .name
                display: inline-block
                width: 180px
                text-align: center
            input
                border: 1px solid #B1B3C1;
                border-radius: 2px;
                width: 240px    
                height: 40px
                line-height: 40px
                padding-left: 20px 
            .state
                width: 240px  
    .btn
        width: 150px
        height: 40px
        line-height: 40px
        background: #e6a23c;
        border-radius: 5px;
        color: #fff
        font-weight: bold
        font-size: 14px
        text-align: center
        margin-top: 100px
        margin-left: 30px
</style>