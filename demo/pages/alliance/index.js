// pages/ally/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    showInvitationCode: false,
    allianceOrder: null,
    now_hours: new Date().getHours(),
    allianceData: app.globalData.allianceData,
    allStatusName: app.globalData.allStatusName,
    isAllianceRequest: false,
    recommendIndex: -1,
    vertical: false,
    interval: 2000,
    adListData: [],
    imgheights: [],//所有图片的高度  
    current: 0,//默认  
    showNewUser: false
  },
  onTabItemTap(item) {
    if (!app.globalData.token || !app.globalData.judgeAlliances) {
      app.utils.openPage2('../register/index', 'redirect')
      return
    }
  },
  onClone() {
    var that = this;
    app.globalData.newUserPopup = false;
    that.setData({
      showNewUser: false,
    })
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  showPopup(e) {
    var that = this;
    var layer = e.currentTarget.dataset.layer
    if (layer === "showInvitationCode") {
      if (that.data.userProfile && that.data.userProfile.invitation_qrcode_url) {
        that.setData({
          [layer]: true
        })
      } else {
        wx.showToast({
          title: '暂无邀请码',
          icon: 'none',
          duration: 3000
        })
      }
    } else {
      that.setData({
        [layer]: true
      })
    }
  },
  hidePopup(e) {
    var layer = e.currentTarget.dataset.layer
    this.setData({
      [layer]: false
    })
  },
  openPage(e) {
    console.log("openPage--e==", e)
    app.utils.openPage(e)
  },
  randomNum() {
    var that = this;
    let recommendIndex = -1;
    console.log('that.data.recommend==', that.data.recommend)
    if (!that.data.recommend.length) {
      recommendIndex = -1;
      console.log("randomNum--recommendIndex=1=", recommendIndex)
    } else if (that.data.recommend.length === 1) {
      recommendIndex = 0;
      console.log("randomNum--recommendIndex=2=", recommendIndex)
    } else {
      recommendIndex = Math.floor(Math.random() * that.data.recommend.length);
      console.log("randomNum--recommendIndex=3=", recommendIndex)
    }
    console.log("randomNum--recommendIndex==", recommendIndex)
    console.log("randomNum--that.data.recommend==", that.data.recommend)
    that.setData({
      recommend: that.data.recommend,
      recommendIndex: recommendIndex,
    })
  },
  getRecommend() {
    var that = this;
    var recommend = [];
    app.webapi.getRecommend()
      .then(res => {
        console.log("getRecommend--res==", res)
        if (res.data.status_code === 0) {
          if (res.data.data) {
            recommend = res.data.data
          }
        } else {
          throw res
        }
        wx.setStorageSync('recommend', recommend)
        that.setData({
          recommend: recommend,
        })
        that.randomNum()
      })
      .catch(res => {
        console.log("getRecommend--catch--res==", res)
        wx.setStorageSync('recommend', [])
      })
  },
  getAllianceOrder() {
    var that = this
    wx.showLoading({
      title: '',
    })
    app.getAllianceOrder((allianceData) => {
      console.log('alliance--getAllianceOrder--allianceData==', allianceData)
      var launchOptions = wx.getLaunchOptionsSync()
      console.log('alliance--getAllianceOrder--launchOptions==', launchOptions)
      if (!allianceData) {
        wx.hideTabBar()
        if (launchOptions.query && launchOptions.query.inviteCode) {
          console.log('alliance--index--getAllianceOrder--register/index==')
          app.utils.openPage2("../register/index")
        }
      } else {
        wx.showTabBar()
        if (app.globalData.newUserPopup && allianceData.inventoryAmount) {
          that.setData({
            showNewUser: true
          })
        } else {
          that.setData({
            showNewUser: false
          })
        }
      }
      that.setData({
        allianceData: allianceData
      })
    })
    /*app.webapi.getAllianceOrder(userId)
      .then(res => {
        console.log("getAllianceOrder--res==", res)
        if (res.data.status_code === 0) {
          if (res.data.data) {
            var commissionOrder = res.data.data.commissionOrder
            var commissionTotal = 0
            commissionOrder.map((item, index) => {
              commissionTotal += item.commission
            })
            res.data.data.commissionTotal = commissionTotal;
            console.log("getAllianceOrder--commissionTotal==", commissionTotal)
          }
          app.globalData.allianceData = res.data.data
          that.setData({
            allianceData: res.data.data || null
          })
        }
        that.setData({
          isAllianceRequest: true
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        console.log("getAllianceOrder--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        that.setData({
          isAllianceRequest: true
        })
      })*/
  },

  /**
   * 广告轮播
   */
  getAdListData(){
    var that = this;
    app.webapi.getAd()
      .then(res => {
        if (res.data.status_code == 0) {
          console.log("getAdListData--==", res.data.data[0].ads)
          var adListData = [];
          adListData = res.data.data[0].ads
          adListData.map((item, index) => {
            item.productId = that.getProductImgId(item.target_url)
            return item
          })
          console.log("getAdListData--adListData==", adListData)
          wx.setStorageSync('adListData', adListData)
          that.setData({
            adListData: res.data.data[0].ads
          })
        }
      })
      .catch(res => {
        console.log("getAdListData--catch--res==", res)
      })
  },

  //计算轮播图片宽高
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
    imgheight = e.detail.height,
    //宽高比  
    ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },

  //截取图片url的商品id
  getProductImgId(urlPath){
    var productid = 0
    if(urlPath){
      productid = urlPath.substring(urlPath.length, urlPath.lastIndexOf("/")+1)
      console.log("productid ==", productid)
      return productid
    }
    return productid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("alliance--onLoad--options==", options)
    var that = this;
    var inviteCode = null;
    that.setData({
      inviteCode: options.inviteCode ? options.inviteCode : null
    })
    that.getRecommend()
    that.getAdListData()
    var page = 'alliance_index';
    if (options && options.inviteCode) {
      page = 'alliance_index_invite'
    }
    app.login("", function (res) {
      console.log("alliance--onLoad--app.login--res==", res)
      that.getAllianceOrder()
      app.getProfile(true, function (userProfile) {
        console.log("alliance--getProfile--userProfile==", userProfile)
        that.setData({
          userProfile: userProfile
        })
      })
    }, page)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("index--onReady==")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("index--onShow==")
    var that = this
    var date = new Date()
    var now_hours = date.getHours()
    
    var recommend = wx.getStorageSync('recommend')
    console.log("recommend==", recommend)
    if (!recommend || !recommend.length) {
      that.getRecommend()
    }
    var adListData = wx.getStorageSync('adListData')
    if (!adListData || !adListData.length) {
      that.getAdListData()
    }
    if (!app.globalData.allianceData) {
      wx.hideTabBar()
    } else {
      wx.showTabBar()
    }
    that.setData({
      allianceData: app.globalData.allianceData,
      recommend: recommend
    })
    that.randomNum()
    // app.login("", function(res) {
    //   console.log("alliance--onshow--app.login--res==", res)
    //   app.getProfile(true, function(userProfile) {
    //     console.log("alliance--getProfile--userProfile==", userProfile)
    //     that.getAllianceOrder(userProfile.id)
    //     that.setData({
    //       userProfile: userProfile
    //     })
    //   })
    // })
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
    var that = this;
    that.setData({
      isAllianceRequest: false,
      newUserPopup: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
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