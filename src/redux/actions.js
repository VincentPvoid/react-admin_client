/*
包含n个action creator的函数模块
同步action 对象{type:'xxx',data:数据值}
异步action 函数 dispatch => {}
*/

import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from './action-types';
import { reqLogin } from '../api';
import { message } from 'antd';
import storageUtils from '../utils/storageUtils';

/*
设置header的同步action
*/
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })




// 接收用户的同步action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })

// 显示错误信息的同步action
export const showErroeMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })

// 退出登录的同步action
export const logout = () => {
  // 删除localStorage中的user
  storageUtils.removeUser()
  // 返回action对象
  return { type: RESET_USER }
}

// 登录的异步action
export const login = (username, password) => {
  return async dispatch => {
    // 1. 执行异步ajax请求
    const res = await reqLogin(username, password)
    // 2.1. 如果成功，分发成功的同步action
    if (res.status === 0) {
      // 把user信息保存到localStorage中
      storageUtils.saveUser(res.data);
      // 分发接收用户的同步action
      dispatch(receiveUser(res.data))
    } else {
      // 2.2. 如果失败，分发失败的同步action
      const msg = res.msg;
      // message.error(msg)
      dispatch(showErroeMsg(msg))
    }
  }
}
