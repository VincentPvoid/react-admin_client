/*
进行local数据存储管理的工具模块
*/
import store from 'store';

const USER_KEY = 'user_key';

export default {
  // 保存user
  saveUser(user){
    // window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    store.set(USER_KEY,user); // 内部会自动转换成json再进行保存
  },

  // 读取user
  getUser(){
    // 如果有值，返回解析后的对象；如果没有值，返回空对象{}
    // return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}');
    return store.get(USER_KEY) || {};
  },

  // 删除user
  removeUser(){
    // window.localStorage.removeItem(USER_KEY);
    store.remove(USER_KEY);
  }
}