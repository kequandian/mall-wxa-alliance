// pages/personal/amount/recharge/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeValue: 0,
    allianceData: app.globalData.allianceData,
    formData: {
      withdraw_type: "WECHAT",
      withdraw_cash: ''
    },
    cashBtnDisplay: true
  },
  // 线下提现；
  offlineWithdrawals(amount) {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.webapi.offlineWithdrawals(amount)
      .then(res => {
        console.log("offlineWithdrawals--res==", res)
        if (res.data.status_code === 0) {
          // that.data.cashBtnDisplay = true;
          wx.hideLoading()
          wx.stopPullDownRefresh()
          wx.showToast({
            title: '提现成功',
            duration: 3000
          })
          setTimeout(() => {
            app.utils.openPage2(1, 'back')
          }, 500)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("offlineWithdrawals--catch--res==", res)
        console.log("that.data.cashBtnDisplay--true--1==")
        that.data.cashBtnDisplay = true;
        wx.hideLoading()
        wx.stopPullDownRefresh()
        that.setData({
          cashBtnDisplay: true
        })
        var title = res.data.message || ""
        if (res && res.data.message === 'invalid.withraw.cash') {
          title = "请输入有效金额"
        }
        wx.showToast({
          title: title,
          icon: "none",
          duration: 3000
        })
      })
  },
  // 线上提现；
  ownerBalance(formData) {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.webapi.ownerBalance(formData)
      .then(res => {
        console.log("ownerBalance--res==", res)
        if (res.data.status_code === 0) {
          // that.data.cashBtnDisplay = true;
          wx.hideLoading()
          wx.stopPullDownRefresh()
          app.getAllianceOrder()
          wx.showToast({
            title: '提现成功',
            duration: 3000
          })
          setTimeout(() => {
            app.utils.openPage2(1, 'back')
          }, 500)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("ownerBalance--catch--res==", res)
        console.log("that.data.cashBtnDisplay--true--1==")
        that.data.cashBtnDisplay = true;
        wx.hideLoading()
        wx.stopPullDownRefresh()
        that.setData({
          cashBtnDisplay: true
        })
        var title = res.data.message || ""
        if (res && res.data.message === 'invalid.withraw.cash') {
          title = "请输入有效金额"
        }
        wx.showToast({
          title: title,
          icon: "none",
          duration: 3000
        })
      })
  },
  onSubmit(e) {
    console.log("onSubmit--e==", e)
    var that = this;
    // wx.showToast({
    //   title: "正在努力开发中，敬请期待 !",
    //   icon: "none",
    //   duration: 2000
    // })
    console.log('that.data.cashBtnDisplay=1=', that.data.cashBtnDisplay)
    if (that.data.cashBtnDisplay) {
      that.data.cashBtnDisplay = false;
      that.setData({
        cashBtnDisplay: false
      })
    } else {
      console.log("onSubmit--that.data.cashBtnDisplay--false--阻止")
      return
    }
    console.log('that.data.cashBtnDisplay=2=', that.data.cashBtnDisplay)
    var allianceData = that.data.allianceData;
    var amount = parseFloat(e.detail.value.amount);
    var cashType = e.detail.target.dataset.cashType;
    console.log('amount==', amount)
    if (allianceData && allianceData.bonus_balance) {
      if (amount && amount <= allianceData.bonus_balance) {
        if (cashType === 'offline') {
          that.offlineWithdrawals(amount)
        } else {
          var formData = {
            withdraw_type: cashType,
            withdraw_cash: amount
          }
          that.ownerBalance(formData)
        }
      } else {
        console.log("that.data.cashBtnDisplay--true--2==")
        that.data.cashBtnDisplay = true;
        that.setData({
          cashBtnDisplay: true
        })
        wx.showToast({
          title: "请输入正确的提现金额",
          icon: "none"
        })
      }
    } else {
      console.log("that.data.cashBtnDisplay--true--22==")
      that.data.cashBtnDisplay = true;
      that.setData({
        cashBtnDisplay: true
      })
      wx.showToast({
        title: "请确认可提现额度",
        icon: "none"
      })
    }
  },
  getInput(e) {
    var that = this;
    console.log("getInput--e==", e)
  },
  recharge() {
    var that = this;
    wx.showToast({
      title: "正在努力开发中，敬请期待 !",
      icon: "none",
      duration: 2000
    })
    /*if (that.data.rechargeValue) {
      app.webapi.walletCharge(that.data.rechargeValue)
        .then(res => {
          console.log("walletCharge--res==", res)
          if (res.data.status_code === 0) {
            console.log("walletCharge--res=2=", res)
            return app.webapi.walletChargePay(res.data.data.id)
          }
        })
        .then(res => {
          console.log("walletChargePay--res==", res)
          if (res.data.status_code === 0) {
          }
        })
        .catch(res => {
          console.log("walletCharge--catch--res==", res)
        })
    } else {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none',
        duration: 2000
      })
    }*/
  },
  getAllianceOrder() {
    var that = this
    wx.showLoading({
      title: '',
    })
    app.getAllianceOrder((allianceData) => {
      // allianceData.bonus_balance = 1000;
      // allianceData.expected_bonus = 2000;
      console.log('alliance--allianceData==', allianceData)
      wx.hideLoading()
      wx.stopPullDownRefresh()
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    console.log("that.data.cashBtnDisplay--true--4==")
    that.data.cashBtnDisplay = true;
    that.setData({
      cashBtnDisplay: true
    })
    that.getAllianceOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.data.formData.withdraw_cash = '';
    that.setData({
      formData: that.data.formData
    })
    that.getAllianceOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})