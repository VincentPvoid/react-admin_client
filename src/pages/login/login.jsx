/*
用户登录的路由组件
*/

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


import logo from './img/sphere_closed_96.png';
import './login.less';

import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';



// const [form] = Form.useForm();

export default class Login extends Component {


  render() {

    // 如果用户已经登录，直接跳转到管理页面
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/" />
    }

    // ajax请求使用promise
    // const onFinish = (values) => {
    //   // console.log('Success:', values);
    //   const {username, password} = values;
    //   reqLogin(username, password).then(res => {
    //     console.log(res.data)
    //   }).catch(err => console.log(err))
    // };

    // ajax请求简化写法；不使用promise
    const onFinish = async (values) => {
      // console.log('Success:', values);
      const { username, password } = values;
      const result = await reqLogin(username, password)
      // console.log('请求成功', result)
      if (result.status === 0) {
        // 提示登录成功
        message.success('登录成功');
        // 保存用户登录信息user
        const user = result.data;
        storageUtils.saveUser(user); // 保存到localStorage中
        memoryUtils.user = user; // 保存到内存中
        // 跳转到管理界面（不需要再退回到登录页面）
        this.props.history.replace('/');
      } else { // 登录失败
        // 提示错误信息
        message.error(result.msg)
      }
    };



    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    // 自定义表单校验规则
    const validatorPsw = (rule, value) => {
      // console.log(rule, value, 'aaaaaaaa')
      const length = value && value.length;
      const pwdReg = /^[a-zA-Z0-9_]+$/;
      if (!value) {
        return Promise.reject('必须输入密码');
      } else if (length < 4) {
        return Promise.reject('密码必须大于4位');
      } else if (length > 12) {
        return Promise.reject('密码不大于12位');
      } else if (!pwdReg.test(value)) {
        return Promise.reject('密码只能为字母、数字或下划线');
      } else {
        return Promise.resolve();
      }
    }

    return (
      <div className="login-page">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>后台管理系统练习</h1>
        </header>

        <section className="login-content">
          <h3>用户登录</h3>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 4, message: '用户名不能小于4位' },
                { max: 12, message: '用户名不能大于12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能为字母、数字或下划线' }
              ]}
              initialValue='admin' //指定初始值
            >
              <Input prefix={<UserOutlined style={{ color: "#959595" }} />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                // { required: true, message: '请输入密码' },
                // { min: 4, message: '密码不能小于4位' },
                // { max: 12, message: '密码不能大于12位' },
                {
                  validator: validatorPsw
                }
              ]}
            >
              <Input.Password placeholder="密码" prefix={<LockOutlined style={{ color: "#959595" }} />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}


/*
1. 前台表单验证
2. 收集表单输入数据
*/


/*
1. 高阶函数
- 一类特别的函数
接收函数类型的参数
返回值是函数

- 常见的高阶函数
 定时器 setTimeout()、setInterval()
 Promise Promise(() =>{})、then(value => {}, reason => {})
 数组遍历相关的方法 forEach()、filter()、map()、reduce()、find()、findIndex()
 函数对象的bind()

- 高阶函数更新动态，更加具有扩展性


2. 高阶组件
- 本质就是一个函数
- 接收一个组件（被包装组件），返回一个新的组件（包装组件）；包装组件会向被包装组件传入特定属性
- 作用：扩展组件的功能
- 高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数


*/

/*
包装Form组件生成一个新的组件：Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
*/


/*
async和await
作用：
简化promise对象的使用，不需要再使用then()来指定成功/失败的回调函数
以同步编码（没有回调函数）方式实现异步流程

写await的位置：
在返回promise的表达式左侧写await；
不想要promise，想要promise异步执行的成功的value数据

写async的位置：
await所在函数（最近的）定义的左侧写async
*/