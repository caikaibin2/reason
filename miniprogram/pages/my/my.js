// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    isshouquan:false
  },

  jumpPage(){
    wx.navigateTo({
      url: '../allbookkeep/allbookkeep',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shouquan()
    
   
  },
  // 是否授权
  shouquan(){
    var userInfo = wx.getStorageSync('userInfo')
    // 是否授权
    if(userInfo){
      this.setData({
        userInfo,
        isshouquan:true
      })
    }
  },
  // 获取用户信息
  obtainInfo(){
    wx.getUserProfile({
      desc: '用于获取用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
       console.log("res ==> ",res);
       var userInfo = res.userInfo
        wx.setStorageSync('userInfo',userInfo)
        this.setData({
          userInfo,
          isshouquan:true
        })
      }
    })
  }
})