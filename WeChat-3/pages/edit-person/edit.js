var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    list1: [{
        key: 'name',
        name: '姓名',
        // value: wx.getStorageSync('user').name
      },
      {
        key: 'gender',
        name: '性别',
        // value: wx.getStorageSync('user').gender
      },
      {
        key: 'birthday',
        name: '生日',
        // value: wx.getStorageSync('user').birthday
      },
      {
        key: 'address',
        name: '所在地',
        // value: wx.getStorageSync('user').address
      }
    ],
    list2: [{
        key: 'phone',
        name: '手机号码',
        // value: wx.getStorageSync('user').phone
      },
      {
        key: 'qq',
        name: '工作QQ',
        // value: wx.getStorageSync('user').qq
      },
      {
        key: 'wechat',
        name: '工作微信',
        // value: wx.getStorageSync('user').wechat

      },
      {
        key: 'email',
        name: '工作邮箱',
        // value: wx.getStorageSync('user').email
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   name: wx.getStorageSync('app.globalData.name'),
    //   gender: wx.getStorageSync('app.globalData.gender'),
    //   birth: wx.getStorageSync('app.globalData.birth'),
    //   location: wx.getStorageSync('app.globalData.location')
    // });
  },
  saveUserInfo: function() {
    const self = this;
    wx.showLoading({
      title: 'loading...',
    })
    wx.request({
      url: app.globalData.proxy + '/user/changeInfo',
      data: self.data.user,
      method: 'POST',
      success(res) {
        if (res.data.code !== 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.setStorageSync('user', self.data.user);
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1000
          })
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
    this.setData({
      user: wx.getStorageSync('user')
    })
    // console.log(this.data.user)
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

  },

  inputUserInfo: function(e) {
    const self = this;
    const key = e.target.dataset.key;
    const val = e.detail.value;
    // console.log(e)
    self.setData({
      user: {
        ...self.data.user,
        [key]: val
      }
    })
    console.log(self.data.user)
  }
})