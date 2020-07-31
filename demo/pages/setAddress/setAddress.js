// setAddress.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    areaArr: [],
    province: [],
    city: [],
    district: [],
    index: null,
    province_index: 0,
    city_index: 0,
    district_index: 0,
    animationData: {},
    address: {
      contact_user: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      street: "",
      street_number: "",
      detail: "",
      is_default: 0
    },
    default_data: {
      contact_user: '收件人',
      phone: '13212312312',
      province: "北京市",
      city: "北京市",
      district: "东城区",
      street: '',
      street_number: '',
      detail: '啊实打实的撒的',
      is_default: 0
    }
  },
  bindRegionChange(e) {
    console.log("bindRegionChange--e==", e)
    this.data.address.province = e.detail.value[0]
    this.data.address.city = e.detail.value[1]
    this.data.address.district = e.detail.value[2]
    this.setData({
      address: this.data.address
    })
  },
  bindInputBlur: function (event) {
    console.log('setAddress--bindInput--event==', event)
    var name = event.currentTarget.dataset.name
    if ( name == 'contact_user' ) {
      this.data.address.contact_user = event.detail.value
    } else if ( name == 'phone' ) {
      if (app.utils.checkUserPhoneReg(event.detail.value)) {
        this.data.address.phone = event.detail.value
      } else {
        wx.showToast({
          title: "请输入正确手机号码",
          icon: "none"
        })
      }
    } else {
      this.data.address.detail = event.detail.value
    }
    
    console.log(this.data.address)
  },

  // 修改默认地址；
  setDefault: function (event) {
    console.log('----------setAddress-----setDefault------')
    console.log(event)
    if ( !event.detail.value ) {
      this.data.address.is_default = 0
    } else {
      this.data.address.is_default = 1
    }
  },

  // 提交表单；
  formSubmit: function (event) {
    console.log('setAddress--formSubmit--event==', event)
    var _this =this
    var contact_user = event.detail.value.contact_user
    var phone = event.detail.value.phone
    var is_default = event.detail.value.is_default? 1:0
    var province = _this.data.address.province
    var city = _this.data.address.city
    var district = _this.data.address.district
    var detail = _this.data.address.detail
    var method = ''
    var id = ''
    var address = _this.data.address

    if ( address.contact_user == "" ) {
      wx.showToast({
        title: "请填写收货人",
        icon: "none"
      })
      return
    } else if (!app.utils.checkUserPhoneReg(address.phone)) {
      wx.showToast({
        title: "请填写正确的手机号码",
        icon: "none"
      })
      return
    } else if ( !address.province ) {
      wx.showToast({
        title: "请选择所在地址",
        icon: "none"
      })
      return
    } else if ( address.detail.trim().length < 5  ) {
      wx.showToast({
        title: "请填写详细地址,不少于5个字",
        icon: "none"
      })
      return
    }
    if ( this.data.index==null) {
      // method = 'POST'
      wx.showLoading({
        title: '',
      })
      app.webapi.addAddress(address)
        .then(res => {
          console.log("addAddress--res==", res)
          if (res.data.status_code === 0) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        })
        .catch(res => {
          console.log("addAddress--catch--res==", res)
        })
    } else {
      // method = 'PUT',
      id = app.globalData.addressArr[this.data.index].id
      app.webapi.updateAddress(id, address)
        .then(res => {
          console.log("updateAddress--res==", res)
          if (res.data.status_code === 0) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 500
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        })
        .catch(res => {
          console.log("updateAddress--catch--res==", res)
        })
    }

    /*wx.request({
      url: app.globalData.URL_API + '/contact' + id,
      data: {
        'contact_user': contact_user,
        'phone': phone,
        'province': province,
        'city': city,
        'district': district,
        'detail': detail,
        'is_default': is_default
      },
      header: {
        'Authorization': app.globalData.token,
        'content-type': 'json'
      },
      method: method,
      success: function(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 500
        })
        console.log(158888888753256486)
        console.log(res.data.data)
        // _this.data.province = res.data.data
        _this.setData({
          areaArr: res.data.data
        })
        wx.navigateBack({
          delta: 1
        })
        // _this.pickerShow()
      }
    })*/

  },

  // 删除地址按钮，
  delAddress: function (event) {

    var _this = this
    var id = event.currentTarget.dataset.id

    wx.showModal({
      title: '提示',
      content: '确定删除该地址吗？',
      success: function(result) {
        if (result.confirm) {
          app.webapi.delAddress(id)
            .then(res => {
              console.log("delAddress--res==", res)
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 500
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            })
            .catch(res => {
              console.log("delAddress--catch--res==", res)
              wx.showToast({
                title: '',
                icon: 'none',
              })
              wx.navigateBack({
                delta: 1
              })
            })
          /*wx.request({
            url: app.globalData.URL_API + '/contact/' + id,
            data: {},
            header: {
              'Authorization': app.globalData.token,
              'content-type': 'json'
            },
            method: 'DELETE',
            success: function(res) {
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 500
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })*/
        }
      },
    })
  },

  // 点击所在地区，弹出地址选择窗口；
  popupSetArea: function () {
    
    var _this = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    }) 
    this.animation = animation
    animation.height(1332+'rpx').step()
    this.setData({
      animationData: animation.export()
    })
    wx.request({
      url: app.globalData.URL_API + '/pcd?all=true',
      data: {},
      header: {
        'Authorization': app.globalData.token,
        'content-type': 'json'
      },
      method: 'GET',
      success: function(res) {
        wx.hideToast()
        console.log(res.data.data)
        // _this.data.province = res.data.data
        _this.setData({
          areaArr: res.data.data
        })
        _this.pickerShow()
      }
    })
  },

  // 弹出窗口中的确定按钮；
  confirm: function (event) {
    console.log('----------setAddress-----confirm------')
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    this.animation = animation
    animation.height(0+'rpx').step()
    this.setData({
      animationData: animation.export()
    })
    console.log(this.data.address)
  },

  // 弹出窗口中的取消按钮；
  cancel: function (event) {
    console.log('----------setAddress-----cancel------')
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
    })
    console.log(this.data.index)
    this.animation = animation
    animation.height(0+'rpx').step()
    if ( this.data.index == null ) {
      this.data.address.province = ''
      this.data.address.city = ''
      this.data.address.district = ''
    } else {
      this.data.address = app.globalData.addressArr[this.data.index]
    }
    console.log(this.data.address)
    this.setData({
      animationData: animation.export(),
      address: this.data.address
    })

  },

  // 判断省市名称显示；
  pickerShow: function (event) {
    console.log('----------setAddress-----pickerShow------')

    var _this = this
    var areaArr = _this.data.areaArr
    var province = []
    var city = []
    var district = []
    var province_index = _this.data.province_index
    var city_index = _this.data.city_index
    var district_index = _this.data.district_index
    // console.log(province_index)
    // console.log(city_index)
    // console.log(district_index)
    console.log(areaArr)
    console.log(areaArr.length)
    
    // 存放省级名称；
    for ( var i = 0; i<areaArr.length; i++ ) {
      province.push(areaArr[i].name)
    }

    // 判断省级里面有没有市
    if (areaArr[province_index].area_list) {

      // 判断市级下标是否超出；
      if (areaArr[province_index].area_list[city_index]) {

        // 存放市级名称；
        for (var i=0; i<areaArr[province_index].area_list.length; i++ ) {
          city.push(areaArr[province_index].area_list[i].name)
        }
        if ( areaArr[province_index].area_list[city_index].area_list ) {
          
          if ( areaArr[province_index].area_list[city_index].area_list[district_index] ) {

            // 存放区级名称；
            for ( var i=0; i<areaArr[province_index].area_list[city_index].area_list.length; i++ ) {
              district.push(areaArr[province_index].area_list[city_index].area_list[i].name)
            }
          } else {
            this.setData({
              district_index: 0
            })
            // 存放区级名称；
            for ( var i=0; i<areaArr[province_index].area_list[city_index].area_list.length; i++ ) {
              district.push(areaArr[province_index].area_list[city_index].area_list[i].name)
            }

          }
        } else {
          district.push(areaArr[province_index].area_list[city_index].name)
        }
      } else {
        this.setData({
            city_index: 0
        })
          // 存放市级名称；
        for (var i=0; i<areaArr[province_index].area_list.length; i++ ) {
          city.push(areaArr[province_index].area_list[i].name)
        }

      }
    } else {
      city.push(areaArr[province_index].name)
      district.push(areaArr[province_index].name)
    }

    this.setData({
      province: province,
      city: city,
      district: district
    })

    // let address = {
    //   contact_user: this.data.address.contact_user,
    //   phone: this.data.address.phone,
    //   province: province[this.data.province_index],
    //   city: city[this.data.city_index],
    //   district: district[this.data.district_index],
    //   street: this.data.address.street,
    //   street_number: this.data.address.street_number,
    //   detail: this.data.address.detail,
    //   is_default: this.data.address.is_default
      
    //   // province: province[this.data.province_index],
    //   // city: city[this.data.city_index],
    //   // district: district[this.data.district_index],
      
    // }
    console.log('---------------')
    console.log(province)
    console.log(this.data.province)
    this.data.address.province = province[this.data.province_index]
    this.data.address.city = city[this.data.city_index]
    this.data.address.district = district[this.data.district_index]
    this.setData({
      address: this.data.address
    })
    console.log(this.data.address)
    // 如果网络慢，数据没有加载，则执行回调；
    if ( province.length==0 || city.length==0 || district.length==0 ) {
      console.log('网络渣渣，执行回调')
      this.pickerShow()
    }

  },

  // 滚动选择的时候触发事件；
  bindChange: function (event) {
    console.log('----------setAddress-----bindChange------')
    console.log(event)

    var valueArr = event.detail.value
      console.log(valueArr[0])
      console.log(valueArr[1])
      console.log(valueArr[2])
      this.setData({
        province_index: valueArr[0],
        city_index: valueArr[1],
        district_index: valueArr[2]
      })
      this.pickerShow()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var _this = this
    console.log('setAddress-----onLoad--options==', options)
    var addressArr = app.globalData.addressArr
    var index = null
    if (options.index) {
      index = options.index
      this.setData({
        address: addressArr[index],
        index: index,
      })
    } else {
      index = null
    }
    console.log("onload--_this.data.address==", _this.data.address)
    // wx.request({
    //   url: app.globalData.URL_API + '/pcd?all=true',
    //   data: {},
    //   header: {
    //     'Authorization': app.globalData.token,
    //     'content-type': 'json'
    //   },
    //   method: 'GET',
    //   success: function(res) {
    //     wx.hideToast()
    //     console.log(res.data.data)
    //     // _this.data.province = res.data.data
    //     _this.setData({
    //       areaArr: res.data.data
    //     })
    //     _this.pickerShow()
    //   }
    // })

    

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