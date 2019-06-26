// // pages/on-off/on-off.js
// var util = require('../../utils/util.js');
// const app = getApp()
// // 初始化云数据库
// wx.cloud.init()
// const db = wx.cloud.database()
// // 初始化腾讯云地理定位服务
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

// Page({
//   data: {
//     ison: 0, // 0:等待上课, 1:我要上课, 2:我走了
//     distance: 10000, // 公司与当前位置间的距离，单位：米
//     start: null, // 上班打卡时间
//     end: null // 下班打卡时间
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {

//     // 实例化API核心类
//     qqmapsdk = new QQMapWX({
//       key: 'PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6'
//     });

//     // 获取地理位置
//     wx.getSetting({
//       success(res) {
//         if (!res.authSetting['scope.userLocation']) {
//           wx.authorize({
//             scope: 'scope.userLocation',
//             success(res) {
//               console.log(res);
//             },
//             fail(err) {
//               console.error(err);
//             }
//           })
//         } else {
//           wx.showToast({
//             title: '地理位置获取成功',
//             icon: 'none',
//             duration: 1000
//           })
//         }
//       }
//     });
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   changeState: function() {
//     var nowTime = new Date(),
//       startTime = app.globalData.startTime,
//       endTime = app.globalData.endTime;
//     if (nowTime - startTime >= 0 && nowTime - endTime < 0) {
//       this.setData({
//         ison: 1
//       })
//     } else if (nowTime - endTime >= 0 && nowTime - endTime < 30 * 60 * 1000) {
//       this.setData({
//         ison: 2
//       })
//     } else if (nowTime - endTime >= 30 * 60 * 1000) {
//       this.setData({
//         ison: 0
//       })
//     }
//   },
//   onShow: function() {
//     // 获取当前工作班次
//     db.collection('arrangement').where({
//       available: true
//     }).field({
//       _id: false
//     }).get().then(res => {
//       // console.log(res)
//       if (res.data.length != 1) {
//         wx.showToast({
//           title: '获取工作安排失败',
//           icon: 'none'
//         });
//       } else {
//         var arrangement = res.data[0];
//         app.globalData.workid = arrangement.workid;
//         app.globalData.startTime = arrangement.startTime;
//         app.globalData.endTime = arrangement.endTime;
//         app.globalData.address = arrangement.address;
//         app.globalData.maxDistance = arrangement.maxDistance;
//       }

//       this.changeState();
//     }).catch(err => {
//       console.log(err);
//     });

//     this.changeState();
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function() {

//   },

//   // 计算公司与当前位置间的距离
//   calDistance: function() {
//     var self = this;
//     wx.request({
//       url: 'https://apis.map.qq.com/ws/geocoder/v1/',
//       data: {
//         "key": "PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6",
//         "address": app.globalData.address
//       },
//       method: 'GET',
//       success: function(res) {
//         if (res.data.result) {
//           const addressLocation = res.data.result.location;
//           const courseLat = addressLocation.lat;
//           const courseLng = addressLocation.lng;
//           let destinationDistance;
//           qqmapsdk.calculateDistance({
//             to: [{
//               latitude: courseLat,
//               longitude: courseLng
//             }],
//             success: function(res) {
//               console.log(res.result.elements)
//               destinationDistance = res.result.elements['0'].distance;
//               self.setData({
//                 distance: destinationDistance
//               });
//               console.log(destinationDistance);
//             },
//             fail: function(res) {
//               console.log(res);
//             }
//           });
//         }
//       }
//     });
//   },

//   insertToDB: function() {

//     // 检测是否有重复数据
//     console.log(app.globalData.workid)
//     db.collection('attendance').where({
//       workid: app.globalData.workid,
//       _openid: app.globalData._openid
//     }).get().then(res => {
//       if (res.data.length > 0) {
//         wx.hideLoading();

//         wx.showModal({
//           title: '签到失败',
//           content: '你已经上过课了哦~',
//         })
//       } else {
//         // 插入数据
//         db.collection('attendance').add({
//           data: {
//             workid: app.globalData.workid,
//             startTime: this.data.start,
//             endTime: null
//           }
//         }).then(res => {
//           wx.hideLoading();

//           console.log(res);
//           wx.showToast({
//             title: '成功上课',
//             icon: 'success',
//             duration: 1000,
//             mask: true
//           });
//         }).catch(err => {
//           wx.hideLoading();
//           console.error(err);
//         })
//       }
//     }).catch(err => {
//       console.error(err);
//     })
//   },

//   // 更新下课信息到数据库
//   updateOffToDB: function() {

//     var self = this;
//     db.collection('attendance').where({
//       workid: app.globalData.workid,
//       _openid: app.globalData._openid
//     }).get().then(res => {
//       if (res.data.length == 0) {
//         wx.hideLoading();
//         wx.showModal({
//           title: '签到失败',
//           content: '好像还没签上课唉~',
//         })
//       } else if (res.data.length > 0 && res.data[0].endTime) {
//         wx.hideLoading();
//         wx.showModal({
//           title: '签到失败',
//           content: '你已经下过课了哦~',
//         })
//       } else {
//         // 更新endTime字段
//         db.collection('attendance').doc(res.data[0]._id).update({
//           data: {
//             endTime: self.data.end
//           }
//         }).then(updateRes => {
//           wx.hideLoading();
//           if (updateRes.stats.updated != 1)
//             wx.showToast({
//               title: '签到失败',
//               icon: 'none',
//               duration: 1000,
//               mask: true
//             });
//           else
//             wx.showToast({
//               title: '成功下课',
//               icon: 'success',
//               duration: 1000,
//               mask: true
//             });
//         }).catch(err => {
//           wx.hideLoading();
//           console.error(err);
//         })
//       }
//     }).catch(err => {
//       wx.hideLoading();
//       console.error(err);
//     })
//   },

//   // onOff: function() {
//   //   if (this.data.ison == 1)
//   //     this.on();
//   //   else if (this.data.ison == 2)
//   //     this.off();
//   // },

//   on: function() {
//     wx.showLoading({
//       title: '等待上课...',
//     });

//     var self = this;
//     // 获取地理位置
//     wx.getLocation({
//       type: 'gcj02',
//       success: function(res) {
//         var longitude = res.longitude;
//         var latitude = res.latitude;
//         var accuracy = res.accuracy;
//         // var time = util.formatTime(new Date());
//         var time = new Date();
//         console.log(res.longitude, res.latitude);
//         console.log(time);
//         self.setData({
//           start: time,
//           longitude: longitude,
//           latitude: latitude
//         });

//         // 计算距离
//         self.calDistance();
//         if (self.data.distance > app.globalData.maxDistance) {
//           wx.showToast({
//             title: '您当前不在打卡区域',
//             icon: 'none',
//             duration: 2000
//           })
//         } else {
//           // 检测数据并插入数据库
//           self.insertToDB()
//         }
//       },
//       fail: function(err) {
//         wx.hideLoading();
//         wx.showModal({
//           title: '签到失败',
//           content: '点击"获取位置"开启位置权限',
//         });
//       }
//     })
//   },

//   off: function() {
//     wx.showLoading({
//       title: '等待下课...',
//     });
//     var self = this;
//     // 获取地理位置
//     wx.getLocation({
//       type: 'gcj02',
//       success: function(res) {

//         var longitude = res.longitude;
//         var latitude = res.latitude;
//         var accuracy = res.accuracy;
//         // var time = util.formatTime(new Date());
//         var time = new Date();
//         console.log(res.longitude, res.latitude);
//         console.log(time);
//         self.setData({
//           end: time,
//         });

//         // 计算距离
//         self.calDistance();
//         if (self.data.distance > app.globalData.maxDistance) {
//           wx.showToast({
//             title: '您当前不在打卡区域',
//             icon: 'none',
//             duration: 2000
//           })
//         } else {
//           // 检测数据并插入数据库
//           self.updateOffToDB();
//         }
//       },
//       fail: function(err) {
//         wx.hideLoading();
//         wx.showModal({
//           title: '签到失败',
//           content: '点击"获取位置"开启位置权限',
//         })
//       }
//     })
//   },

//   tap1: function() {
//     // 询问用户是否授权地理定位
//     wx.getSetting({
//       success(res) {
//         console.log(res.authSetting['scope.userLocation'])
//         if (!res.authSetting['scope.userLocation']) {
//           wx.openSetting({
//             success(res) {
//               res.authSetting = {
//                 "scope.userLocation": true
//               }
//             },
//             fail(err) {
//               console.error(err);
//             }
//           })
//         }
//       }
//     })
//   }
// })
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
const utils = require('../../utils/util.js');
Page({
  data: {
    tabs: ["考勤打卡", "工作安排", "工作情况"],
    activeIndex1: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    arr: [],
    sysW: null,
    lastDay: null,
    firstDay: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    year: null,
    height: null,
    items: [{
      name: 'sendor',
      value: '自动上下班提醒'
    }, ],
    canlender: {
      'month': new Date().getMonth() + 1,
      'date': new Date().getDate(),
      "day": new Date().getDay(),
      'year': new Date().getFullYear(),
      "weeks": [],
      //  这是第几个索引
      'thisIndex': 0,
      'thisDay': '1980/01/01',
    },
    arrangeList: [
      /*{
              name: '正常上班',
              value1: null,
              value2: null,
            },
            {
              name: '部门加班',
              value1: null,
              value2: null,
            },
            {
              name: '临时加班',
              value1: null,
              value2: null,
            },
            {
              name: '请假',
              value1: null,
              value2: null,
            }*/
    ],
    statusList: [
      /*{
              name: '上班打卡',
              value: 'null'
            },
            {
              name: '下班打卡',
              value: 'null',
            },
            {
              name: '加班开始',
              value: 'null',
            },
            {
              name: '加班结束',
              value: 'null',
            },*/
    ]
  },

  // 计算公司与当前位置间的距离
  // calDistance: function() {

  // },

  // attend: function() {
  //   wx.showLoading({
  //     title: '等待中...',
  //   });

  //   var self = this;
  //   // 获取地理位置
  //   wx.getLocation({
  //     type: 'gcj02',
  //     success: function(res) {
  //       wx.hideLoading();
  //       var longitude = res.longitude;
  //       var latitude = res.latitude;
  //       var accuracy = res.accuracy;
  //       // var time = util.formatTime(new Date());
  //       var time = new Date();
  //       console.log(res.longitude, res.latitude);
  //       console.log(time);
  //       self.setData({
  //         start: time,
  //         longitude: longitude,
  //         latitude: latitude
  //       });

  //       // 计算距离
  //       wx.request({
  //         url: 'https://apis.map.qq.com/ws/geocoder/v1/',
  //         data: {
  //           "key": "PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6",
  //           "address": app.globalData.address
  //         },
  //         method: 'GET',
  //         success: function(res) {
  //           if (res.data.result) {
  //             const addressLocation = res.data.result.location;
  //             const courseLat = addressLocation.lat;
  //             const courseLng = addressLocation.lng;
  //             let destinationDistance;
  //             qqmapsdk.calculateDistance({
  //               to: [{
  //                 latitude: courseLat,
  //                 longitude: courseLng
  //               }],
  //               success: function(res) {
  //                 console.log(res.result.elements)
  //                 destinationDistance = res.result.elements['0'].distance;
  //                 self.setData({
  //                   distance: destinationDistance
  //                 });
  //                 console.log(destinationDistance);
  //                 if (destinationDistance > app.globalData.maxDistance) {
  //                   wx.showToast({
  //                     title: '您当前不在打卡区域',
  //                     icon: 'none',
  //                     duration: 2000
  //                   })
  //                   return false;
  //                 } else {
  //                   // 检测数据并插入数据库
  //                   return true;
  //                 }
  //               },
  //               fail: function(res) {
  //                 console.log(res);
  //               }
  //             });
  //           }
  //         }
  //       });

  //     },
  //     fail: function(err) {
  //       wx.hideLoading();
  //       wx.showModal({
  //         title: '签到失败',
  //         content: '点击"获取位置"开启位置权限',
  //       });
  //       return false;
  //     }
  //   })
  // },

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
  },

  //获取日历相关参数
  dataTime: function() {
    var _date = new Date()
    var year = _date.getFullYear() //年
    var month = _date.getMonth() + 1 //月
    var date = _date.getDate() //日
    this.showThisDay(_date, year, month, date);
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth();
    // var months = date.getMonth() + 1;

    // //获取现今年份
    // this.data.year = year;

    // //获取现今月份
    // this.data.month = months;

    // //获取今日日期
    // this.data.getDate = date.getDate();

    // //最后一天是几号
    // var d = new Date(year, months, 0);
    // this.data.lastDay = d.getDate();

    // //第一天星期几
    // let firstDay = new Date(year, month, 1);
    // this.data.firstDay = firstDay.getDay();
  },


  onLoad: function() {
    this.dataTime();
    console.log(this.data.activeIndex1)
    //根据得到今月的最后一天日期遍历 得到所有日期
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      this.data.arr.push(i);
    }
    var res = wx.getSystemInfoSync();
    this.setData({
      sysW: res.windowHeight / 18,
      height: (res.windowHeight / 25) - 5,
      marLet: this.data.firstDay,
      arr: this.data.arr,
      year: this.data.year,
      getDate: this.data.getDate,
      month: this.data.month
    });
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });


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
  onShow: function() {
    this.setData({
      activeIndex1: app.globalData.activeWork,
    })
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
  on_but: function() {
    const decode = {
      on: '上班打卡',
      off: '下班打卡',
      early: '早退',
      extra: '可申请加班',
      late: '迟到打卡'
    }
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      },
      complete(res) {

        wx.showLoading({
          title: '等待中...',
        });

        // 获取地理位置
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            wx.showLoading({
              title: '检测地理位置...',
            });
            var longitude = res.longitude;
            var latitude = res.latitude;
            var accuracy = res.accuracy;
            // var time = util.formatTime(new Date());
            var time = new Date();
            console.log(res.longitude, res.latitude);
            console.log(time);

            // 计算距离
            wx.request({
              url: 'https://apis.map.qq.com/ws/geocoder/v1/',
              data: {
                "key": "PISBZ-7SOW4-4V5UX-XKPJW-JDKK3-ZQBR6",
                "address": app.globalData.address
              },
              method: 'GET',
              success: function (res) {
                wx.showLoading({
                  title: '计算距离中...',
                });
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
                    success: function (res) {
                      console.log(res.result.elements)
                      destinationDistance = res.result.elements['0'].distance;
                      self.setData({
                        distance: destinationDistance
                      });
                      console.log(destinationDistance, app.globalData.maxDistance);
                      if (destinationDistance > app.globalData.maxDistance) {
                        wx.showToast({
                          title: '您当前不在打卡区域',
                          icon: 'none',
                          duration: 2000
                        })
                        wx.hideLoading();
                        return false;
                      } else {
                        // 检测数据并插入数据库
                        wx.showLoading({
                          title: '正在签到...',
                        });
                        console.log("start attending...")
                        wx.request({
                          url: app.globalData.proxy + '/attend/swipe',
                          method: 'POST',
                          data: {
                            userId: wx.getStorageSync('user').userId,
                            time: utils.formatTime(new Date())
                          },
                          success(res1) {
                            wx.hideLoading();
                            if (res1.statusCode === 200) {
                              if (res1.data.code !== 0)
                                wx.showToast({
                                  title: res1.data.msg || '',
                                  icon: 'none'
                                })
                              else {
                                wx.showToast({
                                  title: decode[res1.data.state],
                                  icon: 'success'
                                })
                              }
                            }
                          },
                          fail(err) {
                            wx.hideLoading();
                            wx.showToast({
                              title: '签到失败',
                              icon: 'none',
                              duration: 1000
                            })
                          }
                        })
                      }
                    },
                    fail: function (res) {
                      wx.hideLoading();
                      console.log(res);
                    }
                  });
                }
              }
            });

          },
          fail: function (err) {
            wx.hideLoading();
            wx.showModal({
              title: '签到失败',
              content: '点击"获取位置"开启位置权限',
            });
            return false;
          }
        })

        
      }
    })
  },
  showThisDay: function(date, _year, _month, _date1) {
    // 页面初始化 options为页面跳转所带来的参数
    var canlender = [],
      _date = new Date(date);
    var year = _year,
      month = _month,
      date = _date1;
    console.info(year + "-" + month + "-" + date)
    var day = _date.getDay();
    var firstDay = new Date(year, month - 1, 1).getDay();
    var lastMonthDays = [];
    // 上个月需要显示的天数
    for (var i = firstDay - 1; i >= 0; i--) {
      console.warn(new Date(year, month, -i).getDate())
      lastMonthDays.push({
        'year': year,
        'date': new Date(year, month, -i).getDate() + '',
        'month': month - 1,
        'click': false,
        'noDay': true,
      })
    }
    var currentMonthDys = [];
    //  这个月显示的天数进行判断  如果已经过去则没法点击
    console.log('this date' + date);
    for (var i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      if (i > date) {
        currentMonthDys.push({
          'year': year,
          'date': i + "",
          'month': month,
          'click': true,
          'noDay': false,
        })
      } else if (i == date) {
        //  这里会打印的从1开始的
        var fristDayLength = firstDay + i - 1;
        this.setData({
          'canlender.thisIndex': 0 + ',' + fristDayLength,
          'canlender.thisDay': year + '/' + month + '/' + i
        })
        currentMonthDys.push({
          'year': year,
          'date': i + "",
          'month': month,
          'click': false,
          'noDay': false,
        })
      } else {
        currentMonthDys.push({
          'year': year,
          'date': i + "",
          'month': month,
          'click': false,
          'noDay': true,
        })
      }
    }
    var nextMonthDays = []
    var endDay = new Date(year, month, 0).getDay();
    for (var i = 1; i < 7 - endDay; i++) {
      nextMonthDays.push({
        'year': year,
        'date': i + '',
        'month': parseInt(month) + 1,
        'click': false,
        'noDay': true,
      })
    }

    canlender = canlender.concat(lastMonthDays, currentMonthDys, nextMonthDays)
    var weeks = []

    for (var i = 0; i < canlender.length; i++) {
      if (i % 7 == 0) {
        weeks[parseInt(i / 7)] = new Array(7);
      }
      weeks[parseInt(i / 7)][i % 7] = canlender[i]
    }

    console.info(weeks)
    this.setData({
      "canlender.weeks": weeks
    })
  },
  /**
   *  获取到当前天数
   */
  getThisData: function(dom) {
    const self = this;
    var xy = dom.currentTarget.dataset.index,
      thisDay = dom.currentTarget.dataset.date;
    var xyArr = xy.split(',');
    var x = parseInt(xyArr[0]),
      y = parseInt(xyArr[1]);
    if (xyArr[2] == true || xyArr[2] == 'true') return;
    //  index为从0开始的索引
    var thisDayDomClick = "canlender.weeks[" + x + "][" + [y] + "].click";
    var oldXy = this.data.canlender.thisIndex;
    var oldXyArr = oldXy.split(',');
    var oldx = parseInt(oldXyArr[0]),
      oldy = parseInt(oldXyArr[1]);
    var oldDayDom = "canlender.weeks[" + oldx + "][" + oldy + "].click";
    this.setData({
      [oldDayDom]: true,
      [thisDayDomClick]: false,
      'canlender.thisIndex': x + ',' + y,
      'canlender.thisDay': thisDay,
    })

    var nowDate = new Date(thisDay.split('/').join('-'));
    var startDate = new Date(nowDate.getTime());
    var endDate = new Date(nowDate.getTime() + 24 * 3600 * 1000);
    console.log(startDate, endDate)

    const url = app.globalData.proxy + '/arrange/list/user';
    wx.request({
      url,
      method: 'POST',
      data: {
        userId: wx.getStorageSync('user').userId,
        startDate,
        endDate
      },
      success(res) {
        if (res.data.code !== 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          self.setData({
            arrangeList: [],
            statusList: []
          })
        } else {
          var list = res.data.list.map(v => {
            var type, state;
            switch (v.type) {
              case 'leave':
                type = '请假';
                break;
              case 'extra':
                type = '部门加班';
                break;
              case 'ordinary':
                type = '正常上班';
                break;
              case 'temp':
                type = '临时加班';
                break;
              default:
                type = '上班';
                break;
            }
            switch (v.state) {
              case 'on':
                state = '上班打卡';
                break;
              case 'off':
                state = '下班打卡';
                break;
              case 'late':
                state = '迟到';
                break;
              case 'early':
                state = '早退';
                break;
              case 'extra':
                state = '可申请加班';
                break;
            }
            return {
              arrangeList: {
                onTime: new Date(v.onTime).toLocaleTimeString(),
                offTime: new Date(v.offTime).toLocaleTimeString(),
                type: type
              },
              statusList: {
                realOnTime: new Date(v.realOnTime).toLocaleTimeString(),
                realOffTime: new Date(v.realOffTime).toLocaleTimeString(),
                state: state,
                isExtra: v.state === 'extra'
              }
            }
          })
          self.setData({
            arrangeList: list.map(v => v.arrangeList),
            statusList: list.map(v => v.statusList)
          })
        }
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  /**
   *  bindDateChange 
   */
  bindDateChange: function(e) {
    var date = e.detail.value;
    var dateArr = date.split('-');
    var month = dateArr[1].substring(0, 1) == 0 || dateArr[1].substring(0, 1) == '0' ? dateArr[1].replace(/^[0-9]/, '') : dateArr[1];
    var day = dateArr[2].substring(0, 1) == 0 || dateArr[2].substring(0, 1) == '0' ? dateArr[2].replace(/^[0-9]/, '') : dateArr[2];
    var dateObj = new Date(dateArr[0] + '-' + month + '-' + day);
    this.showThisDay(dateObj, dateArr[0], month, day);
  },

  checkboxChange(e) {
    var url = app.globalData.proxy + '/remind';
    wx.request({
      url,
      method: 'POST',
      data: {
        userId: wx.getStorageSync('user').userId,
        isRemind: e.detail.value[0] === 'sendor'
      },
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.code !== 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 1000
            })
          }
        }
      },
      fail(err) {
        console.log(err);
      }
    })
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex1: e.currentTarget.id
    });
  }
});