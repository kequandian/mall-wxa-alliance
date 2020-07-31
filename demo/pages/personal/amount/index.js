// pages/personal/amount/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allianceData: app.globalData.allianceData
  },
  openPage(e) {
    console.log("openPage--e==", e)
    var url = e.currentTarget.dataset.url;
    app.utils.openPage(e)
    // if (url === "passwordPopup") {
    //   this.setData({
    //     isShowPopup: true
    //   })
    // } else {
    //   app.utils.openPage(e)
    // }
  },
  getAllianceOrder() {
    wx.showLoading({
      title: '',
    })
    var that = this
    app.getAllianceOrder((allianceData) => {
      console.log('alliance--allianceData==', allianceData)
      wx.hideLoading()
      wx.stopPullDownRefresh()
      that.setData({
        allianceData: allianceData
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getAllianceOrder()
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
    var that = this;
    var allianceData = app.globalData.allianceData;
    that.setData({
      allianceData: allianceData
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
    var that = this;
    that.getAllianceOrder()
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