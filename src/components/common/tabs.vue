<template>
        
    <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        mode="horizontal"
        router
        unique-opened
        active-text-color="#e6a23c">
        <el-menu-item index="/home/homeDetail" >
            <span slot="title">主页</span>
        </el-menu-item>
        <el-menu-item index="/home/merManage">
            <span slot="title">商户管理</span>
        </el-menu-item>
        <el-menu-item index="/home/billList" >
            <span slot="title">交易管理</span>
        </el-menu-item>
        <el-menu-item index="/home/agentList" >
            <span slot="title">代理商管理</span>
        </el-menu-item>
        <el-menu-item index="/home/sysApp" >
            <span slot="title">费率管理</span>
        </el-menu-item>
        <el-menu-item index="/home/cashList" >
            <span slot="title">提现管理</span>
        </el-menu-item>
        <el-menu-item index="/home/channel" >
            <span slot="title">充值通道</span>
        </el-menu-item>
        <el-menu-item index="/home/zfbToBank" >
            <span slot="title">支付宝转银行卡</span>
        </el-menu-item>
    </el-menu>
           
</template>

<script>
import Bus from './bus'
export default {
    name: 'tabs',
    data() {
        return{
            root: 1,     //  1:管理员  2：客服
            isCollapse:false
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        }
    },
    mounted() {
        if(localStorage.rolesId == 1002) {
            this.root = 2
        }
        Bus.$on('log', content => { 
            this.isCollapse = content
        });
    }
}
</script>

<style lang="sass" scoped>
    .el-menu-demo
        text-align: right
</style>


