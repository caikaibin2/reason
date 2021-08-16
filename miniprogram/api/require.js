const HTTP = require('../api/http')
export function getHomeBanner() {
  return HTTP({
    url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
  })
}

export function getGoodsList() {
  return HTTP({
    url: 'https://api-hmugo-web.itheima.net/api/public/v1/goods/search'
  })
}
export function getGoodsDetail(data) {
  return HTTP({
    url: 'https://api-hmugo-web.itheima.net/api/public/v1/goods/detail',
    data
  })
}
export function getGoodscategories() {
  return HTTP({
    url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories'
  })
}
export function getGoodsId(data) {
  return HTTP({
    url: 'https://api-hmugo-web.itheima.net/api/public/v1/goods/search',
    data
  })
}