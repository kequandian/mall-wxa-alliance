import utils from "../utils/util";
let app = getApp()
// const API_HOST = 'https://api.cloud.biliya.cn/rest'
//const API_HOST = 'https://api.cloud.biliya.cn/rest'
const API_HOST = 'http://192.168.3.181:8080/rest'

// 登录；
function apiLogin(params) {
  return utils.promisify(wx.request)({
    url: API_HOST + "/login_wxa",
    data: params,
    method: "POST",
    header: {
      "content-type": "application/json"
    }
  });
}
// 获取手机验证码；
function getPhoneCaptcha(phone, name) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/pub/sms",
    data: { phone, name },
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 验证手机验证码；
function checkPhoneCaptcha(phone, captcha) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/pub/sms_verify",
    data: { phone, captcha },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 绑定手机；
function bindPhone(phone, captcha) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/phone",
    data: { phone, captcha },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 获取轮播图；
function getAd() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/ad",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取商品分类；
function getCategory(token) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product_category",
    data: {},
    header: {
      "Authorization": token,
      "content-type": "application/json"
    }
  });
}
// 获取推荐商品；
function getAllProduct(pageNumber, pageSize) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product",
    data: { pageNumber, pageSize },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取某类别下的产品列表；
function getProduct(id, pageNumber, pageSize) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product_category/" + id,
    data: {
      pageNumber: pageNumber ? pageNumber : 1,
      pageSize: pageSize ? pageSize : 30
    },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取商品详情；
function getProductDetail(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product/" + id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取推荐商品；
function getRecommend() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product",
    data: {
      // pageNumber: 1,
      // pageSize: 10,
    },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取收藏商品；
function getProductFavorite(pageNumber) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product_favorite",
    data: {
      pageNumber: pageNumber?pageNumber:1,
      pageSize: 20,
      zone: 1
    },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 加入购物车；
function updateCarts(increase, params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/shopping_cart?increase=" + increase,
    data: params,
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 获取购物车数据；
function getCarts() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/shopping_cart",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 收货地址列表；
function getAddressList() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/contact",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 添加收获地址；
function addAddress(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/contact",
    data: utils.trimHandler(params),
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 删除收获地址；
function delAddress(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/contact/" + id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "DELETE"
  });
}
// 修改收获地址；
function updateAddress(id, params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/contact/" + id,
    data: utils.trimHandler(params),
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "PUT"
  });
}

// 订单详情；
function getOrderDetails(order_number) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order/" + order_number,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}

// 快递公司列表；
function getExpressCompanys() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/admin/express",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 查看订单物流信息；
function getExpressInfo(order_number, waybill_id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    // url: API_HOST + "/wxa/express/path",
    url: API_HOST + "/express_info",
    data: { order_number },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 查看订单多个物流信息；
function getOrderExpress(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order_express/" + id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}


// 获取订单列表；
function getOrder(url) {
  let app = getApp()
  // let pageNum = p_num || 1
  // let pageSize = p_size || 30
  return utils.promisify(wx.request)({
    url: API_HOST + url,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 计算运费；
function computeCarriage(post_carriage) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/product_carriage",
    method: "POST",
    data: post_carriage,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}

// 新建订单；
function addOrder(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order",
    data: params,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 提醒发货；
function getOrderReminder(order_number) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order_deliver_reminder/" + order_number,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 确认订单；取消订单；
function confirmOrder(order_number, status) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order/" + order_number,
    data: { status },
    method: "PUT",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 删除订单；
function delOrder(order_number) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order/" + order_number,
    data: {},
    method: "DELETE",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 申请售后；退款；
function serviceOrder(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/order_customer_service",
    data: params,
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
  });
}
// 检查是否设置钱包支付密码；
function checkWalletPassword() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wallet_password",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 钱包重重支付密码；
function walletPassword(password) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wallet_password",
    data: { password },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 钱包支付；
function walletPay(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wallet_pay",
    data: params,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 钱包充值；
function walletCharge(id, amount, description) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wallet_charge",
    data: { id, amount, description },
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 钱包充值支付；
function walletChargePay(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/payment/wpay/" + id + "?orderType=Wallet",
    data: {},
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}

// 查看充值记录；
function getWalletHistory(type, pageNumber, pageSize) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wallet_history",
    data: { type, pageNumber, pageSize },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}

function getCashQuery(date) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/cashQuery",
    data: { date },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 申请线上提现；
function ownerBalance(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/owner_balance",
    data: params,
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 申请线下提现；
function offlineWithdrawals(balance) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/crud/bonus/offlineWithdrawals",
    data: { balance },
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 查看提现历史记录；
function getRewardCash(page_number, page_size) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/reward_cash",
    data: { page_number, page_size },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 微信支付；
function wxPay(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/wx/push_order",
    data: params,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    },
    method: "POST"
  });
}
// 获取个人信息；
function getProfile() {
  let app = getApp()
  console.log('webapi--getProfile--app.globalData.token==', app.globalData.token)
  return utils.promisify(wx.request)({
    url: API_HOST + "/profile",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json"
    }
  });
}
// 添加朋友；
function addFriend(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/friend/momentsFriends",
    data: params,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "POST"
  });
}
// 删除朋友；
function delFriend(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/friend/momentsFriends/"+ id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "DELETE"
  });
}
// 修改朋友信息；
function updateFriend(id, params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/friend/momentsFriends/" + id,
    data: params,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "PUT"
  });
}

