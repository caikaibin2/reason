// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:cloud.DYNAMIC_CURRENT_ENV})
const db  = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('history-list').where({
    // or 方法用于指定一个 "或" 条件，此处表示需满足 _.eq(0) 或 _.eq(100)
    date: _.gte(event.start).and(_.lte(event.end)).and({userInfo:event.userInfo}),
  }).get()
}