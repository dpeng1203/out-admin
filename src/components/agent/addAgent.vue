<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>添加代理商</span>
        </div>
        <div class="wrapper">
            <div class="rate-title">基础信息</div>
            <div class="item">
                <span class="name">商户名称：</span>
                <input type="text" placeholder="请输入商户名称" v-model="data.mch_name">
            </div>
            <div class="item">
                <span class="name">手机号：</span>
                <input type="text" placeholder="请输入手机号" v-model="data.phone">
            </div>
            <div class="item">
                <span class="name">密码：</span>
                <input type="password" placeholder="请输入密码" v-model="data.password">
            </div>
            <div class="rate-title">设置费率</div>
            <div class="item" v-for="item in rateList" :key="item.id">
                <span class="name">{{item.app_name}}:</span>
                <input type="text" placeholder="请输入密码" v-model="item.rate">
            </div>
        </div>
        <div class="btn" @click="addAgentBtn">保存</div>
    </div>
</template>

<script>
import { sysApp,creatAgent,changeAgent } from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            data: {
                mch_name: null,
                phone: null,
                password: null
            },
            rateList: []
        }
    },
    methods: {
        addAgentBtn() {
            this.rateList.forEach( ele => {
                ele.rate = ele.rate*100
                if(ele.id) {
                    ele.app_id = ele.id
                    delete ele.id
                }
            })
            this.data.apps = this.rateList
            if(this.$route.query.detail) {
                this.data.mch_id = this.$route.query.detail.mch_id
                changeAgent(this.data).then( res => {
                    this.$message({
                        message: '修改成功！',
                        type: 'success'
                    });
                    this.$router.push('/home/agentList')
                })
            }else {
                creatAgent(this.data).then( res => {
                    this.$message({
                        message: '新增成功！',
                        type: 'success'
                    });
                    this.$router.push('/home/agentList')
                })
            }
            
        },
        //得到费率列表
        getRateList() {
            let data = {
                offset: 0,
                limit: 1000
            }
            sysApp(data).then(res => {
                this.rateList = res.data.data_list
                this.rateList.forEach( ele => {
                    ele.rate = ''
                })
            })
        },

    },
    mounted() {
        if(this.$route.query.detail) {
            let list = this.$route.query.detail
            this.rateList = list.user_app_detail
            this.rateList.forEach(ele => {
                ele.rate = ele.rate/100
            })
            this.data.mch_name = list.mch_name
            this.data.phone = list.phone
        }else{
            this.getRateList()
        }
        
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
        .rate-title
            font-weight: bold
            font-size: 18px
            margin-top: 30px
        .item 
            margin-top: 20px
            font-size: 14px
            .name
                display: inline-block
                width: 120px
            input
                border: 1px solid #B1B3C1;
                border-radius: 2px;
                width: 240px    
                height: 40px
                line-height: 40px
                padding-left: 20px 
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