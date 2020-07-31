//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone: '',
    allianceName: '',
    poneMessage: '',
    // phoneCodeinputDis: true,
    checkBtnText: "发送验证码",
    checkBtnDis: true,
    loginBtnDis: true,
    isBind: false,
    applyData: {
      allianceName: "",
      alliancePhone: "",
      invitationCode: "",
      phoneCode: ""
    },
    rules: {
      allianceName: "",
      alliancePhone: ""
    },
    interval: null
  },
  getUserInfo(e) {
    var that = this
    console.log("getUserInfo--e==", e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      var applyData = that.data.applyData;
      app.utils.promisify(wx.login)()
        .then(res => {
          console.log("wx.login--res==", res)
          wx.setStorageSync("userInfo", e.detail.userInfo)
          return app.webapi.apiLogin({
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          })
        })
        .then(res => {
          console.log("login--res==", res)
          wx.hideLoading()
          if (res.data.status_code == 0 && res.data && res.data.data.access_token) {
            console.log("login--res--true==")
            if (that.judgeInput()) {
              console.log("login--res--that.judgeInput()--true==")
              return app.webapi.bindPhone(applyData.alliancePhone, applyData.phoneCode)
            }
          } else {
            console.log("login--res--false==")
            throw res
          }
        })
        .then(res => {
          console.log("bindPhone--res==", res)
          if (res.data.status_code == 0) {
            return app.webapi.createAlliance(that.data.applyData)
          } else {
            throw res
          }
        })
        .then(res => {
          console.log("createAlliance--res==", res)
          if (res.data.status_code == 0) {
            app.utils.openPage2(`./applied?origin=invite`, "redirect")
          } else {
            throw res
          }
        })
        .catch(res => {
          console.log("getUserInfo--catch--res==", res)
          wx.showToast({
            title: res.data.message || '',
            icon: 'none',
            duration: 3000
          })
        })
    }
  },

  judgeInput() {
    var that = this;
    var applyData = that.data.applyData;
    console.log("applyData.allianceName.trim().length ===", applyData.allianceName.trim().length)
    console.log("app.utils.checkUserPhoneReg(applyData.alliancePhone) ===", app.utils.checkUserPhoneReg(applyData.alliancePhone))
    // if (!applyData.invitationCode) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您未获取邀请码, 请推出重新扫描邀请二维码进入',
    //     showCancel: false,
    //   })
    //   return false;
    // }
    if (applyData.invitationCode && applyData.allianceName.trim().length === 0) {
      that.data.rules.allianceName = "请输入姓名";
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    } else if (!app.utils.checkUserPhoneReg(applyData.alliancePhone)) {
      that.data.rules.alliancePhone = "请输入正确对手机号码";
      wx.showToast({
        title: '请输入正确对手机号码',
        icon: 'none'
      })
      return false;
    } else if (!applyData.phoneCode) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
      return false;
    } else {
      return true;
    }
  },
  onSubmit() {
    var that = this;
    var judgeResult = that.judgeInput()
    var applyData = that.data.applyData
    console.log("onSubmit--this.data.isBind==", that.data.isBind)
    console.log("onSubmit--judgeResult==", judgeResult)
    that.setData({
      rules: that.data.rules
    })
    if (judgeResult) {
      app.webapi.bindPhone(applyData.alliancePhone, applyData.phoneCode)
        .then(res => {
          console.log("onSubmit--bindPhone--res==", res)
          if (res.data.status_code === 0) {
            // app.judgeAlliances()
            // return app.webapi.alliancePhone(applyData.alliancePhone, applyData.allianceName)
            return app.webapi.registerPhone(applyData.alliancePhone)
          } else {
            throw res
          }
        })
        .then(res => {
          console.log("onSubmit--registerPhone--2--res==", res)
          if (res.data.status_code === 0) {
            wx.showToast({
              title: "绑定成功",
            })
            app.globalData.newUserPopup = true;
            setTimeout(() => {
              app.utils.openPage2("../alliance/index", "switchTab")
            }, 1000)
          } else if (res.data.status_code === 5) {
            app.globalData.newUserPopup = false;
            wx.showModal({
              title: '提示',
              content: res.data.message,
            })
          } else {
            // wx.showToast({
            //   title: res.data.message,
            //   icon: "none",
            //   duration: 3000
            // })
            app.globalData.newUserPopup = false;
            setTimeout(() => {
              app.utils.openPage2('./applied?origin=bind&status=' + res.data.status_code, 'redirect')
            }, 1000)
          }
        })
        .catch(res => {
          console.log("onSubmit--catch--res==", res)
          app.globalData.newUserPopup = false;
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
  bindPhone(e) {
    // console.log('bindPhone--e==', e)
    // console.log('bindPhone--this.data.phoneCode==', this.data.phoneCode)
    if (app.utils.checkUserPhoneReg(this.data.phone) && this.data.phoneCode) {
      app.webapi.bindPhone(this.data.phone, this.data.phoneCode)
        .then(res => {
          if (res.data.status_code === 0 && res.data.data === "phone.updated") {
            wx.showToast({
              title: '绑定成功',
            })
            setTimeout(() => {
              app.utils.openPage2("../alliance/index", "switchTab")
            }, 2000)
          } else if (res.data.status_code === 1) {
            if (res.data.message === "captcha.invalid") {
              wx.showToast({
                title: "请输入正常验证码",
                icon: "none",
                duration: 3000
              })
            }
          }
          console.log("bindPhone--res==", res)
        })
        .catch(res => {
          console.log("bindPhone--catch--res==", res)
        })
    } else {}
    // if (this.data.phoneCode && this.data.phoneCode == '123123') {
    //   app.utils.openPage2('/pages/index/index', 'switchTab')
    // }
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
  getPhoneCode() {
    console.log("getPhoneCode==")
    if (app.utils.checkUserPhoneReg(this.data.applyData.alliancePhone)) {
      app.webapi.getPhoneCaptcha(this.data.applyData.alliancePhone, "q")
        .then(res => {
          console.log("getPhoneCode--res==", res)
          if (res.data.status_code === 0 && res.data.data === "ok") {
            this.countDown(120)
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
    var value = e.type === 'input' ? e.detail.value : e.detail.value;
    that.data.applyData[layer] = value
    console.log("getInput--that.data.applyData==", that.data.applyData)
    if (layer === 'alliancePhone' && app.utils.checkUserPhoneReg(that.data.applyData.alliancePhone)) {
      that.data.checkBtnDis = false;
    }
    that.setData({
      applyData: that.data.applyData,
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
    console.log("register--onLoad--options==", options)
    var isBind = (options && options.isBind) ? true : false;
    this.setData({
      isBind: false
    })
  },
  onShow() {
    wx.hideHomeButton()
    var that = this;
    var launchOptions = wx.getLaunchOptionsSync()
    console.log("register--onShow--launchOptions==", launchOptions)
    if (launchOptions.query && launchOptions.query.inviteCode) {
      that.data.applyData.invitationCode = launchOptions.query.inviteCode;
    } else {
      that.data.applyData.invitationCode = "";
      // wx.showModal({
      //   title: '提示',
      //   content: '您未获取邀请码, 请推出重新扫描邀请二维码进入',
      //   showCancel: false,
      // })
    }
    console.log("register--onShow--that.data.applyData==", that.data.applyData)
    that.setData({
      applyData: that.data.applyData
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
    clearInterval(that.data.interval)
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