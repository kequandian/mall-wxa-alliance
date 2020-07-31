// pages/friend/add.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendId: null,
    friend: {
      name: "",
      contactPhone: "",
      nick: "",
      avator: "",
      allianceId: 0,
      allianceUserId: 0,
      pcdProvince: "",
      pcdCity: "",
      pcdDistinct: "",
      address: "",
      postCode: "",
      remark: "",
      extra: {}
    },
    default_data: {
      name: "张三",
      contactPhone: "13211123121",
      nick: "张飞",
      avator: "张",
      allianceId: 0,
      allianceUserId: 0,
      pcdProvince: "广东省",
      pcdCity: "广州市",
      pcdDistinct: "黄埔区",
      address: "广东软件园",
      postCode: "",
      remark: "",
      extra: {}
    },
    rules: {
      name: "",
      contactPhone: "",
      nick: "",
      avator: "",
      allianceId: 0,
      allianceUserId: 0,
      pcdProvince: "",
      pcdCity: "",
      pcdDistinct: "",
      address: "",
      postCode: "",
      remark: "",
      extra: {}
    },
    checkResult: true
  },
  getData() {
    var that = this;
    that.setData({
      friend: that.data.default_data
    })
  },
  del() {
    if (this.data.friendId) {
      app.utils.promisify(wx.showModal)({
          title: "提示",
          content: '真的要删除改朋友吗?'
        })
        .then(res => {
          console.log("showModal--res==", res)
          if (res.confirm) {
            wx.showLoading({
              title: '',
            })
            app.webapi.delFriend(this.data.friendId)
              .then(res => {
                console.log("delFriend--res==", res)
                wx.hideLoading()
                if (res.data.status_code == 0) {
                  wx.showToast({
                    title: '已删除',
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                } else {
                  wx.showToast({
                    title: '删除失败',
                    icon: 'none'
                  })
                }
              })
              .catch(res => {
                wx.hideLoading()
                console.log("delFriend--catch--res==", res)
              })
          }
        })
        .catch(res => {
          wx.hideLoading()
          console.log("showModal--catch--res==", res)
        })
    }
  },
  getFriendDetails(friendId) {
    wx.showLoading({
      title: '',
    })
    app.webapi.getFriendDetails(friendId)
      .then(res => {
        wx.hideLoading()
        if (res.data.status_code == 0 && res.data.data) {
          this.data.friend = res.data.data
          this.setData({
            friend: this.data.friend
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
        console.log("getFriendDetails--res==", res)
      })
      .catch(res => {
        console.log("getFriendDetails--catch--res==", res)
        wx.hideLoading()
      })
  },
  submit() {
    var friend = this.data.friend
    if (this.data.checkResult) {
      if (friend.pcdProvince.trim() && friend.pcdCity.trim() && friend.pcdDistinct.trim()) {
        wx.showLoading({
          title: '',
        })
        if (this.data.friendId) {
          app.webapi.updateFriend(this.data.friendId, friend)
            .then(res => {
              console.log("updateFriend--res==", res)
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '修改成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                wx.showToast({
                  title: res.data.message || "修改失败",
                  icon: "none"
                })
              }
            })
        } else {
          app.webapi.addFriend(friend)
            .then(res => {
              console.log("addFriend--res==", res)
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '添加成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                wx.showToast({
                  title: res.data.message || "添加失败",
                  icon: "none"
                })
              }
            })
        }
      } else {
        this.data.rules.region = "地区不能为空"
        this.setData({
          rules: this.data.rules
        })
        return
      }
    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
    }
  },
  changeRegion(e) {
    console.log("changeRegion--e==", e)
    this.data.friend.pcdProvince = e.detail.value[0]
    this.data.friend.pcdCity = e.detail.value[1]
    this.data.friend.pcdDistinct = e.detail.value[2]
    this.setData({
      friend: this.data.friend
    })
  },
  getInputValue(e) {
    console.log("getInputValue--e==", e)
    var flag = e.currentTarget.dataset.flag
    var value = e.detail.value

    this.data.friend[flag] = value
    this.checkValue(flag)
    // this.setData({
    //   friend: this.friend
    // })
  },
  checkValue(flag) {
    console.log("checkValue--this.data.friend==", this.data.friend)
    console.log("checkValue--flag==", flag)
    var checkResult = false
    var friend = this.data.friend
    var rules = this.data.rules
    if (flag === "all" || flag === "name") {
      if (friend.name.trim().length === 0) {
        rules.name = "姓名不能为空"
      }
    }
    switch (flag) {
      case "name":
        if (friend.name.trim().length === 0) {
          rules.name = "姓名不能为空"
          this.data.checkResult = false
        } else {
          this.data.checkResult = true
          rules.name = ""
        }
        break;
      case "contactPhone":
        if (!app.utils.checkUserPhoneReg(friend.contactPhone)) {
          rules.contactPhone = "电话号码错误"
          this.data.checkResult = false
        } else {
          this.data.checkResult = true
          rules.contactPhone = ""
        }
        break;
      case "nick":
        if (friend.nick.trim().length === 0) {
          rules.nick = "姓名不能为空"
          this.data.checkResult = false
        } else {
          this.data.checkResult = true
          rules.nick = ""
        }
        break;
      case "address":
        if (friend.address.trim().length === 0) {
          rules.address = "姓名不能为空"
          this.data.checkResult = false
        } else {
          this.data.checkResult = true
          rules.address = ""
        }
        break;
      default:
    }
    this.setData({
      friend: friend,
      rules: rules,
      checkResult: this.data.checkResult
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options && options.id) {
      this.data.friendId = options.id
      this.getFriendDetails(options.id)
    } else {
      this.data.friendId = null
    }
    this.setData({
      friendId: this.data.friendId
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
  onShow: function() {
    var that = this
    app.getProfile(false, function(userProfile) {
      console.log("add--friend--getProfile--userProfile==", userProfile)
      that.data.friend.allianceUserId = userProfile.id
      that.data.friend.allianceId = userProfile.inviter_id
      that.setData({
        userProfile: userProfile
      })
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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