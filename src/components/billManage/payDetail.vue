<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>代付详情</span>
        </div>
        <div class="wrapper">
            <div class="item">
                <span class="name">商户号：</span>
                <span>{{data.mch_id}}</span>
            </div>
            <div class="item">
                <span class="name">收款人：</span>
                <span>{{data.acc_name}}</span>
            </div>
            
            <div class="item">
                <span class="name">手机号：</span>
                <span>{{data.mobile}}</span>
            </div>
            <div class="item">
                <span class="name">银行名称：</span>
                <span>{{data.bank_name}}</span>
            </div>
            <div class="item">
                <span class="name">收款人卡号：</span>
                <span>{{data.acc_no }}</span>
            </div>
            <div class="item">
                <span class="name">商户订单号：</span>
                <span>{{data.mch_order_id}}</span>
            </div>
            <div class="item">
                <span class="name">系统订单号：</span>
                <span>{{data.sys_order_id}}</span>
            </div>
            <div class="item">
                <span class="name">上游订单号：</span>
                <span>{{data.super_order_id}}</span>
            </div>
            <div class="item">
                <span class="name">代付类型：</span>
                <span>{{data.pay_type}}</span>
            </div>
            <div class="item">
                <span class="name">结算类型：</span>
                <span>{{data.charge_type}}</span>
            </div>
            
            <div class="item">
                <span class="name">通道：</span>
                <span>{{data.bank_payment_id}}</span>
            </div>
            <div class="item">
                <span class="name">金额：</span>
                <span>{{data.money}}</span>
            </div>
            <div class="item">
                <span class="name">手续费：</span>
                <span>{{data.charge_money}}</span>
            </div>
            <div class="item">
                <span class="name">创建时间：</span>
                <span>{{data.create_time}}</span>
            </div>
            <div class="item">
                <span class="name">交易时间：</span>
                <span>{{data.trade_time}}</span>
            </div>
            <div class="item">
                <span class="name">状态：</span>
                <span>{{data.status}}</span>
            </div>
            <div class="item" >
                <span class="name">备注：</span>
                <span v-if="data.msg">{{data.msg}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { changeSysApp } from '../../config/api'
export default {
    data() {
        return{
            data: {}
        }
    },
    methods: {

    },
    mounted() {
        this.data = this.$route.query.row
        
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
            cursor: pointer
    .wrapper
        padding: 40px 0 0 30px
        .item 
            margin-top: 20px
            font-size: 14px
            .name
                display: inline-block
                width: 120px
                font-weight: bold
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