/*
能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/

import ajax from './ajax';

// 登录
export const reqLogin = (username, password) => {
  return ajax('/login', { username, password }, 'POST')
}

// 获取天气
export const reqWeather = (city, extensions = 'base', key = '47c2b9fbbc91e11ea5462f62bf817c0b') => {
  return ajax('https://restapi.amap.com/v3/weather/weatherInfo', { city, extensions, key })
}

// 获取商品分类列表
export const reqCategory = (parentId) => {
  return ajax('/manage/category/list', { parentId })
}

// 更新（修改）商品分类
export const reqUpdateCategory = (categoryId, categoryName) => {
  return ajax('/manage/category/update', { categoryId, categoryName }, 'POST')
}

// 添加商品分类
export const reqAddCategory = (parentId, categoryName) => {
  return ajax('/manage/category/add', { parentId, categoryName }, 'POST')
}

// 获取商品分页列表
// export const reqProducts = (pageNum, pageSize) => {
//   return ajax('/manage/product/list', {pageNum, pageSize})
// }

// 根据ID/Name搜索产品分页列表
/* 
pageNum 请求页数 必须
pageSize 每页条目数 必须
productName或productDesc 商品名称/商品描述关键字 可选 二个只能选一个
如果没有需要搜索的参数，则为获取所有商品数据
*/
export const reqSearchProducts = (data) => {
  return ajax('/manage/product/search', data)
}


// 根据分类ID获取分类
export const reqCategoryName = (categoryId) => {
  return ajax('/manage/category/info', { categoryId })
}

// 对商品进行上架/下架处理
export const reqUpdateProStatus = (productId, status) => {
  return ajax('/manage/product/updateStatus', { productId, status }, 'POST')
}

// 删除图片
export const reqDeleteImg = (name) => {
  return ajax('/manage/img/delete', { name }, 'POST')
}

// 更新或添加商品
export const reqAddUpdateProduct = (product) => {
  return ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
}

// 获取角色列表
export const reqRoles = () => {
  return ajax('/manage/role/list');
}

// 添加角色
export const reqAddRole = (roleName) => {
  return ajax('/manage/role/add', { roleName }, 'POST')
}

// 获取所有用户列表
export const reqUsers = () =>{
  return ajax('/manage/user/list')
}