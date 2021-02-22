/*
添加角色的form组件
*/

import React, { Component } from 'react';
import { Form, Input } from 'antd';

export default class AddForm extends Component {
  render() {
    return (
      <Form ref={this.props.formRef}>
        <Form.Item
          label="角色名称"
          name='roleName'
          rules={[
            { required: true, message: '必须输入角色名称' }
          ]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
      </Form>
    )
  }
}