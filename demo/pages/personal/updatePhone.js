//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    step: 1,
    checkBtnText: "发送验证码",
    checkBtnDis: true,
    loginBtnDis: true,
    isBind: false,
    alliance: [{
        alliancePhone: "",
        phoneCode: ""
      },
      {
        alliancePhone: "",
        phoneCode: ""
      },
    ],
    interval: null
  },

  judgeInput(step) {
    var that = this;
    var alliance = that.data.alliance[step-1];
    console.log("app.utils.checkUserPhoneReg(alliance.alliancePhone) ===", app.utils.checkUserPhoneReg(alliance.alliancePhone))
    if (!app.utils.checkUserPhoneReg(alliance.alliancePhone)) {
      that.data.rules.alliancePhone = "请输入正确对手机号码";
      wx.showToast({
        title: '请输入正确对手机号码',
        icon: 'none'
      })
      return false;
    } else if (!alliance.phoneCode || alliance.phoneCode.length != 6) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
      return false;
    } else {
      return true;
    }
  },
  onSubmit(e) {
    var that = this;
    console.log("onSubmit--e==", e)
    var step = parseInt(e.currentTarget.dataset.step);
    var judgeResult = that.judgeInput(step)
    var alliance = that.data.alliance[step-1]
    if (judgeResult) {
      app.webapi.bindPhone(alliance.alliancePhone, alliance.phoneCode)
        .then(res => {
          console.log("onSubmit--bindPhone--res==", res)
          if (res.data.status_code === 0) {
            if (step === 1) {
              console.log('onSubmit--step==1')
              clearInterval(that.data.interval)
              that.setData({
                step: 2,
                checkBtnText: "发送验证码",
                checkBtnDis: false,
              })
            } else if (step === 2) {
              console.log('onSubmit--step==2')
              app.webapi.changePhone(alliance.alliancePhone)
                .then(res => {
                  console.log("onSubmit--changePhone--2--res==", res)
                  if (res.data.status_code === 0) {
                      wx.showToast({
                        title: '更换成功',
                      })
                      setTimeout(() => {
                        app.utils.openPage2("../alliance/index", "switchTab")
                      }, 1000)
                  } else {
                    throw res
                  }
                })
                .catch(res => {
                  console.log("onSubmit--catch--res==", res)
                  app.globalData.newUserPopup = false;
                  var title = res.data.message;
                  if (res.data.message === "captcha.invalid") {
                    title = "验证码错误"
                  } else if (res.data.message === "phone.already.exist") {
                    title = "此手机己注册"
                  }
                  wx.showToast({
                    title: title,
                    icon: 'none',
                    duration: 3000
                  })
                })
            }
          } else {
            throw res
          }
        })
        .catch(res => {
          console.log("onSubmit--catch--res==", res)
          app.globalData.newUserPopup = false;
          var title = res.data.message;
          if (res.data.message === "captcha.invalid") {
            title = "验证码错误"
          } else if (res.data.message === "phone.already.exist") {
            title = "手机已绑定其他用户"
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 3000
          })
        })
    } else {
      // wx.showToast({
      //   title: '请完善资料',
      //   icon: 'none'
      // })
    }
  },
  countDown(count) {
    var that = this
    // var i = count && isNaN(count) ? 60 : 60;
    var i = isNaN(count) ? 60 : count > 0 ? count : 60;
    // var interval;
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
          // phoneCodeinputDis: false
        })
      } else {
        that.setData({
          checkBtnText: checkBtnText,
          checkBtnDis: true,
          // phoneCodeinputDis: false
        })
      }
    }, 1000)
  },
  codeInput(e) {
    console.log("getPhoneCode--e==", e)
    var phoneCode = e.type === 'input' ? e.detail : e.detail.value.trim()
    if (!isNaN(phoneCode) && phoneCode.length === 6) {
      this.setData({
        loginBtnDis: false,
        phoneCode: phoneCode
      })
    } else {
      this.setData({
        loginBtnDis: true,
        phoneCode: phoneCode
      })
    }
  },
  getPhoneCode(e) {
    console.log("getPhoneCode==")
    var that = this;
    var step = parseInt(e.currentTarget.dataset.step);

    if (app.utils.checkUserPhoneReg(that.data.alliance[step-1].alliancePhone)) {
      app.webapi.getPhoneCaptcha(that.data.alliance[step - 1].alliancePhone, "q")
        .then(res => {
          console.log("getPhoneCode--res==", res)
          if (res.data.status_code === 0 && res.data.data === "ok") {
            that.countDown(120)
            wx.showToast({
              title: '验证码已发送',
            })
          } else {
            wx.showToast({
              title: res.data.message || "验证码发送失败",
              icon: "none"
            })
          }
        })
        .catch(res => {
          console.log("getPhoneCode--catch--res==", res)
          wx.showToast({
            title: res.data.message || "验证码发送失败",
            icon: "none"
          })
        })
    }
  },
  getInput(e) {
    console.log("getInput--e==", e)
    var that = this;
    var layer = e.currentTarget.dataset.layer;
    var step = parseInt(e.currentTarget.dataset.step);
    var value =  e.detail.value;
    that.data.alliance[step - 1][layer] = value
    console.log("getInput--that.data.alliance==", that.data.alliance)
    if (layer === 'alliancePhone' && app.utils.checkUserPhoneReg(that.data.alliance[step - 1].alliancePhone)) {
      that.data.checkBtnDis = false;
    }
    that.setData({
      alliance: that.data.alliance,
      checkBtnDis: that.data.checkBtnDis
    })
  },
  getPhone(e) {
    console.log("getPhone--e==", e)
    var that = this;
    var layer = e.currentTarget.dataset.layer;
    var phone = e.type === 'input' ? e.detail : e.detail.value;
    console.log("phone.lenght==", phone.length)
    if (phone.length === 11 || (e.type === 'blur' && phone)) {
      var checkResult = app.utils.checkUserPhoneReg(phone)
      if (checkResult) {
        that.setData({
          checkBtnDis: false,
          // phoneCodeinputDis: false,
          phone: phone
        })
      } else {
        that.data.rules.phone = "请输入正确的手机号码"
        that.setData({
          checkBtnDis: true,
          rules: that.data.rules,
          // phoneCodeinputDis: true,
          phone: phone
        })
      }
    } else {
      that.data.rules.phone = "";
      that.setData({
        // phoneCodeinputDis: true,
        checkBtnDis: true,
        rules: that.data.rules,
        phone: phone
      })
    }
  },
  onLoad: function(options) {
    console.log("updatePhone--onLoad--options==", options)
    var that = this;
    if (!options.alliancePhone) {
      that.data.checkBtnDis = true;
      wx.showModal({
        title: '提示',
        content: '暂无绑定手机信息',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            app.utils.openPage2(1, 'back')
          }
        }
      })
    } else {
      that.data.alliance[0].alliancePhone = options.alliancePhone;
      that.data.checkBtnDis = false;
    }
    this.setData({
      alliance: that.data.alliance,
      checkBtnDis: that.data.checkBtnDis
    })
  },
  onShow() {
    wx.hideHomeButton()
    var that = this;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
    clearInterval(that.data.interval)
    var alliance = [{
      alliancePhone: "",
      phoneCode: ""
    },
      {
        alliancePhone: "",
        phoneCode: ""
      },
    ]
    that.setData({
      step: 1,
      alliance: alliance
    })
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})