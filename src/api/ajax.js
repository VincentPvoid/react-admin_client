/*
能发送ajax请求的函数模块
 包装axios
 函数的返回值是promise对象
 axios.get()/post()返回的就是promise对象
 返回自己创建的promise对象：
   统一处理请求异常
   异步返回结果数据，而不是包含结果数据的response
1. 优化：统一处理请求异常
  在外层包一个自己创建的promise对象
  在请求出错时，不reject(erro)，而是显示错误提示
2. 优化：异步得到不是response，而是response.data
  在请求成功resolve时，resolve(response.data)
*/

import axios from 'axios';
import {message} from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise = null;
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      promise = axios.get(url, {params: data}) // 指定请求参数
    } else {
      promise = axios.post(url, data)
    }
    // 2. 如果成功，调用resolve
    promise.then(res => {
      resolve(res.data)
    }).catch(err => { // 3. 如果失败了，不调用reject，而是提示异常信息
      message.error('请求出错 '+ err.message)
    })
  })
}