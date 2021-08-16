// pages/my/my.js
Page({
  data: {
    isshowUser:false,
    name:null,
    url: 'https://p3.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg',
    businessList:[
      {id:'01',name:'我的收藏'},
      {id:'02',name:'我的订单'},
      {id:'03',name:'我的地址'},
      {id:'04',name:'联系客服'}
    ]
  },
  // 获取用户信息
  getInfo(){
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("res ==>",res);
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          isshowUser: true,
          url: res.userInfo.avatarUrl,
          name:res.userInfo.nickName
        })
      }
    })
  },
  // 跳转页面
  jumpPage(option){
    console.log(option);
    let index = option.currentTarget.dataset.index
    
    if(index == 0){
      // 跳转到收藏页面
      wx.navigateTo({
        url: '../searchlist/searchlist',
        success:function(res){
          res.eventChannel.emit('emitType','我的收藏')
        }
      })
    }else if(index == 1){
      // 跳转到我的订单页面
      wx.navigateTo({
        url: '../allorder/allorder'
      })
    }else if(index == 2){
      // 跳转到我的地址页面
      wx.navigateTo({
        url: '../address/address',
      })
    }else if(index==3){
      wx.showToast({
        title: '还未开通客服服务功能，造成不便请见谅',
        icon: 'none',
        duration: 3000,
        mask:'true'
      })
    }
  },
 
  onLoad: function (options) {

  },
  onShow: function () {
    if(wx.getStorageSync('userInfo')){
      this.setData({
        isshowUser: true,
        url: wx.getStorageSync('userInfo').avatarUrl,
        name:wx.getStorageSync('userInfo').nickName
      })
    }
  },

 
})