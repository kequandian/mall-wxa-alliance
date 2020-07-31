// address.js
  var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressArr: []
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  addAddress: function (event) {
    wx.navigateTo({
      url: '../setAddress/setAddress'
    })
  },

  setAddress: function (event) {
    console.log('-------address.js------setAddress-------')
    console.log(event)
    var index = event.currentTarget.dataset.index

    wx.navigateTo({
      url: '../setAddress/setAddress?index=' + index
    })
  },

  // 获取收货地址列表；
  getAddressList: function (event) {
    var that = this
    wx.showLoading({
      title: '',
    })
    app.webapi.getAddressList()
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.status_code === 0) {
          app.globalData.addressArr = res.data.data
          that.setData({
            addressArr: res.data.data
          })
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("getAddressList--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
        that.setData({
          addressArr: []
        })
      })
    wx.request({
      url: app.globalData.URL_API +'/contact',
      data: {},
      header: {
        'Authorization': app.globalData.token,
        'content-type': 'json'
      },
      success: function(res) {
        console.log("getAddressList--res==", res)
        that.data.addressArr = res.data.data
        app.globalData.addressArr = res.data.data
        that.setData({
          addressArr: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log('------address----onShow-----')
    this.getAddressList()
    console.log(this.data.addressArr)
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
    var that = this;
    that.getAddressList()
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