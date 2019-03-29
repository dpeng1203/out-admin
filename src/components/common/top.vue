<template>
    <div class="top">
        <div class="head-title">后台管理系统</div>
        <div class="userInfo">
            <div class="user-name">您好，{{name}} | <span class="btn-out" @click="out">退出</span></div>
        </div>
        <!-- <div class="btn-wrapper">
               <span class="btn-out" @click="out">退出</span> 
        </div> -->
    </div>    
</template>

<script>
import Bus from './bus'
import { loginOut } from '../../config/api'
export default {
    name: 'top',
    data() {
        return{
            isCollapse: false,
            name: localStorage.name,
            accound: localStorage.nickname,
            code: localStorage.id
        }
    },
    methods: {
        out() {
            loginOut().then((res) => {
                this.$message({
                    message: '登出成功',
                    type: 'success'
                });
                localStorage.clear()
                this.$router.push('/')
            }, (err) => {
                this.$router.push('/')
            })
        },
        opentabs(e) {
            console.log(e)
            Bus.$emit('log', e)
        }
    },
    

}
</script>

<style lang="sass" scoped>
    .top
        display: flex
        background: #fff
        .name
            width: 219px
            flex-shrink: 0
            text-align: center
            padding: 40px 0 
            background: #34395D
            color: #fff
            font-size: 24px
            .line
                color: #F64866
        .head-title
            flex: 1
            color: #7E8196
            height: 80px
            line-height: 80px
            padding: 0 20px
            border-bottom: 1px solid #EEE
        .userInfo
            font-size: 14px
            color: #B9BAC8
            height: 80px
            line-height: 80px
            padding-right: 30px
            border-bottom: 1px solid #EEE
            span
                cursor: pointer
                

</style>