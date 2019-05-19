//index.js
//获取应用实例
const app = getApp()
wx.cloud.init();
const db = wx.cloud.database()


Page({
  data: {
    userid: null,
    username: null,
    userclass: null
  },
  onLoad: function() {
    // 调用云函数获取openid
    wx.cloud.callFunction({
      name: 'login',
      success: function(res) {
        app.globalData._openid = res.result.openid;
        // console.log(res.result.openid)
      }
    });

    // 如果缓存中含有该用户的登录数据，则可以免登录直接进入首页
    if (wx.getStorageSync('userid') && wx.getStorageSync('username') && wx.getStorageSync('userclass')) {
      wx.switchTab({
        url: '../on-off/on-off'
      });
    }
  },
  useridInput: function(event) {
    this.setData({
      userid: event.detail.value
    })
  },
  usernameInput: function(event) {
    this.setData({
      username: event.detail.value
    })
  },
  userclassInput: function(event) {
    this.setData({
      userclass: event.detail.value
    })
  },

  saveUserToDB: function(userInfo) {
    var self = this;
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).get().then(res => {
      if (res.data.length == 0) {
        db.collection('user').add({
          data: {
            userInfo: userInfo,
            userid: self.data.userid,
            username: self.data.username,
            userclass: self.data.userclass
          }
        }).then(res => {
          console.log(res);
        }).catch(err => {
          console.error(err);
        });
      }
    }).catch(err => {
      console.error(err);
    })
  },

  loginBtnClick: function(e) {
    var self = this;
    if (e.detail.userInfo) {
      if (!this.data.userid || !this.data.username || !this.data.userclass)
        wx.showModal({
          title: '提示',
          content: '以上均为必填项',
        })
      else if (this.data.userid.length < 3)
        wx.showModal({
          title: '提示',
          content: '学号格式有误',
        })
      else {
        // 存储三个个人信息到本地存储
        wx.setStorageSync('userid', this.data.userid);
        wx.setStorageSync('username', this.data.username);
        wx.setStorageSync('userclass', this.data.userclass);
        wx.getUserInfo({
          success(res) {
            wx.setStorageSync('userInfo', res.userInfo);

            // 插入当前用户信息到数据库
            self.saveUserToDB(res.userInfo);
          },
          fail(err) {
            console.error(err);
          }
        })

        wx.switchTab({
          url: '../on-off/on-off',
        })
      }
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 1000
      });
    }
  },
})