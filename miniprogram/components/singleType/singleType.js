// components/singleType/singleType.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detailData:{
      type:Object,
      value:{}
    },
    tatilPrice:{
      type:Number,
      value:0
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
    goPage(){
      let ids = []
      this.data.detailData.itemList.forEach(item => {
          ids.push(item._id)
      });
      ids = ids.join('-')
      this.triggerEvent('goPageIds',ids)
    }
  }
})
