/* 更新分类的form组件 */
import React, { Component } from 'react';
import { Form, Input } from 'antd';

export default class UpdateForm extends Component {
  constructor(props){
    super(props)
    this.item = this.props.item;
  }

  render() {
    const parentName = this.item.name;
    return (
      <Form ref={this.props.formRef}>
        <Form.Item
          name="categoryName"
          initialValue={parentName}
          rules={[
            {required:true, message:'必须输入分类名称'}
          ]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    )
  }
}