//index.js
var zhenzisms = require('../../utils/zhenzisms.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    name: '',
    phone: '',
    code: '',
    second: 60
  },
  onLoad: function () {

  },
  //姓名输入
  bindNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号输入
  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  bind: function () {
    console.log(app.globalData.activeIndex)
  },
  //验证码输入
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取短信验证码
  getCode(e) {
    console.log('获取验证码');
    var that = this;
    zhenzisms.client.init('https://sms_developer.zhenzikj.com', 'appId', 'appSecret');
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        that.timer();
        return;
      }
      wx.showToast({
        title: res.data.data,
        icon: 'none',
        duration: 2000
      })
    }, '15811111111', '验证码为:3322');

  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  //保存
  save(e) {
    console.log('姓名: ' + this.data.name);
    console.log('手机号: ' + this.data.phone);
    console.log('验证码: ' + this.data.code);

    //省略提交过程
  }
})

