// pages/settings/settings.js
Page({
  data: {
    userInfo: null,
    userid: null,
    userclass: null,
    username: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userid: wx.getStorageSync('userid'),
      userclass: wx.getStorageSync('userclass'),
      username: wx.getStorageSync('username')
    });
  },

  unlogin: function() {
    wx.clearStorage();
    wx.redirectTo({
      url: '../../index/index',
    });
  }
})