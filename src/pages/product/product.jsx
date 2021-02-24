/*
商品管理的路由组件
*/

import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from './home';
import Detail from './detail';
import AddUpdate from './add-update';


export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/product' component={Home} exact />
          <Route path='/product/detail' component={Detail} />
          <Route path='/product/addupdate' component={AddUpdate} />
          <Redirect to='/product' />
        </Switch>
      </div>
    )
  }
}