Page({
  data: {
    addressList: []
  },
  jumppage() {
    wx.navigateTo({
      url: '../cgaddress/cgaddress',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('emitText', {
          text: '添加新地址'
        })
      }
    })
  },
  cgaddress(option) {
    console.log(option);
    wx.navigateTo({
      url: '../cgaddress/cgaddress',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('emitText', {
          text: '修改地址',
          index: option.currentTarget.dataset.index
        })
      }
    })
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let addressList = wx.getStorageSync('addressList')
    this.setData({
      addressList
    })
  }
})