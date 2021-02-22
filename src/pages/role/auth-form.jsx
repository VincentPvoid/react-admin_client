/*
修改角色权限的tree组件
*/

import React, { PureComponent } from 'react';
import { Tree, Form, Input } from 'antd';

import menuList from '../../config/menuConfig';



export default class AuthForm extends PureComponent {

  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    console.log(checkedKeys, 'sdfsfgggggggg')
    console.log(info, 'info')
    // const checkedItems = info.checkedNodes.map(item => item.key)
    // this.setState({
    //   checkedKeys:checkedItems
    // })
    this.setState({
      checkedKeys
    })
  };

  // 根据menus的数据数组生成初始化选择tree
  initTree = () => {
    return ([{
      title: '平台权限',
      key: '/all',
      children: [...menuList]
    }])
  }

  constructor(props) {
    super(props)
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus
    }
  }

  // 当props或state发生变化时，在重新rendor()之前调用；第一次加载组件时不会调用
  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log(nextProps.role.menus, 'nextProps')
  //   // console.log(nextState, 'nextState')
  //   // 判断当前状态是否已经更新完成（必须，否则会死循环）
  //   if (this.state.checkedKeys != nextProps.role.menus) {
  //     this.setState({
  //       checkedKeys: nextProps.role.menus
  //     })
  //   }
  //   return true;
  // }

  render() {
    console.log('auth-form render()')
    
    const treeData = this.initTree()
    const { role } = this.props;
    const { checkedKeys } = this.state

    const layout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 18 }, // 右侧包裹input的宽度
    };

    return (
      <div>
        <Form.Item
          label="角色名称"
          {...layout}
        >
          <Input value={role.name} disabled />
        </Form.Item>
        <Tree
          checkable
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          treeData={treeData}
          defaultExpandAll
        >
        </Tree>
      </div>
    )
  }
}