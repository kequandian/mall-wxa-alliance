// pages/personal/team/profile.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelf: false,
    sexArr: ["女", "男"],
    alliance: {},
    nowDate: app.utils.getNowDate()
  },
  openPage(e) {
    app.utils.openPage(e)
  },
  bindinput(e) {
    console.log("bindinput--e==", e)
    var that = this
    var layer = e.currentTarget.dataset.layer;
    var value = e.detail.value
    if (layer === 'age') {
      that.data.alliance[layer] = parseInt(value)
    } else {
      that.data.alliance[layer] = value
    }

    that.setData({
      alliance: that.data.alliance
    })
    console.log("bindinput--that.data.alliance==", that.data.alliance)
  },
  changeSwitch(e) {
    console.log("changeSwitch--e==", e)
    var that = this
    var layer = e.currentTarget.dataset.layer;
    var value = e.detail.value
    if (layer === "allianceStatus") {
      that.data.alliance.allianceStatus = value ? 1 : 0
    }
    that.setData({
      alliance: that.data.alliance
    })
  },
  pickerChange(e) {
    console.log("pickerChange--e==", e)
    var that = this
    var layer = e.currentTarget.dataset.layer;
    var value = e.detail.value
    if (layer === "allianceSex") {
      that.data.alliance.allianceSex = parseInt(value)
    } else if (layer === "allianceDob") {
      that.data.alliance.allianceDob = value
      that.data.alliance.age = app.utils.getAge(value)
    }
    that.setData({
      alliance: that.data.alliance
    })
  },
  updateAlliance(e) {
    var that = this
    console.log("updateAlliance--e==", e)
    var formValue = e.detail.value
    // formValue.allianceDob = 1
    if (!formValue.allianceName.length || !formValue.allianceName.trim().length) {
      wx.showToast({
        title: "姓名不能为空",
        icon: "none"
      })
    } else if (!app.utils.checkUserPhoneReg(formValue.alliancePhone)) {
      wx.showToast({
        title: "请输入正确的手机号码",
        icon: "none"
      })
    /*} else if (formValue.allianceSex !== 0 && formValue.allianceSex !== 1) {
      wx.showToast({
        title: "请选择性别",
        icon: "none"
      })
    } else if (!formValue.age) {
      wx.showToast({
        title: "请输入年龄",
        icon: "none"
      })
    } else if (!formValue.allianceOccupation.length || !formValue.allianceOccupation.trim().length) {
      wx.showToast({
        title: "请输入您的职业",
        icon: "none"
      })
    } else if (formValue.allianceSex !== 0 && formValue.allianceSex !== 1) {
      wx.showToast({
        title: "请输入您的需求",
        icon: "none"
      })
    } else if (formValue.allianceSex !== 0 && formValue.allianceSex !== 1) {
      wx.showToast({
        title: "请输入您的爱好",
        icon: "none"
      })
    } else if (!formValue.allianceAddress.length || !formValue.allianceAddress.trim().length) {
      wx.showToast({
        title: "请输入地址",
        icon: "none"
      })*/
    } else {
      app.webapi.updateAlliance(that.data.allianceId, that.data.alliance)
        .then(res => {
          console.log("updateAlliance--res==", res)
          if (res.data.status_code === 0 && res.data.data === 1) {
            wx.showToast({
              title: '修改成功',
            })
            setTimeout(() => {
              app.utils.openPage2(1, 'back')
            }, 500)
          } else {
            throw res
          }
        })
        .catch(res => {
          console.log("updateAlliance--catch--res==", res)
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        })
    }
  },
  getAllianceDetails(allianceId) {
    var that = this
    if (!allianceId) {
      return
    }
    wx.showLoading({
      title: '',
    })
    var alliance = "";
    app.webapi.getAllianceDetails(allianceId)
      .then(res => {
        console.log('getAllianceDetails--res==', res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status_code === 0) {
          alliance = res.data.data;
          that.setData({
            alliance: alliance
          })
        } else {
          throw res
        }
      })
      .catch(res => {
        console.log('getAllianceDetails--catch--res==', res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000
        })
        that.setData({
          alliance: ''
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options && options.isSelf) {
    //   wx.setNavigationBarTitle({
    //     title: "个人信息"
    //   })
    //   this.setData({
    //     isSelf: true,
    //     allianceId: options.id 
    //   })
    // } else {
    //   wx.setNavigationBarTitle({
    //     title: "盟友"
    //   })
    //   this.setData({
    //     isSelf: false,
    //     allianceId: options.id 
    //   })
    // }
    wx.setNavigationBarTitle({
      title: options.isSelf ? "个人信息" : "盟友"
    })
    if (!options.id) {
      app.utils.promisify(wx.showModal({
        title: '提示',
        content: '',
      }))
    }
    var allianceId = options.id
    this.getAllianceDetails(allianceId)
    this.setData({
      isSelf: options.isSelf,
      allianceId: options.id
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
    var that = this;
    that.getAllianceDetails(that.data.allianceId)
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