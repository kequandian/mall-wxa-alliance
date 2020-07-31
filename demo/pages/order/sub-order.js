var md5 = require('../../utils/md5.js');
var app = getApp()

Page({
    /*页面的初始数据*/
    data: {
        showCoupon: false,
        isWay: false,
        runAM: false,
        isAddress: false,
        isCoupon: false,
        isStore: false,
        products: [],
        addressIndex: -1,
        couponIndex: -2,
        product_price: 0,
        total_price: 0,
        couponList: [],
        wayName: 'EXPRESS',
        storeIndex: -1,
        wayText: '快递运输',
        carriage: 0,
        remark: '',
        credit_offset: 0,
        total_credit: 0,
        pay_credit: 0,
        jf_switch: false,
    },
    showCoupon() {
        var that = this
        if (that.data.couponList.length) {
            that.setData({
                showCoupon: true,
            })
        }
    },
    //积分抵扣；
    creditPayment: function() {
        var that = this
        var users = that.data.users
        var jf_switch = that.data.jf_switch
        var total_credit = that.data.total_credit
        var credit_offset = 0
        if (jf_switch) {
            if (users.grade.creditCashPlanEnabled == 1) {
                if (users.credit < total_credit) {
                    credit_offset = parseFloat(users.credit / users.grade.creditCashPlan * users.grade.creditWinCash).toFixed(2)
                    that.data.pay_credit = users.credit
                } else {
                    credit_offset = parseFloat(total_credit / users.grade.creditCashPlan * users.grade.creditWinCash).toFixed(2)
                    that.data.pay_credit = total_credit
                }
                that.data.credit_offset = credit_offset
                return credit_offset
            } else {
                credit_offset = 0
                that.data.credit_offset = credit_offset
                return credit_offset
            }
        } else {
            credit_offset = 0
            that.data.credit_offset = credit_offset
            return credit_offset
        }
    },
    // 积分开关;
    creditSwitch: function(event) {
        console.log('creditSwitch----event', event)
        this.data.jf_switch = event.detail.value
        this.calculate()
    },
    // 支付；
    wxPay: function(order_number) {
        var that = this
        var post_order = {
            "order_number": order_number,
            "order_type": "Order",
            "type": "WXA"
        }
        app.wxRequest('wx/push_order', post_order, 'POST', that, function(res) {
            console.log('wxPay----res', res)
            if (res.data.status_code == 0) {
                wx.requestPayment({
                    "timeStamp": res.data.data.timeStamp,
                    "nonceStr": res.data.data.nonceStr,
                    "package": res.data.data.package,
                    "signType": res.data.data.signType,
                    "paySign": res.data.data.paySign,
                    success: function(res) {
                        console.log('requestPayment----res', res)
                        if (res.errMsg == "requestPayment:ok") {
                            app.openPage('../payment/payment?order_number=' + order_number)

                            // app.openPage('../order-details/order-details')
                        }
                    },
                    fail: function(e) {
                        console.log('fail----e', e)
                        wx.showToast({
                            title: '支付失败',
                            image: '../../images/fail.png',
                            duration: 1000
                        })
                        // app.openPage('../payment/payment?order_number=' + order_number)
                        // app.openPage('../order-details/order-details?order_number='+order_number)
                    }
                })
            } else if (res.data.status_code == 1) {
                wx.showToast({
                    title: '支付失败',
                    image: '../../images/fail.png'
                })
            }
        })
    },
    // 留言；
    getRemark: function(event) {
        console.log('getRemark---event', event)
        this.data.remark = event.detail.value
    },
    confirm: function(event) {
        this.setData({
            isWay: false
        })
    },
    // 选择门店；
    selSrore: function(event) {
        var storeIndex = event.currentTarget.dataset.index
        var storeList = this.data.storeList
        if (storeIndex != -1) {
            var store_name = storeList[storeIndex].name
            var store_id = storeList[storeIndex].id
            this.setData({
                storeIndex: storeIndex,
                store: storeList[storeIndex],
                isStore: !this.data.isStore
            })
        }
    },
    selWay: function(event) {
        console.log('selWay----event', event)
        var wayName = event.currentTarget.dataset.wayName

        if (wayName == 'EXPRESS') {
            this.setData({
                wayName: wayName,
                storeIndex: -1,
                store: null,
                wayText: '快递运输'
            })
        } else if (wayName == 'FLASH') {
            this.setData({
                wayName: wayName,
                storeIndex: -1,
                store: null,
                wayText: '极速送达'
            })
        } else if (wayName == 'SELF_PICK') {
            this.setData({
                wayName: wayName,
                isStore: !this.data.isStore,
                wayText: '自提门店'
            })
        }
        this.Carriage(this.data.options, this.data.address)
    },
    getStore: function() {
        console.log('门店')
        var that = this
        app.wxRequest2('store/stores?type=Store', {}, 'GET', that, function(res) {
            console.log('店铺', res)
            if (res.statusCode == 200) {
                if (res.data.data.records.length > 0) {
                    that.setData({
                        storeList: res.data.data.records
                    })
                } else {
                    that.setData({
                        storeList: []
                    })
                }
            }
        })
    },
    // 计算实付金额；
    calculate: function() {
        console.log('计算总金额')
        var that = this
        var couponIndex = that.data.couponIndex
        var couponList = that.data.couponList
        var product_price = that.data.product_price
        var carriage = that.data.carriage
        var total_price = that.data.total_price
        var credit_offset = that.creditPayment()
        console.log('product_price,1233333333333333', product_price)
        console.log('calculate----that.creditPayment()', that.creditPayment())
        var coupon_price = 0
        if (couponIndex == -1 || couponIndex == -2) {
            total_price = product_price + carriage - credit_offset
            coupon_price = 0
        } else {
            // total_price = couponList[couponIndex].final_price + carriage - credit_offset
            if (couponList[couponIndex].c_type == 'full') {
                if (product_price >= couponList[couponIndex].climit) {
                    total_price = parseFloat(product_price + carriage - couponList[couponIndex].worth).toFixed(2)
                } else {
                    total_price = parseFloat(product_price + carriage).toFixed(2)
                }
            } else if (couponList[couponIndex].c_type == 'discount') {
                total_price = parseFloat(product_price * couponList[couponIndex].discount / 10 + carriage).toFixed(2)
            }
            console.log('couponList[couponIndex].final_price,', couponList[couponIndex].final_price)
            coupon_price = parseFloat(product_price - couponList[couponIndex].final_price).toFixed(2)
        }
        console.log('parseFloat(total_price).toFixed(2),', parseFloat(total_price).toFixed(2))
        that.setData({
            total_price: parseFloat(total_price).toFixed(2),
            credit_offset: credit_offset,
            coupon_price: coupon_price

        })
    },
    goAddress: function(event) {
        console.log('goAddress---event', event)
        app.openPage('../address/address?origin=sub-order&selIndex=' + this.data.addressIndex)
    },
    goCoupon: function(event) {
        console.log('goCoupon---event', event)
        var couponList = this.data.couponList
        if (couponList.length > 0) {
            var coupons = JSON.stringify(couponList)
            app.openPage('../coupon/coupon?origin=sub-order&coupons=' + coupons)
        }
    },
    // 提交；
    sub: function(event) {
        var that = this
        var coupon = that.data.coupon
        var wayName = that.data.wayName
        var storeIndex = that.data.storeIndex
        var store = that.data.store
        var address = that.data.address
        var addressIndex = that.data.addressIndex
        var post_order = {}
        console.log("sub---address==", address)
        console.log("sub---addressIndex==", addressIndex)
        if (addressIndex == -1) {
            wx.showToast({
                title: '请设置收货信息',
                icon: 'none'
            })
            return
        } else if (wayName == 'SELF_PICK') {
            if (storeIndex == -1) {
                wx.showToast({
                    title: '请选择自提门店',
                    icon: 'none'
                })
                return
            } else {
                post_order = {
                    "contact": address,
                    "delivery_type": "SELF_PICK",
                    "origin": "MINI_PROGRAM",
                    "pay_credit": 0,
                    "invoice_title": "",
                    "order_items": this.data.options,
                    "invoice": 0,
                    "receiving_time": "",
                    "payment_type": "WECHAT",
                    "store_id": store.id,
                    "store_name": store.name,
                    "remark": that.data.remark,
                    "pay_credit": that.data.pay_credit
                }
            }
        } else if (wayName == 'EXPRESS') {
            post_order = {
                "contact": address,
                "coupon_id": null,
                "delivery_type": "EXPRESS",
                "origin": "MINI_PROGRAM",
                "pay_credit": 0,
                "invoice_title": "",
                "order_items": this.data.options,
                "invoice": 0,
                "receiving_time": "",
                "payment_type": "WECHAT",
                "remark": that.data.remark,
                "pay_credit": that.data.pay_credit
            }
        } else if (wayName == 'FLASH') {
            post_order = {
                "contact": address,
                "coupon_id": null,
                "delivery_type": "FLASH",
                "origin": "MINI_PROGRAM",
                "pay_credit": 0,
                "invoice_title": "",
                "order_items": this.data.options,
                "invoice": 0,
                "receiving_time": "",
                "payment_type": "WECHAT",
                "remark": that.data.remark,
                "pay_credit": that.data.pay_credit
            }
        }
        if (that.data.couponList && that.data.couponIndex >= 0) {
            var userid = that.data.users.userid
            var secretKey = "8e66e5081b9b6d27"
            var ctime = new Date().getTime()
            console.log("getCoupon3----ctime==", ctime)
            var signature = md5.hexMD5(userid + secretKey + ctime)
            console.log("getCoupon3----signature==", signature)
            post_order.ext = {
                coupon_id: that.data.couponList[that.data.couponIndex].id.toString(),
                coupon_type: that.data.couponList[that.data.couponIndex].c_type,
                cuts: parseInt(that.data.couponList[that.data.couponIndex].worth),
                discount: that.data.couponList[that.data.couponIndex].discount,
                user_type: that.data.couponList[that.data.couponIndex].usertype.toString(),
            }
        }
        app.wxRequest('order', post_order, 'POST', that, function(res) {
            console.log("提交订单----res", res)
            console.log("提交订单----post_order", JSON.stringify(post_order))
            if (res.statusCode == 200) {
                if (that.data.couponList && that.data.couponIndex >= 0) {
                    var userid = that.data.users.userid
                    var secretKey = "8e66e5081b9b6d27"
                    var ctime = new Date().getTime()
                    console.log("getCoupon3----ctime==", ctime)
                    var signature = md5.hexMD5(userid + secretKey + ctime)
                    console.log("getCoupon3----signature==", signature)
                    var post_coupon = {
                        userid: userid,
                        ctime: ctime,
                        signature: signature,
                        couponid: that.data.couponList[that.data.couponIndex].id.toString(),
                        order: res.data.data.id,
                        status: 2
                    }
                    app.wxRequest3('checkcoupon', post_coupon, 'POST', that, function(res) {})
                }
                that.wxPay(res.data.data.order_number)
            }
        })
    },
    // 选择优惠券；
    selCoupon: function(e) {
        var that = this
        console.log('selCoupon----e', e)
        // var couponId = e.currentTarget.dataset.couponId
        // this.chanMask({
        //     maskType: 'coupon'
        // })

        var index = e.currentTarget.dataset.index
		var couponIndex = that.data.couponIndex
		if (couponIndex != index) {
			couponIndex = index
		} else {
			couponIndex = -1
		}
		that.setData({
			couponIndex: couponIndex,
			showCoupon: false
		})
		that.calculate()

    },
    // 选择收货地址；
    selAddress: function(event) {
        console.log('selAddress----event', event)
        var index = event.currentTarget.dataset.index
        this.setData({
            addressIndex: index,
            address: this.data.addressList[index]
        })
        this.chanMask({
            maskType: 'address'
        })
    },
    // 显示收货地址或优惠券；
    chanMask: function(event) {
        console.log('chanMask---event222', event)
        var maskType
        if (event.currentTarget.dataset.maskType) {
            maskType = event.currentTarget.dataset.maskType
        } else if (event.maskType) {
            maskType = event.maskType
        }
        var isShow = this.data.show ? false : true;
        var delay = isShow ? 30 : 500;

        if (maskType == 'address') {
            if (this.data.addressIndex == -1) {
                return
            }
            this.setData({
                isAddress: !this.data.isAddress
            })
        } else if (maskType == 'coupon') {
            if (this.data.couponIndex == -1) {
                return
            }
            this.setData({
                isCoupon: !this.data.isCoupon
            })
        } else if (maskType == 'store') {
            this.setData({
                isStore: !this.data.isStore
            })
        } else if (maskType == 'way') {
            this.setData({
                isWay: !this.data.isWay
            })
        }
    },
    // 计算运费；
    Carriage: function(products, address) {
        console.log('Carriage---products', products)
        console.log('Carriage---address', address)
        var that = this
        if (!products || !address) {
            console.log('没有')
            return null
        }
        var post_carriage = {
            "province": address.province,
            "city": address.city,
            "data": products,
            "delivery_type": that.data.wayName
        }
        app.wxRequest('product_carriage', post_carriage, 'POST', that, function(res) {
            console.log('计算运费---res', res)
            that.setData({
                carriage: res.data.data.carriage,
            })
            that.calculate()
        })
    },
    // 获取收货地址；
    getAddress: function() {
        var that = this
        app.wxRequest('contact', {}, 'GET', that, function(res) {
            console.log('收货地址----res', res)
            if (res.statusCode == 200) {
                var addressList = res.data.data
                var addressIndex = -1
                var address = {}
                if (addressList.length) {
                    for (var i = 0; i < addressList.length; i++) {
                        if (addressList[i].is_default == 1) {
                            addressIndex = i
                        }
                    }
                    if (addressIndex == -1) {
                        addressIndex = 0
                    }
                    address = addressList[addressIndex]
                    that.Carriage(that.data.options, addressList[addressIndex])
                }
                that.setData({
                    addressIndex: addressIndex,
                    addressList: addressList,
                    address: address
                })
                console.log('addressIndex--', addressIndex)
            }
        })
    },
    // 获取优惠券；
    getCoupon: function(products) {
        console.log('getCoupon----products', products)
        var that = this
        app.wxRequest('coupon_calculation', products, 'POST', that, function(res) {
            console.log('优惠券----res', res)
            if (res.statusCode == 200) {
                var couponList = res.data.data
                if (couponList.length > 0) {
                    that.data.couponIndex = 0
                } else {
                    return
                }
                that.setData({
                    couponIndex: that.data.couponIndex,
                    couponList: couponList,
                    coupon: couponList[that.data.couponIndex],
                    coupon_price: parseFloat(that.data.product_price - couponList[that.data.couponIndex].final_price).toFixed(2)
                })
                that.calculate()
            }
        })
    },
    getCoupon3() {
        var that = this
		wx.showLoading({
			title: '',
		})
        var userid = that.data.users.userid
        var secretKey = "8e66e5081b9b6d27"
        var ctime = new Date().getTime()
        console.log("getCoupon3----ctime==", ctime)
        var signature = md5.hexMD5(userid + secretKey + ctime)
        console.log("getCoupon3----signature==", signature)
        var post_data = {
            userid: userid,
            ctime: ctime,
            signature: signature
        }
        app.wxRequest3('get_coupon', post_data, 'POST', that, function(res) {
            console.log("getCoupon3---res==", res)
			wx.hideLoading()
            if (res.data.code == 200) {
                // res.data.data = [
                // 	{
                // 		"id": 11,
                // 		"title": "ceshi2",
                // 		"climit": "0.00",
                // 		"worth": "0.00",
                // 		"discount": "6.00",
                // 		"c_type": "discount",
                // 		"start_time": 1559664000,
                // 		"end_time": 1561132799,
                // 		"status": 1,
                // 		"is_kol": 1,
                // 		"usertype": 1
                // 	},
                // 	{
                // 		"id": 10,
                // 		"title": "ceshi",
                // 		"climit": "20.00",
                // 		"worth": "10.00",
                // 		"discount": "0.00",
                // 		"c_type": "full",
                // 		"start_time": 1559577600,
                // 		"end_time": 1559923199,
                // 		"status": 1,
                // 		"is_kol": 0,
                // 		"usertype": 1
                // 	}
                // ]
                if (res.data.data) {

                    that.setData({
                        couponList: res.data.data
                    })
                } else {
                    that.setData({
                        couponList: []
                    })
                }
            }
        })
    },

    // 获取商品；
    getProduct: function(product_id, quantity) {
        var that = this
        wx.showLoading({
            title: '',
        })
        console.log('getProduct---product_id', product_id)
        console.log('getProduct---quantity', quantity)

        // var aaa = that.creditPayment()
        // console.log('product_price----价格',product_price)
        app.wxRequest('product/' + product_id, {}, 'GET', that, function(res) {
            console.log('res', res)
            res.data.data.quantity = quantity
            var product_price = Number(that.data.product_price)
            wx.hideLoading()
            if (res.statusCode == 200) {
                // res.data.data.quantity = options[i].quantity
                that.data.total_credit += res.data.data.credit
                that.data.products.push(res.data.data)
                that.data.product_price = product_price + parseFloat(res.data.data.price).toFixed(2) * res.data.data.quantity

                console.log('that.data.product_price---商品价格', that.data.product_price)
                console.log('getProduct-----products', that.data.products)
                console.log('that.data.total_credit---积分', that.data.total_credit)
                that.setData({
                    products: that.data.products,
                    product_price: parseFloat(that.data.product_price).toFixed(2),
                    total_credit: that.data.total_credit,
                })
                that.calculate()
                console.log('getProduct---product_price', that.data.product_price)
            }
        })
    },
    /*生命周期函数--监听页面加载*/
    onLoad: function(options) {
        var that = this;
        var options = JSON.parse(options.products)
        console.log('sub-order--onload--options==', options)
        that.data.options = options
        var post_coupon = []
        if (options.length > 0) {
            var product_price = 0
            for (var i = 0; i < options.length; i++) {
                var price = 0
                price = Number(options[i].price) * options[i].quantity
                post_coupon[i] = {
                    "product_id": options[i].product_id,
                    "price": price
                }
                that.getProduct(options[i].product_id, options[i].quantity)
            }
        }
        app.getUser(function(users) {
            console.log('个人信息--res', users)
            if (users) {
                that.setData({
                    users: users
                })
            } else {
                that.setData({
                    users: {}
                })
            }
            that.getCoupon3()
        })
        that.getAddress()
        console.log('post_coupon', post_coupon)
        // that.getCoupon(post_coupon)
        that.getStore()

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