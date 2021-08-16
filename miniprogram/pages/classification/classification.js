var {getGoodscategories,getGoodsId} = require('../../api/require')
Page({

  data: {
    activeIndex: 0,
    itemIndex:0,
    allCommodity:[],
    scrollIndex:0,
  },
  switchTab(option){
    this.setData({
      activeIndex:option.currentTarget.dataset.activeindex,
      itemIndex:0
    })
    wx.setStorageSync('index', option.currentTarget.dataset.activeindex)
  },
  jumpDetail(option){
    console.log(option.currentTarget.dataset.value);
    let value = option.currentTarget.dataset.value
    if(value.indexOf('/')){
      value = value.split('/')[0]
    }
    // return ;
    wx.navigateTo({
      url: '../searchlist/searchlist',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('value',value)
      }
    })
  },
  onLoad: function (options) {
   
    getGoodscategories().then(data => {
      console.log("分类 ==>",data);
      this.setData({
        allCommodity:data.data.message
      })
    })
  },
  cgIndexItem(options){
    console.log(options);
    this.setData({
      itemIndex:options.currentTarget.dataset.acindex
    })
  },
  onReady: function () {

  },
  onShow: function () {
    console.log(wx.getStorageSync('index'));
    if (wx.getStorageSync('index')) {
      this.setData({
        activeIndex: wx.getStorageSync('index'),
        scrollIndex: wx.getStorageSync('index')
      })
    }

  },
})