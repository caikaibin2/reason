// components/booking.item/booking-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isDelete:{
      type:Boolean,
      value:false
    },
    isDate:{
      type:Boolean,
      value:false
    },
    detailInfor:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete(){
      console.log(this.data.detailInfor._id);
      wx.showModal({
        title: '提示',
        content: '是否永久删除该数据',
        success: res => {
          if (res.confirm) {
            wx.showLoading({
              title: '删除中...',
            })
            wx.cloud.callFunction({
              name:"remove_data",
              data:{
                _id:this.data.detailInfor._id
              }
            }).then(res => {
              console.log("res ==>",res);
              wx.hideLoading()
              if(res.result.stats.removed==1){
                wx.showToast({
                  title: '删除成功',
                  duration:2000
                })
                this.triggerEvent("update")
              }else{
                wx.showToast({
                  title: '删除失败，请稍后再试',
                  duration:2000
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    }
  }
})
