// miniprogram/pages/allbookkeep/allbookkeep.js
Page({
  data: {
    allData:[]
  },

  onShow(){
    this.getAllData()
    console.log(this.getTargetTime('2012-02-03'));
    console.log(this.getTargetTime('2012-02-04'));
  },
  // 获取时间戳
  getTargetTime(time){
    let date = new Date()
    date.setYear(time.split("-")[0])
    date.setMonth(time.split("-")[1] - 1)
    date.setDate(time.split("-")[2])
    return date.getTime()
  },
  // 获取所有数据
  getAllData(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:"get_all_data"
    }).then(res => {
      console.log("res ==>",res);
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
      
      // console.log("newArr ==>",newArr);
      this.setData({
        allData:newArr
      })
      wx.hideLoading()
    })
  },
})