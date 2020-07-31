//const API_HOST = 'https://api.cloud.biliya.cn/rest'
const API_HOST = 'http://192.168.3.181:8080/rest'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 验证银行卡号；
function checkBankNumReg(bankNumber) {
  var regExpP = /^\d{16}|\d{19}$/; //手机号
  if (regExpP.test(bankNumber)) { //test检测$('#user_phone').val()是否符合regExp格式
    //$('#err-lgU').html('√ 检测通过').css('color', 'green');
    return true;
  }
  return false;
}
// 验证手机号码；
function checkUserPhoneReg(phone) {
  var regExpP = /^1[34578]\d{9}$/; //手机号
  if (regExpP.test(phone)) { //test检测$('#user_phone').val()是否符合regExp格式
    //$('#err-lgU').html('√ 检测通过').css('color', 'green');
    return true;
  }
  return false;
}
function checkAddZone(num) {
  return num < 10 ? '0' + num.toString() : num
}
// 时间戳转年月日；
function dateFormatter(t) {
  if (!t) return ''
  t = new Date(t).getTime()
  t = new Date(t)
  var year = t.getFullYear()
  var month = (t.getMonth() + 1)
  month = checkAddZone(month)

  var date = t.getDate()
  date = checkAddZone(date)

  var hour = t.getHours()
  hour = checkAddZone(hour)

  var min = t.getMinutes()
  min = checkAddZone(min)

  var se = t.getSeconds()
  se = checkAddZone(se)

  // return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + se
  return year + '-' + month + '-' + date
}
// 时间戳转年月日 时分秒；
function dateTimeFormatter(t) {
  if (!t) return ''
  t = new Date(t).getTime()
  t = new Date(t)
  var year = t.getFullYear()
  var month = (t.getMonth() + 1)
  month = checkAddZone(month)

  var date = t.getDate()
  date = checkAddZone(date)

  var hour = t.getHours()
  hour = checkAddZone(hour)

  var min = t.getMinutes()
  min = checkAddZone(min)

  var se = t.getSeconds()
  se = checkAddZone(se)

  return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + se
  // return year + '-' + month + '-' + date
}
// 获取当前年月日；
function getNowDate() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDay()

  return `${y}-${m}-${d}`
}
/*根据出生日期算出年龄*/
function getAge(strBirthday) {
  console.log("typeof(strBirthday)==", typeof (strBirthday))
  // if (typeof (strBirthday) === "number") {
  //   let time = moment(baseTime).format()
  //   let date = new Date(time);
  //   strBirthday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  // }
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];

  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0;//同年 则为0岁
  }
  else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay;//日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
      else {
        var monthDiff = nowMonth - birthMonth;//月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
    }
    else {
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge;//返回周岁年龄

}

function promisify(api, index) {
  const app = getApp()
  if (!index) {
    index = 1
  }

  let data = {};
  return (...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, { success: resolve, fail: reject }, ...params));
    })
    .then(res => {
      // console.log("promisify--res==", res)

      if (res.statusCode === 200) {
        if (res.data.status_code === 401) {
          index += 1
          if (index < 4) {
            app.login("", function (res) {
              if (res.data && res.data.data && res.data.data.access_token) {
                promisify(api, index)
              } else {
              }
            })
          } else {
            return res
          }
        } else if (res.data.status_code === 1 && res.data.message === "not.valid.alliance") {
          console.log('util--promisify--/pages/register/index')
          openPage2("/pages/register/index", "redirect")
          // return false
        } else {
          return res
        }
      } else {
        return res
      }
    })
    .catch(res => {
      return res
    })
  };
}

/**
 * 处理前后空格和回车
 */
//开始
function trimHandler(params) {
  return Array.isArray(params) ? trimArray(params) : trimObject(params);
}
function trimArray(params) {
  return params.map(param => {
    return trimObject(param);
  })
}
function trimObject(params) {
  if (typeof (params) !== 'object') {
    return params;
  }
  Object.keys(params).map(param => {
    const value = params[param];
    if (value && typeof (value) === 'string') {
      const res = value.replace(/(^\s*)|(\s*$)/g, "");
      params[param] = res;
      if (res === "") {
        delete params[param];
      }
    }
    if (value && value instanceof Array) {
      params[param] = trimArray(value);
    }
  });
  return params;
}
//结束

function openPage2(url, openType, that) {
  console.log("openPage2--openType==", openType)
  var app = getApp()
  var pages = getCurrentPages()
  if (openType == "redirect") {
    wx.redirectTo({
      url: url
    })
  } else if (openType == "switchTab") {
    wx.switchTab({
      url: url
    })
    wx.hideLoading()

  } else if (openType == "reLaunch") {
    wx.reLaunch({
      url: url
    })
    wx.hideLoading()

  } else if (openType == "navigateBack") {
    wx.reLaunch({
      url: url
    })
    wx.hideLoading()

  } else if (openType == "back") {
    console.log('openPage-----back---url', url)
    wx.navigateBack({
      delta: parseInt(url)
    })
    wx.hideLoading()

  } else if (openType == "navigate" || openType == "" || openType == undefined) {
    console.log('openPage---openType--URL', url)
    if (pages.length >= 9) {
      wx.reLaunch({
        url: url
      })
      wx.hideLoading()

    } else {
      wx.navigateTo({
        url: url
      })
      wx.hideLoading()
    }
  }
}

function openPage(e, that, special) {
  console.log('utils-----openPage---e', e)
  var pages = getCurrentPages()
  var type = e.type

  if (special) {
    var url = e.currentTarget.dataset.url
    openPage2(url, 'tap', that)
  } else {
    if (type == 'back') {
      openPage2(1, 'back', that)
    } else if (type == 'home') {
      var url = e.currentTarget.dataset.url
      openPage2(url, '', that)
    } else if (type == 'tap') {
      var url = e.currentTarget.dataset.url
      if (url) {
        var openType = e.currentTarget.dataset.openType
        openPage2(url, openType, that)
      } else {
        wx.showToast({
          title: '暂未开发改模块',
          icon: 'none'
        })
      }
    }
  }
}
function getUserInfo(e, that, cb) {
  var app = getApp()
  console.log('utils----getUserInfo--e', e)
  if (e.detail.errMsg == "getUserInfo:fail auth deny") {
    that.setData({
      loginPopup: true
    })
  } else if (e.detail.errMsg == "getUserInfo:ok") {
    that.setData({
      loginPopup: false
    })
    app.login(e.detail, that, cb)
  }
}
function returnStatusName(status) {
  switch(status) {
    case "1":
      return "未支付"
      break;
    default:
      return "其他"
      break;
  }
}

module.exports = {
  formatTime,
  checkBankNumReg,
  checkUserPhoneReg,
  dateFormatter,
  dateTimeFormatter,
  getNowDate,
  getAge,
  promisify,
  openPage,
  openPage2,
  getUserInfo,
  returnStatusName,
  trimHandler
}
