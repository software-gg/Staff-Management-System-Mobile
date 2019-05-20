var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    tabs: ["待审核", "已通过", "未通过"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    // 有两个list，对应请假申请和加班申请，每个list中的一个元素有三个状态，0为待审核，
    // 1为已通过，2为未通过,每次遍历列表决定去哪个navbar。然后在加载页面的的时候对list的元素进行增减。
    //num代表是第几个表，0是第一个，1是第二个
    list: [
      {
        num:0,
        time: null,
        name: '请假申请',
        starttime: null,
        endtime: null,
        status: 1,
      },
      {
        num: 0,
        time: null,
        name: '请假申请',
        starttime: null,
        endtime: null,
        status: 0,
      },
      {
        num: 0,
        time: null,
        name: '请假申请',
        starttime: null,
        endtime: null,
        status: 2,
      }
    ],
    list1: [
      {
        num: 1,
        time: null,
        name: '加班申请',
        starttime: null,
        endtime: null,
        status: 0,
      },
      {
        num: 1,
        time: null,
        name: '加班申请',
        starttime: null,
        endtime: null,
        status: 1,
      },
      {
        num: 1,
        time: null,
        name: '加班申请',
        starttime: null,
        endtime: null,
        status: 2,
      },

    ]
  },
  
  // cancal1是待审核的取消
  // cancel2是已通过的请假的销假
  // cancel3是未通过的本地数据删除
 
  cancel1:function(event){
    console.log(event)
  },

  cancel2: function (event) {
    console.log(event)
  },

  cancel3: function (event) {
    console.log(event);
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if(res.confirm){
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
              list1: list1,              //这里是删除在内存中的list，程序中的并没有删除
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
 


  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    this.setData({
      activeIndex: app.globalData.activeIndex,
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    console.log("%d,%d",this.data.sliderLeft,this.data.sliderOffset);
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});