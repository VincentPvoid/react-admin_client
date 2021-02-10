/*
后台管理主路由组件
*/

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import Header from '../../components/header';
import LeftNav from '../../components/left-nav';

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    // 如果内存中没有存储user，表示当前没有登录
    if (!user || !user._id) {
      // 自动跳转到login页面（在render()中）
      return <Redirect to="/login" />
    }


    return (
      <Layout style={{height:'100%'}}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{background:'#fff'}}>Content</Content>
          <Footer style={{textAlign:'center', color:'#959595'}}>Footer页脚测试</Footer>
        </Layout>
      </Layout>
    )
  }
}