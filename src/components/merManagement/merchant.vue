<template>
    <div class="mer-audit">
        <div class="basic-wrapper" >
            <div class="basic-info">
                <h2>基本信息</h2>
                <div class="item">
                    <span class="name">商户名称：</span>
                    <span v-if="editorState == 0">{{list.mch_name}}</span>
                    <el-input placeholder="请输入内容" v-model="list.mch_name" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">商户简称：</span>
                    <span v-if="editorState == 0">{{list.nick_name}}</span>
                    <el-input placeholder="请输入内容" v-model="list.nick_name" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">法人姓名：</span>
                    <span v-if="editorState == 0">{{list.legal_name}}</span>
                    <el-input placeholder="请输入内容" v-model="list.legal_name" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">法人手机号：</span>
                    <span v-if="editorState == 0">{{list.legal_phone}}</span>
                    <el-input placeholder="请输入内容" v-model="list.legal_phone" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">邮箱地址：</span>
                    <span v-if="editorState == 0">{{list.email}}</span>
                    <el-input placeholder="请输入内容" v-model="list.email" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">其他联系人姓名：</span>
                    <span v-if="editorState == 0">{{list.link_name}}</span>
                    <el-input placeholder="请输入内容" v-model="list.link_name" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">其他联系人手机号：</span>
                    <span v-if="editorState == 0">{{list.link_phone}}</span>
                    <el-input placeholder="请输入内容" v-model="list.link_phone" clearable v-if="editorState == 1"></el-input>
                </div>
                <div class="item">
                    <span class="name">统一社会信用代码：</span>
                    <span v-if="editorState == 0">{{list.org_code}}</span>
                    <el-input placeholder="请输入内容" v-model="list.org_code" clearable v-if="editorState == 1"></el-input>
                </div>
            </div>
        </div>
        
        <div class="mer-info">
            <h2>商户资质</h2>
            <div class="photo-wrapper" v-if="list.license_images">
                <div class="item" v-if="list.license_images[0] != 0">
                    <span class="name">营业执照</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.license_images[0]' alt="">
                    </div>
                </div>
                <div class="item" v-if="list.license_images[1] != 0">
                    <span class="name">开户许可证</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.license_images[1]' alt="">
                    </div>
                </div>
                <div class="item" v-if="list.license_images[2] != 0">
                    <span class="name">手持营业执照</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.license_images[2]' alt="">
                    </div>
                </div>
            </div>
            <div class="photo-wrapper" v-if="list.card_images">
                <div class="item" v-if="list.card_images[0] != 0">
                    <span class="name">身份证（正面）</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.card_images[0]' alt="">
                    </div>
                </div>
                <div class="item" v-if="list.card_images[1] != 0">
                    <span class="name">身份证（反面）</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.card_images[1]' alt="">
                    </div>
                </div>
                <div class="item" v-if="list.card_images[2] != 0">
                    <span class="name">手持身份证（正面）</span>
                    <div class="img-ct">
                        <img :src='`${hostName}/files/` + list.card_images[2]' alt="">
                    </div>
                </div>
            </div>
            <div class="photo-wrapper" v-if="list.other_images && list.other_images.length != 0">
                <div class="item">
                    <span class="name">其他资质照片</span>
                    <div class="img-ct">
                        <img alt="" v-for="imgItem in list.other_images" :key="imgItem" :src='`${hostName}/files/` + imgItem' >
                    </div>
                </div>
            </div>
        </div>
        <div class="btn" v-if="list.state != 0 && editorState == 0" @click="editorInfo">编辑</div>
        <div class="btn" v-if="editorState == 1" @click="save">保存</div>
        <div class="btn" v-if="editorState == 1" @click="editorState = 0">取消</div>
        <div class="btn" @click="succ" v-if="list.state == 0">审核通过</div>
        <div class="btn err" @click="fail" v-if="list.state == 0">审核失败</div>
    </div>
</template>

<script>
import hostName from '../../config/hostName'
import { changeMerDetail,merInfoList,auditPass } from '../../config/api'
export default {
    name: 'merchant',
    props: {
        mch_id: [Number,String]
    },
    data() {
        return{
            editorState: 0,             //  1: 编辑  0：不可编辑
            hostName: hostName,
            list: {},
        }
    },
    methods: {
        getMerInfo() {
            let data = {
                mch_id: this.mch_id
            }
            merInfoList(data).then( res => {
                if(res.data.data_list.length != 0) {
                     this.list = res.data.data_list[0]
                }
               
            })
        },
        //编辑
        editorInfo() {
            this.editorState = 1
        },
        //  修改后审核
        save() {
            let data = this.list
            delete data.id
            delete data.create_time
            delete data.modify_time
            if(data.card_images) {
                delete data.card_images
            }
            if(data.license_images) {
                delete data.license_images
            }
            if(data.other_images) {
                delete data.other_images
            }
            data.state = 1
            console.log(data)
            changeMerDetail(data).then( res => {
                this.editorState = 0
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                // this.editorState = 0
                this.$router.push('/home/merManage')
                // if(this.list.state == 1) {
                //     this.$router.push({path: '/home/merRate',query: {merId: this.list.mch_id}})
                // }else {
                //     this.$router.push('/home/merManage')
                // }
                
            })
        },

        // 审核通过
        succ() {
            let data = {
                mch_id: this.mch_id,
                state: 1
            }
            auditPass(data).then( res => {
                this.$message({
                    message: '审核通过！',
                    type: 'success'
                });
                this.$router.push({path: '/home/merRate',query: {merId: this.list.mch_id}})
            })
        },
        // 审核失败
        fail() {
            let data = {
                mch_id: this.mch_id,
                state: 2
            }
            auditPass(data).then( res => {
                this.$message({
                    message: '审核失败！',
                    type: 'success'
                });
                this.$router.push('/home/merManage')
            })
        },
    },
    mounted() {
        setTimeout(() =>{
            this.getMerInfo()
        },0 )
        
    }
}
</script>

<style lang="sass" scoped>
.mer-audit
    color: #3D4060
    .tabs 
        margin-left: 30px
        .basic-wrapper
            margin: 0 70px 0 30px
            padding-bottom: 30px
            width: 1135px
            .basic-info
                margin-right: 70px
                margin-top: 30px
                h2
                    font-size: 16px
                    font-weight: bold
                    margin-bottom: 10px
                .item 
                    margin-top: 10px
                    font-size: 14px
                    .name
                        color: #7E8196
                        display: inline-block
                        width: 180px
                    .el-input
                        width: 220px
        .mer-info
            margin: 30px 0 0 30px
            h2
                font-size: 16px
                font-weight: bold
            .photo-wrapper
                display: flex
                .item 
                    margin-top: 20px
                    font-size: 14px
                    .name
                        color: #7E8196
                        display: inline-block
                    .img-ct    
                        img
                            margin: 10px 30px 0 0
                            width: 186px
                            height: 120px
    .btn 
        display: inline-block
        font-size: 14px
        background: #e6a23c
        border-radius: 5px
        color: #fff
        width: 150px    
        height: 40px 
        line-height: 40px
        margin-left: 30px 
        margin: 50px 0 100px 30px
        text-align: center

</style>