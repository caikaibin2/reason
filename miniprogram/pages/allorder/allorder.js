const app = getApp()
Page({
  data: {
    typeTextList: [{
        text: '全部'
      },
      {
        text: '待付款'
      },
      {
        text: '待发货'
      },
      {
        text: '待收货'
      },
      {
        text: '已收货'
      },
    ],
    stateTextList: [
      '付款',
      '发货',
      '收货'
    ],
    activeIndex: 0,
    allOrder: [],
    showOrder: []
  },
  // 改变选项
  cgactive(e, index) {
    // wx.removeStorageSync('orderList')
    // return ;
    console.log("index ==>", index);
    let allOrder= this.data.allOrder
    if (!allOrder) {
      this.setData({
        activeIndex: e.currentTarget.dataset.index,
        allOrder: [],
        showOrder: []
      })
      return;
    }
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        activeIndex: e.currentTarget.dataset.index,
        showOrder: this.data.allOrder
      })
      return;
    }
    let arr = []
    allOrder.forEach(item => {
      if (item.state == e.currentTarget.dataset.index) {
        arr.push(item)
      }
    });
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      showOrder: arr
    })
  },
  getAllorder() {
    let allOrder = wx.getStorageSync('orderList')
    if (!allOrder) {
      return;
    }
    console.log(allOrder);
    this.setData({
      allOrder: allOrder,
      showOrder: allOrder,
      activeIndex: 0
    })
  },
  // 改变状态
  cgState(e) {
    let allOrder = this.data.allOrder
    for (let i = 0; i < allOrder.length; i++) {
      if (allOrder[i].id === e.currentTarget.dataset.id) {
        allOrder[i].state += 1
        continue;
      }

    }
    let arr = []
    if(this.data.activeIndex == 0){
      this.setData({
        showOrder: this.data.allOrder
      })
      return ;
    }
    for (let i = 0; i < allOrder.length; i++) {
      if (allOrder[i].state == this.data.activeIndex) {
        arr.push(allOrder[i])
      }
    }
    this.setData({
      showOrder: arr
    })
  },
  // 删除
  deletes(e) {
    let allOrder = this.data.allOrder
    for (let i = 0; i < this.data.allOrder.length; i++) {

      if (allOrder[i].id == e.currentTarget.dataset.id) {
        let arr = allOrder.splice(i, 1)
        console.log("arr ==>", arr);
        continue;
      }
    }
    let showOrder = []
    if (this.data.activeIndex == 0) {
      showOrder = allOrder
    } else {
      for (let i = 0; i < allOrder.length; i++) {
        if (allOrder[i].state == this.data.activeIndex) {
          showOrder.push(allOrder[i])
        }
      }
    }
    this.setData({
      allOrder,
      showOrder
    })
    // wx.setStorageSync('orderList', allOrder)
    // this.setData({
    //   allOrder
    // })
  },
  onLoad: function (options) {
    // 调用监听器，监听数据变化
    app.watch(this, {
      activeIndex: function (newVal) {
        console.log(newVal)
      }
    })
  },
  onShow: function () {
    this.getAllorder()
  },
  onHide: function () {

  },
  onUnload:function (){
    wx.setStorageSync('orderList', this.data.allOrder)
  }
})