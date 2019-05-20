// pages/message/message.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[
       {
        name:'申请通过',
        time:null,
        type:null,  //什么申请
        message:'已由部门经理审核并通过',
        issue:null,
       },
       {
        name:'申请未通过',
        time:null,
        type:null,
        message:'未通过',
        issue:null,
       },
     ],
     
     issue3:null,
     
     issue4:null,
    
     time1:null,    //与上班时间的差距
     time2:null,    //距离下班时间的差距
     
     value5a:'今天您可以申请加班',
     message5a:'今天您的下班时间已超过下班时间',
     issue5a:null,
    
    show:true,  //是展示上班提醒还是下班提醒
    show1: true,  //已及是否展示加班提醒
     value5b:'今天您还不能加班',
     message5b:'您还没有完成正常时间上下班' ,
     issue5b:null,  
  },


  on: function () {
    app.activeIndex1 = 0, 
    wx.switchTab({
      url: '../on-off/on-off',
    })
  },
  
  unpass:function(){
    app.globalData.activeIndex = 2,
    console.log(app.globalData.activeIndex),
      wx.switchTab({
        url: '../apply/apply',
      })
  },

  apply:function(){
    app.globalData.activeIndex = 1,
    console.log(app.globalData.activeIndex)
    wx.switchTab({
      url: '../apply/apply',
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //加载申请通过的信息

     //加载申请未通过信息

    //  计算time1，若大于0，show就是true。
    //  还要计算time2，若大于0，show1就是true，
    //  然后或需要将计算出来的时间转换为可阅读的时间
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

  },
})
