// pages/on-off/on-off.js
var util = require('../../utils/util.js');
const app = getApp()
// 初始化云数据库
wx.cloud.init()
const db = wx.cloud.database()
// 初始化腾讯云地理定位服务
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    ison: 0, // 0:等待上课, 1:我要上课, 2:我走了
    distance: 10000, // 公司与当前位置间的距离，单位：米
    start: null, // 上班打卡时间
    end: null // 下班打卡时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6'
    });

    // 获取地理位置
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log(res);
            },
            fail(err) {
              console.error(err);
            }
          })
        } else {
          wx.showToast({
            title: '地理位置获取成功',
            icon: 'none',
            duration: 1000
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  changeState: function() {
    var nowTime = new Date(),
      startTime = app.globalData.startTime,
      endTime = app.globalData.endTime;
    if (nowTime - startTime >= 0 && nowTime - endTime < 0) {
      this.setData({
        ison: 1
      })
    } else if (nowTime - endTime >= 0 && nowTime - endTime < 30 * 60 * 1000) {
      this.setData({
        ison: 2
      })
    } else if (nowTime - endTime >= 30 * 60 * 1000) {
      this.setData({
        ison: 0
      })
    }
  },
  onShow: function() {
    // 获取当前工作班次
    db.collection('arrangement').where({
      available: true
    }).field({
      _id: false
    }).get().then(res => {
      // console.log(res)
      if (res.data.length != 1) {
        wx.showToast({
          title: '获取工作安排失败',
          icon: 'none'
        });
      } else {
        var arrangement = res.data[0];
        app.globalData.workid = arrangement.workid;
        app.globalData.startTime = arrangement.startTime;
        app.globalData.endTime = arrangement.endTime;
        app.globalData.address = arrangement.address;
        app.globalData.maxDistance = arrangement.maxDistance;
      }

      this.changeState();
    }).catch(err => {
      console.log(err);
    });

    this.changeState();
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

  // 计算公司与当前位置间的距离
  calDistance: function() {
    var self = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        "key": "PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6",
        "address": app.globalData.address
      },
      method: 'GET',
      success: function(res) {
        if (res.data.result) {
          const addressLocation = res.data.result.location;
          const courseLat = addressLocation.lat;
          const courseLng = addressLocation.lng;
          let destinationDistance;
          qqmapsdk.calculateDistance({
            to: [{
              latitude: courseLat,
              longitude: courseLng
            }],
            success: function(res) {
              console.log(res.result.elements)
              destinationDistance = res.result.elements['0'].distance;
              self.setData({
                distance: destinationDistance
              });
              console.log(destinationDistance);
            },
            fail: function(res) {
              console.log(res);
            }
          });
        }
      }
    });
  },

  insertToDB: function() {

    // 检测是否有重复数据
    console.log(app.globalData.workid)
    db.collection('attendance').where({
      workid: app.globalData.workid,
      _openid: app.globalData._openid
    }).get().then(res => {
      if (res.data.length > 0) {
        wx.hideLoading();

        wx.showModal({
          title: '签到失败',
          content: '你已经上过课了哦~',
        })
      } else {
        // 插入数据
        db.collection('attendance').add({
          data: {
            workid: app.globalData.workid,
            startTime: this.data.start,
            endTime: null
          }
        }).then(res => {
          wx.hideLoading();

          console.log(res);
          wx.showToast({
            title: '成功上课',
            icon: 'success',
            duration: 1000,
            mask: true
          });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
        })
      }
    }).catch(err => {
      console.error(err);
    })
  },

  // 更新下课信息到数据库
  updateOffToDB: function() {

    var self = this;
    db.collection('attendance').where({
      workid: app.globalData.workid,
      _openid: app.globalData._openid
    }).get().then(res => {
      if (res.data.length == 0) {
        wx.hideLoading();
        wx.showModal({
          title: '签到失败',
          content: '好像还没签上课唉~',
        })
      } else if (res.data.length > 0 && res.data[0].endTime) {
        wx.hideLoading();
        wx.showModal({
          title: '签到失败',
          content: '你已经下过课了哦~',
        })
      } else {
        // 更新endTime字段
        db.collection('attendance').doc(res.data[0]._id).update({
          data: {
            endTime: self.data.end
          }
        }).then(updateRes => {
          wx.hideLoading();
          if (updateRes.stats.updated != 1)
            wx.showToast({
              title: '签到失败',
              icon: 'none',
              duration: 1000,
              mask: true
            });
          else
            wx.showToast({
              title: '成功下课',
              icon: 'success',
              duration: 1000,
              mask: true
            });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
        })
      }
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    })
  },

  // onOff: function() {
  //   if (this.data.ison == 1)
  //     this.on();
  //   else if (this.data.ison == 2)
  //     this.off();
  // },

  on: function() {
    wx.showLoading({
      title: '等待上课...',
    });

    var self = this;
    // 获取地理位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var longitude = res.longitude;
        var latitude = res.latitude;
        var accuracy = res.accuracy;
        // var time = util.formatTime(new Date());
        var time = new Date();
        console.log(res.longitude, res.latitude);
        console.log(time);
        self.setData({
          start: time,
          longitude: longitude,
          latitude: latitude
        });

        // 计算距离
        self.calDistance();
        if (self.data.distance > app.globalData.maxDistance) {
          wx.showToast({
            title: '您当前不在打卡区域',
            icon: 'none',
            duration: 2000
          })
        } else {
          // 检测数据并插入数据库
          self.insertToDB()
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showModal({
          title: '签到失败',
          content: '点击"获取位置"开启位置权限',
        });
      }
    })
  },

  off: function() {
    wx.showLoading({
      title: '等待下课...',
    });
    var self = this;
    // 获取地理位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {

        var longitude = res.longitude;
        var latitude = res.latitude;
        var accuracy = res.accuracy;
        // var time = util.formatTime(new Date());
        var time = new Date();
        console.log(res.longitude, res.latitude);
        console.log(time);
        self.setData({
          end: time,
        });

        // 计算距离
        self.calDistance();
        if (self.data.distance > app.globalData.maxDistance) {
          wx.showToast({
            title: '您当前不在打卡区域',
            icon: 'none',
            duration: 2000
          })
        } else {
          // 检测数据并插入数据库
          self.updateOffToDB();
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showModal({
          title: '签到失败',
          content: '点击"获取位置"开启位置权限',
        })
      }
    })
  },

  tap1: function() {
    // 询问用户是否授权地理定位
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.userLocation'])
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(res) {
              res.authSetting = {
                "scope.userLocation": true
              }
            },
            fail(err) {
              console.error(err);
            }
          })
        }
      }
    })
  }
})