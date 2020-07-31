// pages/personal/amount/recharge.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 30,
    list: []
    /*list: [
      {
        id: 1,
        amount: 2000,   // 本次充值额;
        balance: 2300,  // 本次充值后账户的余额;
        gift_amount: 0, // 本次充值赠送额 ;
        gift_balance: 0, // 充值后赠送帐户的余额;
        type: "农业银行",
        time: "2019-10-31"
      },
      {
        id: 1,
        amount: 2000,   // 本次充值额;
        balance: 2300,  // 本次充值后账户的余额;
        gift_amount: 0, // 本次充值赠送额 ;
        gift_balance: 0, // 充值后赠送帐户的余额;
        type: "建设银行",
        time: "2019-10-31"
      }
    ]*/
  },
  getRewardCash(pageNumber) {
    var that = this;
    wx.showLoading({
      title: '',
    })
    var list = that.data.list;
    var pageSize = that.data.pageSize;
    if (!pageNumber || pageNumber === 1) {
      pageNumber = 1;
      list = [];
    }
    app.webapi.getRewardCash(pageNumber, pageSize)
      .then(res => {
        console.log("getRewardCash--res==", res)
        if (res.data.status_code === 0) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          list = list.concat(res.data.data)
          that.setData({
            list: list
          })
        } else {
          throw res
        }

      })
      .catch(res => {
        console.log("getRewardCash--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
        that.setData({
          list: []
        })
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
    that.getRewardCash()
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
    that.getRewardCash(1)
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