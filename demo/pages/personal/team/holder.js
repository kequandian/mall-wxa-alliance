// pages/personal/holder/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    holder: {
      total_bonus: 24000,
      start_time: "2019-01-01",
      end_time: "2019-10-02",
      holder_num: 50,
      team_ratio: 0.1,
      mean_bonus: 4000,
      team_bonus: 20000,
    },
    allianceData: "",
    valueWidth: 0
  },
  getAllianceOrder() {
    var that = this
    wx.showLoading({
      title: '',
    })
    app.getAllianceOrder((allianceData) => {
      console.log('alliance--allianceData==', allianceData)
      wx.hideLoading()
      wx.stopPullDownRefresh()
      that.setData({
        allianceData: allianceData
      })
    })
  },

  /**
   * 判断总人数和占比背景圆圈显示大小
   * sCount 总人数数值
   * pCount 占比数值
   */
  widthCount(sCount, pCount) {
    console.log('widthCount--sCount==', sCount);
    console.log('widthCount--pCount==', pCount);
    var that = this;
    var count = 0;
    if (sCount > pCount){
      count = sCount * 60
    } else {
      count = pCount * 60
    }

    this.setData({
      valueWidth: count
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
    this.allianceData = app.globalData.allianceData;
    const a = 0.7;
    var sCount = this.allianceData.stockholderCount.toString().length;
    // var pCount = this.allianceData.proportion.toString().length;
    var pCount = a.toString().length;
    that.widthCount(sCount, pCount);
    that.getAllianceOrder()
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
    that.getAllianceOrder()
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