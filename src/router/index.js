import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import adminLogin from '@/components/adminLogin'

//商户管理
const merchant = resolve => require(['../components/merManagement/merchant'], resolve);
const merManage = resolve => require(['../components/merManagement/merManage'], resolve);
const merDetail = resolve => require(['../components/merManagement/merDetail'], resolve);
const merRate = resolve => require(['../components/merManagement/merRate'], resolve);

//提现列表
const cashList = resolve => require(['../components/cashList/cashList'], resolve);

//通道管理
const channel = resolve => require(['../components/channelAndPayBank/channel'], resolve);
const payBank = resolve => require(['../components/channelAndPayBank/payBank'], resolve);


//主页详情
const homeDetail = resolve => require(['../components/homeDetail/homeDetail'], resolve);

//交易管理
const billList = resolve => require(['../components/billManage/billList'], resolve);
const oneBillDetail = resolve => require(['../components/billManage/oneBillDetail'], resolve);
const payList = resolve => require(['../components/billManage/payList'], resolve);
const payDetail = resolve => require(['../components/billManage/payDetail'], resolve);

// 系统产品管理
const sysApp = resolve => require(['../components/sysApp/sysApp'], resolve);
const addSysApp = resolve => require(['../components/sysApp/addSysApp'], resolve);
const changeSysApp = resolve => require(['../components/sysApp/changeSysApp'], resolve);


//代理管理
const agentList = resolve => require(['../components/agent/agentList'], resolve);
const agentPayList = resolve => require(['../components/agent/agentPayList'], resolve);

// const addAgent = resolve => require(['../components/agent/addAgent'], resolve);
// const childAgent = resolve => require(['../components/agent/childAgent'], resolve);
// const addChildAgent = resolve => require(['../components/agent/addChildAgent'], resolve);

//回调确认
const callbackList = resolve => require(['../components/callback/callbackList'], resolve);
const qrList = resolve => require(['../components/callback/qrList'], resolve);
const missList = resolve => require(['../components/callback/missList'], resolve);
const addQr = resolve => require(['../components/callback/addQr'], resolve);
const setUid = resolve => require(['../components/callback/setUid'], resolve);
const addmiss = resolve => require(['../components/callback/addmiss'], resolve);

//支付宝红包
const zfbhb = resolve => require(['../components/zfbhb/zfbhb'], resolve);
const zfbToBank = resolve => require(['../components/zfbhb/zfbToBank'], resolve);

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home,
      // redirect: '/home/homeDetail',
      children:[
        {path: 'merchant', name: 'merchant', component: merchant},
        {path: 'merManage', name: 'merManage', component: merManage},
        {path: 'merDetail', name: 'merDetail', component: merDetail},
        {path: 'merRate', name: 'merRate', component: merRate},

        //提现列表
        {path: 'cashList', name: 'cashList', component: cashList},
        //通道管理
        {path: 'channel', name: 'channel', component: channel},
        //代付管理
        {path: 'payBank', name: 'payBank', component: payBank},

        // 主页详情
        {path: 'homeDetail', name: 'homeDetail', component: homeDetail},

        //交易管理
        {path: 'billList', name: 'billList', component: billList},
        {path: 'oneBillDetail', name: 'oneBillDetail', component: oneBillDetail},
        {path: 'payList', name: 'payList', component: payList},
        {path: 'payDetail', name: 'payDetail', component: payDetail},

        //系统产品管理
        {path: 'sysApp', name: 'sysApp', component: sysApp},
        {path: 'addSysApp', name: 'addSysApp', component: addSysApp},
        {path: 'changeSysApp', name: 'changeSysApp', component: changeSysApp},

        //  代理管理
        {path: 'agentList', name: 'agentList', component: agentList},
        {path: 'agentPayList', name: 'agentPayList', component: agentPayList},
        // {path: 'addAgent', name: 'addAgent', component: addAgent},
        // {path: 'childAgent', name: 'childAgent', component: childAgent},
        // {path: 'addChildAgent', name: 'addChildAgent', component: addChildAgent},
        
        //  回调确认
        {path: 'callbackList', name: 'callbackList', component: callbackList},
        {path: 'qrList', name: 'qrList', component: qrList},
        {path: 'missList', name: 'missList', component: missList},
        {path: 'addQr', name: 'addQr', component: addQr},
        {path: 'setUid', name: 'setUid', component: setUid},
        {path: 'addmiss', name: 'addmiss', component: addmiss},

        //支付宝红包
        {path: 'zfbhb', name: 'zfbhb', component: zfbhb},
        {path: 'zfbToBank', name: 'zfbToBank', component: zfbToBank},
      ]
    },
    {
      path: '/',
      redirect: '/adminLogin'
    },
    {
      path: '/adminLogin',
      name: 'adminLogin',
      component: adminLogin
    },
  ]
})





