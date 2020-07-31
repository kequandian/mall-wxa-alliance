//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    favoriteArr: [],
    record: [{
        'title': '我的收藏',
        'number': '25'
      },
      {
        'title': '可用积分',
        'number': '18'
      },
      {
        'title': '收藏宝贝',
        'number': '2'
      }
    ],
    waitArr: [{
        'title': '待付款',
        'img': 'wait-payment.png',
        status: 'CREATED_PAY_PENDING'
      },
      {
        'title': '待发货',
        'img': 'wait-send.png',
        status: 'CONFIRMED_DELIVER_PENDING'
      },
      {
        'title': '待收货',
        'img': 'wait-reach.png',
        status: 'DELIVERED_CONFIRM_PENDING'
      },
      {
        'title': '待评价',
        'img': 'wait-evaluate.png',
        status: ''
      }
    ],
    userProfile: wx.getStorageSync("user_profile"),
    showUserAuth: false
  },
  getUserInfo(e) {
    var that = this
    console.log("getUserInfo--e==", e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e.detail, function(res) {
        console.log("getUserInfo--login--res==", res)
      })
    }
  },
  showUserPopup() {
    this.setData({
      showUserAuth: true
    })
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })wait-send.png
  // },

  // 点击我的收藏调用该方法跳转到收藏页面；
  favorite: function() {
    wx.navigateTo({
      url: '../favorite/favorite'
    })
  },

  goAddress: function(event) {
    console.log('-----myPage----goAddress-----')
    wx.navigateTo({
      url: '../address/address'
    })
  },

  onLoad: function() {

    var that = this
    var favoriteArr = app.globalData.favoriteArr
    // app.getFavorite(function() {
    //   console.log('-----myPage----onload-----')
    //   console.log(app.globalData.favoriteArr)
    // });
    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        favoriteArr: favoriteArr
      })
    })
  },

  // 点击我的订单调用该方法跳转到订单页面；
  order: function(event) {
    var status = ''
    if (event.currentTarget.dataset.status) {
      status = event.currentTarget.dataset.status
    }
    wx.navigateTo({
      url: '../order/order?status=' + status
    })
  },
  onShow: function() {
    var that = this
    app.getProfile(false, function(userProfile) {
      console.log("myPage--onShow--getProfile--userProfile==", userProfile)
      that.setData({
        userProfile: userProfile
      })
    })
    // app.getFavorite(function() {
    //   console.log('-----myPage----onshow-----')
    //   console.log(app.globalData.favoriteArr)
    //   that.setData({
    //     favoriteArr: app.globalData.favoriteArr
    //   })
    // });
  }
})