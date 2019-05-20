
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex: 0,
    type: ['事假', '病假', '加班'],
    sdate: '2016-11-08',
    stime: '12:00',
    edate: '2016-11-08',
    etime: '12:00',
  },
//  选择申请类型确定事件  
  bindTypePickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //  点击起始日期组件确定事件  
  bindSDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      sdate: e.detail.value
    })
  },
  //  点击起始时间组件确定事件  
  bindSTimeChange: function (e) {
    this.setData({
      stime: e.detail.value
    })
  },
  //  点击终止日期组件确定事件  
  bindEDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      edate: e.detail.value
    })
  },
  //  点击终止时间组件确定事件  
  bindETimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  },
  //输入文本
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
   
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