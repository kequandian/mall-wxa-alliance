
# 生成用户token #
1. 在用户表 获取指定用户的 id, login_name, password, salt 的数据
2. 使用 genToken.jar 工具生成token
                                      id       login_name              password       salt
  例子：java -jar genToken.jar access  5  oNhTd4p9b1zG6BOMthL525w2Odhg    ""     a18f0409e7547870


##
    "pages/index/index",				    // tabBar首页;（进入小程序即进入此页）；
    "pages/category/category",				// tabBar分类页面
    "pages/myPage/myPage",				  	// tabBar 个人中心页面；
    "pages/cart/cart",					    // tabBar 购物车页面；
    "pages/search/search",				  	// 搜索页面(点击首页输入框进入该页面)；
    "pages/aaa/aaa",					
    "pages/logs/logs",					    // 日志页面
    "pages/product/product"				  	// 点击首页导航进入此页面；
    "pages/details/details"         		// 商品详情页；
    "pages/favorite/favorite"				// 收藏页面；
    "pages/address/address",                // 收货地址；
    "pages/setAddress/setAddress",          // 添加 修改收货地址；
    "pages/order/order",                    // 我的订单；
    "pages/order-details/order-details"     // 订单详情页；
