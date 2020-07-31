// pages/register/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getUserInfo(e) {
    var that = this
    console.log("getUserInfo--e==", e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e.detail, function (res) {
        console.log("getUserInfo--login--res==", res)
        if (res.data.status_code === 0) {
          // if (!res.data.data.phone) {
          //   app.utils.openPage2("./phone", "reLaunch")
          // }
        }
      })
    } else {
      
    }
  },
  hidePopup(e) {
    var layer = e.currentTarget.dataset.layer
    this.setData({
      [layer]: false
    })
  },
  showPopup(e) {
    var layer = e.currentTarget.dataset.layer
    // if (layer === "showUserAuth") {
      this.setData({
        [layer]: true
      })
    // }
  },
  openPage(e) {
    console.log("openPage--e==", e)
    app.utils.openPage(e)
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
    wx.hideHomeButton()
    wx.hideShareMenu()
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