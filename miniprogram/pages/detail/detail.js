// pages/detail/detail.js
const {
  getGoodsDetail
} = require('../../api/require')
Page({
  data: {
    detail: [],
    cartLength: 0,
    like: false
  },
  addCart() {
    let _this = this
    if (wx.getStorageSync('cartList').length == 0 || !wx.getStorageSync('cartList')) {
      this.data.detail.number = 1
      let detail = this.data.detail
      wx.setStorageSync('cartList', [detail])
      this.copyCartLength()
      wx.showToast({
        title: '成功加入购物车',
        icon: 'success',
        duration: 2000
      })
      console.log("没有数据");
      return
    } else {

      let cartList = wx.getStorageSync('cartList')
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].goods_id == _this.data.detail.goods_id) {
          console.log("有一样的ID")
          wx.showModal({
            title: '检测到购物车已有该商品，是否在其数量上添加1',
            content: '提示：可在购物车直接修改数量',
            success(res) {
              if (res.confirm) {
                cartList[i].number = cartList[i].number + 1
                wx.setStorageSync('cartList', cartList)
                _this.copyCartLength()

              }
            }
          })
          return;
        } else if (i == cartList.length - 1 && cartList[i].goods_id != _this.data.detail.goods_id) {
          console.log("最后添加")
          _this.data.detail.number = 1
          let detail = _this.data.detail
          cartList.unshift(detail)
          wx.setStorageSync('cartList', cartList)
          _this.copyCartLength()
          wx.showToast({
            title: '成功加入购物车',
            icon: 'success',
            duration: 2000
          })
          return;
        }
      }

    }
  },
  onShow:function (){
  this.copyCartLength()
  },
  onLoad: function (options) {
    

    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    var _this = this
    eventChannel.on('emitId', function (data) {
      getGoodsDetail({
        goods_id: data.id
      }).then(data => {
        console.log("详情页面", data);
        let likeList = wx.getStorageSync('likeList')
        console.log(data.data.message);
        console.log(likeList);
        
        if (!likeList) {
          wx.setStorageSync('likeList', [])
        } else {
          for (let i = 0; i < likeList.length; i++) {
            if(likeList[i].goods_id ==data.data.message.goods_id ){
              _this.setData({
                like: true
              })
              continue ;
            }
          }
          
        }
        _this.setData({
          detail: data.data.message
        })
      })
    })
  },
  like() {
    this.setData({
      like: !this.data.like
    })
  },
  // 获取购物车的数量
  copyCartLength() {
    this.setData({
      cartLength: wx.getStorageSync('cartList').length
    })
  },
  // 去首页
  gohome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  gocart() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  setlikeList(){
    // wx.removeStorageSync('likeList')
    // return ;
    let likeList = wx.getStorageSync('likeList')
    console.log(this.data.like);
    if (likeList.length == 0 && this.data.like) {
      wx.setStorageSync('likeList', [this.data.detail])
    } else if (likeList.length > 0) {
      console.log(likeList.length);
      if (this.data.like) {
        for (let i = 0; i < likeList.length; i++) {
          if(likeList[i].goods_id ==this.data.detail.goods_id ){
            return ;
          }else if(likeList.length-1 == i){
            likeList.unshift(this.data.detail)
            wx.setStorageSync('likeList', likeList)
            return ;

          }
        }
      }
       else if (!this.data.like ) {
        for (let i = 0; i < likeList.length; i++) {
          if(likeList[i].goods_id ==this.data.detail.goods_id ){
            likeList.splice(i, 1)
               wx.setStorageSync('likeList', likeList)
            return ;
          }else if(likeList.length-1 == i){
           return ;
          }
        }
      }
    }
  },
  onUnload: function () {
    this.setlikeList()
  }
})