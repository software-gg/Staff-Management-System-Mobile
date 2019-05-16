var util = require('../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

// pages/users/users.js
var app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listForStart: [],
    listForEnd: [],
    tabs: ["上课名单", "下课名单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */

  searchUserInDB: function(obj) {

    wx.showLoading({
      title: '加载中...',
    })

    var self = this;
    db.collection('user').where({
      _openid: obj._openid
    }).get().then(res => {
      if (res.data.length != 1) {
        wx.showToast({
          title: '数据库错误',
          icon: 'none'
        });
        return;
      }
      var userInfo = res.data[0];
      var formatStartTime = util.formatTime(obj.startTime);
      var formatEndTime;
      if (obj.endTime != null)
        formatEndTime = util.formatTime(obj.endTime);
      self.setData({
        listForStart: self.data.listForStart.concat([{
          userInfo: userInfo,
          attend: obj
        }].map((item) => {
          item.attend.startTime = formatStartTime;
          return item;
        }))
      });

      // console.log(obj.endTime)
      if (obj.endTime !== null) {
        self.setData({
          listForEnd: self.data.listForEnd.concat([{
            userInfo: userInfo,
            attend: obj
          }].map((item) => {
            item.attend.startTime = formatStartTime;
            item.attend.endTime = formatEndTime;
            return item;
          }))
        });
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },

  onShow: function() {
    wx.showLoading({
      title: '加载中...',
    });
    var self = this;
    this.setData({
      listForStart: [],
      listForEnd: []
    })
    db.collection('attendance').where({
      workid: app.globalData.workid
    }).get().then(res => {
      for (var i in res.data) {
        var obj = res.data[i];
        self.searchUserInDB(obj);
      }
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  }
})