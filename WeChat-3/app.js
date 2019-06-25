//app.js
App({
  onLaunch: function() {
    // // 初始化知晓云SDK
    // wx.BaaS = requirePlugin('sdkPlugin')
    // //让插件帮助完成登录、支付等功能
    // wx.BaaS.wxExtend(wx.login,
    //   wx.getUserInfo,
    //   wx.requestPayment)

    // wx.BaaS.init('0e4a8b16d5c15dd0815b')

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    proxy: 'http://192.168.1.104:9093',
    workid: '',
    user: '',
    // _openid: null,
    startTime: null,
    endTime: null,
    maxDistance: null,
    address: null,
    activeApply:0,
    activeWork:0,
    maxDistance: null,
    // address: null,
    // name: null,
    // gender: null,
    // birth: null,
    // location: null,
    // phone: null,
    // qq: null,
    // wechat: null,
    // email: null,
    // oldpasswd: null,
    // newpasswd: null,
    // cfmpasswd: null
  }
})