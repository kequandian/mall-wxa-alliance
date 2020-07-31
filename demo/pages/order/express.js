// pages/express/express.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    express: null,
    selIndex: 0
  },
  selExpress(e) {
    var that = this;
    console.log('selExpress--e==', e);
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    if (that.data.selIndex !== index) {
      that.getOrderExpress(id);
      that.setData({
        selIndex: index
      })
    }
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
          wx.hideLoading()
          wx.stopPullDownRefresh()
          that.setData({
            order: res.data.data,
            selIndex: 0
          })
          if (res.data.data.express_list && res.data.data.express_list.length) {
            that.getOrderExpress(res.data.data.express_list[0].id)
          }
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
        wx.hideLoading()
      })
  },
  getExpressInfo(order_number, express_number) {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.webapi.getExpressInfo(order_number, express_number)
      .then(res => {
        console.log("getExpressInfo--res==", res)
        if (res.data.status_code === 0) {
          // if (res.data.data) {
          //   that.getExpressCompanys(res.data.data.company)
          // }
          // var express = res.data.data;
          // for (var i in express.path_item_list) {
          //   express.path_item_list[i].action_time_s = app.utils.dateTimeFormatter(express.path_item_list[i].action_time)
          // }
          that.setData({
            express: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        console.log("getExpressInfo--catch--res==", res)
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  getOrderExpress(id) {
    var that = this;
    console.log('getOrderExpress--that.data.order==', that.data.order);
    wx.showLoading({
      title: '',
    })
    app.webapi.getOrderExpress(id)
      .then(res => {
        console.log("getOrderExpress--res==", res)
        if (res.data.status_code === 0) {
          that.setData({
            express: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        console.log("getExpressInfo--catch--res==", res)
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("express--onLoad--options==", options)
    var that = this;
    if (options && options.order_number) {
      that.getOrderDetails(options.order_number)
      // that.getOrderExpress(options.order_number)
      // that.getExpressInfo(options.order_number)
      that.setData({
        order_number: options.order_number
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '没有找到该改订单物流,返回上一页',
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
      that.setData({
        order_number: "",
        express_number: ""
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
    var that = this;
    // var express = that.data.express;
    // for (var i in express.path_item_list) {
    //   express.path_item_list[i].action_time_s = app.utils.dateTimeFormatter(express.path_item_list[i].action_time)
    // }
    // console.log("onshow--express==", express)
    // that.setData({
    //   express: express
    // })
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
    this.setData({
      express: null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderDetails(this.data.order_number)
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