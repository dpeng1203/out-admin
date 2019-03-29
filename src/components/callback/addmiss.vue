<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>添加补单</span>
        </div>
        <div class="wrapper">
            <div class="item">
                <span class="name">名称</span>
                <input type="text" placeholder="请输入名称" v-model="name">
            </div>
            <div class="item">
                <span class="name">金额</span>
                <input type="text" placeholder="请输入金额" v-model="money">
            </div>
            <div class="item">
                <span class="name">时间</span>
                <span>{{time}}</span>
                <el-input class="inline-input time" v-model="hour" ></el-input>
                <span >:</span>
                <el-input class="inline-input time" v-model="min"></el-input>
            </div>
        </div>
        <div class="btn" @click="addBtn">保存</div>
    </div>
</template>

<script>
import {addMissList } from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            time: '',
            y: '',
            m: '',
            d: '',
            hour: '',
            min: '',
            name: '',
            money: ''
        }
    },
    methods: {
        addBtn() {
            if(this.name == '') {
                this.$message.error('请输入昵称')
                return false
            }
            if(this.money == '') {
                this.$message.error('请输入金额')
                return false
            }
            if(this.hour == '' || this.min == '') {
                this.$message.error('请输入时间')
                return false
            }
            let order_time = new Date(this.y,this.m-1,this.d,this.hour,this.min)
            console.log(order_time)
            let data = {
                money: this.money * 100,
                name: this.name,
                order_time: order_time
            }
            addMissList(data).then(res => {
                this.$message.success('成功！！')
                this.$router.push('/home/missList')
            })
        }
    },
    mounted() {
        let myDate = new Date();
        this.y = myDate.getFullYear()
        this.m = myDate.getMonth() + 1
        this.d = myDate.getDate()
        if (this.m < 10) {
            this.m = "0" + this.m;
        }
        if (this.d < 10) {
            this.d = "0" + this.d;
        }
        this.time = this.y + '-' + this.m + '-' + this.d
    }
}
</script>

<style lang='sass' scoped>
.add-peopel
    color: #3D4060;
    .title 
        font-size: 24px
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
                font-weight: bold
            input
                border: 1px solid #B1B3C1;
                border-radius: 2px;
                width: 240px    
                height: 40px
                line-height: 40px
                padding-left: 20px 
            .time
                width: 50px
    .btn
        width: 150px
        height: 40px
        line-height: 40px
        background: #00BFA6;
        border-radius: 25px;
        color: #fff
        font-weight: bold
        font-size: 16px
        text-align: center
        margin-top: 100px
        margin-left: 30px
</style>