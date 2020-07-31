// pages/personal/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTypes: [
      {
        title: "待付款",
        type: 1,
        icon: "../../images/wait-2.png",
        url: "../order/order?status=CREATED_PAY_PENDING"
      },
      {
        title: "待发货",
        type: 2,
        icon: "../../images/deliver_pending-2.png",
        url: "../order/order?status=CONFIRMED_DELIVER_PENDING"
      },
      {
        title: "退换/售后",
        type: 3,
        icon: "../../images/after_sale-2.png",
        url: "../order/order?status=CLOSED_CONFIRMED"
      }
    ],
    list: [
      {
        icon: "../../images/order_all.png",
        title: "全部订单",
        path: "../order/order",
        status: 1
      },
      {
        icon: "../../images/team.png",
        title: "盟友团队",
        path: "./team/index",
        status: 1
      },
      {
        icon: "../../images/reward.png",
        title: "团队奖励",
        path: "./team/award",
        status: 1
      },
      {
        icon: "../../images/share_out_bonus.png",
        title: "盟友分红",
        path: "./team/holder",
        status: 0
      },
      {
        icon: "../../images/address_manage.png",
        title: "地址管理",
        path: "../address/address",
        status: 1
      },
      // {
      //   icon: "../../images/friend_manage.png",
      //   title: "好友信息",
      //   path: "../friend/friend",
      //   status: 1,
      //   openType: ""
      // },
      {
        icon: "../../images/amount_manage.png",
        title: "资金管理",
        path: "./amount/index",
        status: 1,
        openType: ""
      },
      {
        icon: "../../images/psw_manage.png",
        title: "重置密码",
        path: "./wallet",
        status: 1,
        openType: ""
      }
    ],
    isShowPopup: false,
    passwordInput: '',
    allianceData: app.globalData.allianceData
  },
  onTabItemTap(item) {
    if (!app.globalData.token || !app.globalData.judgeAlliances) {
      app.utils.openPage2('../register/index', 'redirect')
      return
    }
  },
  onClose() {
    this.setData({
      isShowPopup: false,
      passwordInput: ''
    })
  },
  walletPassword(e) {
    var that = this;
    console.log("walletPassword--e==", e)
    var password1 = e.detail.value.password1;
    var password2 = e.detail.value.password2;
    if (password1 && password2 && password1 === password2) {
      app.webapi.walletPassword(password1)
        .then(res => {
          console.log("walletPassword--res==", res)
          if (res.data.status_code === 0) {
            wx.showToast({
              title: '修改成功',
            })
            that.onClose()
          } else {
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 3000
            })
          }
        })
        .catch(res => {
          console.log("walletPassword--catch--res==", res)
        })
    } else {
      wx.showToast({
        title: '密码不一致，请重新输入',
        icon: 'none',
        duration: 3000
      })
    }
  },
  openPage(e) {
    console.log("openPage--e==", e)
    var url = e.currentTarget.dataset.url;
    if (url === "passwordPopup") {
      this.setData({
        isShowPopup: true
      })
    } else {
      app.utils.openPage(e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    var allianceData = app.globalData.allianceData;
    console.log("allianceData==", allianceData)
    if (allianceData) {
      if (allianceData.allianceType == 1) {
        that.data.list[3].status = 1
      } else {
        that.data.list[3].status = 0
      }
      that.setData({
        allianceData: allianceData,
        list: that.data.list
      })
    }
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
      isShowPopup: false,
      passwordInput: ''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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