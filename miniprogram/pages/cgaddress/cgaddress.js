// pages/cgaddress/cgaddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valueList: [{
        text: '姓名',
        value: '',
        placeholder: '收货人姓名'
      },
      {
        text: '电话',
        value: '',
        placeholder: '收货人电话'
      },
      {
        text: '地区',
        value: '',
        placeholder: '选择省/市/区'
      },
      {
        text: '详细地址',
        value: '',
        placeholder: '街道门牌、楼层房间号等'
      },
      {
        text: '邮政编码',
        value: '',
        placeholder: '当地邮政编码'
      }
    ],
    isdefault: false,
    index: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _this = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('emitText', function (data) {
      wx.setNavigationBarTitle({
        title: data.text
      })
      console.log(data);
      if (data.index >= 0) {
        _this.setData({
          index: data.index
        })
        let addressList = wx.getStorageSync('addressList')

        let arr = []
        for (let i = 0; i < 5; i++) {
          arr.push(addressList[data.index][i])
        }
        console.log(arr);
        _this.setData({
          valueList: arr,
          isdefault: addressList[data.index][5].default
        })
      }
    })
  },
  getValues() {
    if (!wx.getStorageSync('addressList')) {
      wx.setStorageSync('addressList', [])
    }
    for (let i = 0; i < this.data.valueList.length; i++) {
      if (i == 1 && this.data.valueList[i].value.length != 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (this.data.valueList[i].value.length == 0) {
        wx.showToast({
          title: '请填写全部信息再保存',
          icon: 'none',
          duration: 2000
        })
        return;
      }

    }
    let arrList = wx.getStorageSync('addressList')
    if (this.data.isdefault && arrList.length != 0) {
      arrList.forEach(item => {
        item[5].default = false
      });
    }
    let arr = this.data.valueList
    arr.push({
      default: this.data.isdefault
    })
    if (this.data.index < 0) {
      arrList.unshift(arr)
    } else {
      arrList[this.data.index] = arr
    }
    wx.setStorageSync('addressList', arrList)
    wx.showToast({
      title: '保存成功'
    })
    setTimeout(() => {
      wx.disableAlertBeforeUnload()
      wx.navigateBack({
        delta: 1
      })
    }, 1000)

  },
  change(option) {
    console.log(option);
    this.data.valueList[option.currentTarget.dataset.index].value = option.detail.value
    this.setData({
      valueList: this.data.valueList
    })
  },
  picker(value) {
    let str = value.detail.value.join('/')
    this.data.valueList[2].value = str
    this.setData({
      valueList: this.data.valueList
    })
  },
  // 设置默认地址
  default () {
    this.setData({
      isdefault: !this.data.isdefault
    })
  },
  deleteAddress() {
    let addressList = wx.getStorageSync('addressList')
    addressList.splice(this.data.index, 1)
    wx.setStorageSync('addressList', addressList)
    wx.showModal({
      title: '是否删除该收货地址',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功',
          })
          wx.disableAlertBeforeUnload()
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onShow: function () {
    wx.enableAlertBeforeUnload({
      message: "返回上一级则不保存编辑内容，是否继续返回"
    })
  },
  onUnload: function () {

  },
})