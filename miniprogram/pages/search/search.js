// pages/search/search.js
Page({
  data: {
    value: '',
    historySearchs: [],
  },
  changevalue(e) {
    this.setData({
      value: e.detail.value
    })
  },
  search(e) {
    let index = e.currentTarget.dataset.index
    console.log(index);
    if (index >= 0) {
      var _this = this
      wx.navigateTo({
        url: '../searchlist/searchlist',
        success: function (res) {
          res.eventChannel.emit("value", _this.data.historySearchs[index])
        }
      })
      return;
    }
    if (this.data.value.length < 1) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return;
    }
    let historySearchs = wx.getStorageSync('historySearchs')
    var _this = this
    wx.navigateTo({
      url: '../searchlist/searchlist',
      success: function (res) {
        console.log("value ==>", _this.data.value);
        res.eventChannel.emit("value", _this.data.value)
      }
    })
    if (!historySearchs) {
      wx.setStorageSync('historySearchs', [this.data.value])
    } else {
      for (let i = 0; i < historySearchs.length; i++) {
        if (historySearchs[i] == this.data.value) {
          return ;
        } else if (i ==historySearchs.length - 1) {
          historySearchs.unshift(this.data.value)
          wx.setStorageSync('historySearchs', historySearchs)
          this.setData({
            historySearchs
          })
         return ;
        }
      }
    }

   

  },
  // 删除历史列表
  deletes(e) {
    console.log(e);
    let historySearchs = this.data.historySearchs
    historySearchs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      historySearchs
    })
    wx.setStorageSync('historySearchs', historySearchs)
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let historySearchs = wx.getStorageSync('historySearchs')
    if (historySearchs) {
      this.setData({
        historySearchs
      })
    }
  }
})