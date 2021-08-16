// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList:[],
    // 选择的日期
    choiceDate:"",
     // 选择当月的记账记录的时间差
    timeDifference:{
      start:'',
      end:''
    },
    // 收入和支出的金额
    typePrice:{
      sr:0,
      zc:0
    },
    // 月余 月收入 月支出
    monthlyAccount:{
      sr:0,
      srdecimal:0,
      zc:0,
      zcdecimal:0,
      yy:0,
      yydecimal:0
    }
  },
 

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取本月的支出和收入
  getMouthPrice(){
    wx.cloud.callFunction({
      name:'get_mouth_price',
      data:{
        start:this.data.timeDifference.start,
        end:this.data.timeDifference.end
      }
    }).then(res => { 
      console.log("res ==>",res);
      let dataArr = res.result.data
      let sr = 0;
      let zc = 0;
      let yy = 0;
      dataArr.forEach((item) => {
        if(item.type.type == 'sr'){
          sr +=Number(item.price )
        }else if(item.type.type=='zc'){
          zc +=Number(item.price)
        }
      })
      sr = sr.toFixed(2)
      zc = zc.toFixed(2)
      yy = (sr - zc).toFixed(2)
      let srArr = sr.split('.')
      let zcArr = zc.split('.')
      let yyArr = yy.split('.')
      this.setData({
        monthlyAccount:{
          sr:srArr[0],
          srdecimal:srArr[1],
          zc:zcArr[0],
          zcdecimal:zcArr[1],
          yy:yyArr[0],
          yydecimal:yyArr[1]
        }
      })
      console.log(this.data.monthlyAccount);
    })
  },
// 获取当天的日期并传递
nowDate(){
  wx.showLoading({
    title: '加载中...',
  })
  let date = new Date()
  let a = date.getMonth()+1
  let yue = a<10?"0"+a : a
  let b = date.getDate()
  let ri = b<10?"0"+b:b
  let nowDate = `${date.getFullYear()}-${yue}-${ri}`
  this.setData({
    timeDifference:{
      start:`${date.getFullYear()}-${yue}-01`,
      end:nowDate
    },
    choiceDate:nowDate
  })
  wx.cloud.callFunction({
    name:"get_type_icons",
    data:{
      date:nowDate
    }
  }).then(res =>{
    wx.hideLoading();
    this.setData({
      detailList:res.result.data
    })
   
    this.changeTypePrice()
  })
},
// 修改日期和金额
changeChoiceDate(e){
  if(e.detail.value == this.data.choiceDate){
    return 
  }
  wx.showLoading({
    title: '加载中...',
  })
  this.setData({
    choiceDate:e.detail.value
  })
  wx.cloud.callFunction({
    name:"get_type_icons",
    data:{
      date:e.detail.value
    }
  }).then(res =>{
    wx.hideLoading();
    this.setData({
      detailList:res.result.data
    })
    this.changeTypePrice()
  })
},
// 修改当日的收入和支出
changeTypePrice(){
  var sr = 0;
  var zc = 0;
  this.data.detailList.forEach((item) => {
      if(item.type.type == 'sr'){
        sr = sr + Number(item.price)
      }else{
        zc += Number(item.price)
      }
  })
  this.setData({
    typePrice:{
      sr:sr.toFixed(2),
      zc:zc.toFixed(2)
    }
  })
},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.nowDate()
    this.getMouthPrice()
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