// pages/personal/amount/recharge/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeValue: 0
  },
  getInput(e) {
    var that = this;
    console.log("getInput--e==", e)
    var value = Number(e.detail.value);
    that.setData({
      rechargeValue: value
    })
  },
  // 微信支付；
  wxPay(order_number) {
    var that = this
    var post_order = {
      "order_number": order_number.toString(),
      "order_type": "Wallet",
      "type": "WXA"
    }
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.wxPay(post_order)
      .then(res => {
        console.log("wxPay--res==", res)
        if (res.data.status_code === 0) {
          wx.hideLoading()
          app.utils.promisify(wx.requestPayment)(res.data.data)
            .then(res => {
              console.log("wx.requestPayment--res==", res)
              wx.hideLoading()
              if (res.errMsg === "requestPayment:fail cancel") {
                wx.showToast({
                  title: '支付失败',
                  icon: "none"
                })
              } else if (res.errMsg === "requestPayment:ok") {
                app.getAllianceOrder()
                app.utils.openPage2(1, "back")
              }
            })
            .catch(res => {
              console.log("wx.requestPayment--catch--res==", res)
            })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
      .catch(res => {
        console.log("wxPay--catch--res==", res)
      })
  },
  recharge() {
    var that = this;
    if (that.data.rechargeValue) {
      var id = 0;
      var description = "钱包充值";
      app.webapi.walletCharge(id, that.data.rechargeValue, description)
        .then(res => {
          console.log("walletCharge--res==", res)
          if (res.data.status_code === 0) {
            that.wxPay(res.data.data.id)
            // return app.webapi.walletChargePay(res.data.data.id)
          }
        })
        // .then(res => {
        //   console.log("walletChargePay--res==", res)
        //   wx.showToast({
        //     title: "正在努力开发中，敬请期待 !",
        //     icon: "none",
        //     duration: 2000
        //   })
        //   if (res.data.status_code === 0) {
        //   }
        // })
        .catch(res => {
          console.log("walletCharge--catch--res==", res)
        })
    } else {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none',
        duration: 2000
      })
    }
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