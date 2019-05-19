var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1: [
      {
        name: '旧密码',
        value: app.globalData.oldpasswd
      },
      {
        name: '新密码',
        value: app.globalData.newpasswd
      },
      {
        name: '确认密码',
        value: app.globalData.cfmpasswd
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  },
//保存密码并退出登陆
  savePasswdAndUnlogin: function () {
    
    wx.clearStorage();
    wx.redirectTo({
      url: '../../index/index',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})