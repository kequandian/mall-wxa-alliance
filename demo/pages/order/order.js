// order.js
var app = getApp()
// var pageSize = app.siteInfo.pageSize
// var pageSize = 5
Page({

  //  * 页面的初始数据   
  data: {
    navArr: [{
        title: '全部',
        status: ''
      },
      {
        title: '待付款',
        status: 'CREATED_PAY_PENDING'
      },
      {
        title: '待发货',
        status: 'CONFIRMED_DELIVER_PENDING'
      },
      {
        title: '待收货',
        status: 'DELIVERED_CONFIRM_PENDING'
      },
      // {
      //   title: '待评价',
      //   status: 'CLOSED_CONFIRMED'
      // },
      {
        title: '已完成',
        status: 'CLOSED_CONFIRMED'
      },
    ],
    lightIndex: 0,
    pageNum: 1,
    pageSize: 30,
    orderList: [],
    status: '',
    passwordInput: "",
    isWalletPay: false,
    allStatusName: app.globalData.allStatusName,
    isService: false,
    serviceReason: "",
    reasonList: [
      "选择错了",
      "重复下单",
      "不想要了",
      "其他"
    ],
    reasonIndex: -1
  },
  changePicker(e) {
    console.log("changePicker--e==", e)
    var that = this;
    var value = e.detail.value;
    that.setData({
      reasonIndex: parseInt(value)
    })
  },
  onClose() {
    this.setData({
      showAddresList: false,
      isWalletPay: false,
      passwordInput: '',
      selOrder: '',
      isService: false,
      serviceReason: "",
      reasonIndex: -1
    })
  },
  openPage(e) {
    this.onClose()
    app.utils.openPage(e)
  },
  // 钱包支付；
  walletPay(e) {
    var that = this;
    app.walletPay(e, that.data.selOrder, 'list', function (res) {
      console.log("walletPay--res==", res)
      that.getOrderList(that.data.navArr[that.data.lightIndex].status)
      that.onClose()
    })
  },
  /*walletPay(e) { 
    var that = this
    var password = e.detail.value.password;
    if (!that.data.selOrder || password.length === 0) {
      wx.showToast({
        title: "请输入密码",
        icon: "none"
      })
      return
    }
    var post_order = {
      orderNumber: that.data.selOrder.order_number,
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
          that.getOrderList(that.data.navArr[that.data.lightIndex].status)
          // setTimeout(() => {
          //   app.utils.openPage2('./order-details?order_number=' + that.data.selOrder.order_number, 'redirect')
          //   that.onClose()
          // }, 1000)
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
  getUsers: function() {
    var that = this
    app.getUser(function(users) {
      console.log('个人信息--users', users)
      if (users) {
        var num = Number(users.delivered) + Number(users.delivering) + Number(users.payPending) + Number(users.commentPending)
        console.log('num', num)
        that.setData({
          users: users
        })
      } else {
        that.setData({
          users: {}
        })
      }

    })
  },
  orderBtn(event) {
    console.log('orderBtn---event', event)
    var that = this
    var operation = event.currentTarget.dataset.operation
    var order_number = event.currentTarget.dataset.orderNumber
    var index = event.currentTarget.dataset.index
    console.log('operation', operation)
    // 提醒发货；
    if (operation == 'reminder') {
      app.webapi.getOrderReminder(order_number)
        .then(res => {
          console.log("getOrderReminder--res==", res)
          if (res.data.message == "order.deliver.reminded" && res.data.status_code == 0) {
            wx.showToast({
              title: '已提醒发货',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: '已提醒发货,请耐心等待',
              icon: 'none',
              duration: 1000
            })
          }
        })
        .catch(res => {
          console.log("getOrderReminder--catch--res==", res)
        })
    } else if (operation == 'confirm' || operation == 'cancel') {
      // 确认订单；
      var status = "";
      var title = "";
      if (operation == 'confirm') {
        status = "CLOSED_CONFIRMED";
        title = "已确认订单";
      } else if (operation == 'cancel') {
        status = "CLOSED_CANCELED";
        title = "已取消订单";
      }
      app.webapi.confirmOrder(order_number, status, title)
        .then(res => {
          console.log("confirmOrder--res==", res)
          if (res.data.status_code == 0) {
            // res.data.message == "order.delete.success" && 
            wx.showToast({
              title: title,
              duration: 1000
            })
            that.data.pageNum = 1;
            that.getOrderList(that.data.navArr[that.data.lightIndex].status)
          } else {
            throw res
          }
        })
        .catch(res => {
          console.log("getOrderReminder--catch--res==", res)
          var title = res.data.message || '异常'
          wx.showToast({
            title: title,
            icon: "none",
            duration: 2000
          })
        })
    } else if (operation == 'express') {
      // 查看物流；
      var selOrder = that.data.orderList[index];
      // var express_number = selOrder.express_number;
      if (order_number) {
        app.utils.openPage2(`./express?order_number=${order_number}`)
      } else {
        wx.showToast({
          title: "找不到订单号",
          icon: "none",
          duration: 2000
        })
      }
    } else if (operation == 'delete') {
      // 删除订单；
      app.utils.promisify(wx.showModal)({ title: "提示", content: "确定删除订单吗？" })
        .then(res => {
          if (res.confirm) {
            app.webapi.delOrder(order_number)
              .then(res => {
                console.log("delOrder--res==", res)
                if (res.data.status_code == 0) {
                  wx.showToast({
                    title: '已删除订单',
                    duration: 1000
                  })
                  that.data.pageNum = 1;
                  that.getOrderList(that.data.navArr[that.data.lightIndex].status)
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: "none",
                    duration: 2000
                  })
                }
              })
              .catch(res => {
                console.log("delOrder--catch--res==", res)
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 2000
                })
              })
          }
        })
    } else if (operation == 'pay') {
      // 去支付；
      var order_price = that.data.orderList[index].total_price;
      var allianceData = app.globalData.allianceData;
      var payment_type = "WECHAT";
      console.log("addOrder--allianceData==", allianceData)
      console.log("addOrder--order_price==", order_price)
      if (allianceData) {
        if (allianceData.balance && allianceData.balance >= order_price) {
          that.setData({
            isWalletPay: true,
            selOrder: that.data.orderList[index]
          })
          return
        }
      }
      var post_data = {
        "order_type": "Order",
        "order_number": order_number,
        "type": "WXA"
      }
      app.webapi.wxPay(post_data)
        .then(res => {
          console.log("wxPay--res==", res)
          if (res.data.status_code === 0) {
            app.utils.promisify(wx.requestPayment)(res.data.data)
              .then(res => {
                console.log("wx.requestPayment--res==", res)
                iwx.hideLoading()
                if (res.errMsg === "requestPayment:fail cancel") {
                  wx.showToast({
                    title: '支付失败',
                    icon: "none"
                  })
                } else {
                  that.getOrderList(that.data.navArr[that.data.lightIndex].status)
                }
              })
              .catch(res => {
                console.log("wx.requestPayment--catch--res==", res)
              })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
        .catch(res => {
          console.log("wxPay--catch--res==", res)
        })
    } else if (operation == 'service') {
      that.setData({
        isService: true,
        selOrder: that.data.orderList[index]
      })
      // app.utils.promisify(wx.showModal)({ title: "提示", content: "确定退款吗？" })
      //   .then(res => {
      //     if (res.confirm) {
      //       that.serviceOrder(that.data.orderList[index])
      //     }
      //   })
    }
  },
  confirmOrder(order_number, status, title) {
    wx.showLoading({
      title: '',
    })
    app.webapi.confirmOrder(order_number, status)
      .then(res => {
        console.log("confirmOrder--res==", res)
        if (res.data.status_code == 0) {
          // res.data.message == "order.delete.success" && 
          wx.hideLoading()
          wx.showToast({
            title: title,
            duration: 1000
          })
          that.data.pageNum = 1;
          that.getOrderList(that.data.navArr[that.data.lightIndex].status)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("getOrderReminder--catch--res==", res)
        var message = res.data.message || '异常'
        wx.showToast({
          title: message,
          icon: "none",
          duration: 2000
        })
      })
  },
  serviceOrder(e) {
    console.log("serviceOrder--e==", e)
    var that = this;
    var selOrder = that.data.selOrder;
    var reason = "";
    if (!selOrder.order_number) {
      wx.showToast({
        title: "订单异常",
        icon: "none"
      })
      return
    }
    var reasonPicker = e.detail.value.reasonPicker;
    var other_reason = e.detail.value.other_reason;
    if (reasonPicker < 0 || (reasonPicker === 3 && !other_reason)) {
      wx.showToast({
        title: "请选择退款理由",
        icon: "none",
        duration: 2000
      })
      return;
    } else {
      if (reasonPicker === 3) {
        reason = other_reason
      } else {
        reason = that.data.reasonList[reasonPicker] + other_reason
      }
    }
    var returns = [];
    for (var i in selOrder.order_items) {
      returns.push({ 
        product_id: selOrder.order_items[i].product_id,
        quantity: selOrder.order_items[i].quantity
      })
    }
    var service_order_data = {
      order_number: selOrder.order_number,
      service_type: "REFUND", // RETURN: 退货退款, REFUND: 仅退款， EXCHANGE: 换货
      reason: reason,
      content: "",
      images: [],
      returns: returns
    }
    wx.showLoading({
      title: '',
    })
    app.webapi.serviceOrder(service_order_data)
      .then(res => {
        console.log("serviceOrder--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          app.getAllianceOrder()
          wx.showToast({
            title: "",
          })
        }
        that.onClose()
        that.getOrderList(that.data.navArr[that.data.lightIndex].status)
      })
      .catch(res => {
        console.log("serviceOrder--catch--res==", res)
        wx.hideLoading()
        that.onClose()
      })
  },
  payment: function(options) {
    console.log('order.js----payment---options', options)
    var order_number = options.currentTarget.dataset.orderNumber

    app.payment(order_number, function(res) {
      console.log('order.js----payment---res', res)

      this.getOrderList('')
    })
  },
  //点击导航调用该方法
  clickNav: function(event) {

    var that = this
    var lightIndex = event.currentTarget.dataset.index
    that.data.status = event.currentTarget.dataset.status
    that.data.pageNum = 1
    wx.showLoading({
      title: ''
    })
    that.data.orderList = []
    that.setData({
      lightIndex: lightIndex,
    })
    that.getOrderList(that.data.status)
  },
  // 请求订单列表数据；
  getOrderList(status, pageNum) {
    console.log('---------order-----getOrderList-----status', status)
    var that = this
    var status = status
    var navArr = that.data.navArr
    var pageNum = that.data.pageNum
    var pageSize = that.data.pageSize || 30
    if (status == '') {
      // 全部订单；
      status = ''
    } else {
      if (status == 'CONFIRMED_DELIVER_PENDING') {
        // delivering：待发货；
        status = '&status=CONFIRMED_DELIVER_PENDING&status=DELIVERING&status=PAID_CONFIRM_PENDING'
      } else if (status == 'DELIVERED_CONFIRM_PENDING') {
        // delivered: 待收货；
        status = '&status=DELIVERED_CONFIRM_PENDING&status=CANCELED_RETURN_PENDING&status=CONFIRMED_PICK_PENDING'
      } else if (status == 'CLOSED_CONFIRMED') {
        // status = '&status=' + status + '&commented=false'
        status = '&status=CLOSED_PAY_TIMEOUT&status=CLOSED_CANCELED&status=CLOSED_CONFIRMED&status=CLOSED_REFUNDED'
      } else {
        status = '&status=' + status
      }
    }
    var orderList = that.data.orderList
    if (!pageNum || pageNum === 1) {
      pageNum = 1
      orderList = []
    }
    wx.showLoading({
      title: '',
    })
    // + '&queryMarketing=false'
    var url = '/order?pageNumber=' + pageNum + '&pageSize=' + pageSize + status
    app.webapi.getOrder(url)
      .then(res => {
        console.log("getOrder--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status_code === 0) {
          that.data.total_page = res.data
          var orderList2 = orderList.concat(res.data.data)
          that.setData({
            orderList: orderList2,
            lightIndex: that.data.lightIndex,
            pageNum: pageNum
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          })
        }
      })
      .catch(res => {
        console.log("getOrder--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        })
      })
    // wx.request({
    //   url: app.globalData.URL_API + url,
    //   data: {},
    //   header: {
    //     "Authorization": app.globalData.token,
    //     "content-type": "application/json"
    //   },
    //   success(res) {
    //     console.log('orderListres--success--res==', res)
    //   },
    //   fail(res) {
    //     console.log('orderListres--fail--res==', res)
    //   }
    // });
    // app.wxRequest(url, {}, 'GET', that, function (res) {
		// 	console.log('order---res', res)
		// 	that.data.total_page = res.data
		// 	wx.hideLoading()
		// 	var orderList2 = orderList.concat(res.data.data)

		// 	console.log('orderListres', orderList)
		// 	that.setData({
		// 		orderList: orderList2,
		// 		lightIndex: that.data.lightIndex,
		// 		pageNum: pageNum
		// 	})
		// })
  },
  // 点击订单中间部分调用跳转；
  orderDetails: function(event) {
    console.log('orderDetails---event', event)
    var order_number = event.currentTarget.dataset.orderNumber
    var statusName = event.currentTarget.dataset.statusName
    // app.openPage('../evaluate/evaluate?order_number=' + order_number + '&statusName=' +statusName)
    app.utils.openPage2('./order-details?order_number=' + order_number)
  },
  // 取消订单；
  delOrder: function(event) {
    var that = this
    var order_number = event.currentTarget.dataset.orderNumber
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: function(result) {
        wx.request({
          url: app.globalData.URL_API + '/order/' + order_number,
          data: {},
          method: 'DELETE',
          header: {
            'Authorization': app.globalData.token,
            'content-type': 'json'
          },
          success: function(res) {
            console.log('delOrder----取消订单---res', res)
            wx.showToast({
              title: '已取消订单！',
              icon: 'success',
              duration: 500
            })
            that.getOrderList('')

          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('---------order-----onLoad-----options', options)
    wx.showLoading({
      title: ''
    })
    var navArr = this.data.navArr
    var status = options.status || ""
    if (status) {
      for (var i = 0; i < navArr.length; i++) {
        if (status === navArr[i].status) {
          this.data.lightIndex = i
          console.log("onLoad--this.data.lightIndex==", this.data.lightIndex)
          break
        }
      }
    }
    this.getOrderList(status)
    // this.getUsers()
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
    this.onClose()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.data.pageNum = 1;
    that.getOrderList(that.data.navArr[that.data.lightIndex].status)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    var pageNum = that.data.pageNum
    var pageSize = that.data.pageSize
    var orderList = that.data.orderList
    if (pageNum * pageSize == orderList.length) {
      pageNum += 1
      that.getOrderList(this.data.status, pageNum)
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})