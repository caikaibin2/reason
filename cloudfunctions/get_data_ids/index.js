// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:cloud.DYNAMIC_CURRENT_ENV})

// 引用云数据库
const db = cloud.database()

// 引用操作指令
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('history-list').where({
      _id:_.in(event.ids.split('-')),
      userInfo:event.userInfo
    }).get()
  }catch(err){
    console.log("err ==>",err);
  }
}