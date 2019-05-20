var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1:[
      {
        name:'姓名',
        value: app.globalData.name
      },
      {
        name:'性别',
        value: app.globalData.gender
      },
      {
        name:'生日',
        value: app.globalData.birth
      },
      {
        name:'所在地',
        value: app.globalData.location
      }
    ],
    list2: [
      {
        name: '手机号码',
        value: app.globalData.phone
      },
      {
        name: '工作QQ',
        value: app.globalData.qq
      },
      {
        name: '工作微信',
        value: app.globalData.wechat
      },
      {
        name: '工作邮箱',
        value: app.globalData.email
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: wx.getStorageSync('app.globalData.name'),
      gender: wx.getStorageSync('app.globalData.gender'),
      birth: wx.getStorageSync('app.globalData.birth'),
      location: wx.getStorageSync('app.globalData.location')
    });
  },
  saveUserInfo:function(options){
    
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