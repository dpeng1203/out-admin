<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>设置uid</span>
        </div>
        <div class="upLoad">
            <img src="../../assets/img/444.jpg" alt="" >
        </div>
        <div class="tip">请打开支付宝扫描上图二维码，输入扫描结果：</div>
        <el-input placeholder="请输入内容" v-model="uid" clearable class="el-input"></el-input>
        <div class="btn" @click="set">设置</div>
    </div>
</template>

<script>
import { setUid } from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            url: '',
            uid: ''
        }
    },
    methods: {
        set() {
            let data = {
                id: this.$route.query.qrId,
                auth_id: localStorage.id,
                uid: this.uid
            }
            setUid(data).then( res => {
                 this.$message({
                    message: '设置成功！',
                    type: 'success'
                });
                this.$router.push('/home/qrList')
            })
        },
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
    .upLoad
        margin-left: 25px
        margin-top: 20px
        input
            font-size: 16px
        img
            width: 180px
            display: block
        p 
            margin-top: 20px
    .tip
        margin-left: 25px
        margin-top: 20px
        color: red
        font-size: 16px
    .el-input
        width: 300px
        margin-left: 25px
        margin-top: 20px
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