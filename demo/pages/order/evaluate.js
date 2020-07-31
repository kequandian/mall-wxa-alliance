var app = getApp()
Page({
  //  * 页面的初始数据
  data: {},

  // 提交评价；
  subForm: function(event) {
    var that = this
    console.log('subForm--event', event)
    var products = that.data.products
    var order = that.data.order
    var users = that.data.users
    console.log('subForm---products', products)
    console.log('subForm---order', order)
    console.log('subForm---users', users)
    var post_data = {
      orderNum: order.order_number,
      evalutions: []
    }
    for (var i in order.order_items) {
      if (products[i].content == '') {
        wx.showToast({
          title: '请输入商品的评价',
          icon: 'none'
        })
        return
      }
      post_data.evalutions.push({
        content: products[i].content,
        images: products[i].uploadImg,
        stockId: order.order_items[i].id,
        memberId: users.id,
        memberName: users.name,
        stockType: 'Product',
        stockEvaluationStars: [{
          starName: '商品评分',
          starValue: products[i].mark
        }]
      })
    }
    console.log('subForm----post_data', post_data)
    app.wxRequest2('cms/evaluations', post_data, 'POST', that, function(res) {
      console.log('cms/evaluations---评价---res', res)
    })
  },
  // 评价内容；
  contentText: function(event) {
    var that = this
    console.log('contentText----event', event)
    var id = Number(event.currentTarget.id)
    console.log('contentText---id', id)
    var value = event.detail.value
    var products = that.data.products
    console.log('contentText----products--1', products)
    products[id].content = value
    console.log('contentText------products', products)
    that.setData({
      products: products
    })
  },
  // 删除图片；
  delImg: function(event) {
    var that = this
    var productIndex = event.currentTarget.dataset.productIndex
    var upIndex = event.currentTarget.dataset.upIndex
    var products = that.data.products

    if (upIndex < products[productIndex].uploadImg.length) {
      products[productIndex].uploadImg.splice(upIndex, 1)
    }
    that.setData({
      products: products
    })
  },
  uploadFile: function() {

    app.wxRequest2('fs/uploadfile', {}, 'POST', that, function(res) {})
  },
  // 上传图片；
  chooseImage: function(event) {
    var that = this
    var productIndex = event.currentTarget.dataset.productIndex
    var products = that.data.products
    wx.chooseImage({
      success: function(res) {
        console.log('wx.chooseImage----success---res', res)
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length >= 1) {
          for (var i = 0; i < tempFilePaths.length; i++) {
            // products[productIndex].uploadImg.push(tempFilePaths[i])
            wx.uploadFile({
              url: app.siteInfo.API_URL2 + 'fs/uploadfile',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {},
              header: {
                'Authorization': app.globalData.access_token,
                'content-type': 'multiline/form-data',
              },
              success: function(res) {
                console.log('uploadFile-----上传图片----res' + i, res)
                console.log('uploadFile-----上传图片----' + i, JSON.parse(res.data))
                var data = JSON.parse(res.data)

                if (data.code == 200) {
                  products[productIndex].uploadImg.push(data.data.url)
                  console.log('uploadFile---success---products', products)
                  that.setData({
                    products: products
                  })
                } else {
                  console.log('data.code!=200', data)
                }
              },
              complete: function(res) {
                console.log('uploadFile---complete', res)
                return
                if (that.data.upload_img.length == that.data.chooseImage.length) {
                  console.log('that.data.upload_imgthat.data.upload_img', that.data.upload_img)
                  var feedback_post = {}
                  if (that.data.upload_img.length == 0) {
                    feedback_post = {
                      content: feedback_text,
                    }
                  } else {
                    feedback_post = {
                      content: feedback_text,
                      images: that.data.upload_img
                    }
                  }
                  app.request('/feedback', feedback_post, 'POST', function(res) {
                    wx.hideLoading()
                    console.log('feedback.js-----postFeedback---res', res)
                    if (res.data.status_code == 0) {
                      wx.showToast({
                        title: '反馈成功',
                        icon: 'success',
                        duration: 2000,
                      })
                      setTimeout(function() {
                        wx.switchTab({
                          url: '../../pages/myPage/myPage'
                        })
                      }, 1000)

                    } else if (res.data.status_code == 1) {
                      wx.showToast({
                        title: '反馈失败,',
                        image: '../../images/error.png',
                        duration: 2000,
                      })
                    }
                  })
                }
              }
            })
          }
        }
        that.setData({
          products: products
        })
        /*wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log('getImageInfogetImageInfo----res',res)
            chooseImage.push(res.path)
            console.log(res.width)
            console.log(res.height)
            that.setData({
              chooseImage: chooseImage
            })
          }
        })*/
      }
    })
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
          that.setData({
            order: res.data.data,
            products: products
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
  // 评价选星星；
  selStar: function(event) {
    var that = this
    console.log('selStar---event', event)
    var index = event.currentTarget.dataset.index
    var productIndex = event.currentTarget.dataset.productIndex
    var products = that.data.products
    products[productIndex].mark = index
    console.log('products', products)
    this.setData({
      products: products
    })
  },

  //  * 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.data.order_number = options.order_number
    this.getOrderDetails(options.order_number)

    // this.getOrderDetails('181021002510169105')
  },

  //  * 生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

  //  * 生命周期函数--监听页面显示
  onShow: function() {
    var that = this
    // console.log('my----onShow---users', users)
    // app.getUser(function(users) {
    //   console.log('个人信息--res', res)
    //   if (users) {
    //     var users = res.data.data
    //     var num = Number(users.delivered) + Number(users.delivering) + Number(users.payPending) + Number(users.commentPending)
    //     console.log('num', num)
    //     console.log('users.ACTIVATION', users.ACTIVATION)
    //     that.setData({})
    //   }
    // })
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
    wx.stopPullDownRefresh()
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