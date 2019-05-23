const app = getApp();
// const date = new Date()
// const years = []
// const months = []
// const days = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

// for (let i = 1; i <= 12; i++) {
//   months.push(i)
// }

// for (let i = 1; i <= 31; i++) {
//   days.push(i)
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    typeIndex: -1,
    type: ['事假', '病假', '加班'],
    sdate: '',
    stime: '',
    edate: '',
    etime: '',
    reason: ''
  },
  //  选择申请类型确定事件  
  bindTypePickerChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //  点击起始日期组件确定事件  
  bindSDateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      sdate: e.detail.value
    })
  },
  //  点击起始时间组件确定事件  
  bindSTimeChange: function(e) {
    this.setData({
      stime: e.detail.value
    })
  },
  //  点击终止日期组件确定事件  
  bindEDateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      edate: e.detail.value
    })
  },
  //  点击终止时间组件确定事件  
  bindETimeChange: function(e) {
    this.setData({
      etime: e.detail.value
    })
  },


  // bindTextAreaBlur: function (e) {
  //   console.log(e.detail.value)
  // },

  //输入文本
  inputReason: function(e) {
    // console.log(this.data)
    this.setData({
      reason: e.detail.value
    })
  },

  // 提交申请
  handOn: function(e) {
    // console.log(this.data)
    const user = this.data.user;
    const url = app.globalData.proxy + '/apply/submit';
    const departName = user.departName;
    const userId = user.userId;
    const sentTime = new Date();
    const startTime = new Date(this.data.sdate + ' ' + this.data.stime);
    const endTime = new Date(this.data.edate + ' ' + this.data.etime);
    const reason = this.data.reason;
    const type = this.data.type[this.data.typeIndex];
    const apply = {
      departName,
      userId,
      sentTime,
      startTime,
      endTime,
      type,
      reason,
      state: 'wait',
      isCancel: '0',
      isDelete: '0'
    };

    if (type === -1 || !startTime || !endTime || !reason) {
      wx.showToast({
        title: '以上均为必填项',
        icon: 'none'
      })
    } else if (startTime >= endTime) {
      wx.showToast({
        title: '时间填写有误',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: 'loading...',
      })
      wx.request({
        url,
        method: 'POST',
        data: apply,
        success(res) {
          wx.showToast({
            title: '申请成功',
          })
          wx.switchTab({
            url: '../apply/apply'
          })
        },
        fail(err) {
          wx.showToast({
            title: '申请失败',
            icon: 'none'
          })
        },
        complete(res) {
          wx.hideLoading();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.typeIndex >= 0 && options.typeIndex <= 2) {
      this.setData({
        typeIndex: options.typeIndex
      })
    }
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