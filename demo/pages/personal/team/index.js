// pages/personal/team/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teams: []
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  getMyAlliances() {
    var that = this
    app.webapi.getMyAlliances()
      .then(res => {
        console.log("getMyAlliances--res==", res)
        if (res.data.status_code === 0) {
          that.setData({
            teams: res.data.data || []
          })
        }
        wx.stopPullDownRefresh()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getMyAlliances()
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
    var that = this
    // that.setData({
    //   userId: 3
    // })
    // app.getProfile(false, function(userProfile) {
    //   console.log("team--getProfile--userProfile==", userProfile)
    //   // that.getMyAlliances(userProfile.id)
    //   that.getMyAlliances(3)
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getMyAlliances(this.data.userId)
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