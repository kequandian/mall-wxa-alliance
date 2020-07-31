// pages/personal/wallet.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allianceData: "",
    checkBtnText: "获取验证码",
    checkBtnDis: false,
    formData: {
      alliancePhone: "",
      phoneCode: "",
      password1: "",
      password2: ""
    }
  },
  judgeInput() {
    var that = this;
    var formData = that.data.formData;
    if (!formData.phoneCode || formData.phoneCode.length != 6) {
      return false;
    } else if (!formData.password1 || !formData.password2 || !formData.password1 != !formData.password2) {
      return false;
    } else {
      return true
    }
  },
  onSubmit() {
    var that = this;
    var judgeResult = that.judgeInput()
    var formData = that.data.formData
    if (judgeResult) {
      app.webapi.bindPhone(formData.alliancePhone, formData.phoneCode)
        .then(res => {
          console.log("onSubmit--bindPhone--res==", res)
          if (res.data.status_code === 0) {
            return app.webapi.walletPassword(formData.password1)
          } else {
            throw res
          }
        })
        .then(res => {
          console.log("onSubmit--registerPhone--2--res==", res)
          if (res.data.status_code === 0) {
            wx.showToast({
              title: "设置成功",
            })
            setTimeout(() => {
              if (that.data.order_number) {
                app.utils.openPage2('../order/order-details?order_number=' + that.data.order_number, 'redirect')
              } else {
                app.utils.openPage2(1, "back")
              }
            }, 1000)
          } else {
            throw res
          }
        })
        .catch(res => {
          console.log("onSubmit--catch--res==", res)
          var title = res.data.message;
          if (res.data.message === "captcha.invalid") {
            title = "验证码错误"
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 3000
          })
        })
    } else {
      wx.showToast({
        title: '请完善资料',
        icon: 'none'
      })
    }
  },
  getInput(e) {
    console.log("getInput--e==", e)
    var that = this;
    var layer = e.currentTarget.dataset.layer;
    var value = e.type === 'input' ? e.detail.value : e.detail.value;
    that.data.formData[layer] = value
  },
  countDown(count) {
    var that = this
    var i = isNaN(count) ? 60 : count > 0 ? count : 60;
    that.data.interval = setInterval(function() {
      console.log("setInterval--")
      i = i - 1
      var checkBtnText = "等待验证码(" + i + "s)"
      if (i <= 0) {
        clearInterval(that.data.interval)
        //解除你的btn不可点击
        that.setData({
          checkBtnText: "发送验证码",
          checkBtnDis: false,
        })
      } else {
        that.setData({
          checkBtnText: checkBtnText,
          checkBtnDis: true,
        })
      }
    }, 1000)
  },
  getPhoneCode() {
    var that = this;
    if (!that.data.checkBtnDis && that.data.formData.alliancePhone) {
      app.webapi.getPhoneCaptcha(that.data.formData.alliancePhone, "q")
        .then(res => {
          if (res.data.status_code === 0) {
            that.countDown(120)
            wx.showToast({
              title: "验证码已发送",
              icon: "none"
            })
          } else {
            throw res
          }
        })
        .catch(res => {
          wx.showToast({
            title: res.data.message || "验证码发送失败",
            icon: "none"
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('wallet--onLoad--options==', options)
    that.setData({
      order_number: options.order_number ? options.order_number : null
    })
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
    wx.showLoading({
      title: '',
    })
    app.getAllianceOrder((data) => {
      console.log('wallet--allianceData==', data)
      var formData = that.data.formData;
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (data) {
        formData.alliancePhone = data.alliancePhone
      }
      that.setData({
        formData: formData
      })
    })
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
    var that = this;
    clearInterval(that.data.interval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var formData = {
      alliancePhone: "",
      phoneCode: "",
      password1: "",
      password2: ""
    }
    that.setData({
      formData: formData
    })
    that.onShow()
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