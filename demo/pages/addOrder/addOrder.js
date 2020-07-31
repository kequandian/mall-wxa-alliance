// pages/addOrder/addOrder.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: [],
    address: '',
    productArr: [],
    products: [],
    address_index: 0,     // 用于标识选择收货地址下标；
    freight: 0,            // 运费；
    total: 0,
    integral: 0,
    payment: 0,
    screenWidth: app.screenWidth,
    buttonWidth: '0px',
    buttonHeight: '0px',
    pay_credit: 0,
    showAddresList: false,
    selFriend: app.globalData.selFriend,
    isWalletPay: false,
    passwordInput: '',
    couponIndex: -2,
    carriage: 0,
    credit_offset: 0,
    total_credit: 0,
    total_price: 0,
    product_price: 0
  },
  selOrderType(e) {
    console.log("selOrderType--e==", e)
    this.setData({
      orderType: parseInt(e.detail.value)
    })
  },
  openPage(e) {
    this.onClose()
    app.utils.openPage(e)
  },
  onClose(e) {
    console.log("onClose--e==", e)
    this.setData({
      showAddresList: false,
      isWalletPay: false,
      passwordInput: ''
    })
    if (e) {
      setTimeout(() => {
        app.utils.openPage2('../order/order-details?order_number=' + this.data.order_number, 'redirect')
      }, 500)
    }

  },
  // 备注；
  getRemark(e) {
    this.data.remark = e.detail.value.trim()
  },
  // 获取选择商品；
  getProduct(id, quantity) {
    console.log('------addOrder------getProduct---')
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.getProductDetail(id)
      .then(res => {
        console.log("getProductDetail--res==", res)
        wx.hideLoading()
        res.data.data.quantity = quantity
        var product_price = Number(that.data.product_price)
        if (res.data.status_code === 0) {
          that.data.total_credit += res.data.data.credit
          that.data.products.push(res.data.data)
          if (that.data.judgeAlliances) {
            that.data.product_price = product_price + parseFloat(res.data.data.price).toFixed(2) * res.data.data.quantity
          } else {
            that.data.product_price = product_price + parseFloat(res.data.data.suggested_price).toFixed(2) * res.data.data.quantity
          }
          console.log('that.data.product_price---商品价格', that.data.product_price)
          console.log('getProduct-----products', that.data.products)
          console.log('that.data.total_credit---积分', that.data.total_credit)
          that.setData({
            products: that.data.products,
            product_price: parseFloat(that.data.product_price).toFixed(2),
            total_credit: that.data.total_credit,
          })
          that.calculate()
        }
      })
      .catch(res => {
        console.log("getProductDetail--catch--res==", res)
        wx.hideLoading()
      })
  },
  // 点击地址，显示收货地址列表；
  setAddress: function() {
    console.log('------addOrder.js-----setAddress------')
    var that = this
    that.setData({
      showAddresList: true
    })
    /*var OREanimation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    this.OREanimation = OREanimation
    console.log(app.screenWidth)
    OREanimation.translate(-app.screenWidth).step()


    var ADDanimation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    this.ADDanimation = ADDanimation
    console.log(app.screenWidth)
    ADDanimation.translate(-2000).step()

    wx.request({
      url: app.globalData.URL_API +'/contact',
      data: {},
      header: {
        'Authorization': app.globalData.token,
        'content-type': 'json'
      },
      success: function(res) {
        that.data.addressArr = res.data.data
        app.globalData.addressArr = res.data.data
        that.setData({
          addressArr: res.data.data,
          OREanimationData: OREanimation.export(),
          ADDanimationData: ADDanimation.export()
        })
      }
    })*/
  },
  getAddress() {
    var that = this
    app.webapi.getAddressList()
      .then(res => {
        console.log("getAddressList--res==", res)
        if (res.data.status_code === 0) {
          var addressArr = res.data.data
          app.globalData.addressArr = res.data.data
          if (addressArr.length) {
            for (var i in addressArr) {
              if (addressArr[i].is_default) {
                that.data.address = addressArr[i]
                break;
              }
            }
          }
          if (app.globalData.selFriend) {
            var selFriend = app.globalData.selFriend
            that.data.address = {
              "city": selFriend.pcdCity,
              "contact_user": selFriend.name,
              "detail": selFriend.address,
              "district": selFriend.pcdDistinct,
              "phone": selFriend.contactPhone,
              "province": selFriend.pcdProvince
            }
          }
          if (that.data.address) {
            that.computeCarriage(that.data.options, that.data.address)
          }
          that.setData({
            addressArr: res.data.data,
            address: that.data.address
          })
        } else {
          that.setData({
            addressArr: [],
          })
        }

      })
      .catch(res => {
        console.log("getAddressList--catch--res==", res)
      })
  },
  selFriend(e) {
    var friend_index = e.currentTarget.dataset.index
    var friends = this.data.friends
    this.setData({
      friend: friends[friend_index],
      showAddresList: false
    })
  },
  // 选择收货地址；
  selectAddress: function (e) {
    var that = this;
    var address_index = e.currentTarget.dataset.index
    var addressArr = that.data.addressArr
    that.computeCarriage(that.data.options, addressArr[address_index])
    that.setData({
      address: addressArr[address_index],
      showAddresList: false
    })
    /*var OREanimation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    this.OREanimation = OREanimation
    console.log(app.screenWidth)
    OREanimation.translate(0).step()


    var ADDanimation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    this.ADDanimation = ADDanimation
    console.log(app.screenWidth)
    ADDanimation.translate(0).step()

    this.setData({
      buttonWidth: '100%',
      buttonHeight: '100rpx',
      address: addressArr[address_index],
      OREanimationData: OREanimation.export(),
      ADDanimationData: ADDanimation.export()
    })*/

  },

  // 积分抵消；
  integral: function (event) {
    console.log('------addOrder------integral----')
    console.log(event)
    var integral = 0
    if (event.detail.value) {
      integral = 1
    } else {
      integral = 0
    }
    console.log(parseFloat(integral).toFixed(2))
    console.log(typeof(integral))
    this.setData({
      integral: parseFloat(integral).toFixed(2),
      payment: parseFloat(Number(this.data.total)+Number(this.data.freight)-Number(integral)).toFixed(2)
    })

    // var payment = parseFloat(this.data.total+this.data.freight).toFixed(2)

    // payment =  parseFloat(payment - this.data.integral).toFixed(2)

    // this.setData({
    //   integral: parseFloat(integral).toFixed(2),
    //   payment: parseFloat(Number(this.data.total)+Number(this.data.freight)-Number(this.data.integral)).toFixed(2)
    // })
  },

  // " - " 调用该方法减少数量；
  reduce: function (event) {
    var index = parseInt(event.currentTarget.dataset.index)

    var productArr = this.data.productArr
    if ( productArr[index].quantity > 1 ) {
      productArr[index].quantity = productArr[index].quantity - 1
    } else {
      wx.showToast({
        title: '不能再减了',
        icon: '',
        duration: 500
      })
      productArr[index].quantity = 1
    }
    // 计算总价；
    // this.compute()

  },
  // " + " 调用该方法增加数量；
  add: function (event) {
    console.log('------addOrder------add---')
    console.log(this.data.productArr)
    var index = parseInt(event.currentTarget.dataset.index)

    var productArr = this.data.productArr
    if ( productArr[index].quantity < productArr[index].stock_balance ) {
      productArr[index].quantity = Number(productArr[index].quantity) + 1
    } else {
      wx.showToast({
        title: '库存就这么多了',
        icon: '',
        duration: 500
      })
      productArr[index].quantity = productArr[index].stock_balance
    }
    
    console.log(productArr[index].quantity)
    // this.compute()
  },

  // 输入框修改数量；
  changeInput: function (event) {
    console.log('------addOrder------changeInput---')
    var index = event.currentTarget.dataset.index
    var value = event.detail.value
    
    if ( isNaN(value) || Number(value) < 1 ) {
      wx.showToast({
        title: '请重新输入数量',
        icon: '',
        duration: 500
      })
      value = 1
    }

    console.log(typeof(value))
    console.log(isNaN(value))
    console.log(Number(value))
    console.log(typeof(value))
    var productArr = this.data.productArr
    productArr[index].quantity = parseInt(value)

    // this.compute()
    
  },

  // 计算价格；
  compute: function () {
    console.log('------addOrder------compute---')
    var productArr = this.data.productArr
    var total = 0
    var freight = this.data.freight
    console.log(typeof(freight))
    for ( var i=0; i<productArr.length; i++ ) {
      total = total + productArr[i].price * productArr[i].quantity
      if ( productArr[i].freight > freight ) {
        freight = productArr[i].freight
      }
    }
    
    console.log(typeof(freight))
    console.log(freight)
    this.setData({
      productArr: this.data.productArr,
      total: parseFloat(total).toFixed(2),
      freight: parseFloat(freight).toFixed(2),
      payment: parseFloat(total+Number(freight)).toFixed(2)
    })
  },
  //积分抵扣；
  creditPayment: function () {
    var that = this
    var users = that.data.users
    var jf_switch = that.data.jf_switch
    var total_credit = that.data.total_credit
    var credit_offset = 0
    return credit_offset;
    if (jf_switch) {
      if (users.grade.creditCashPlanEnabled == 1) {
        if (users.credit < total_credit) {
          credit_offset = parseFloat(users.credit / users.grade.creditCashPlan * users.grade.creditWinCash).toFixed(2)
          that.data.pay_credit = users.credit
        } else {
          credit_offset = parseFloat(total_credit / users.grade.creditCashPlan * users.grade.creditWinCash).toFixed(2)
          that.data.pay_credit = total_credit
        }
        that.data.credit_offset = credit_offset
        return credit_offset
      } else {
        credit_offset = 0
        that.data.credit_offset = credit_offset
        return credit_offset
      }
    } else {
      credit_offset = 0
      that.data.credit_offset = credit_offset
      return credit_offset
    }
  },
  // 计算实付金额；
  calculate() {
    console.log('计算总金额')
    var that = this
    var couponIndex = that.data.couponIndex
    var couponList = that.data.couponList
    var product_price = parseFloat(that.data.product_price)
    var carriage = that.data.carriage
    var total_price = that.data.total_price
    var credit_offset = that.creditPayment()
    var coupon_price = 0
    console.log("calculate--product_price==", product_price)
    console.log("calculate--carriage==", carriage)
    console.log("calculate--total_price==", total_price)
    console.log("calculate--credit_offset==", credit_offset)
    if (couponIndex == -1 || couponIndex == -2) {
      total_price = product_price + carriage - credit_offset
      console.log("calculate--total_price=111=", total_price)
      coupon_price = 0
    } else {
      // total_price = couponList[couponIndex].final_price + carriage - credit_offset
      if (couponList[couponIndex].c_type == 'full') {
        if (product_price >= couponList[couponIndex].climit) {
          total_price = parseFloat(product_price + carriage - couponList[couponIndex].worth).toFixed(2)
        } else {
          total_price = parseFloat(product_price + carriage).toFixed(2)
        }
      } else if (couponList[couponIndex].c_type == 'discount') {
        total_price = parseFloat(product_price * couponList[couponIndex].discount / 10 + carriage).toFixed(2)
      }
      console.log('couponList[couponIndex].final_price,', couponList[couponIndex].final_price)
      coupon_price = parseFloat(product_price - couponList[couponIndex].final_price).toFixed(2)
    }
    console.log('parseFloat(total_price).toFixed(2),', parseFloat(total_price).toFixed(2))
    that.setData({
      total_price: parseFloat(total_price).toFixed(2),
      credit_offset: credit_offset,
      coupon_price: coupon_price

    })
  },
  // 计算运费；
  computeCarriage(products, address) {
    console.log('Carriage---products', products)
    console.log('Carriage---address', address)
    var that = this
    if (!products || !address) {
      console.log('没有')
      return null
    }
    var post_carriage = {
      "province": address.province,
      "city": address.city,
      "data": products,
      "delivery_type": that.data.wayName
    }
    app.webapi.computeCarriage(post_carriage)
      .then(res => {
        console.log("addOrder--computeCarriage--res==", res)
        that.setData({
          carriage: res.data.data.carriage,
        })
        that.calculate()
      })
      .catch(res => {
        console.log("addOrder--computeCarriage--catch--res==", res)
      })
  },
  // 提交订单；
  addOrder() {
    var that = this;
    console.log('addOrder--')
    
    if (!that.data.address) {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var allianceData = that.data.allianceData;
    var payment_type = "WECHAT";
    console.log("addOrder--allianceData==", allianceData)
    console.log("addOrder--that.data.payment==", that.data.total_price)
    if (allianceData) {
      if (allianceData.balance && allianceData.balance >= that.data.total_price) {
        payment_type = "WALLET";
      } else {
        payment_type = "WECHAT";
        // wx.showModal({
        //   title: '提示',
        //   content: '对不起，您的钱包余额不够',
        //   cancelText: '微信支付',
        //   confirmText: '钱包充值',
        //   success(res) {
        //     console.log("showModal--res==", res)
        //     if (res.confirm) {
        //     } else if (res.cancel) {
        //       payment_type = "WECHAT";
        //     }
        //   }
        // })
      }
    }
    var post_order = {
      "delivery_type": "EXPRESS",
      "contact": that.data.address,
      "coupon_id": null,
      "origin": "MINI_PROGRAM",
      "invoice_title": "",
      "order_items": that.data.options,
      "invoice": 0,
      "receiving_time": "",
      // "payment_type": "WECHAT",
      "payment_type": payment_type,
      "remark": that.data.remark,
      "pay_credit": that.data.pay_credit
    }
    wx.showLoading({
      title: '',
    })
    app.webapi.addOrder(post_order)
      .then(res => {
        console.log("addOrder--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0 && res.data.data && res.data.data.order_number) {
          that.data.order = res.data.data;
          that.setData({
            isWalletPay: payment_type === 'WALLET' ? true : false,
            order_number: res.data.data.order_number
          })
          if (payment_type === 'WECHAT') {
            that.wxPay(res.data.data.order_number)
          } else if (payment_type === 'WALLET'){
            // that.walletPay(res.data.data.order_number)
          }
          
        } else {
          wx.showToast({
            title: '新建订单失败',
            icon: 'none'
          })
        }
        if (that.data.origin === 'cart') {
          var post_carts = []
          that.data.options.map(item => {
            post_carts.push({ product_id: item.product_id, quantity: 0 })
          })
          app.webapi.updateCarts(false, post_carts)
            .then(res => {
              wx.hideLoading()
              if (res.data.status_code === 0) {
                wx.setStorageSync("cart", res.data.data)
              }
            })
        }
      })
      .catch(res => {
        console.log("addOrder--catch--res==", res)
        wx.showToast({
          title: '新建订单失败',
          icon: 'none'
        })
      })
  },
  // 钱包支付；
  walletPay(e) {
    var that = this;
    app.walletPay(e, that.data.order, 'add', function (res) {
      console.log("walletPay--res==", res)
      setTimeout(() => {
        app.utils.openPage2('../order/order-details?order_number=' + that.data.order_number, 'redirect')
      }, 500)
      that.onClose()
    })
  },
  /*walletPay(e) {
    var that = this
    console.log("walletPay--e==", e)
    console.log("walletPay--that.data.order_number==", that.data.order_number)
    var password = e.detail.value.password;
    if (!that.data.order_number || password.length === 0) {
      wx.showToast({
        title: "请输入密码",
        icon: "none"
      })
      return
    }
    var post_order = {
      orderNumber: that.data.order_number,
      orderType: "Order",
      // "type": "WALLET",
      password: password
    }
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.walletPay(post_order)
      .then(res => {
        console.log("walletPay--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          app.getAllianceOrder()
          wx.showToast({
            title: '支付成功',
          })
          that.onClose()
          setTimeout(() => {
            app.utils.openPage2('../order/order-details?order_number=' + that.data.order_number, 'redirect')
          }, 500)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000
          })
        }
      })
      .catch(res => {
        console.log("walletPay--catch--res==", res)
        wx.hideLoading()
      })
  },*/
  // 微信支付；
  wxPay(order_number) {
    var that = this
    var post_order = {
      "order_number": order_number,
      "order_type": "Order",
      "type": "WXA"
    }
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.wxPay(post_order)
      .then(res => {
        console.log("wxPay--res==", res)
        if (res.data.status_code === 0) {
          app.utils.promisify(wx.requestPayment)(res.data.data)
            .then(res => {
              console.log("wx.requestPayment--res==", res)
              wx.hideLoading()
              if (res.errMsg === "requestPayment:fail cancel") {
                wx.showToast({
                  title: '支付失败',
                  icon: "none"
                })
              }
              setTimeout(() => {
                app.utils.openPage2('../order/order-details?order_number=' + order_number, 'redirect')
              }, 500)
            })
            .catch(res => {
              console.log("wx.requestPayment--catch--res==", res)
              wx.hideLoading()
              setTimeout(() => {
                app.utils.openPage2('../order/order-details?order_number=' + order_number, 'redirect')
              }, 500)
            })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          setTimeout(() => {
            app.utils.openPage2('../order/order-details?order_number=' + order_number, 'redirect')
          }, 500)
        }
      })
      .catch(res => {
        console.log("wxPay--catch--res==", res)
      })
    /*app.wxRequest('wx/push_order', post_order, 'POST', that, function (res) {
      console.log('wxPay----res', res)
      if (res.data.status_code == 0) {
        wx.requestPayment({
          "timeStamp": res.data.data.timeStamp,
          "nonceStr": res.data.data.nonceStr,
          "package": res.data.data.package,
          "signType": res.data.data.signType,
          "paySign": res.data.data.paySign,
          success: function (res) {
            console.log('requestPayment----res', res)
            if (res.errMsg == "requestPayment:ok") {
              app.openPage('../payment/payment?order_number=' + order_number)

              // app.openPage('../order-details/order-details')
            }
          },
          fail: function (e) {
            console.log('fail----e', e)
            wx.showToast({
              title: '支付失败',
              image: '../../images/fail.png',
              duration: 1000
            })
            // app.openPage('../payment/payment?order_number=' + order_number)
            // app.openPage('../order-details/order-details?order_number='+order_number)
          }
        })
      } else if (res.data.status_code == 1) {
        wx.showToast({
          title: '支付失败',
          image: '../../images/fail.png'
        })
      }
    })*/
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('addOrder--onLoad--options==', options)
    // console.log(typeof(this.data.total))
    // var id = options.id.split('-')
    // var quantity = options.quantity.split('-')
    
    // var order_items = JSON.parse(options.products)
    that.data.origin = options.origin
    var options = JSON.parse(options.products)
    that.data.options = options
    console.log('addOrder--onLoad--options==', options)

    // this.data.order_items = order_items
    // console.log('addOrder--onLoad--order_items==', order_items)
    var post_coupon = []
    for (var i = 0; i < options.length; i++ ) {
      var price = 0
      price = Number(options[i].price) * options[i].quantity
      post_coupon[i] = {
        "product_id": options[i].product_id,
        "price": price
      }
      this.getProduct(options[i].product_id, options[i].quantity)
    }
    var addressArr = []
    var address_index = 0
    app.getAllianceOrder(allianceData => {
      that.setData({
        allianceData: allianceData
      })
    })

    //获取收货地址列表；
    /*app.getAddressList(function(res) {
      console.log('addOrder--getAddressList--res==', res)
      if (res.length) {
        addressArr = res
        var addressArr = app.globalData.addressArr

        for (var i = 0; i < addressArr.length; i++) {
          if (addressArr[i].is_default == 1) {
            address_index = i
            break;
          }
        }
        that.data.address = addressArr[address_index]
      }
       that.setData({
        address: that.data.address,
        integral: parseFloat(that.data.integral).toFixed(2),
        buttonWidth: that.data.buttonWidth,
        buttonHeight: that.data.buttonHeight
      })
    })*/
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
    console.log("addOrder--onShow--selFriend==", app.globalData.selFriend)
    this.setData({
      selFriend: app.globalData.selFriend,
      judgeAlliances: app.globalData.judgeAlliances
    })
    this.getAddress()
    // app.webapi.getFriends()
    //   .then(res => {
    //     console.log("getFriend--res==", res)
    //     if (res.data.status_code === 0 && res.data.data) {
    //       this.data.friends = res.data.data.records
    //       this.setData({
    //         friends: this.data.friends
    //       })
    //     }
    //   })
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
    var that = this;
    that.onClose()
    that.setData({
      showAddresList: false,
      isWalletPay: false,
      order_number: ""
    })
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