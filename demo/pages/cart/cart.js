// cart.js
  var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    select: false,
    payment: 0,
    allSelect: false,
    startX: 0,
    itemLefts: [],
    selectIcon: [],
    selectNum: 0,
    selCartJson: app.globalData.selCartJson || {}
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  // 点击商品调用该函数跳转详情页；
  getDetails: function (options){
    console.log('a11a1a1a1a1')
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + options.currentTarget.dataset.id
    })
  },
  select: function (event) {
    var payment = 0
    var productList = this.data.productList

    var selectArr = event.detail.value

    if ( event.detail.value.length < productList.length ) {
      this.data.allSelect = ''
    } else {
      this.data.allSelect = 'true'
    }

    for ( var i=0; i<selectArr.length; i++ ) {
      console.log(selectArr)
      console.log(789)
      // console.log(selectArr[i])

      payment += productList[selectArr[i]].quantity * productList[selectArr[i]].price
    }

    this.setData({
      allSelect: this.data.allSelect,
      payment: payment
    })
  },

  // " - " 调用该方法减少数量；
  reduce: function (event) {
    var index = parseInt(event.currentTarget.dataset.index)

    var productList = this.data.productList

    productList[index].quantity = productList[index].quantity - 1

    // 请求修改数量；
    this.setProduct(productList[index])
    // 合计随着数量改变而改变；
    this.computePayment()

  },
  // " + " 调用该方法增加数量；
  add: function (event) {
    var index = parseInt(event.currentTarget.dataset.index)

    var productList = this.data.productList

    productList[index].quantity = productList[index].quantity + 1

    // 请求修改数量；
    this.setProduct(productList[index])
    // 合计随着数量改变而改变；
    this.computePayment()

  },
  //点击输入框调用防止跳转；
  prevent: function () {
    // 什么都不用做；
  },
  // 输入框修改数量；
  changeInput: function (event) {

    var index = event.currentTarget.dataset.index
    var productList = this.data.productList
    productList[index].quantity = parseInt(event.detail.value)
    this.setProduct(productList[index])
  },
  // 点击删除按钮调用该方法；
  delButton: function (event) {
    var index = event.currentTarget.dataset.index
    var productList = this.data.productList
    productList[index].quantity = 0
    this.setProduct(productList[index])
  },

  // 发送请求修改购物车中商品数量 或 删除；
  setProduct: function(product) {
    var that = this
    wx.showLoading({
      title: '',
    })
    var post_data = [{ product_id: product.product_id, quantity: product.quantity }]
    app.webapi.updateCarts(false, post_data)
      .then(res => {
        console.log("updateCart--res==", res)
        wx.hideLoading()
        if (res.data.status_code === 0) {
          wx.setStorageSync("cart", res.data.data)
          if (product.quantity === 0){
            wx.showToast({
              title: '已删除',
            })
          }
          that.setData({
            productList: res.data.data,
            itemLefts: []
          })
        } else {
        }
      })
      .catch(res => {
        console.log("updateCart--catch--res==", res)
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
    // wx.request({
    //   url: app.globalData.URL_API + '/shopping_cart?increase=false', //仅为示例，并非真实的接口地址
    //   data: [{
    //     'product_id': product.product_id,
    //     'quantity': product.quantity
    //   }],
    //   method: 'POST',
    //   header: {
    //     'Authorization': app.globalData.token,
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     // for (var i=0; i<res.data.data.length; i++) {
    //     //   res.data.data[i].selected = false
    //     // }
    //     // console.log("*************")
    //     // console.log(res.data.data)
    //     that.setData({
    //       productList: res.data.data
    //     })
    //   }
    // })
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

  // // 从购物车中移除；
  // delete: function (event) {
  //   var productId = parseInt(event.currentTarget.dataset.productId)
  //   console.log(77777)
  //   console.log(productId)
  //   var that = this
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要删除该商品吗？',
  //     success: function(result) {
  //       if (result.confirm) {
  //         wx.request({
  //           url: app.globalData.URL_API + '/shopping_cart?increase=true', //仅为示例，并非真实的接口地址
  //           data: [
  //             {
  //               'product_id': productId,
  //               'quantity': 0
  //             }
  //           ],
  //           method: 'POST',
  //           header: {
  //             'Authorization': app.globalData.token,
  //             'content-type': 'application/json'
  //           },
  //           success: function(res) {
  //             console.log(res)
  //             console.log(88888)
  //             console.log(res.data.data)

  //             wx.showToast({
  //               title: '删除成功！',
  //               icon: 'success',
  //               duration: 1500
  //             })
  //             that.setData({
  //               productList: res.data.data,
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // 点击商品前面 icon 图标；
  selectProduct: function (e) {
    console.log('cart--selectProduc--e==', e)
    var payment = 0     // 合计；
    var selectNum = 0   // 用于记录已选择的商品；
    var allSelect = this.data.allSelect
    var productId = e.currentTarget.dataset.productId
    var specId = e.currentTarget.dataset.specId
    var index = e.currentTarget.dataset.index
    var selectIcon = this.data.selectIcon
    selectIcon[index] = selectIcon[index]?'':true
    var productList = this.data.productList

    for ( var i=0; i<selectIcon.length; i++ ) {
      if (selectIcon[i]) {
        selectNum++
        payment = payment + productList[i].price * productList[i].quantity
      }
    }
    console.log(selectNum)
    // 判断是否全部商品都选上了；
    if ( selectNum == productList.length ) {
      allSelect = !allSelect
    } else {
      allSelect = false
    }

    this.setData({
      selectIcon: selectIcon,
      allSelect: allSelect,
      payment: parseFloat(payment).toFixed(2),
      selectNum: selectNum
    })
  },

  // 点击全选；
  allSelect: function (event) {

    var selectIcon = this.data.selectIcon
    var productList = this.data.productList
    var allSelect = this.data.allSelect
    var selectNum = this.data.selectNum
    var payment = 0
    if (allSelect) {
      allSelect = !allSelect
      for ( var i=0; i<productList.length; i++ ) {
        selectIcon[i] = ''
      }
    } else {
      allSelect = !allSelect
      for ( var i=0; i<productList.length; i++ ) {
        selectNum++
        selectIcon[i] = true
        payment = payment + productList[i].price * productList[i].quantity
      }
    }
    this.setData({
      allSelect: allSelect,
      selectIcon: selectIcon,
      payment: parseFloat(payment).toFixed(2),
      selectNum: selectNum
    })
  },
  // 合计；
  computePayment: function () {
    console.log(4)
    var payment = 0
    var selectIcon = this.data.selectIcon
    var productList = this.data.productList
    for ( var i=0; i<selectIcon.length; i++ ) {
      if (selectIcon[i]) {
        payment = payment + productList[i].price * productList[i].quantity
      }
    }
    this.setData({
      payment: parseFloat(payment).toFixed(2)
    })
  },

  // 点击去结算；
  buyNow: function(e) {
    console.log('cart--buyNow--e==', )
    var that = this
    if (that.data.selectNum === 0) {
      return
    }
    if (!app.globalData.token || !app.globalData.judgeAlliances) {
      app.utils.openPage2('../register/index')
      return
    }
    var product_id = ''
    var product_quantity = ''
    var products = []
    var selectIcon = that.data.selectIcon
    var productList = that.data.productList
    for ( var i=0; i<selectIcon.length; i++ ) {
      if (selectIcon[i]) {
        // products.push({ product_id: productList[i].product_id, quantity: productList[i].quantity })
        products.push({
          product_id: productList[i].product_id,
          quantity: productList[i].quantity,
          price: productList[i].price,
          fare_id: productList[i].fare_id,
          weight: productList[i].weight,
          bulk: productList[i].bulk,
          product_specification_id: null,
          product_specification_name: null,
          product_name: productList[i].name,
          stock_balance: productList[i].stock_balance,
          cover: productList[i].cover,
          credit: productList[i].credit,
        })
        // product_id = product_id + productList[i].product_id + '-'
        // product_quantity = product_quantity + productList[i].quantity + '-'
      }
    }
    var productsStr = JSON.stringify(products)
    app.utils.openPage2('../addOrder/addOrder?origin=cart&products=' + productsStr)
    // wx.navigateTo({
    //   url: '../addOrder/addOrder?id=' +product_id+ '&quantity=' +product_quantity
    // })
  },
  getCarts() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    app.webapi.getCarts()
      .then(res => {
        console.log("getCarts--res==", res)
        wx.hideLoading()
        wx.setStorageSync("cart", res.data.data)
        that.setData({
          productList: res.data.data,
          selectIcon: []
        })
      })
      .catch(res => {
        console.log("getCarts--catch--res==", res)
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----------cart---onLoad-------')
    var that = this
    that.getCarts()
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
    this.onLoad()
    this.setData({
      itemLefts: [],
      select: false,
      selectNum: 0,
      payment: 0
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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