//app.js
const utils = require('./utils/util.js')
const webapi = require('./webapi/index.js')
// var URL_API = 'https://www.kequandian.net/rest'
//var URL_API = 'https://api.cloud.biliya.cn/rest'
// var URL_API = 'https:/biliya.zele.pro/rest'
var URL_API = 'http://192.168.3.181:8080/rest'

App({
  utils: utils,
  webapi: webapi,
  onLaunch: function(options) {
    var that = this;
    console.log('app--onLaunch--options==', options)
    var inviteCode = null;
    if (options && options.query && options.query.inviteCode) {
      inviteCode = options.query.inviteCode
    }
    // that.login("", function(res) {
    //   if (res.data.status_code === 0) {
    //   }
    // }, inviteCode)
    wx.getSystemInfo({
      success: function(res) {
        console.log('app--etSystemInfo--res==', res)
        that.screenHeight = res.screenHeight,
          that.screenWidth = res.screenWidth
      }
    })
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  onShow(options) {
    console.log('app--onShow--options==', options)
    var that = this;
    var pages = getCurrentPages()
    console.log("app--init--pages==", pages)
    if (pages.length && pages[pages.length - 1].route != "pages/alliance/index") {
      that.init()
    } else {
      that.getCategory
    }
  },
  isRuning: false,
  init() {
    var that = this;
    that.login("", function(res) {
      console.log('app--init==')
      if (res.data.status_code === 0) {
        // this.utils.openPage2("/pages/register/phone")
        if (!that.isRuning) {
          that.getCategory()
          that.getAllianceOrder()
        }
      }
    }, 'app')
    console.log("app--init--that.isRuning==", that.isRuning)
    // if (!that.isRuning) {
    //   that.getCategory()
    //   that.getAllianceOrder()
    // } else {
    // }
  },
  getCategory() {
    var that = this;
    that.isRuning = true;
    var categoryData = [];
    that.webapi.getCategory(that.globalData.token)
      .then(res => {
        console.log("getCategory--res==22222", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          if (res.data.data) {
            categoryData = categoryData.concat(res.data.data)
            that.globalData.categoryData = categoryData
          }
          console.log("res--data---list==22222", categoryData)
          that.isRuning = false;
          wx.setStorageSync('categoryData', categoryData)
        } else {
          throw res
        }
      })
      .catch(res => {
        wx.hideLoading()
        console.log("getCategory--catch--res==", res)
        wx.setStorageSync('categoryData', [])
        that.isRuning = false;
      })
  },
  allianceGlobal(cb) {
    webapi.allianceGlobal()
      .then(res => {
        console.log('allianceGlobal--res==', res)
        if (res.data.status_code === 0) {
          typeof (cb) === 'function' && cb(res.data.data.globalDelayRegister)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log('allianceGlobal--catch--res==', res)
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
        typeof(cb) === 'function' && cb(false)
      })
  },
  login(userAuth, cb, page) {
    wx.showLoading({
      title: '',
    })
    this.allianceGlobal((globalDelayRegister) => {
      // utils.openPage2('../category/category', 'switchTab')
      console.log('login--globalDelayRegister==', globalDelayRegister)
      utils.promisify(wx.login)()
        .then(res => {
          console.log("wx.login--res==", res)
          if (userAuth) {
            wx.setStorageSync("userInfo", userAuth.userInfo)
            return webapi.apiLogin({
              code: res.code,
              encryptedData: userAuth.encryptedData,
              iv: userAuth.iv
            })
          } else {
            return webapi.apiLogin({
              code: res.code
            })
          }
        })
        .then(res => {
          console.log("login--res==", res)
          wx.hideLoading()
          if (res.data.status_code == 0) {
            if (res.data.data.access_token) {
              this.globalData.token = res.data.data.access_token;
              this.globalData.openid = res.data.data.openid;
              console.log('login--this.globalData.token==', this.globalData.token)
              // this.globalData.token = 'eyJsb2dpbl9uYW1lIjoib05oVGQ0cUphc0w3aUlKT2tNYnpHRXdObWJKdyIsImlkIjoiMjMiLCJ0b2tlbiI6IjEwYmYwMjNkMmQ3ZjBmYjQ5NzU5NzlhMzllM2Q0ZDk5MTYxYzFiOWMifQ='
              // if (page) {
              //   console.log("login--page--true")
              //   return;
              // }
              // if (globalDelayRegister) {
              //   utils.openPage2('../category/category', 'switchTab')
              // } else 
              if (userAuth || page === 'alliance_index_invite') {
                console.log("login--userAuth--true==")
                this.judgeAlliances("/pages/register/phone", cb, page, false)
              } else {
                console.log("login--userAuth--false==")
                this.judgeAlliances("/pages/register/index", cb, page, globalDelayRegister)
              }
            }
            // typeof (cb) == 'function' && cb(res)
          } else if (res.data.status_code == 4001) {
            console.log('4001--globalDelayRegister--true==')
            // if (res.data.message === "auth.required") {}
            if (globalDelayRegister) {
              console.log('login--4001--globalDelayRegister--true==')
              utils.openPage2('../category/category', 'switchTab')
            } else {
              console.log('login--4001--globalDelayRegister--false--register/index==')
              utils.openPage2("/pages/register/index", "redirect")
            }
            // if (that) {
            //   that.setData({
            //     loginPopup: true
            //   })
            // }
          } else {
            if (globalDelayRegister) {
              utils.openPage2('../category/category', 'switchTab')
            } else {
              throw res
            }
          }
        })
        .catch(res => {
          wx.hideLoading()
          console.log("wx.login--catch--res==", res)
        })
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  getAllianceOrder(cb) {
    this.isRuning = true;
    this.webapi.getAllianceOrder()
      .then(res => {
        console.log("getAllianceOrder--res==", res)
        if (res.statusCode === 200) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          if (res.data.status_code === 0) {
            this.globalData.allianceData = res.data.data
            typeof(cb) === 'function' && cb(res.data.data)
          } else {
            typeof(cb) === 'function' && cb('')
          }
          this.isRuning = false;
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("getAllianceOrder--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
        this.isRuning = false;
        typeof(cb) === 'function' && cb('')
      })
  },
  checkWalletPassword(cb) {
    var that = this;
    // that.webapi
  },
  // 钱包支付；
  walletPay(e, orderData, page, cb) {
    var that = this;
    console.log("walletPay--e==", e)
    console.log("walletPay--orderData==", orderData)
    console.log("walletPay--orderData.order_number==", orderData.order_number)
    var password = e.detail.value.password;
    if (!orderData || password.length === 0) {
      wx.showToast({
        title: "请输入密码",
        icon: "none"
      })
      return
    }
    var post_order = {
      orderNumber: orderData.order_number,
      orderType: "Order",
      // "type": "WALLET",
      password: password
    }
    wx.showLoading({
      title: '加载中',
    })
    that.webapi.walletPay(post_order)
      .then(res => {
        console.log("walletPay--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          that.getAllianceOrder()
          wx.showToast({
            title: '支付成功',
          })
          typeof(cb) === "function" && cb(res)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("walletPay--catch--res==", res)
        var errorMessage = "支付失败"
        wx.hideLoading()
        if (res.data.message == "incorrect.password") {
          errorMessage = "密码错误"
        } else if (res.data.message == "password.not.set") {
          errorMessage = "未设置支付密码"
        }
        wx.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        })
      })
  },
  // 请求商品收藏列表；
  getFavorite: function(callback) {
    console.log(159357)
    var that = this
    wx.request({
      url: that.globalData.URL_API + '/product_favorite', //仅为示例，并非真实的接口地址
      data: {},
      method: 'GET',
      header: {
        'Authorization': that.globalData.token,
        'content-type': 'json'
      },
      success: function(res) {
        // console.log("app---getFavorite")
        // console.log(res.data.data)
        // that.globalData.favoriteArr = res.data.data
        // console.log(that.globalData.favoriteArr)

        that.globalData.favoriteArr = res.data.data
        callback(res.data.data)
      }
    });
  },
  // 获取收货地址列表；
  getAddressList: function(callback) {
    var that = this
    wx.request({
      url: that.globalData.URL_API + '/contact',
      data: {},
      header: {
        'Authorization': that.globalData.token,
        'content-type': 'json'
      },
      success: function(res) {

        that.globalData.addressArr = res.data.data
        callback(res.data.data)
      }
    })
  },
  // 获取个人信息；
  getProfile(flag, cb) {
    var that = this;
    var userProfile = wx.getStorageSync("user_profile")
    console.log("app--getProfile--userProfile==", userProfile)
    if (flag || !userProfile) {
      that.webapi.getProfile()
        .then(res => {
          console.log("getProfile--res==", res)
          if (res.data.status_code === 0) {
            // if (res.data.status_code === 0 && res.data.data) {
            //   wx.setStorageSync("user_profile", res.data.data)
            //   typeof (cb) == 'function' && cb(res)
            // }
            if (res.data.data) {
              if (res.data.data.phone) {
                wx.setStorageSync("user_profile", res.data.data)
                typeof(cb) == 'function' && cb(res.data.data)
              } else {
                // utils.openPage2("/pages/register/index", "redirect")
              }
            } else {
              typeof(cb) == 'function' && cb("")
            }
          }
        })
        .catch(res => {
          console.log("getProfile--catch--res==", res)
        })
    } else {
      typeof(cb) == 'function' && cb(userProfile)
    }
  },
  judgeAlliances(url, cb, page, globalDelayRegister) {
    var that = this
    console.log('judgeAlliances--url==', url)
    console.log('judgeAlliances--page==', page)
    webapi.judgeAlliances()
      .then(res => {
        console.log("app--judgeAlliances--res==", res)
        that.globalData.judgeAlliances = res.data.status_code === 0 ? true : false
        if (res.data.status_code === 0) {
          that.globalData.judgeAlliances = true
          // utils.openPage2("/pages/register/phone", "redirect")
          if (page === 'alliance_index') {
            typeof(cb) == 'function' && cb(res)
            // utils.openPage2('/pages/register/index', "redirect")
          } else {
            utils.openPage2("/pages/alliance/index", "redirect")
          } 
        } else if (globalDelayRegister) {
          utils.openPage2('../category/category', 'switchTab')
        } else if (res.data.status_code === 1) {
          if (url === "/pages/register/phone") {
            utils.openPage2(url, "redirect")
          } else {
            utils.promisify(wx.showModal)({
                title: '提示',
                content: '您不是盟友，请绑定手机号码',
                showCancel: false,
              })
              .then(res => {
                console.log("judgeAlliances--showModal--res==", res)
                if (res.confirm) {
                  utils.openPage2(url, "redirect")
                }
              })
          }
        } else if (res.data.status_code === 3) {
          
          utils.openPage2("/pages/register/phone", "redirect")
        } else if (res.data.status_code === 5) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        } else {
          utils.openPage2("/pages/register/applied?status=" + res.data.status_code, "redirect")
        }
      })
      .catch(res => {
        console.log("app--judgeAlliances--catch--res==", res)
      })
  },
  globalData: {
    userInfo: null,
    categoryData: [],
    // URL_API: 'https://www.kequandian.net/rest',
    //URL_API: "https://api.cloud.biliya.cn/rest",
    // URL_API: "https://biliya.zele.pro/rest",
    URL_API: 'http://192.168.3.181:8080/rest',
    favoriteArr: {},
    addressArr: [],
    token: null,
    // token: "eyJsb2dpbl9uYW1lIjoib05oVGQ0cUphc0w3aUlKT2tNYnpHRXdObWJKdyIsImlkIjoiMjMiLCJ0b2tlbiI6IjEwYmYwMjNkMmQ3ZjBmYjQ5NzU5NzlhMzllM2Q0ZDk5MTYxYzFiOWMifQ",
    selCartJson: null,
    selFriend: null,
    allianceData: null,
    allStatusName: {
      "CREATED_PAY_PENDING": "待支付",
      "CLOSED_PAY_TIMEOUT": "支付超时关闭",
      "CLOSED_CANCELED": "已取消",
      "PAID_CONFIRM_PENDING": "已支付",
      "CONFIRMED_DELIVER_PENDING": "待发货",
      "DELIVERING": "发货中",
      "DELIVERED_CONFIRM_PENDING": "已发货",
      "CANCELED_RETURN_PENDING": "待退货",
      "CLOSED_CONFIRMED": "已确认收货",
      "CANCELED_REFUND_PENDING": "待退款",
      "CLOSED_REFUNDED": "已退款",
      "CONFIRMED_PICK_PENDING": "待取货"
    },
    newUserPopup: false
  }
})