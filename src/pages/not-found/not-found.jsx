import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import './not-found.less';


export default class NotFound extends Component {


  render() {
    return (
      <Row className="not-found">
        <Col span={12} className="img">
        </Col>
        <Col span={12} className="text">
          <h1>404页面</h1>
          <h2>抱歉，此页面不存在</h2>
          <div>
            <Button type='primary' onClick={() => { this.props.history.replace('/home') }}>回到首页</Button>
          </div>
        </Col>
      </Row>
    )
  }
}