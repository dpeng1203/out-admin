<template>
    <div class="login">
          
        <div class="wrapper">
            <div class="title">后台管理系统</div>
            <div><input type="text" placeholder="账号" v-model="account"></div>
            <div class="input-wrap" v-if="eyeOpen">
                <input type="password" placeholder="密码" v-model="pw" @keyup.enter="login">
                <img src="../assets/img/eye_close.png" alt=""  @click="showPw" > 
            </div>
            <div class="input-wrap" v-if="!eyeOpen">
                <input type="text" placeholder="密码" v-model="pw" @keyup.enter="login">
                <img src="../assets/img/eye_open.png" alt="" @click="showPw" > 
            </div>

            <!-- <div class="slide">
                <slide-verify 
                    :l="42"
                    :r="10"
                    :w="310"
                    :h="155"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
                >
                </slide-verify>
            </div> -->
            <div class="btn" @click="login">登录</div>
        </div>
    </div>    
</template>

<script>
import SlideVerify from 'vue-monoplasty-slide-verify'
import {login} from '../config/api'
export default {
    name: 'adminLogin',
    data() {
        return{ 
            eyeOpen: true,
            account: '',
            pw: '',
            slideShow: false
        }
    },
    components: {
        SlideVerify
    },
    methods: {
        showPw() {
            this.eyeOpen = !this.eyeOpen
        },
        onSuccess(){
            if(this.account == '') {
                this.$message.error('请输入账号')
                return false
            }
            if(this.pw == '') {
                this.$message.error('请输入密码')
                return false
            }
            this.login()
        },
        onFail(){

        },
        onRefresh(){

        },
        login() {
            localStorage.clear()
            if(this.account == '') {
                this.$message.error('请输入账号')
                return false
            }
            if(this.pw == '') {
                this.$message.error('请输入密码')
                return false
            }
            let data = {
                phone: this.account,
                password: this.pw
            }
            login(data).then((res) => {
                console.log(res)
                localStorage.id = res.id
                localStorage.nickname = res.nickname
                if(res.base.mch_name) {
                    localStorage.name = res.base.mch_name
                }
                if(res.roles && res.roles.length != 0) {
                    res.roles.forEach(ele => {
                        if(ele.id == 1002) {
                            localStorage.rolesId = 1002
                        }
                    });
                }
                this.$router.push('/home')
            })
        },
    }
}
</script>

<style lang="sass" scoped>
.login
    width: 100%;
    height: 100vh
    background-image: url(../assets/img/background.png)
    background-size: 100% 100%;
    position: relative;
    .wrapper
        position: absolute
        left: 50%;
        top: 50%;
        width: 370px
        background: rgba(255,255,255, 0.2)
        margin-left: -185px
        margin-top: -180px
        border-radius: 5px
        padding: 40px 30px
        text-align: center
        .title 
            font-size: 20px
            font-weight: bold
            padding-bottom: 10px
            color: #fff
        input
            border: 1px solid #B1B3C1;
            border-radius: 2px;
            font-size: 16px
            width: 100%
            height: 40px
            line-height: 40px
            margin-top: 20px
            padding-left: 20px
        .input-wrap
            position: relative
            img
                position: absolute
                right: 10px
                top: 32px
                width: 20px
                height: 20px
        .slide
            margin-top: 10px
        .btn
            margin-top: 40px
            background: #e6a23c
            border: 1px solid #B1B3C1;
            border-radius: 2px;
            color: #fff
            height: 40px
            font-size: 16px
            line-height: 40px
</style>