// 获取朋友列表；
function getFriends(pageNum, pageSize) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/friend/momentsFriends",
    data: { pageNum, pageSize },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 查询朋友详细信息；
function getFriendDetails(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/friend/momentsFriends/" + id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
  });
}

// 盟友绑定手机；
function alliancePhone(phoneNumber, userName) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/bindphone",
    data: { phoneNumber, userName },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "POST"
  });
}
// 盟友绑定手机；
function registerPhone(phoneNumber) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/register",
    data: { phoneNumber },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "POST"
  });
}
// 盟友更换绑定手机；
function changePhone(alliancePhone) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/changePhone",
    data: { alliancePhone },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "POST"
  });
}
// 申请盟友；
function createAlliance(parmas) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/createAlliance",
    data: parmas,
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    },
    method: "POST"
  });
}
// 判断是否是盟友；
function allianceGlobal() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: "https://api.cloud.biliya.cn/openrpc/alliance/global",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 判断是否是盟友；
function judgeAlliances() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/alliance",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 获取盟友列表；
function getAlliances(pageNum, pageSize, search) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances",
    data: { pageNum, pageSize, search },
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 新建盟友；
function addAlliance(params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances",
    data: params,
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 获取我的盟友列表;
function getMyAlliances() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/getAlliancesByUserId",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
      // "X-USER-ID": userId
    }
  });
}
// 获取盟友信息；根据X-USER-ID获取我的盟友信息,可以获取当月订单currentMonthOrder;
function getAllianceOrder() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/getAllianceInformationByUserId",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
      // "X-USER-ID": userId
    }
  });
}
// 获取盟友信息；根据盟友id获取我的盟友信息,携带自营商品selfProducts;
function getAllianceProducts(allianceId) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/getAllianceInformationByUserId/" + allianceId,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 删除盟友；
function delAlliance(allianceId) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/" + allianceId,
    data: {},
    method: "DELETE",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 获取盟友信息；
function getAllianceDetails(id) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/" + id,
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 更新盟友状态；
function changeship(phone) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/changeship/" + phone,
    data: { allianceShip: 0 },
    method: "POST",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 更新盟友信息；
function updateAlliance(id, params) {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/" + id,
    data: params,
    method: "PUT",
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
// 获取盟友信息；
function getAllianceMeal() {
  let app = getApp()
  return utils.promisify(wx.request)({
    url: API_HOST + "/rpc/alliance/alliances/setMeal",
    data: {},
    header: {
      "Authorization": app.globalData.token,
      "content-type": "application/json",
    }
  });
}
module.exports = {
  API_HOST,
  apiLogin,
  getPhoneCaptcha,
  checkPhoneCaptcha,
  bindPhone,
  getAd,
  getCategory,
  getAllProduct,
  getProductDetail,
  getRecommend,
  getProduct,
  getProductFavorite,
  updateCarts,
  getCarts,
  getAddressList,
  addAddress,
  delAddress,
  updateAddress,
  getOrderDetails,
  getOrder,
  getExpressCompanys,
  getExpressInfo,
  getOrderExpress,
  computeCarriage,
  addOrder,
  getOrderReminder,
  confirmOrder,
  delOrder,
  serviceOrder,
  checkWalletPassword,
  walletPassword,
  walletPay,
  walletCharge,
  walletChargePay,
  getWalletHistory,
  getCashQuery,
  ownerBalance,
  offlineWithdrawals,
  getRewardCash,
  wxPay,
  getProfile,
  addFriend,
  delFriend,
  updateFriend,
  getFriends,
  getFriendDetails,
  alliancePhone,
  registerPhone,
  changePhone,
  createAlliance,
  allianceGlobal,
  judgeAlliances,
  getAlliances,
  addAlliance,
  getMyAlliances,
  getAllianceOrder,
  getAllianceProducts,
  delAlliance,
  getAllianceDetails,
  changeship,
  updateAlliance,
  getAllianceMeal
}