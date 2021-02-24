import React, { PureComponent } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  message
} from 'antd';

import { reqUsers, reqDeleteUser, reqAddUpdateUser, reqAddCategory } from '../../api';
import { formatDate } from '../../utils/dateFormat';
import LinkButton from '../../components/link-button';
import UserForm from './user-form';


const { confirm } = Modal;

export default class User extends PureComponent {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    showModel: false, // 是否显示添加/修改用户弹框
    loading:false
  }

  initColumn = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        width: 250
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
        render: (value) => (
          this.roleNames[value]
        )
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => { this.showUpdateUser(user) }}>修改</LinkButton>
            <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  // 根据角色的数组生成一个包含所有角色名的对象容器
  initRoles = (roles) => {
    return roles.reduce((pre, item) => {
      pre[item._id] = item.name
      return pre;
    }, {})
  }


  // 获取所有用户列表users和roles
  getUsers = async () => {
    this.setState({loading:true})
    const res = await reqUsers();
    this.setState({loading:false})
    if (res.status === 0) {
      let { users, roles } = res.data;
      // 初始化生成一个包含所有角色名称的对象容器 {_id1:name1,_id2:name2...}
      this.roleNames = this.initRoles(roles)
      this.setState({
        users,
        roles,
      })
    }
  }


  // 删除用户
  deleteUser = (user) => {
    confirm({
      title: `确定要删除${user.username}吗？`,
      okText:'确定',
      cancelText:'取消',
      onOk: async () => {
        // console.log('OK');
        const res = await reqDeleteUser(user._id);
        if (res.status === 0) {
          message.success(`删除用户${user.username}成功`)
          this.getUsers();
        } else {
          message.error('删除用户失败')
        }
      },
      // onCancel:()=> {
      //   console.log('Cancel');
      // },
    });
  }


  closeModal = () => {
    this.userInfoForm.current && this.userInfoForm.current.resetFields()
    this.setState({
      showModel: false
    })
  }

  // 添加/更新用户
  addUpdateUser = () => {
    this.userInfoForm.current.validateFields().then(
      async (values) => {
        const user = values;
        this.user && (user._id = this.user._id)
        let text = user._id ? '更新' : '添加'
        console.log(user, 'valuessssss')
        const res = await reqAddUpdateUser(user)
        if (res.status === 0) {
          message.success(text + '用户成功')
          this.setState({
            showModel:false
          })
          this.userInfoForm.current.resetFields();
          this.getUsers();
        } else {
          message.error(test + '用户失败')
        }
      }
    )
  }

  // 显示添加用户弹框
  showAddUser = () => {
    this.user = null;
    this.setState({
      showModel: true
    })
  }

  // 显示修改用户弹框
  showUpdateUser = (user) => {
    // this.userInfoForm.current && this.userInfoForm.current.resetFields()
    this.user = user;
    this.setState({
      showModel: true
    })
  }


  constructor(props) {
    super(props)
    this.initColumn();
    this.userInfoForm = React.createRef()
  }

  componentDidMount() {
    this.getUsers();
  }


  render() {

    const { roles, users, showModel, loading } = this.state;
    const user = this.user || {};

    const title = (
      <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
    )

    return (
      <div>
        <Card title={title}>
          <Table
            dataSource={users}
            columns={this.columns}
            bordered
            rowKey='_id'
            loading={loading}
            pagination={{ showQuickJumper: true }}
          />
        </Card>

        <Modal title='添加用户'
          visible={showModel}
          onOk={this.addUpdateUser}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'>
          <UserForm
            formRef={this.userInfoForm}
            user={user}
            roles={roles}
          />
        </Modal>

      </div>
    )
  }
}