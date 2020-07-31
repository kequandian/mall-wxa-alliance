// details.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: "",
    quantity: 1,
    inShow: false,
    deployView: true,
    animationData: {},
    productData: {cover: '../../images/cart.jpg'},
    selectIndex: -1,
    product_specification_id: -1
  },
  getInputBlur(e) {
    console.log("getInput--e==", e)
    var that = this;
    var layer = e.currentTarget.dataset.layer;
    var value = e.detail.value;
    if (layer === "quantity") {
      var quantity = 1;
      if (that.data.productData.stock_balance) {
        if (parseInt(value) <= 0) {
          wx.showToast({
            title: "数量不能小于1",
            icon: "none"
          })
        } else if (parseInt(value) <= that.data.productData.stock_balance) {
          quantity = parseInt(value)
        } else {
          quantity = that.data.productData.stock_balance
        }
        that.setData({
          quantity: quantity
        })
      } else {
        that.setData({
          quantity: 0
        })
      }
    }
  },
  getHeight(e) {
    var that = this
    var width = wx.getSystemInfoSync().windowWidth
    //获取可使用窗口宽度
    var imgheight = e.detail.height
    //获取图片实际高度
    var imgwidth = e.detail.width
    //获取图片实际宽度
    var height = width * imgheight / imgwidth + "px"
    //计算等比swiper高度
    that.setData({
      imgHeight: height
    })
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  // 点击收藏调用该方法；
  favorite: function (event) {
    var that = this
    var id = parseInt(event.currentTarget.dataset.id)
    console.log(id)
    var favorite = !that.data.favorite

    if ( favorite ) {
      // 添加收藏；
      wx.request({
        url: app.globalData.URL_API + '/product_favorite', //仅为示例，并非真实的接口地址
        data: {
          'product_id': id
        },
        method: 'POST',
        header: {
          'Authorization': app.globalData.token,
          'content-type': 'json'
        },
        success: function (res) {
          that.setData({
            favorite: favorite
          })
        }
      });
    } else {
      // 取消收藏；
      wx.request({
        url: app.globalData.URL_API + '/product_favorite/' + id, //仅为示例，并非真实的接口地址
        data: {
        },
        method: 'DELETE',
        header: {
          'Authorization': app.globalData.token,
          'content-type': 'json'
        },
        success: function (res) {
          that.setData({
            favorite: favorite
          })
        }
      });
    }
  },

  // 点击 加入购物车，立即购买 弹出窗口；
  openDeploy: function (event) {
    var that = this
    // var animation = wx.createAnimation({
    //   duration: 2000,
    //   timingFunction: 'ease',
    // })
    // this.animation = animation
    // animation.translate(0,0).step()
    if (!app.globalData.token || !app.globalData.judgeAlliances) {
      app.utils.openPage2('../register/index')
      return
    }
    that.setData({
      quantity: 1,
      inShow: true,
      deployView: !that.data.deployView,
      button: event.currentTarget.dataset.button,
      // animationData: animation.export()
    })
  },
  reduce: function (event) {
    if (this.data.quantity>1) {
      this.data.quantity = this.data.quantity - 1
    } else {
      wx.showToast({
        title: '不能再少了！',
        duration: 500
      })
      this.data.quantity = 1
    }
    this.setData({
      quantity: this.data.quantity
    })
  },
  add: function (event) {
    if (this.data.quantity<this.data.productData.stock_balance) {
      this.data.quantity = this.data.quantity + 1
    } else {
      wx.showToast({
        title: '库存就这些了！',
        duration: 500
      })
      this.data.quantity = productData.stock_balance
    }
    
    this.setData({
      quantity: this.data.quantity
    })
  },
  //点击输入框调用防止跳转；
  prevent: function () {
    // 什么都不用做；
  },
  cartCount() {
    var that = this
    var cart = wx.getStorageSync("cart")
    var cartCount = 0;
    if (cart && cart.length) {
      cart.map(item => {
        cartCount += 1;
      })
    }
    console.log("cartCount--cartCount==", cartCount)
    that.setData({
      cartCount: cartCount
    })
  },
  addCart: function (event) {
    console.log('details.js--addCart--')
    var id = parseInt( event.currentTarget.dataset.id )
    var that = this
    if (!that.data.quantity || that.data.quantity < 1) {
      wx.showToast({
        title: "数量不能小于1",
        icon: "none",
        duration: 2000
      })
      return;
    }
    var post_data = [{ product_id: id, quantity: that.data.quantity }]
    app.webapi.updateCarts(true, post_data)
      .then(res => {
        console.log("updateCart--res==", res)
        if (res.data.status_code === 0){
          wx.setStorageSync("cart", res.data.data)
          wx.showToast({
            title: '已加入购物车',
            duration: 1500
          })
          that.setData({
            productList: res.data.data,
            deployView: !that.data.deployView,
            inShow: false,
            cart: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1500
          })
        }
      })
      .catch(res => {
        console.log("updateCart--catch--res==", res)
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1500
        })
      })
  },

  // 立即购买下订单；
  buyNow: function(e) {
    console.log("buyNow--e==", e)
    var that = this;
    var id = e.currentTarget.dataset.id
    // var quantity = this.data.quantity
    // var products = [
    //   { product_id: id, quantity: quantity}
    // ]
    var productData = that.data.productData
    var products = [{
      product_id: productData.id,
      quantity: that.data.quantity,
      price: that.data.judgeAlliances ? productData.price : productData.suggested_price,
      fare_id: productData.fare_id,
      weight: productData.weight,
      bulk: productData.bulk,
      product_specification_id: null,
      product_specification_name: null,
      product_name: productData.name,
      stock_balance: productData.stock_balance,
      cover: productData.cover,
      credit: productData.credit,
    }]
    products = JSON.stringify(products)
    app.utils.openPage2('../addOrder/addOrder?origin=details&products=' + products)
    // app.utils.openPage2('../order/sub-order?products=' + products)
    // var productsStr = JSON.stringify(products)
    // app.utils.openPage2('../addOrder/addOrder?products=' + productsStr)
    that.setData({
      inShow: false
    })
  },

  closeDeploy: function(event) {
    this.setData({
      inShow: false
    })
  },
  selectStandrd: function (event) {
    var selectIndex = event.currentTarget.dataset.index
    this.data.product_specification_id = event.currentTarget.dataset.id

    this.setData({
      selectIndex: selectIndex
    })
  },
  getProductDetail(id) {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.webapi.getProductDetail(id)
      .then(res => {
        if (res.data.status_code === 0) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          that.data.description = res.data.data.description
          var description = res.data.data.description
          WxParse.wxParse('description', 'html', description, that, 5);
          console.log("res.data.data == res.data.data ==", res.data.data)
          wx.stopPullDownRefresh()
          that.setData({
            productData: res.data.data,
            inShow: that.data.inShow
          })
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log("getProductDetail--catch--res==", res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        var title = res.data.message;
        if (res && res.data.message === 'product.is.offsell') {
          title = "该商品已下架"
        }
        wx.showModal({
          title: '提示',
          content: title,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              app.utils.openPage2(1, 'back')
            }
          }
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('details--onLoad--options==', options)
    // var favoriteArr = app.globalData.favoriteArr
    // var favorite = false;
    // for ( var i=0; i<favoriteArr.length; i++ ) {
    //   if ( favoriteArr[i].id == parseInt(options.id) ) {
    //     favorite = true
    //     break
    //   }
    // }
    var that = this
    var description = ''
    wx.showLoading({
      title: '',
    })
    var id = null;
    if (options && options.id) {
      id = options.id
    }
    that.getProductDetail(id)
    that.setData({
      id: id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this
    console.log('details--onshow--options==', options)
    var cart = wx.getStorageSync("cart")
    console.log("details--onshow--cart==", cart)
    that.setData({
      cart: cart,
      judgeAlliances: app.globalData.judgeAlliances
    })
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
      inShow: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.getProductDetail(that.data.id)
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