var app = getApp()

Page({
  pwd: {},
  data: {
    list1: [{
        key: 'originPwd',
        name: '旧密码',
        // value: app.globalData.oldpasswd
      },
      {
        key: 'newPwd',
        name: '新密码',
        // value: app.globalData.newpasswd
      },
      {
        key: 'confirmPwd',
        name: '确认密码',
        // value: app.globalData.cfmpasswd
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   title: options.title
    // })
  },
  //保存密码并退出登陆
  savePasswdAndUnlogin: function() {
    const self = this;
    const user = wx.getStorageSync('user');
    if (!self.data.pwd || !self.data.pwd.originPwd || !self.data.pwd.newPwd || !self.data.pwd.confirmPwd) {
      wx.showToast({
        title: '以上均为必填项',
        icon: 'none',
        duration: 1000
      })
    } else if (self.data.pwd.newPwd !== self.data.pwd.confirmPwd) {
      wx.showToast({
        title: '两个密码不同',
        icon: 'none',
        duration: 1000
      })
    } else {
      // console.log(this.data.pwd)
      wx.showLoading({
        title: 'loading...',
      })
      wx.request({
        url: app.globalData.proxy + '/user/changePwd',
        method: 'POST',
        data: {
          userId: user.userId,
          pwd: self.data.pwd.originPwd,
          newPwd: self.data.pwd.newPwd
        },
        success(res) {
          if (res.data.code !== 0)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          else {
            // wx.setStorageSync('userid', self.data.userid);
            // wx.setStorageSync('user', res.data.user);
            // console.log(res.data.user)
            wx.showToast({
              title: '密码修改成功!',
              icon: 'success',
              duration: 1000
            })
            wx.clearStorage();
            wx.redirectTo({
              url: '../index/index',
            });
          }
        },
        fail(err) {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1000
          })
        },
        complete(res) {
          wx.hideLoading();
        }
      })
    }
  },

  inputPwd: function(e) {
    const key = e.target.dataset.key;
    const val = e.detail.value;
    this.setData({
      pwd: {
        ...this.data.pwd,
        [key]: val
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})