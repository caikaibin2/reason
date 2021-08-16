var {getGoodsId} = require('../../api/require')
Page({
  data: {
      state:0,
      commodityList:[]
  },
  onLoad: function (options) {
    this.pageType()
  },
  onShow: function () {

  },
  pageType(){
    let _this = this
    const eventChanner = this.getOpenerEventChannel()
    eventChanner.on('emitType',function(data){
      console.log("data",data);
      if(data =='我的收藏'){
        wx.setNavigationBarTitle({
          title:data
        })
        _this.getlikeList()
        _this.setData({
          state:1
        })
      }
    })

    eventChanner.on("value",function(value){
          getGoodsId({query:value}).then(res => {
            console.log("关键搜索 ==>",res);
            let arr = []
            res.data.message.goods.forEach(item => {
              if(item.goods_big_logo){
                arr.push(item)
              }
            });
            _this.setData({
              commodityList:arr
            })
          })
    })
  },
  // 获取收藏列表
  getlikeList(){
    let likeList = wx.getStorageSync('likeList')
    if(!likeList){
      return ;
    }
    this.setData({
      commodityList:likeList
    })
  },
  deletes(e){
    console.log(e);
    let commodityList = this.data.commodityList
    for (let i = 0; i < commodityList.length; i++) {
      if(commodityList[i].goods_id == e.currentTarget.dataset.id){
        commodityList.splice(i,1)
        this.setData({
          commodityList
        })
        // wx.setStorageSync('likeList', commodityList)
        return ;
      }
    }
  },
  jumpDetail(e){
    console.log(e);
    wx.navigateTo({
      url: '../detail/detail',
      success:function(res){
       res.eventChannel.emit("emitId",{id:e.currentTarget.dataset.id})
      }
    })
  }
})