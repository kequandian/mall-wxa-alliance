// pages/alliance/judge.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getAllianceMeal() {
    var that = this;
    app.webapi.getAllianceMeal()
      .then(res => {
        console.log("getAllianceMeal--res==", res)
      })
      .catch(res => {
        console.log("getAllianceMeal--catch--res==", res)
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
    var that = this;
    wx.hideHomeButton()
    wx.hideShareMenu()
    app.login("", function (res) {
      if (res.data.status_code === 0) {
        that.getAllianceMeal()
      }
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