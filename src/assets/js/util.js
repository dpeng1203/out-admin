export default {
  checkText(str) {
    let reg = /[\u4e00-\u9fa5]/g, arr = []
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },
  checkCode(str) {
    let reg = /^[0-9]{4}$/g, arr = []
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },
  checkNumber(str) {
    let reg = /^[\u4e00-\u9fa5][a-zA-Z]/g, arr = []
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },
  checkNemberFloat(val) {
    let regPos = /^\d+(\.\d+)?$/; //非负浮点数
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  //判断邮政编码
  checkPostalCode(val) {
    let re = /^[1-9]{1}[0-9]{5}$/
    if (re.test(val))
      return true
    else
      return false
  },
  // checkPhone(str) {
  //   let reg = /^0?(13|14|15|18)[0-9]{9}$/g, arr = []
  //   if (reg.test(str)) {
  //     return true
  //   } else {
  //     return false
  //   }
  // },
  checkPhone(str) {
    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g, arr = [];
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },
  checkID(str) {
    let reg = /^([0-9]){7,18}(x|X)?$/g, arr = [];
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },


  getUserIP(onNewIP){ //  onNewIp - your listener function for new IPs
  //compatibility for firefox and chrome
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new myPeerConnection({
      iceServers: []
    }),
    noop = function () {
    },
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }

  //create a bogus data channel
  pc.createDataChannel("");

  // create offer and set local description
  pc.createOffer().then(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(iterateIP);
    });

    pc.setLocalDescription(sdp, noop, noop);
  }).catch(function (reason) {
    // An error occurred, so handle the failure to connect
  });

  //sten for candidate events
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
},
// Usage


}
