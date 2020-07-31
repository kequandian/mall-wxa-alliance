// search.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    orderArr: [
        { 'title': '人气', 'src': '#', 'color': '#000', 'order': 'view_count'},
        { 'title': '销量', 'src': '#', 'color': '#000', 'order': 'sales'},
        { 'title': '价格', 'src': '#', 'color': '#000', 'order': 'price'}, 
    ],
    selectPerson:false,
    select: true,
    searchName: '',
    animationData: {}
  },
  // 点击商品调用该函数跳转详情页；
  getDetails: function (options){
    console.log('a11a1a1a1a1')
    console.log(options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + options.currentTarget.dataset.id
    })
  },

  clickOrder: function(event) {
    console.log('------search----clickOrder-----')
    
    var _this = this

    var index = event.currentTarget.dataset.index

    var orderArr = _this.data.orderArr
    var orderBy = orderArr[index].order

    console.log(index)
    for ( var i=0; i<orderArr.length; i++ ) {
      if ( i == index ) {
        orderArr[i].color = 'red'
      } else {
        orderArr[i].color = "#000"
      }

    }

    if ( index == 2 ) {
      _this.data.selectPerson = !_this.data.selectPerson
      
    } else {
      _this.data.selectPerson = false

      _this.setData({
        selectPerson: false
      })
    }
      if(_this.data.selectPerson == true){

        var animation = wx.createAnimation({
          duration: 200,
          timingFucion: "ease",
        })

        animation.height(160+'rpx').step()

        _this.setData({
          selectPerson: _this.data.selectPerson,
          orderArr: _this.data.orderArr,
          animationData: animation.export()
       })
      }else{

        var animation = wx.createAnimation({
          duration: 100,
          timingFucion: "ease",
        })

        animation.height(0+'rpx').step()

        _this.setData({
          selectPerson:_this.data.selectPerson,
          orderArr: _this.data.orderArr,
          animationData: animation.export()
        })
      }

      wx.request({
      // http://112.74.26.228:10080/rest/product_search?pageNumber=1&pageSize=20&name=abc&orderByDesc=view_count&orderBy=price&orderBy=sales
        url: app.globalData.URL_API +'/product_search?pageNumber=1&pageSize=60&name='+ _this.data.searchName +'&orderByDesc='+ orderArr[index].order, //仅为示例，并非真实的接口地址
        header: {
          'access_token': 'eyJsb2dpbl9uYW1lIjoidXNlcjEyMyIsInRva2VuIjoiNWJmMGIzNzZjNDk3NmE0ZTdjZDFlODExYjNkZTk2YjhkY2I5YjlhNiJ9',
          'content-type': 'json'
        },
        success: function (res) {

          console.log(res.data.data)
          wx.hideLoading()
          _this.setData({
            productList: res.data.data,
            isHit: 'false',
            orderArr: _this.data.orderArr
          })
        }
      });
    
    

  },
  
  
  mySelect:function(e){

    var _this = this
    var orderArr = _this.data.orderArr
    var selectPrice = e.currentTarget.dataset.order
    console.log(777)
    console.log(selectPrice)
    var text = ''
    orderArr[2].color = "red"
    if ( selectPrice == 'orderBy') {
      text = "从低到高"
    } else {
      text = "从高到低"
    }

    var animation = wx.createAnimation({
      duration: 100,
      timingFucion: "ease",
    })

    animation.height(0+'rpx').step()

    

    console.log(orderArr[2].color)
    // var url = API_URL+'product_search?pageNumber=1&pageSize=60&name='+ _this.data.searchName +'&'+ selectPrice + '=' + orderArr[2].order
    console.log(533)
    // console.log(url)
    wx.request({
      // http://112.74.26.228:10080/rest/product_search?pageNumber=1&pageSize=20&name=abc&orderByDesc=view_count&orderBy=price&orderBy=sales
        url: app.globalData.URL_API + '/product_search?pageNumber=1&pageSize=60&name='+ _this.data.searchName +'&'+ selectPrice + '=' + orderArr[2].order, //仅为示例，并非真实的接口地址
        header: {
          'access_token': 'eyJsb2dpbl9uYW1lIjoidXNlcjEyMyIsInRva2VuIjoiNWJmMGIzNzZjNDk3NmE0ZTdjZDFlODExYjNkZTk2YjhkY2I5YjlhNiJ9',
          'content-type': 'json'
      },
      success: function (res) {
        console.log(res.data.data)
        wx.hideLoading()
        _this.setData({
          productList: res.data.data,
          isHit: 'false',
          selectPerson:true,
          select: false,
          selectPrice: text,
          orederArr: _this.data.orderArr,
          animationData: animation.export()
        })
      }
    });

    // this.setData({
    //   selectPerson:true,
    //   select: false,
    //   selectPrice: text,
    //   orederArr: this.data.orderArr
    // })
 },

  // search页面搜索框,热搜词调用该方法判断；
  searchAgency: function(event) {
    console.log('----search---searchAgency---')
    wx.showToast({
      title:"加载中..",
      icon:"loading",
      duration:10000
    });
    var isHit = 'true'
    var orderBy = "true"
    var order = orderBy? 'orderBy':'orderByDesc'
    // 判断是点击热搜索关键词还是输入框输入搜索内容
    if(!event.detail.value){
      console.log(event)
      this.data.searchName = event.currentTarget.dataset.hitWord
    } else {
      this.data.searchName = event.detail.value
      console.log(event)
    }
    var url = app.globalData.URL_API + '/product_search?pageNumber=1&pageSize=60&name='+ this.data.searchName
    console.log(2222)
    console.log(this.data.productList)
    this.getSearchData(url,isHit)
    // console.log(333)
    // console.log(this.data.productList)
    // this.setData({
    //   productList: this.data.productList,
    //   isHit: 'false',
    // })
    // console.log(444)
    
  },
  // 请求热搜关键词数据；
  getHit:function () {
   console.log(2)
    var _this = this
    
    wx.request({
      url: app.globalData.URL_API + '/product_hit_word', //仅为示例，并非真实的接口地址
      header: {
        'access_token': 'eyJsb2dpbl9uYW1lIjoidXNlcjEyMyIsInRva2VuIjoiNWJmMGIzNzZjNDk3NmE0ZTdjZDFlODExYjNkZTk2YjhkY2I5YjlhNiJ9',
        'content-type': 'json'
      },
      success: function (res) {
        console.log(res.data.data)
        wx.hideLoading()
        _this.setData({
          hitWord: res.data.data,
          isHit: true,
        })
      }
    });
  },

  // 请求商品数据；
  getSearchData: function (url,isHit) {
    console.log('-----search----getSearchData----')
    console.log(url)
    var _this = this
    wx.request({
      // http://112.74.26.228:10080/rest/product_search?pageNumber=1&pageSize=20&name=abc&orderByDesc=view_count&orderBy=price&orderBy=sales
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'access_token': 'eyJsb2dpbl9uYW1lIjoidXNlcjEyMyIsInRva2VuIjoiNWJmMGIzNzZjNDk3NmE0ZTdjZDFlODExYjNkZTk2YjhkY2I5YjlhNiJ9',
        'content-type': 'json'
      },
      method: 'GET',
      success: function (res) {
        // console.log(555)
        // console.log(res.data.data)
        // console.log(666)
        console.log(res.data.data.products)
        wx.hideLoading()
        console.log(isHit)
        if (isHit=='true') {
          _this.setData({
            isHit: 'false',
            productList: res.data.data
          })
        } else {
          console.log('kkkkkkk')
          _this.setData({
            isHit: 'false',
            productList: res.data.data.products
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('-------search----onload------')
    wx.showToast({
      title:"加载中..",
      icon:"loading",
      duration:10000
    });
    console.log(options)
    console.log(options.isHit)
    // var isHit = bool.parent(options.isHit)
    // var isHit = options.isHit
    if (options.isHit=='true') {
      console.log(1)
      this.getHit()
      console.log(3)
      this.setData({
        productList: this.data.productList,
        isHit: 'false',
      })
    } else if (options.id) {
      console.log(options)
      var title = options.title
      var id = options.id
      var isHit = options.isHit
      var url = app.globalData.URL_API + '/product_category/' + id
      wx.setNavigationBarTitle({
        title: title
      })
      this.getSearchData(url,isHit)
    }
    
    
  },
  requestData: function () {
    
    
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
    // console.log('-----search-----onshow-----')
    // console.log(this.data.productList)
    // this.setData({
    //   productList: this.data.productList,
    //   isHit: 'false',
    // })
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