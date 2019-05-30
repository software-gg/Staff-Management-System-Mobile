//index.js
//获取应用实例
const app = getApp()
// wx.cloud.init();
// const db = wx.cloud.database()
var zhenzisms = require('../../utils/zhenzisms.js');


Page({
  data: {
    userid: null,
    password: null,
    fake_id: null,
    fake_password: null,
    items: [{
      name: 'remember',
      value: '是否记录登陆工号和密码'
    }, ],
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    name: '',
    phone: '',
    code: '',
    second: 60

  },
  onLoad: function() {
    // 调用云函数获取openid
    // wx.cloud.callFunction({
    //   name: 'login',
    //   success: function(res) {
    //     app.globalData._openid = res.result.openid;
    //     // console.log(res.result.openid)
    //   }
    // });

    // 如果缓存中含有该用户的登录数据，则可以免登录直接进入首页
    if (wx.getStorageSync('user')) {
      wx.switchTab({
        url: '../on-off/on-off'
      });
    }
  },
  useridInput: function(event) {
    this.setData({
      userid: event.detail.value
    })
  },
  usernameInput: function(event) {
    this.setData({
      password: event.detail.value
    })
  },


  checkboxChange: function() {
    try {
      fake_id = wx.getStorageSync('userid')
      fake_password = wx.getStorageSync('password')
    } catch (e) {

    }


  },
  bindPhoneInput(e) {
    // console.log(e.detail.value);
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
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取短信验证码
  // getCode(e) {
  //   console.log('获取验证码');
  //   var that = this;
  //   zhenzisms.client.init('https://smsdeveloper.zhenzikj.com', 'AppID', 'AppSecret');
  //   zhenzisms.client.sendCode(function(res) {
  //     console.log(res);
  //     if (res.data.code == 0) {
  //       that.timer();
  //     }
  //     wx.showToast({
  //       title: res.data.data,
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }, that.data.phone, '验证码为:{code}');
  // },

  timer: function() {
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
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },



  // saveUserToDB: function(userInfo) {
  //   var self = this;
  //   db.collection('user').where({
  //     _openid: app.globalData.openid,
  //   }).get().then(res => {
  //     if (res.data.length == 0) {
  //       db.collection('user').add({
  //         data: {
  //           userInfo: userInfo,
  //           userid: self.data.userid,
  //           password: self.data.password,

  //         }
  //       }).then(res => {
  //         console.log(res);
  //       }).catch(err => {
  //         console.error(err);
  //       });
  //     }
  //   }).catch(err => {
  //     console.error(err);
  //   })
  // },

  loginBtnClick: function(e) {
    var self = this;

    if (e.detail.userInfo) {
      if (!this.data.userid || !this.data.password)
        wx.showModal({
          title: '提示',
          content: '以上均为必填项',
        })
      else if (this.data.userid.length < 3)
        wx.showModal({
          title: '提示',
          content: '工号格式有误',
        })
      else {
        // 存储三个个人信息到本地存储

        // wx.getUserInfo({
        //   success(res) {
        //     wx.setStorageSync('userInfo', res.userInfo);
        //     // 插入当前用户信息到数据库
        //     self.saveUserToDB(res.userInfo);
        //   },
        //   fail(err) {
        //     console.error(err);
        //   }
        // })


        // 测试：
        // if (zhenzisms.client.validateCode(this.data.phone, this.data.code) == 'ok') {
        //   wx.switchTab({
        //     url: '../on-off/on-off',
        //   })
        // } else {
        //   console.log("验证码有误")
        // }
        wx.showLoading({
          title: 'loading...',
        })
        wx.request({
          url: app.globalData.proxy + '/user/login',
          method: 'POST',
          data: {
            userId: self.data.userid,
            phone: self.data.phone,
            pwd: self.data.password
          },
          success(res) {
            if (res.data.code === 1)
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            else {
              // wx.setStorageSync('userid', self.data.userid);
              wx.setStorageSync('user', res.data.user);
              console.log(res.data.user)
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              })
              setTimeout(function() {
                wx.switchTab({
                  url: '../on-off/on-off',
                })
              }, 500)
            }
          },
          fail(err) {
            console.log(err)
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          },
          complete(res) {
            wx.hideLoading();
          }
        })
      }
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 1000
      });
    }
  },
})