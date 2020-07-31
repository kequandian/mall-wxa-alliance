// pages/personal/team/award.js
const app = getApp()
const nowDate = new Date()
const Y = nowDate.getFullYear()
const M = nowDate.getMonth() + 1
const D = nowDate.getDate()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fetch_date: "",
    end_date: Y+"-"+M,
    now_data: Y + "-" + M,
    sel_date: Y + "-" + M,
    monthAward: null
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  bindDateChange(e) {
    console.log('bindDateChange--e==', e)
    var that = this;
    that.getCashQuery(e.detail.value)
    that.setData({
      sel_date: e.detail.value
    })
  },
  getCashQuery(sel_date) {
    var that = this;
    if (!sel_date) {
      return;
    }
    wx.showLoading({
      title: '',
    })
    sel_date = sel_date + '-' + D
    app.webapi.getCashQuery(sel_date)
      .then(res => {
        console.log('getCashQuery--res==', res)
        if (res.data.status_code === 0) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          that.setData({
            monthAward: res.data.data
          })
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log('getCashQuery--catch--res==', res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message || '',
          icon: 'none',
          duration: 3000
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var allianceData = app.globalData.allianceData;
    console.log("allianceData==", allianceData)
    // if (allianceData) {
    //   that.setData({
    //     commissionOrder: allianceData.commissionOrder || [],
    //     allianceData: allianceData
    //   })
    // }
    if (that.data.sel_date) {
      that.getCashQuery(that.data.sel_date)
    } else {
      wx.showToast({
        title: '请选择年月',
        icon: 'none',
        duration: 3000
      })
    }
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
    var that = this;
    if (that.data.sel_date) {
      that.getCashQuery(that.data.sel_date)
    } else {
      that.getCashQuery(that.data.now_data)
    }
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