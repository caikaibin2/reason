// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:cloud.DYNAMIC_CURRENT_ENV});

// 引用云数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let sqlName = event.sqlName
  delete event.sqlName
  db.collection(sqlName).add({
    data:event
  })
 
  try{
    return await true
  }catch{
    return await false
  }
}