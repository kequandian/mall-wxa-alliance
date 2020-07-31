// pages/apply-back/apply-back.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*order: {
      goods: [{
          id: 1,
          cover: '../../images/800.png',
          name: 'LUX力士 恒久嫩肤娇肤沐浴乳1升'
        },
        {
          id: 1,
          cover: '../../images/800.png',
          name: 'LUX力士 恒久嫩肤娇肤沐浴乳1升'
        },
      ],
      price: 68.00
    },
    apply: {
      goods: [{
          id: 1,
          img: '../../images/800.png'
        },
        {
          id: 1,
          img: '../../images/800.png'
        },
        {
          id: 1,
          img: '../../images/800.png'
        },
      ],
      status: 1
    },*/
    order: null,
    apply: null,
    showPopup: false,
    showServicePopup: true,
    defaultData: {
      order_number: "",
      service_type: "",
      reason: "",
      content: "",
      images: [],
      returns: [],
      exchanges: []
    },
    formData: {
      service_type: "",
    },
  },
  selService(e) {
    var that = this;
    var formData = that.data.formData;
    formData.service_type = e.currentTarget.dataset.serviceType
    that.setData({
      formData: formData
    })
  },
  closePopup(e) {
    this.setData({
      showPopup: !this.data.showPopup
    })
  },
  showPopup(e) {
    this.setData({
      showPopup: !this.data.showPopup
    })
  },

  formSubmit(e) {
    console.log('formSubmit--e==', e)
  },
  delImg(e) {
    console.log("删除")
    // var index = event.currentTarget.dataset.index
  },

  update(e) {
    console.log("上传")
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
        wx.stopPullDownRefresh()
        if (res.data.status_code === 0) {
          var products = []
          var order_items = res.data.data.order_items
          for (var i in res.data.data.order_items) {
            products.push({
              mark: 5,
              uploadImg: [],
              content: ''
            })
          }
          if (res.data.data.status === "CONFIRMED_DELIVER_PENDING") {
            that.data.formData.service_type = "REFUND"
          }
          that.setData({
            order: res.data.data,
            products: products,
            formData: that.data.formData
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
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getOrderDetails(options.order_number)
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
    that.setData({
      formData: that.data.defaultData
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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