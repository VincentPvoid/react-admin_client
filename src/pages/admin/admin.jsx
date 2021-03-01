/*
后台管理主路由组件
*/

import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import Header from '../../components/header';
import LeftNav from '../../components/left-nav';

import Category from '../category/category';
import Home from '../home/home';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import NotFound from '../not-found/not-found';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
  render() {
    const user = this.props.user;
    // 如果内存中没有存储user，表示当前没有登录
    if (!user || !user._id) {
      // 自动跳转到login页面（在render()中）
      return <Redirect to="/login" />
    }


    return (
      <Layout style={{ height: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ background: '#fff', margin: 20, overflow: 'auto' }}>
            <Switch>
              <Redirect from='/' to='/home' exact />
              <Route path='/home' component={Home} />
              <Route path='/product' component={Product} />
              <Route path='/category' component={Category} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Route component={NotFound} /> 
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#959595' }}>Footer页脚测试</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  {}
)(Admin)