// index.js

// var API_URL = "https://www.kequandian.net/rest/product?pageNumber=1&pageSize=50&zone=1"
// var API_URL2 = "http://www.kequandian.net/rest/product?pageNumber=1&pageSize=50&zone=1"
// http://www.kequandian.net/rest/product?pageNumber=1&pageSize=50&zone=1

var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginPopup: false,
    imagesUrlArr: [],
    isHit: true,
    // 头部导航数组；
    // menu: [ "个人护理", "居家清洁", "母婴用品", "组合商品" ],
    // menuImg: ['grhl-menu.png', 'jjqj-menu.png', 'myyp-menu.png', 'jhsp-menu.png'],
    
    // 首页导航栏名字，图标
    // menuArr: [
    //     {'name':'个人护理', 'img': 'grhl-menu.png', 'id': 'grhl' },
    //     {'name':'居家清洁', 'img': 'jjqj-menu.png', 'id': 'jjqj' },
    //     {'name':'母婴用品', 'img': 'myyp-menu.png', 'id': 'myyp' },
    //     {'name':'组合商品', 'img': 'jhsp-menu.png', 'id': 'zhsp' }
    //     ]
    menuArr: {
      categoryData:{},
      menuImg: [
          {'img': 'grhl-menu.png'},
          {'img': 'jjqj-menu.png'},
          {'img': 'myyp-menu.png'},
          {'img': 'jhsp-menu.png'}
      ],
    }
  },
  closeLoginPopup: function () {
    this.setData({
      loginPopup: false
    })
  },
  getUserInfo: function (event) {
    var that = this
    console.log('getUserInfo---event', event)

    app.utils.getUserInfo(event, that, function (res) {
      console.log('getUserInfo----res--111-', res)
      app.globalData.access_token = res.data.data.access_token
      app.globalData.openid = res.data.data.openid
      if (res.data.data.unionid) {
        app.globalData.unionid = res.data.data.unionid
      }
      app.getUser(function (users) {
        that.setData({
          users: users
        })
      })
    })
  },
  // 点击商品调用该函数跳转详情页；
  getDetails: function (options){
    console.log('a11a1a1a1a1')
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + options.currentTarget.dataset.id
    })
  },

  // 点击导航菜单掉用该函数；
  OnClickMenu: function(options){
    var menuId = options.currentTarget.dataset.menuId         // menuId为点击导航对应分类的id；
    var menuIndex = options.currentTarget.dataset.menuIndex   // 被点击的类在数据中排序的下标，用于确定跟导航跳转传参；
    var menuName = options.currentTarget.dataset.menuName
    console.log("OnClickMenu--this.data.menuArr.categoryData==", this.data.menuArr.categoryData)
    this.setData({ 
      menuArr: this.data.menuArr
    })
    var url = '../product/product?title=' + menuName + '&index=' + menuIndex + '&id=' + menuId
    app.utils.openPage2(url)
    // wx.navigateTo({
    //   url: '../product/product?title=' + menuName + '&menuIndex=' + menuIndex + '&menuId=' + menuId
    // })

  },
  getDataCommom: function(){
  },
  // 点击搜索框调用该方法；
  OnSearch: function() {
    wx.navigateTo({
      url: "../search/search?isHit="+this.data.isHit,
    })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({ title:"加载中..", duration:10000 });
//     console.log(typeof(Number(b))+'---'+Number(b))
// console.log(typeof(Number(c))+'---'+Number(c))
    var _this = this
    console.log(1598)
    console.log(_this.data.menuArr.categoryData)
    
    // 刷新收藏商品数据；
    // app.getFavorite(function() {
    //   console.log('---------onLoad-----------')
    //   console.log(app.globalData.favoriteArr)
    // });
/*-------------------------------------------------*/
    // 请求获取广告数据(轮播数据)；
    app.webapi.getAd()
      .then(res => {
        console.log("index--getAd--res==", res)
        wx.hideLoading()
        if (res.data.data.length) {
          _this.data.imagesUrlArr = _this.data.imagesUrlArr.concat(res.data.data[1].ads)
        } else {
          _this.data.imagesUrlArr = []
        }
        _this.setData({
          ads2: _this.data.imagesUrlArr
        })
        
      })
      .catch(res => {
        wx.hideLoading()
        console.log("index--getAd--catch-res==", res)
      })
/*-------------------------------------------------*/
    // 请求导航数据；
    app.webapi.getCategory()
      .then(res => {
        console.log("getCategory--res==", res)
        _this.data.menuArr.categoryData = res.data.data
        app.globalData.categoryData = res.data.data
        _this.setData({
          menuArr: _this.data.menuArr
        })
      })
      .catch(res => {
        console.log("getCategory--catch--res==", res)
      })
    _this.data.menuArr.categoryData = app.globalData.categoryData
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
    var _this = this
    app.login("", function(res) {
      if (res.data.status_code === 0) {
        if (!res.data.data.phone) {
          // app.utils.openPage2("../register/phone", "reLaunch")
        }
        // app.getProfile(function(res) {
        //   console.log("index--onshow--getProfile--res==", res)
        //   if (res.data.data.phone) {
        //     wx.setStorageSync("userData", res.data.data)
        //   } else {
        //     app.utils.openPage2("../register/index", "reLaunch")
        //   }
        // })
      }
      app.webapi.getRecommend()
        .then(res => {
          console.log("index--getRecommend--res==", res)
          _this.setData({
            Recommend: res.data.data,
          })
        })
        .catch(res => {
          console.log("index--getRecommend--catch-res==", res)
        })
    }, _this)
    /*app.webapi.getProductFavorite()
      .then(res => {
        console.log("getProductFavorite--res==", res)
      })
      .catch(res => {
        console.log("getProductFavorite--catch--res==", res)
      })
      app.getFavorite(function() {
        console.log('-----index----onshow-----')
        console.log(app.globalData.favoriteArr)
        _this.setData({
          favoriteArr: app.globalData.favoriteArr
        })
    });*/
    wx.showShareMenu({
      withShareTicket: true
    })
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
    wx.stopPullDownRefresh()
  
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