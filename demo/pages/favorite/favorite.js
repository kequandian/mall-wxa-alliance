// favorite.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoriteArr: app.globalData.favoriteArr,
    startX: 0,
    itemLefts: []
  },

  // 点击商品跳转到详情页；
  getDetails: function (options){
    console.log('a11a1a1a1a1')
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + options.currentTarget.dataset.id
    })
  },

  // 加入购物车；
  addCart: function (event) {

    var _this = this
    var id = event.currentTarget.dataset.id

    wx.request({
      url: app.globalData.URL_API + '/shopping_cart?increase=true', //仅为示例，并非真实的接口地址
      data: [
        {
          'product_id': id,
          'quantity': 1
        }
      ],
      method: 'POST',
      header: {
        'Authorization': app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log("---favorite-----addCart------")
        console.log(res.data.data)

        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1500
        })
        // _this.setData({
        //   productList: res.data.data,
        //   deployView: !_this.data.deployView
        // })
      }
    })
  },

  // 手指触摸动作开始系统自动调用该方法；
  touchStart: function (e) {
    var startX = e.touches[0].clientX;
    this.setData({
      startX: startX,
      itemLefts: []
    });
  },
  // 手指触摸后移动系统自动调用该方法；
  touchMove: function (event) {
    var index = event.currentTarget.dataset.index     // 下标；
    console.log(1468254)
    console.log(event.touches)
    var movedX = event.touches[0].clientX         //  
    var distance = this.data.startX - movedX          // 移动的距离；
    var itemLefts = this.data.itemLefts               // 数组；
    itemLefts[index] = -distance

    this.setData({
      itemLefts: itemLefts
    })
  },
  // 手指触摸动作结束系统自动调用该方法；
  touchEnd: function(event) {
      var index = event.currentTarget.dataset.index
      var endX = event.changedTouches[0].clientX
      var distance = this.data.startX - endX

      var buttonWidth = 120

      if ( distance <=0 ) {
        distance = 0
      } else {
        if (distance >= buttonWidth / 2 ) {
          distance = buttonWidth
        } else {
          distance = 0
        }
      }
      var itemLefts = this.data.itemLefts
      itemLefts[index] = -distance
      this.setData({
        itemLefts: itemLefts
      })
  },
  
  delButton: function (event) {

    var _this = this
    var id = event.currentTarget.dataset.id

     wx.showModal({
      title: '提示',
      content: '确定取消收藏该商品吗？',
      success: function(result) {
        if (result.confirm) {
          wx.request({
            url: app.globalData.URL_API + '/product_favorite/' + id, //仅为示例，并非真实的接口地址
            data: {},
            method: 'DELETE',
            header: {
              'Authorization': app.globalData.token,
              'content-type': 'application/json'
            },
            success: function(res) {
              wx.showToast({
                title: '已取消收藏！',
                icon: 'success',
                duration: 1500
              })
              console.log("---favorite-----delButton------")
              console.log(res.data.data)
              _this.onLoad()

              // _this.setData({
              //   productList: res.data.data,
              //   deployView: !_this.data.deployView
              // })
            }
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var favoriteArr = app.globalData.favoriteArr
    // console.log(13456)
    // console.log(favoriteArr)
    // this.setData({
    //   favoriteArr: favoriteArr
    // })
    var _this = this
    app.getFavorite(function() {
      console.log('-----index----onshow-----')
      console.log(app.globalData.favoriteArr)
      _this.setData({
        favoriteArr: app.globalData.favoriteArr,
        itemLefts: []
      })
    });
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
  // onPullDownRefresh: function () {
  
  // },

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