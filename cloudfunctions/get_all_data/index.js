// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:cloud.DYNAMIC_CURRENT_ENV})

// 引用数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection("history-list").where({userInfo:event.userInfo}).get()
}