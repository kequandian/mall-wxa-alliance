// grhl.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: []
  },

  // 点击商品调用该函数跳转详情页；
  getDetails: function(options) {
    console.log('a11a1a1a1a1')
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + options.currentTarget.dataset.id
    })
  },

  ClickHeaderMenu: function(event) {
    var id = event.currentTarget.dataset.menuId
    var index = event.currentTarget.dataset.menuIndex
    var categoryDat = app.globalData.categoryDat
    this.getProductData(id)
    this.setData({
      lightIndex: index
    })
  },

  /*-----------------------------------------------*/
  selCategory(e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    if (index != this.data.lightIndex) {
      this.data.pageNum = 1
      this.getProduct(id)
      this.setData({
        lightIndex: index
      })
    }
  },

  // 点击搜索框调用该方法；
  OnSearch: function(event) {
    var url = ''
    console.log('-------categroy-----Onsearch---')
    if (event.currentTarget.dataset.id) {
      url = '../search/search?id=' + event.currentTarget.dataset.id + '&title=' + event.currentTarget.dataset.name + '&isHit=false'
      console.log(url)
    } else {
      url = "../search/search?isHit=" + this.data.isHit
    }
    console.log(event)
    console.log(this.data.isHit)
    wx.navigateTo({
      url: url
    })
  },
  // 点击左边分类；
  clickLeft: function(event) {
    var lightIndex = event.currentTarget.dataset.index
    this.setData({
      lightIndex: lightIndex
    })
  },
  getCategory() {
    app.webapi.getCategory()
      .then(res => {
        console.log("getCategory--res==", res)
        if (res.data.status_code === 0) {
          var categoryData = [{
            id: -1,
            name: '全部'
          }]
          this.data.categoryData = categoryData.concat(res.data.data)
          app.globalData.categoryData = res.data.data
          this.data.pageNum = 1
          this.getProduct(res.data.data[lightIndex].id)
        }
        _this.setData({
          categoryData: res.data.data
        })
      })
      .catch(res => {
        console.log("getCategory--catch--res==", res)
      })
  },
  getProduct(id) {
    wx.showLoading({
      title: '加载中',
    })
    var pageNum = this.data.pageNum
    var pageSize = this.data.pageSize
    app.webapi.getProduct(id, pageNum, pageSize)
      .then(res => {
        console.log("getProduct--res==", res)
        wx.hideLoading()
        var productList = this.data.productList
        if (res.data.status_code === 0) {
          if (pageNum > 1) {
            productList = productList.concat(res.data.data.products)
          } else {
            productList = res.data.data.products
          }
          this.setData({
            productList: productList
          })
        }
      })
      .catch(res => {
        console.log("getProduct--catch--res==", res)
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("product--onLoad--options==", options)
    if (options && options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    this.setData({
      loadOptions: options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    console.log('product--onshow--options==', options)
    console.log('product--onShow--app.globalData.categoryData==', app.globalData.categoryData)
    console.log('product--onShow--this.data.loadOptions==', this.data.loadOptions)
    var categoryData = app.globalData.categoryData
    if (!categoryData || categoryData.length == 0) {
      this.getCategory()
    } else {
      if (categoryData[0].id != -1) {
        var defaultData = [{
          id: -1,
          name: "全部"
        }]
        categoryData = defaultData.concat(app.globalData.categoryData)
        this.getProduct(this.data.loadOptions.id)
      }
      this.setData({
        categoryData: categoryData,
        lightIndex: parseInt(this.data.loadOptions.index) + 1
      })
    }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("product--onPullDownRefresh--")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("product--onReachBottom--")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})