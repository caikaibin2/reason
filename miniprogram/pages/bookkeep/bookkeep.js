// miniprogram/pages/bookkeep/bookkeep.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示骨架屏
    loading:true,
     // 收入支出的index
     activeIndex:0,
     // 收入支出类型
     typelist:[
       {
         title:"收入",
         type:'sr'
       },
       {
         title:"支出",
         type:"zc"
       }
     ],
    // 选择icon列表的index
    iconIndex:0,
    // icon类型列表以及文字
    typeIcons:[],

    // 支付账号类型索引
    payTypeIndex:0,
    // 支付账号类型
    payTypelist:[
      {
        name:"现金",
        type:'xj'
      },
      {
        name:"支付宝",
        type:'zfb'
      },
      {
        name:"微信",
        type:'wx'
      },
      {
        name:"信用卡",
        type:'xyk'
      },
      {
        name:"存蓄卡",
        type:'cxk'
      },
    ],
    // 选择日期
    date:'选择日期',
    // 最后日期
    endDate:'',
    // 金额
    price:'',
    remarks:""
  },
  onLoad:function(){
    wx.showLoading({
      title: '加载中...',
    })
    this.cloudfunction()
    // 获取当前时间
    this.nowDate()
  },
  // 保存
  determine(){
    var userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo ==>",!userInfo);
    // 是否授权
    if(!userInfo){
      this.getUserProfile()
      return ;
    }
    
    if(this.data.date =="选择日期"){
      return wx.showToast({
        title: '请选择日期',
        icon:'none',
        duration:2000
      })
    }
    if(this.data.price.length == 0 ){
      return wx.showToast({
        title: '填写金额',
        icon:'none',
        duration:2000
      })
    }
     setTimeout(()=> {
      wx.showLoading({
        title: '保存中...',
        mask:true
      })
      // 收入支出类型
      let type = this.data.typelist[this.data.activeIndex];
      // 哪个区域的花费和支出
      let typeIcons = this.data.typeIcons[this.data.iconIndex];
      // 哪种方式支出或收入
      let payType = this.data.payTypelist[this.data.payTypeIndex];
      
      let data = {
        type,
        typeIcons,
        payType,
        price:Number(this.data.price).toFixed(2),
        date:this.data.date,
        remarks:this.data.remarks,
        sqlName:'history-list'
      }
      wx.cloud.callFunction({
        name:"add_data",
        data,
      }).then(res => {
        if(res.result){
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            duration:2000,
            mask:true
          })
          // 初始化数据
          this.setData({
             // 收入支出的index
            activeIndex:0,
            // 选择icon列表的index
            iconIndex:0,
            // 选择日期
            date:'选择日期',
            // 金额
            price:'',
            remarks:"",
            // 支付类型
            payTypeIndex:0

          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '保存失败稍后再试！',
            duration:2000,
            mask:true
          })
        }
      })
    },200)
  },
  // 调用云函数
  cloudfunction(){
    wx.cloud.callFunction({
      name:"get_type_icons"
    }).then(res => {
      this.setData({
        typeIcons:res.result.data
      })
      this.setData({
        loading:false
      })
      wx.hideLoading()
     
    })
  },
  // 切换类型
  switchType(e){
    if(e.currentTarget.dataset.index == this.data.activeIndex){
      return ;
    }
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
  },
  // 切换icon图标列表
  changeIcon(e){
    this.setData({
      iconIndex:e.currentTarget.dataset.index
    })
  },
  // 改变支付账号类型索引
  changepayTypeIndex(e){
    this.setData({
      payTypeIndex:e.currentTarget.dataset.index
    })
  },
  // 改变日期
  changeDate(e){
    this.setData({
      date:e.detail.value
    })
  },
  // 获取当前日期
  nowDate(){
    let date = new Date()
    let endDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    this.setData({
      endDate
    })
  },
  // 修改备注、金额
  changePriceRemarks(e){
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]:e.detail.value
    })
  },
  // 获取用户的信息
  getuserAuthInfo(res){
    console.log("res ==>",res);
  },
  // 授权
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于获取用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
       console.log("res ==> ",res);
       var userInfo = res.userInfo
        wx.setStorageSync('userInfo',userInfo)
      }
    })
  },
  

  
})