<template>
    <div class="add-peopel">
        <div class="title">
            <img src="../../assets/img/ic_back.png" alt="" @click="$router.go(-1)">
            <span>添加二维码</span>
        </div>
        <div class="upLoad">
            <input type="file" @change="addImg" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg">
            <img :src='url' alt="">
            <p>{{imgMsg}}</p>
        </div>
        <el-input v-model="code_name" placeholder="请输入昵称" class="code-name"></el-input>
        <div class="btn" @click="addBtn">添加</div>
    </div>
</template>

<script>
import { addQr } from '../../config/api'
export default {
    name: 'addAccount',
    data() {
        return{
            url: '',
            imgMsg: '',
            code_name: ''
        }
    },
    methods: {
        getObjectURL(file) {
            let url = null ; 
            if (window.createObjectURL!=undefined) { // basic
                url = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file) ;
            }
            return url ;
        },
        addImg(event) {
            let inputDOM = this.$refs.inputer;
            // 通过DOM取文件数据
            let file = inputDOM.files;
            console.log(file[0])
            this.url = this.getObjectURL(file[0])
            console.log(this.url)
            
            qrcode.decode(this.url);
            qrcode.callback = (imgMsg) => {
                console.log(imgMsg)
                this.imgMsg = imgMsg
            }
        },
        addBtn() {
            let data = {
                auth_id: localStorage.id,
                code_url: this.imgMsg,
                code_name: this.code_name
            }
            addQr(data).then( res => {
                 this.$message({
                    message: '新增成功！',
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
    .code-name
        margin-left: 25px
        width: 220px
        margin-top: 15px
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
        margin-top: 30px
        margin-left: 30px
</style>