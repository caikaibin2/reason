// miniprogram/pages/typeDetails/typeDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    allData:[]
  },
  onLoad: function (options) {
    this.getDataId(options._ids,options.date)
  },
  // 获取时间戳
  getTargetTime(time){
    let date = new Date()
    date.setYear(time.split("-")[0])
    date.setMonth(time.split("-")[1] - 1)
    date.setDate(time.split("-")[2])
    return date.getTime()
  },
  // 根据id列表集合获取数据
  getDataId(ids,date){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'get_data_ids',
      data:{
        ids
      }
    }).then(res => {
      wx.hideLoading();
      let _date = date==0?'年':date==1?'月':'日'
      wx.setNavigationBarTitle({
        title: _date+res.result.data[0].type.title+'-'+res.result.data[0].typeIcons.name+'记账数据'
      })

      let timeArr = []
      let newArr = []
      res.result.data.forEach((item,index) =>{
        let time = this.getTargetTime(item.date)
        timeArr.push({time,index})
      })
      timeArr.sort((a, b)=>{
        return b.time - a.time
      })
      timeArr.forEach(item => {
        newArr.push( res.result.data[item.index])
      })
      this.setData({
        loading:false,
        allData:newArr
      })
    })
  },
  
})