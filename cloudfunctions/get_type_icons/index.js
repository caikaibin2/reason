// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:cloud.DYNAMIC_CURRENT_ENV})
// 应用云数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.date){
    return await db.collection('history-list').where({"date":event.date}).get()
  }else{
    return await db.collection('type-list').get()
  }
  
}