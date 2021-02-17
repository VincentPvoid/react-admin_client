/* 添加分类的form组件 */
import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;


export default class AddForm extends Component {

  constructor(props) {
    super(props)
    // console.log(this.props.formRef.current)
  }

  componentDidMount() {
    this.props.setForm(this.props.formRef.current);
    // this.props.formRef.current.resetFields()
  }

  render() {
    const { list, parentId } = this.props
    return (
      <Form ref={this.props.formRef}>
        <Form.Item label="所属分类" name='parentId' initialValue={parentId}>
          <Select>
            <Option value='0' key='0'>一级分类</Option>
            {
              list.map(item => {
                return (
                  <Option
                    value={item._id}
                    key={item._id}
                  >{item.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="分类名称"
          name='categoryName'
          rules={[
            { required: true, message: '必须输入分类名称' }
          ]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    )
  }
}