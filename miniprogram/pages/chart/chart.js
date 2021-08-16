import * as echarts from '../../components/ec-canvas/echarts';

let chartCanvas = null;


Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    // 控制画布的第一次出现
    index:0,
    // 选择要查看的日期 显示在页面的日期
    time:'选择日期',
    // 真实的日期
    date:' ',
    // 截止选择日期为当天
    end:'',
    // 按年月日查询（0，1，2）
    typequeryIndex:0,
    ec: {
      onInit: null
    },
    isshowChart:true,
    subTypeIndex:0,
    subType:[
      {
        tatilPrice:0,
        count:0,
        type:'zc',
        title:"支出",
        typeList:[]
      },
      {
        tatilPrice:0,
        count:0,
        type:'sr',
        title:"收入",
        typeList:[]
      },
    ],
    // 颜色列表
    colorList:[[],[]],
    dataList:[]
  },
  // 跳转详情页面
  goPage(e){
    console.log("chart e ==>",e);
    wx.navigateTo({
      url: `../typeDetails/typeDetails?_ids=${e.detail}&date=${this.data.typequeryIndex}`,
    })
  },
  // 改变当前时间
  changeTime(e){
    if(e.detail.value == this.data.time){
      return ;
    }
    this.data.date = e.detail.value
    if(this.data.typequeryIndex==0){
      this.data.time = this.data.date.slice(0,4)
    }else if(this.data.typequeryIndex==1){
      this.data.time = this.data.date.slice(0,7)
    }else{
      this.data.time = this.data.date
    }
    
    this.setData({
      date:e.detail.value,
      time:this.data.time
    })
    this.getDateList()
  },
  // 修改年月日查询（0，1，2）
  changeTypequery(){
    if(this.data.time =="选择日期"){
      return wx.showToast({
        title: '请先选择要查询的日期',
        icon:'none',
        duration:2000
      })
    }
    if(this.data.typequeryIndex==2){
      this.data.typequeryIndex=0
    }else{
      this.data.typequeryIndex++
    }
    this.setData({
      typequeryIndex:this.data.typequeryIndex
    }) 
    if(this.data.typequeryIndex==0){
      this.data.time = this.data.date.slice(0,4)
    }else if(this.data.typequeryIndex==1){
      this.data.time = this.data.date.slice(0,7)
    }else{
      this.data.time = this.data.date
    }
    this.setData({
      time:this.data.time
    })
    this.getDateList()
  },
  // 修改选择查看收入还是支出
  changesubType(e){
    console.log("e==>",e.currentTarget.dataset.index);
    if(this.data.subTypeIndex == e.currentTarget.dataset.index){
      return ;
    }
    this.setData({
      subTypeIndex:e.currentTarget.dataset.index
    })
    this.chartSelf(this.data.dataList[this.data.subTypeIndex],this.data.colorList[this.data.subTypeIndex])
  },
  // 获取现在当前时间
  getNowDate(){
    let date = new Date()
    let a = date.getMonth()+1
    let yue = a<10?"0"+a : a
    let b = date.getDate()
    let ri = b<10?"0"+b:b
    let nowDate = `${date.getFullYear()}-${yue}-${ri}`
    return nowDate
  },
  // 获取筛选的列表
  getDateList(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    // 当前现在的时间
    let nowDateArr = this.getNowDate().split('-')
    // 选择查看的日期
    let closeDarwArr = this.data.date.split('-')
    let start = '';
    let end = '';
    // 如果按年查询
    if(this.data.typequeryIndex ==0){
      // 如果选择的日期跟当前的日期 同年
      if(nowDateArr[0] == closeDarwArr[0]){
          start = `${closeDarwArr[0]}-01-01`;
          end = nowDateArr.join('-')
      }
      // 不同年
      else{
        start = `${closeDarwArr[0]}-01-01`;
        end = `${closeDarwArr[0]}-12-31`
      }
    }
    // 如果按月查询
    else if(this.data.typequeryIndex ==1){
      // 如果选择的日期跟当前的日期 同年同月
      if(nowDateArr[0] == closeDarwArr[0] && nowDateArr[1] == closeDarwArr[1]){
        start = `${closeDarwArr[0]}-${closeDarwArr[1]}-01`;
        end = nowDateArr.join('-')
      }else{
        // 是否为2月
        if(closeDarwArr[1] == '02'){
          start = `${closeDarwArr[0]}-${closeDarwArr[1]}-01`;
          // 判断是否为闰年
          if(closeDarwArr[0] % 400 ==0 || (closeDarwArr[0] % 4 ==0 && closeDarwArr[0] % 100 != 0)){
            end = `${closeDarwArr[0]}-${closeDarwArr[1]}-29`;
          }else{
            end = `${closeDarwArr[0]}-${closeDarwArr[1]}-28`;
          }
        }else{
          start = `${closeDarwArr[0]}-${closeDarwArr[1]}-01`;
          // 月份有31天的数组
          let bigMouth = ["01","03","05","07","08","10","12"]
          if(bigMouth.indexOf(closeDarwArr[1])>-1){
            end = `${closeDarwArr[0]}-${closeDarwArr[1]}-31`;
          }else{
            end = `${closeDarwArr[0]}-${closeDarwArr[1]}-30`;
          }
        }
      }
    }
    // 按日查询
    else{
      start = closeDarwArr.join('-');
      end = closeDarwArr.join('-')
    }
    wx.cloud.callFunction({
      name:'get_mouth_price',
      data:{
        start,
        end
      }
    }).then(res => {
      wx.hideLoading();
      this.setData({
        isshowChart:false
      })
      if(res.result.data.length != 0){
        let Obj = [
          {
            tatilPrice:0,
            count:0,
            type:'zc',
            title:"支出",
            typeList:[]
          },
          {
            tatilPrice:0,
            count:0,
            type:'sr',
            title:"收入",
            typeList:[]
          },
        ]
        let srColorArr=[]
        let zcColorArr = []
        let srDataArr=[]
        let zcDataArr = []
        res.result.data.forEach(item => {
         
          if(item.type.type == 'zc'){
            let total = (Obj[0].tatilPrice*1000 +(item.price-0)*1000)/1000
            Obj[0].tatilPrice = total
            Obj[0].count += 1
           
            if(Obj[0].typeList.length == 0 ){
              let zccolor = this.randomColor()
              zcColorArr.push(zccolor)
              zcDataArr.push({value:item.price -0,name:item.typeIcons.name})
              Obj[0].typeList.push(
                {
                  icon:item.typeIcons.icon,
                  price:item.price-0,
                  name:item.typeIcons.name,
                  count:1,
                  color:zccolor,
                  itemList:[item],
                  type:item.typeIcons.type
                }
              );
            }else{
              for (let i = 0; i <Obj[0].typeList.length; i++) {
                  if(Obj[0].typeList[i].type==item.typeIcons.type){
                    Obj[0].typeList[i].price += item.price-0
                    Obj[0].typeList[i].count +=1
                    Obj[0].typeList[i].itemList.push(item)
                    zcDataArr[i].value += item.price-0
                    return ;
                  }else if(i == Obj[0].typeList.length-1){
                    let zccolor = this.randomColor()
                    zcColorArr.push(zccolor)
                    zcDataArr.push({value:item.price-0,name:item.typeIcons.name})
                    Obj[0].typeList.push(
                      {
                        icon:item.typeIcons.icon,
                        price:(item.price-0)*1000/1000,
                        name:item.typeIcons.name,
                        count:1,
                        color:zccolor,
                        itemList:[item],
                        type:item.typeIcons.type
                      }
                    );
                    break ;
                  }
              }
            }
          }else{
            let total = (Obj[1].tatilPrice*1000 +(item.price-0)*1000)/1000
            Obj[1].tatilPrice = total
            Obj[1].count += 1
            if(Obj[1].typeList.length == 0 ){
              let srcolor = this.randomColor()
              srColorArr.push(srcolor)
              srDataArr.push({value:item.price-0,name:item.typeIcons.name})
              Obj[1].typeList.push(
                {
                  icon:item.typeIcons.icon,
                  price:(item.price-0)*1000/1000,
                  name:item.typeIcons.name,
                  count:1,
                  color:srcolor,
                  itemList:[item],
                  type:item.typeIcons.type
                }
              );
            }else{
              for (let i = 0; i <Obj[1].typeList.length; i++) {
                  if(Obj[1].typeList[i].type==item.typeIcons.type){
                    Obj[1].typeList[i].price += (item.price-0)*1000/1000
                    Obj[1].typeList[i].count +=1
                    Obj[1].typeList[i].itemList.push(item)
                    srDataArr[i].value += item.price-0
                    return ;
                  }else if(i == Obj[1].typeList.length-1){
                    let srcolor = this.randomColor()
                    srColorArr.push(srcolor)
                    srDataArr.push({value:item.price-0,name:item.typeIcons.name})
                    Obj[1].typeList.push(
                      {
                        icon:item.typeIcons.icon,
                        price:item.price-0,
                        name:item.typeIcons.name,
                        count:1,
                        color:srcolor,
                        itemList:[item],
                        type:item.typeIcons.type
                      }
                    );
                    break ;
                  }
              }
            }
          }
        });
        this.setData({
          subType:Obj,
          colorList:[zcColorArr,srColorArr],
          dataList:[zcDataArr,srDataArr]
        })
        this.chartSelf(this.data.dataList[this.data.subTypeIndex],this.data.colorList[this.data.subTypeIndex])
      }else{
        this.setData({
          subType:[
            {
              tatilPrice:0,
              count:0,
              type:'zc',
              title:"支出",
              typeList:[]
            },
            {
              tatilPrice:0,
              count:0,
              type:'sr',
              title:"收入",
              typeList:[]
            },
          ],
          colorList:[],
          dataList:[]
        })
        this.chartSelf([],[])
      }
     
    }).catch( err => {
      console.log("err ==>",err);
      wx.hideLoading();
    })
  },
  // 生成随机颜色
  randomColor(){
    let arr = []
    for (let i = 0; i < 3; i++) {
        arr.push(Math.ceil(Math.random()*255))
    }
    return `rgb(${arr.join(',')})`
  },
  // 自己写的画布函数
  chartSelf(data,color){
    var option = {
      
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'horizontal',
          bottom: 'bottom',
      },
      series: [
          {
              name: '',
              type: 'pie',
              center: ['50%', '50%'],
              radius: ['0%', '60%'],
              data,
              color
          }
      ]
    };
    chartCanvas.setOption(option)

  },
  // 内置画布函数
  initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'horizontal',
          bottom: 'bottom',
      },
      series: [
          {
              name: '',
              type: 'pie',
              center: ['50%', '50%'],
              radius: ['0%', '60%'],
              data: [],
              // emphasis: {
              //     itemStyle: {
              //         shadowBlur: 10,
              //         shadowOffsetX: 0,
              //         shadowColor: 'rgba(0, 0, 0, 0.5)'
              //     }
              // }
              color:[]
          }
      ]
  };
  
    chart.setOption(option);
    chartCanvas = chart;
    return chart;
  },
 onLoad(){
   this.setData({
    end:this.getNowDate(),
    ec: {
      onInit: this.initChart
    },
   })
 },
 onShow(){
   this.setData({
    time:'选择日期',
    subType:[]
   })
   
   if(this.data.index == 0 ){
     this.setData({
       index:1
     })
   }else{
      this.chartSelf([],[])
   }
 }
});
