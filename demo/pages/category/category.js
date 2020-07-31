// categroy.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hitWord: [],
    categoryName: [],
    isHit: true,
    screenHeight: Math.ceil(getApp().screenHeight * 750.0 / getApp().screenWidth),
    lightIndex: 0,
    pageNum: 1,
    pageSize: 30,
    categoryData: [],
    productList: []
    // categoryImg: ['sthl.png', 'mbhl.png', 'kqhl.png', 'nxhl.png', 'xfxl.png', 'hfxl.png', 'wyqj.png', 'cfqj.png', 'jwqj.png', 'jjqj.png', 'myxh.png']
  },
  onTabItemTap(item) {
    console.log('category--onTabItemTap--item==', item)
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  // 点击商品调用该函数跳转详情页；
  // getDetails: function (options) {
  //   console.log('a11a1a1a1a1')
  //   console.log(options.currentTarget.dataset.id)
  //   wx.navigateTo({
  //     url: '../details/details?id=' + options.currentTarget.dataset.id
  //   })
  // },
  getData: function(url, key) {
    var that = this
    console.log(key)
  },
  selCategory(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    if (index != that.data.lightIndex) {
      that.data.pageNum = 1
      // if (id === -1) {
      //   that.getAllProduct()
      // } else {
      //   that.getProduct(id)
      // }
      that.getProduct(id)

      that.setData({
        lightIndex: index
      })
    }
  },

  // 点击搜索框调用该方法；
  onSearch: function(event) {
    var url = ''
    console.log('-------categroy-----onSearch---')
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
  getCategory(id) {
    var that = this
    var lightIndex = that.data.lightIndex
    console.log('that.data.lightIndex==', that.data.lightIndex)
    var categoryData = []
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.getCategory()
      .then(res => {
        console.log("getCategory--res==11111", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          if (res.data.data) {
            categoryData = categoryData.concat(res.data.data)
            that.data.lightIndex = 0;
            if (id) {
              categoryData.map((item, index) => {
                if (item.id === id) {
                  that.data.lightIndex = index;
                  return false;
                }
              })
            }
            app.globalData.categoryData = categoryData
            that.data.pageNum = 1
            // that.getAllProduct()
            that.getProduct(categoryData[that.data.lightIndex].id)
          }
          // that.getProduct(res.data.data[lightIndex].id)
        }
        wx.setStorageSync('categoryData', categoryData)
        that.setData({
          categoryData: categoryData
        })
      })
      .catch(res => {
        wx.hideLoading()
        console.log("getCategory--catch--res==", res)
        wx.setStorageSync('categoryData', [])
      })
  },
  getAllProduct() {
    var that = this;
    var productList = that.data.productList;
    var pageNum = that.data.pageNum || 1;
    var pageSize = that.data.pageSize || 30;
    if (!pageNum || pageNum === 1){
      pageNum = 1;
      productList = [];
    }
    wx.showLoading({
      title: '加载中',
    })
    app.webapi.getAllProduct(pageNum, pageSize)
      .then(res => {
        console.log("getAllProduct--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          productList = productList.concat(res.data.data)
        }
        wx.stopPullDownRefresh()
        that.setData({
          productList: productList,
          pageNum: pageNum
        })
      })
      .catch(res => {
        console.log("getAllProduct--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        that.setData({
          productList: productList
        })
      })
  },
  getProduct(id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var pageNum = that.data.pageNum
    var pageSize = that.data.pageSize
    app.webapi.getProduct(id, pageNum, pageSize)
      .then(res => {
        console.log("getProduct--res==", res)
        wx.hideLoading()
        var productList = that.data.productList
        if (res.data.status_code === 0) {
          if (pageNum > 1) {
            productList = productList.concat(res.data.data.products)
          } else {
            productList = res.data.data.products
          }
          console.log("productList==", productList)
          that.setData({
            productList: productList
          })
        }
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        console.log("getProduct--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("categroy--onLoad--options==", options)
    var that = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('categroy--onReady--')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    console.log('categroy--onShow--app.globalData.selFriend==', app.globalData.selFriend)
    var categoryData = wx.getStorageSync('categoryData')
    console.log("categroy--onshow--wx.getStorageSync('categoryData')==", categoryData)
    wx.showTabBar()
    if (!categoryData || !categoryData.length) {
      that.getCategory()
    } else {
      // that.getAllProduct()
      that.getProduct(categoryData[that.data.lightIndex].id)
    }
    that.setData({
      categoryData: categoryData,
      pageNum: 1,
      judgeAlliances: app.globalData.judgeAlliances
    })
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
    console.log('category--onUnload==', that.data.lightIndex)
    that.setData({
      lightIndex: 0
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("category--onPullDownRefresh--")
    // wx.showLoading({
    //   title: '刷新',
    // })
    var that = this;
    that.data.pageNum = 1;
    that.getCategory(that.data.categoryData[that.data.lightIndex].id)
    
    // that.getProduct(that.data.categoryData[that.data.lightIndex].id)

    // if (that.data.categoryData[that.data.lightIndex].id === -1) {
    //   that.getAllProduct()
    // } else {
    //   that.getProduct(that.data.categoryData[that.data.lightIndex].id)
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("category--onReachBottom--")
    var that = this;
    that.data.pageNum += 1;
    console.log('category--that.data.pageNum==', that.data.pageNum)
    that.getProduct(that.data.categoryData[that.data.lightIndex].id)
    // wx.showLoading({
    //   title: '加载',
    // })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})