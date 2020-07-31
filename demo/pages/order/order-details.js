var app = getApp()
Page({

  /*页面的初始数据*/
  data: {
    statusArr: [{
      status: 'CREATED_PAY_PENDING',
      name: '待支付'
    }, {
      status: 'CLOSED_PAY_TIMEOUT',
      name: '支付超时关闭'
    }, {
      status: 'CLOSED_CANCELED',
      name: '已取消'
    }, {
      status: 'PAID_CONFIRM_PENDING',
      name: '已支付'
    }, {
      status: 'CONFIRMED_DELIVER_PENDING',
      name: '待发货'
    }, {
      status: 'DELIVERING',
      name: '发货中'
    }, {
      status: 'DELIVERED_CONFIRM_PENDING',
      name: '已发货'
    }, {
      status: 'CANCELED_RETURN_PENDING',
      name: '待退货'
    }, {
      status: 'CLOSED_CONFIRMED',
      name: '已确认收货'
    }, {
      status: 'CANCELED_REFUND_PENDING',
      name: '待退款'
    }, {
      status: 'CLOSED_REFUNDED',
      name: '已退款'
    }],
    order: null,
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
  serviceOrder(e) {
    console.log("serviceOrder--e==", e)
    var that = this;
    var selOrder = that.data.order;
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
            title: '申请成功',
            duration: 2000
          })
          that.onClose()
          that.getOrderDetails(that.data.order_number)
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("serviceOrder--catch--res==", res)
        wx.hideLoading()
        that.onClose()
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000
        })
      })
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
      isWalletPay: false,
      passwordInput: '',
      isService: false,
      serviceReason: "",
      reasonIndex: -1
    })
  },
  walletPay(e) {
    var that = this;
    app.walletPay(e, that.data.order, 'details', function(res) {
      console.log("walletPay--res==", res)
      that.getOrderDetails(that.data.order_number)
      that.onClose()
    })
  },
  orderBtn: function(event) {
    console.log('orderBtn---event', event)
    var that = this
    var operation = event.currentTarget.dataset.operation
    var order_number = event.currentTarget.dataset.orderNumber
    if (operation == 'reminder') {
      // console.log('DELIVERED_CONFIRM_PENDING')
      app.webapi.getOrderReminder(order_number)
        .then(res => {
          console.log("getOrderReminder--res==", res)
          if (res.data.message == "order.deliver.reminded" && res.data.status_code == 0) {
            wx.showToast({
              title: '已提醒发货',
              icon: 'success',
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
    } else if (operation == 'express') {
      // 查看物流；
      if (order_number) {
        app.utils.openPage2(`./express?order_number=${order_number}`)
      } else {
        wx.showToast({
          title: "找不到快递单号",
          icon: "none",
          duration: 2000
        })
      }
    } else if (operation == 'delete') {
      app.utils.promisify(wx.showModal)({ title: "提示", content: "确定删除订单吗？" })
        .then(res => {
          console.log("删除订单--showModal--res==", res)
          if (res.confirm) {
            console.log("执行删除")
            app.webapi.delOrder(order_number)
              .then(res => {
                console.log("delOrder--res==", res)
                if (res.data.message == "order.delete.success" && res.data.status_code == 0) {
                  wx.showToast({
                    title: '已删除',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function () {
                    app.utils.openPage2(1, 'back')
                  }, 1000)
                }
              })
              .catch(res => {
                console.log("delOrder--catch--res==", res)
              })
          }
        })
    } else if (operation == 'pay') {
      var order_price = that.data.order.total_price;
      var allianceData = app.globalData.allianceData;
      console.log("addOrder--allianceData==", allianceData)
      console.log("addOrder--order_price==", order_price)
      if (allianceData) {
        if (allianceData.balance && allianceData.balance >= order_price) {
          that.setData({
            isWalletPay: true
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
                if (res.data.status_code === 0) {
                  wx.showToast({
                    title: '支付成功',
                  })
                  that.getOrderDetails(that.data.order_numberr)
                }
              })
              .catch(res => {
                console.log("wx.requestPayment--catch--res==", res)
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 1000
                })
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
      app.webapi.confirmOrder(order_number, status)
        .then(res => {
          console.log("confirmOrder--res==", res)
          if (res.data.status_code == 0) {
            // res.data.message == "order.delete.success" && 
            wx.showToast({
              title: title,
              duration: 1000
            })
            that.data.pageNum = 1;
            if (status = "CLOSED_CANCELED") {
              setTimeout(() => {
                app.utils.openPage2(1, 'back')
              }, 1000)
            } else if (status = "CLOSED_CONFIRMED") {
              that.getOrderDetails(order_numberr)
            }
          }
        })
        .catch(res => {
          console.log("confirmOrder--catch--res==", res)
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000
          })
        })
    } else if (operation == 'evaluate') {

    } else if (operation == 'service') {
      that.setData({
        isService: true
      })
    } else {

    }
  },
  openPage(e) {
    this.onClose()
    app.utils.openPage(e)
  },

  getOrderDetails(order_number) {
    var that = this
    wx.showLoading({
      title: '',
    })
    app.webapi.getOrderDetails(order_number)
      .then(res => {
        console.log("getOrderDetails--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          var product_price = 0
          if (res.data.data.order_items.length > 0) {
            var order_items = res.data.data.order_items
            for (var i in order_items) {
              product_price += order_items[i].final_price
            }
          }
          wx.stopPullDownRefresh()
          that.setData({
            order: res.data.data,
            product_price: parseFloat(product_price).toFixed(2)
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
        console.log("getOrderDetails--catch--res==", res)
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        })
        wx.stopPullDownRefresh()
      })
    /*app.wxRequest('order/' + order_number, {}, 'GET', that, function(res) {
        console.log('getOrderDetails---res', res)
        var product_price = 0
        if (res.data.data.order_items.length > 0) {
            var order_items = res.data.data.order_items
            for (var i in order_items) {
                product_price += order_items[i].final_price
            }
        }
        that.setData({
            order: res.data.data,
            product_price: parseFloat(product_price).toFixed(2)
        })
    })*/
  },
  //  * 生命周期函数--监听页面加载

  onLoad: function(options) {
    console.log('order-details----options', options)
    if (options && options.order_number && options.order_number != "undefined") {
      this.data.order_number = options.order_number
      this.getOrderDetails(options.order_number)
    } else {
      wx.showModal({
        title: '提示',
        content: '没有找到改订单,返回上一页',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            var pages = getCurrentPages()
            if (pages.length > 1) {
              app.utils.openPage2(1, "back")
            } else {
              app.utils.openPage2("../alliance/index", "switchTab")
            }
          }
        }
      })
    }
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
    var that = this;
    that.onClose()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getOrderDetails(this.data.order_number)
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