var {getGoodsList} = require('../../api/require')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cartList:[],
      // 总价钱
      totalPrice:0,
      nocartList:[]
  },
  goDetail(option){
    wx.navigateTo({
      url: '../detail/detail',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('emitId', { id: option.currentTarget.dataset.id })
      }
    })
  },
  deletes(option){
    this.data.cartList.splice(option.currentTarget.dataset.index,1)
    let totalPrice = 0
    this.data.cartList.forEach(item => {
          totalPrice += item.goods_price*item.number
      });
    this.setData({
      cartList:this.data.cartList,
      totalPrice:totalPrice
    })

  },
  // 减数量
  reduceNum(option){
    if( this.data.cartList[option.currentTarget.dataset.index].number==1){
      return ;
    }
    this.data.cartList[option.currentTarget.dataset.index].number --
    this.gettatolPrice(this.data.cartList)
    
  },
  // 加数量
  addNum(option){
    
    this.data.cartList[option.currentTarget.dataset.index].number ++
    this.gettatolPrice(this.data.cartList)
  },
  onShow: function () {
    if(wx.getStorageSync('cartList')){
      let cartList = wx.getStorageSync('cartList')
      let totalPrice = 0
      cartList.forEach(item => {
          totalPrice += item.goods_price*item.number
      });
      this.setData({
        cartList:cartList,
        totalPrice:totalPrice
      })
    }else{
      this.setData({
        cartList:[],
        totalPrice:0
      })
    }
  },
  onLoad(){
    // wx.removeStorageSync('cartList')
    getGoodsList().then(data => {
      console.log(data);
      let goods = []
      data.data.message.goods.forEach(item => {
        if(item.goods_big_logo){
          goods.unshift(item)
        }
      })
      this.setData({
        nocartList:goods
      })
    })
  },
  gettatolPrice(cartList){
    let totalPrice = 0
    this.data.cartList.forEach(item => {
          totalPrice += item.goods_price*item.number
      });
    this.setData({
      cartList:cartList,
      totalPrice:totalPrice
    })
  },
  // 跳到订单页面
  goPage(){
    wx.navigateTo({
      url: '../order/order'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('cartList', this.data.cartList)
  }
})