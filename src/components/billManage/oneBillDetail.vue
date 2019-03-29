<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>充值详情</span>
        </div>
        <div class="wrapper">
            <div class="item">
                <span class="name">商户号：</span>
                <span>{{data.mch_id}}</span>
            </div>
            <div class="item">
                <span class="name">商户名称：</span>
                <span>{{data.mch_name}}</span>
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
                <span class="name">支付类型：</span>
                <span>{{data.pay_type}}</span>
            </div>
            <div class="item">
                <span class="name">通道：</span>
                <span>{{data.channel}}</span>
            </div>
            <div class="item">
                <span class="name">金额：</span>
                <span>{{data.money}}</span>
            </div>
            <div class="item">
                <span class="name">手续费：</span>
                <span>{{data.mch_charge}}</span>
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
                <span>{{data.state}}</span>
            </div>
            <div class="item">
                <span class="name">是否手动补单：</span>
                <span>{{data.handle}}</span>
            </div>
        </div>
        <!-- <div class="btn" @click="addSysAppBtn">保存</div> -->
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
        this.data = this.$route.query.billInfo
        if(this.data.super_order_id && this.data.super_order_id.indexOf('unknown') === 0) {
            this.data.handle = '是'
        }else{
            this.data.handle = '否'
        }
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
            cursor: pointer
    .wrapper
        padding: 10px 0 0 30px
        .item 
            margin-top: 15px
            font-size: 14px
            .name
                display: inline-block
                width: 120px
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