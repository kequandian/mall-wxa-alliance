// pages/friend/friend.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact_phone: null,
    activeName: "",
    orderList: [],
    pageNum: 1,
    pageSize: 30
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  openPage(e) {
    console.log("openPage--e==", e)
    app.utils.openPage(e)
  },
  // 请求订单列表数据；
  getOrderList: function (contact_phone) {
    wx.showLoading({
      title: '',
    })
    var that = this
    var status = status
    var navArr = that.data.navArr
    var pageNum = that.data.pageNum || 1
    var pageSize = that.data.pageSize || 30
    /*if (status == '') {
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
        status = '&status=' + status + '&commented=false'
      } else {
        status = '&status=' + status
      }
    }*/
    var orderList = that.data.orderList
    if (!pageNum) {
      pageNum = 1
      orderList = []
    }
    // + '&queryMarketing=false'
    var url = '/order?pageNumber=' + pageNum + '&pageSize=' + pageSize
    if (contact_phone) {
      url = url + "&contact_phone=" + contact_phone
    }
    app.webapi.getOrder(url)
      .then(res => {
        console.log("getOrder--res==", res)
        wx.hideLoading()
        that.data.total_page = res.data
        var orderList2 = orderList.concat(res.data.data)
        wx.stopPullDownRefresh()
        that.setData({
          orderList: orderList2,
          lightIndex: that.data.lightIndex,
          pageNum: pageNum
        })
      })
      .catch(res => {
        console.log("getOrder--catch--res==", res)
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("friend--order--onLoad--options==", options)
    if (options && options.contact_phone) {
      this.getOrderList(options.contact_phone)
      this.setData({
        contact_phone: options.contact_phone
      })
    }
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
    console.log("friend--onPullDownRefresh")
    this.data.pageNum = 1
    this.getOrderList(this.data.contact_phone)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("friend--onReachBottom")
    var that = this
    var pageNum = that.data.pageNum
    var pageSize = that.data.pageSize
    var orderList = that.data.orderList
    if (pageNum * pageSize == orderList.length) {
      pageNum += 1
      that.getOrderList(this.data.contact_phone)
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
  onShareAppMessage: function () {

  }
})