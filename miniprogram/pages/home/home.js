var {
  getHomeBanner,
  getGoodsList,
  getGoodscategories
} = require('../../api/require')
// pages/home/home.js
Page({
  data: {
    bannerList: [],
    goodsList: [],
    height:292,
    typeList:[],
    isshowAlltype:false
  },
  // 跳转到分类页面
  jumpTabar(option) {
    console.log(option)
    wx.setStorageSync('index', option.currentTarget.dataset.index)
    wx.switchTab({
      url: '../classification/classification',
      success: function (res) {
        
      }
    })
  },
  goSearchPage(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 跳转到详情页面
  jumpDetail(option) {
    console.log(option);
    wx.navigateTo({
      url: '../detail/detail',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('emitId', { id: option.currentTarget.dataset.id })
      }
      
    })
  },
  // 是否显示所有类型图标
  showAlltype(){
    console.log(this.data.isshowAlltype);
      this.setData({
        height:this.data.isshowAlltype?292:890,
        isshowAlltype:!this.data.isshowAlltype
      })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getHomeBanner().then(data => {
      this.setData({
        bannerList: data.data.message
      })
    })
    getGoodsList().then(data => {
      console.log(data);
      let arr = []
      data.data.message.goods.forEach(element => {
        if (element.goods_big_logo) {
          arr.push(element)
        }
      });
      this.setData({
        goodsList: arr
      })
    })
    getGoodscategories().then(data => {
      this.setData({
        typeList:data.data.message
      })
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