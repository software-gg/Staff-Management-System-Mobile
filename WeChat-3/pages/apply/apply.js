var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    tabs: ["待审核", "已通过", "未通过"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // 有两个list，对应请假申请和加班申请，每个list中的一个元素有三个状态，0为待审核，
    // 1为已通过，2为未通过,每次遍历列表决定去哪个navbar。然后在加载页面的的时候对list的元素进行增减。
    //num代表是第几个表，0是第一个，1是第二个
    list: [
      // {
      //   num:0,
      //   time: null,
      //   name: '请假申请',
      //   starttime: null,
      //   endtime: null,
      //   status: 1,
      // },
      // {
      //   num: 0,
      //   time: null,
      //   name: '请假申请',
      //   starttime: null,
      //   endtime: null,
      //   status: 0,
      // },
      // {
      //   num: 0,
      //   time: null,
      //   name: '请假申请',
      //   starttime: null,
      //   endtime: null,
      //   status: 2,
      // }
    ],
    //   list1: [
    //     {
    //       num: 1,
    //       time: null,
    //       name: '加班申请',
    //       starttime: null,
    //       endtime: null,
    //       status: 0,
    //     },
    //     {
    //       num: 1,
    //       time: null,
    //       name: '加班申请',
    //       starttime: null,
    //       endtime: null,
    //       status: 1,
    //     },
    //     {
    //       num: 1,
    //       time: null,
    //       name: '加班申请',
    //       starttime: null,
    //       endtime: null,
    //       status: 2,
    //     },

    // ]
  },

  // cancal1是待审核的取消
  // cancel2是已通过的请假的销假
  // cancel3是未通过的本地数据删除

  cancel1: function(event) {
    console.log(event)
  },

  cancel2: function(event) {
    console.log(event)
  },

  cancel3: function(event) {
    console.log(event);
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function(res) {
        if (res.confirm) {
          var list = self.data.list;
          var list1 = self.data.list1;
          var status = event.currentTarget.dataset.status;
          var index = event.target.dataset.index;
          var num = event.target.dataset.num;
          if (num == 0) {
            list.splice(index, 1)
            self.setData({
              list: list,
            })
            self.onLoad()
          } else {
            list1.splice(index, 1)
            self.setData({
              list1: list1, //这里是删除在内存中的list，程序中的并没有删除
            })
            console.log(list1);
            self.onLoad()
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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

  setListData: function(list) {
    // const self = this;
    list = list.map(item => {
      if (item.state === 'wait') {
        return {
          ...item,
          isHidden: (new Date() > new Date(item.startTime))
        }
      } else if (item.state === 'pass') {
        if ((item.type === '病假' || item.type === '事假') && !item.isCancel) {
          return {
            ...item,
            isHidden: false
          }
        } else {
          return {
            ...item,
            isHidden: true
          }
        }
      } else if (item.state === 'fail') {
        if (item.isDelete) {
          return {};
        } else {
          return {
            ...item,
            isHidden: false
          }
        }
      } else {
        return {
          ...item,
          isHidden: true
        }
      }
    })
    this.setData({
      list
    })
  },

  onShow: function() {
    this.setData({
      activeIndex: app.globalData.activeApply,
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
    // console.log("%d,%d", this.data.sliderLeft, this.data.sliderOffset);

    // 请求所有apply数据
    wx.showLoading({
      title: 'loading...',
    })
    wx.request({
      url: app.globalData.proxy + '/apply/all',
      method: 'POST',
      data: {
        userId: wx.getStorageSync('user').userId
      },
      success(res) {
        // console.log(res.data.list);
        that.setListData(res.data.list)
      },
      fail(err) {
        wx.showToast({
          title: '获取申请列表失败',
          icon: 'none',
          duration: 1000
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  tabClick: function(e) {
    app.globalData.activeApply = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  cancelUnpass: function(e) {
    const self = this;
    const _id = e.target.dataset.applyid;

    const url = app.globalData.proxy + '/apply/update'
    wx.showModal({
      title: '删除',
      content: '删除此申请吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url,
            method: 'POST',
            data: {
              _id,
              key: 'isDelete',
              val: true
            },
            success(res) {
              if (res.data.code !== 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              } else {
                // wx.showToast({
                //   title: '删除成功',
                // })
                self.onShow();
              }
            },
            fail(err) {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 1000
              })
            },
          })
        }
      }
    })
  },
  cancelApply: function(e) {
    const self = this;
    const url = app.globalData.proxy + '/apply/delete'
    const _id = e.target.dataset.applyid;
    wx.showModal({
      title: '取消申请',
      content: '撤销此申请吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url,
            method: 'POST',
            data: {
              _id
            },
            success(res) {
              if (res.statusCode === 200) {
                if (res.data.code === 1) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  self.onShow();
                  // wx.showToast({
                  //   title: '取消成功',
                  // })
                }
              } else {
                wx.showToast({
                  title: '出错啦',
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            fail(err) {
              wx.showToast({
                title: '取消失败',
                icon: 'none',
                duration: 1000
              })
            },
          })
        }
      }
    })
  },
  cancelLeave: function(e) {
    const _id = e.target.dataset.applyid;
    const url = app.globalData.proxy + '/apply/update'
    const self = this;
    wx.showModal({
      title: '销假',
      content: '确定销假吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url,
            method: 'POST',
            data: {
              _id,
              key: 'isCancel',
              val: true
            },
            success(res) {
              if (res.statusCode === 200) {
                if (res.data.code === 1) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  self.onShow();
                }
              }
            },
            fail(err) {
              wx.showToast({
                title: '销假失败',
                icon: 'none',
                duration: 1000
              })
            },
          })
        }
      }
    })
  }
});