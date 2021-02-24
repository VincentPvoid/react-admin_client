/*
添加或更新用户的form组件
*/

import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Select
} from 'antd';

const { Option } = Select;



export default class UserForm extends PureComponent {

  constructor(props) {
    super(props)

  }


  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const { user, roles } = this.props;
    const form = this.props.formRef.current;
    // console.log(user)
    // console.log(form, 'form')

    form && form.setFieldsValue({
      username:user.username,
      phone:user.phone,
      email:user.email,
      role_id:user.role_id
    })

    return (
      <Form
        ref={this.props.formRef}
        {...layout}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 4, message: '用户名不能小于4位' },
            { max: 12, message: '用户名不能大于12位' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能为字母、数字或下划线' }
          ]}
          initialValue={user.username}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {user._id ? '' : (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 4, message: '密码不能小于4位' },
              { max: 12, message: '密码不能大于12位' },
            ]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item
          label="手机号"
          name="phone"
          initialValue={user.phone}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          initialValue={user.email}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="角色"
          name="role_id"
          // rules={[{ required: true, message: '必须输入角色' }]}
          initialValue={user.role_id}
        >
          <Select>
            {
              roles.map(role => {
                return (
                  <Option
                    value={role._id}
                    key={role._id}
                  >{role.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
      </Form>
    )
  }
}