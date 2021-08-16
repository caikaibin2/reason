Page({
  data: {
    cartList: [],
    totalPrice: 0,
    addressList: [],
    address: [],
    activeIndex: -1,
    isShowPageContainer: false
  },
  onLoad: function (options) {
    wx.enableAlertBeforeUnload({
      message:'是否取消支付',
      success:function(res){
        console.log("res ==>",res);
      }
    })
  },
  // 获取当前时间
  getNowTime: function () {
    let dateTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) :
      new Date().getMonth() + 1
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() :
      new Date().getDate()
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() :
      new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
      new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
      new Date().getSeconds()
    dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    return dateTime
  },
  onloadfun() {
    let cartList = wx.getStorageSync('cartList')
    if(!cartList){
      wx.disableAlertBeforeUnload()
      console.log(11);
      wx.navigateBack({
        delta: 1,
      })
      return ;
    }
    let totalPrice = 0
    cartList.forEach(item => {
      totalPrice += item.goods_price * item.number
    });
    this.setData({
      cartList,
      totalPrice
    })
    if (!wx.getStorageSync('orderList')) {
      wx.setStorageSync('orderList', [])
    }
    let addressList = wx.getStorageSync('addressList')
    console.log(addressList);
    this.setData({
      addressList
    })
    for (let i = 0; i < addressList.length; i++) {
      if (addressList[i][5].default) {
        this.setData({
          activeIndex: i,
          address: addressList[i]
        })
        return;
      }
    }
  },
  onShow: function () {
    this.onloadfun()
  },
  jumppay() {
    
    // wx.removeStorageSync('orderList')
   
    // return ;
    if (this.data.address.length == 0) {
      wx.showToast({
        title: '请选择地址',
      })
      return;
    }
    if (!wx.getStorageSync('orderList')) {
      wx.setStorageSync('orderList', [])
    }
    let orderList = wx.getStorageSync('orderList')
    let cartList = wx.getStorageSync('cartList')
    let count = 0
    cartList.forEach(item => {
      count += item.number
    })
    let dd = new Date()
    let obj = {}
    obj.totalCount = count
    obj.time = this.getNowTime()
    obj.id = dd.getTime()
    obj.state = 2
    obj.totalPrice = this.data.totalPrice
    obj.cartList = this.data.cartList
    obj.address = this.data.address
    orderList.unshift(obj)
    wx.setStorageSync('orderList', orderList)
    wx.removeStorageSync('cartList')
    wx.showLoading({
      title: '支付中...',
    })
    setTimeout(function () {
    wx.hideLoading()
    wx.showToast({
        title: '支付成功！',
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../allorder/allorder',
        })
      }, 1000)
    }, 2000)
  },
  radioChange(e) {
    console.log(e);
    this.setData({
      activeIndex: e.detail.value
    })
  },
  determine() {
    this.setData({
      address: this.data.addressList[this.data.activeIndex],
      isShowPageContainer: false
    })

  },
  // 点击选择收货
  cgisShowPageContainer() {
    this.setData({
      isShowPageContainer: true
    })
  },
  // 点击添加新地址
  addAddress() {
    wx.navigateTo({
      url: '../cgaddress/cgaddress',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('emitText', {
          text: '添加新地址'
        })
      }
    })
    this.setData({
      isShowPageContainer: false
    })
  },
  onUnload: function () {
    let cartList = wx.getStorageSync('cartList')
    if(cartList.length>0){
      let orderList = wx.getStorageSync('orderList')
      let count = 0
      cartList.forEach(item => {
        count += item.number
      })
      let dd = new Date()
      let obj = {}
      obj.totalCount = count
      obj.time = this.getNowTime()
      obj.id = dd.getTime()
      obj.state = 1
      obj.totalPrice = this.data.totalPrice
      obj.cartList = this.data.cartList
      obj.address = this.data.address
      orderList.unshift(obj)
      wx.setStorageSync('orderList', orderList)
      wx.removeStorageSync('cartList')
    }
  }
})