/*
redux最核心的管理对象store
*/

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';


// 创建store对象内部会第一次调用reducer()得到初始状态值
export default createStore(reducer, composeWithDevTools(
  applyMiddleware(thunk)
));