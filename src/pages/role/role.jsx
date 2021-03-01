import React, { Component } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  message
} from 'antd';
import { connect } from 'react-redux';

import { logout } from '../../redux/actions';
import { formatDate } from '../../utils/dateFormat';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';


class Role extends Component {

  state = {
    loading: false,
    role: {}, // 当前选中的角色行
    roles: [], // 角色列表
    showModel: 0, // 表示是否显示弹出框；0表示都不显示；1表示显示添加角色弹出框；2表示显示设置权限弹出框
  }

  initColmuns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name', // 显示数据对应的属性名
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formatDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  // 设置行属性；为行加监听（点击/双击等）
  onRow = (role) => {
    return {
      onClick: event => { // 点击行
        // console.log(event, 'event')
        // console.log(role, 'record')
        this.setState({
          role,
        })
      },
    };
  }

  // 直接点击checkbox时，把当前选择role加入state中
  // clickCheckbox = (value) => {
  //   // console.log(e,'bbbbbbbbbbbb')
  //   const role = this.state.roles.find(item => item._id === value[0])
  //   this.setState({
  //     role,
  //   })
  // }

  // 获取角色列表
  getRoles = async () => {
    const res = await reqRoles();
    if (res.status === 0) {
      this.setState({
        roles: res.data
      })
    }
  }

  closeModal = () => {
    this.setState({
      showModel: 0
    })
    this.addForm.current && this.addForm.current.resetFields()
  }

  // 确定添加角色
  addRole = () => {
    this.addForm.current.validateFields().then(
      async (values) => {
        console.log(values)
        const res = await reqAddRole(values.roleName);
        if (res.status === 0) {
          message.success('添加角色成功');
          // 新添加的角色数据
          const role = res.data;
          /*
          // 更新roles状态（能起作用，但不推荐这种做法）
          const roles = this.state.roles;
          roles.push(role);
          this.setState({
            roles
          })
          */

          // 更新roles状态：基于原本状态数据更新（推荐）
          this.setState(state => ({
            roles: [...state.roles, role],
            showModel: 0
          }))

          this.addForm.current.resetFields()
        } else {
          message.error('添加角色失败')
        }
      }
    )
    // console.log(this.addForm.current)
  }

  // 修改角色权限
  updateRole = async () => {
    // let b = this.authForm.current.getcheckedKeys()
    const role = this.state.role
    role.auth_time = Date.now();
    role.auth_name = this.props.user.username;
    role.menus = this.authForm.current.getcheckedKeys()
    // console.log(role,'rrrrrrrrrrrr')
    const res = await reqUpdateRole(role);
    if (res.status === 0) {
      // 如果更新的是当前用户所属角色的权限，强制退出
      if (role._id === this.props.user.role_id) {
        this.props.logout()
        message.success('当前用户权限已改变，请重新登录')
      } else {
        message.success('修改角色权限成功')
        this.setState({
          showModel: 0,
          roles: [...this.state.roles]
        })
      }
    } else {
      message.error('修改角色权限失败')
    }
  }

  constructor(props) {
    super(props)
    this.initColmuns();
    this.addForm = React.createRef(); // 添加角色Form的容器
    this.authForm = React.createRef(); // 设置权限的容器
  }

  componentDidMount() {
    this.getRoles()
  }


  render() {

    const { loading, role, roles, showModel } = this.state;

    const title = (
      <span>
        <Button type="primary" onClick={() => { this.setState({ showModel: 1 }) }}>创建角色</Button> &nbsp;&nbsp;&nbsp;
        <Button type="primary" disabled={!role._id} onClick={() => { this.setState({ showModel: 2 }) }}>设置角色权限</Button>
      </span>
    )

    return (
      <div>
        <Card title={title}>
          <Table
            dataSource={roles}
            columns={this.columns}
            bordered
            rowKey='_id'
            loading={loading}
            pagination={{ showQuickJumper: true }}
            rowSelection={{ type: 'radio', columnWidth: 50, selectedRowKeys: [role._id], onSelect: (role) => this.setState({ role }) }}
            onRow={this.onRow}
          />
        </Card>

        <Modal title="创建角色"
          visible={showModel === 1}
          onOk={this.addRole}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'
        >
          <AddForm
            formRef={this.addForm}
          />
        </Modal>

        <Modal title="设置角色权限"
          visible={showModel === 2}
          onOk={this.updateRole}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'
        >
          <AuthForm
            ref={this.authForm}
            role={role}
            key={role._id}
          />
        </Modal>



      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user }),
  { logout }
)(Role)