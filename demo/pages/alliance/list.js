// pages/alliance/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 30,
    searchValue: '',
    total_page: 1,
    alliancList: [] 
  },
  onTabItemTap(item) {
    if (!app.globalData.token || !app.globalData.judgeAlliances) {
      app.utils.openPage2('../register/index', 'redirect')
      return
    }
  },
  bindinput(e) {
    console.log("bindinput--e==", e)
    var that = this
    var value = e.detail.value
    if (value && value.trim()) {
      that.setData({
        searchValue: value.trim()
      })
    } else {
      value = ""
    }
    that.setData({
      searchValue: value
    })
    that.getAlliances()
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  getAlliances(pageNum) {
    var that = this
    wx.showLoading({
      title: ""
    })
    var alliancList = that.data.alliancList
    if (!pageNum || pageNum === 1) {
      pageNum = 1;
      alliancList = [];
    }
    var pageSize = this.data.pageSize || 30
    app.webapi.getAlliances(pageNum, pageSize, that.data.searchValue)
      .then(res => {
        console.log("getAlliances--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          that.data.alliancList = alliancList.concat(res.data.data.records)
          that.data.total_page = res.data.data.page || 1
        }
        wx.stopPullDownRefresh()
        that.setData({
          alliancList: that.data.alliancList,
          pageNum: pageNum,
          total_page: that.data.total_page
        })
      })
      .catch(res => {
        console.log("getAlliances--catch--res==", res)
        wx.stopPullDownRefresh()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlliances()
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
    this.data.pageNum = 1
    this.getAlliances()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageNum < this.data.total_page) {
      this.data.pageNum += 1;
      this.getAlliances(this.data.pageNum)
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})