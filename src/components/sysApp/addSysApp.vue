<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>添加应用</span>
        </div>
        <div class="wrapper">
            <div class="item">
                <span class="name">应用名称</span>
                <input type="text" placeholder="请输入姓名" v-model="data.app_name">
            </div>
            <div class="item">
                <span class="name">费率（%）</span>
                <input type="text" placeholder="请输入费率" v-model="data.rate">
            </div>
        </div>
        <div class="btn" @click="addSysAppBtn">保存</div>
    </div>
</template>

<script>
import {addSysApp} from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            rePw: '',
            data: {
                app_name: null,
                rate: null
            }
        }
    },
    methods: {
        addSysAppBtn() {
            this.data.rate = this.data.rate*100
            addSysApp(this.data).then( res => {
                 this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.$router.push('/home/sysApp')
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