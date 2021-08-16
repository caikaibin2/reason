module.exports = function HTTP (objAll){
  return new Promise((resolve,reject) => {
    wx.request({
      ...objAll,
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}