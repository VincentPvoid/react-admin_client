import React, { Component } from 'react';
import {
  Card,
  Table,
  Button,
  message
} from 'antd';

import { reqUsers } from '../../api';
import { formatDate } from '../../utils/dateFormat';


export default class User extends Component {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
  }

  initColumn = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render:(value)=>(
          this.roleNames[value]
        )
      },
      {
        title: '操作',
        dataIndex: 'name',
      },
    ]
  }

  // 根据角色的数组生成一个包含所有角色名的对象容器
  initRoles = (roles) => {
    return roles.reduce((pre, item)=>{
      pre[item._id] = item.name
      return pre;
    },{})
  }


  // 获取所有用户列表users和roles
  getUsers = async () => {
    const res = await reqUsers();
    if (res.status === 0) {
      let { users, roles } = res.data;
      this.roleNames = this.initRoles(roles)
      this.setState({
        users,
        roles,
      })
    }
  }

  constructor(props) {
    super(props)
    this.initColumn();
  }

  componentDidMount() {
    this.getUsers();
  }


  render() {

    const { roles, users } = this.state;

    const title = (
      <Button type="primary">创建用户</Button>
    )

    return (
      <div>
        <Card title={title}>
          <Table
            dataSource={users}
            columns={this.columns}
            bordered
            rowKey='_id'
            // loading={loading}
            pagination={{ showQuickJumper: true }}
          />
        </Card>
      </div>
    )
  }
}