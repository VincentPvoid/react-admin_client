import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { connect } from 'react-redux';

import { setHeadTitle } from '../../redux/actions'
import menuList from '../../config/menuConfig';
import logo from '../../assets/img/sphere_closed_96.png';
import './index.less';


/*
左侧导航的组件
*/

const { SubMenu } = Menu;


class LeftNav extends Component {

  /*
  判断当前用户是否有当前item对应的菜单权限
  */
  hasAuth = (item) => {
    /*
    1. 如果菜单项标识为公开
    2. 如果当前用户是admin
    3. 如果菜单项的key在用户的menus中
    */
    if (item.isPublic || this.props.user.username === 'admin' || this.props.user.role.menus.indexOf(item.key) != -1) {
      return true
    } else if (item.children) {
      // 4. 如果有子节点，需要判断有没有一个child的key在menus中
      return !!item.children.find(child => this.props.user.role.menus.indexOf(child.key) != -1)
    }
    return false;
  }



  /*
  根据menu的数据数组生成对应的标签数组
  使用map()+递归调用
  */
  getMenuNodes = (menuList) => {
    // 获取当前请求的path
    let path = this.props.location.pathname;

    return menuList.map(item => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>
                {item.title}
              </Link>
            </Menu.Item>
          )
        } else {
          // 查找一个与当前子路径匹配的子Item
          const cItem = item.children.find(cItem => cItem.key === path)
          // 如果存在，说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }
    })
  }

  /*
  根据menu的数据数组生成对应的标签数组
  使用reduce()+递归调用
  */
  getMenuNodes_reduce = (menuList) => {
    // console.log('bbbbbbbb')

    // 获取当前请求的path
    let path = this.props.location.pathname;

    // 如果当前请求的是根路径，设置头部标题为首页
    if (path === '/') {
      this.props.setHeadTitle('首页')
    }

    return menuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        // 如果请求路径与当前item.key匹配，则将item.title保存到store
        if (path.indexOf(item.key) === 0) {
          this.props.setHeadTitle(item.title)
        }
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                {item.title}
              </Link>
            </Menu.Item>
          )
        } else {
          // 查找一个与当前子路径匹配的子Item；
          // 注意如果当前为/product下的路由，key不能完全匹配，因此只需要判断当前path是否包含有Item的key
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          // 如果存在，说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }

          pre.push(
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes_reduce(item.children)}
            </SubMenu>
          )
        }
      }
      return pre;
    }, [])
  }

  constructor(props) {
    super(props)
    this.menuNodes = this.getMenuNodes_reduce(menuList)
  }


  render() {

    let path = this.props.location.pathname;
    const openKey = this.openKey;

    // 如果当前的路径是product的子路径，则把path的值设为/product，否则无法显示选中效果（因为没有路由项的key与path完全一致）
    path = path.indexOf('/product') === 0 ? '/product' : path;

    return (
      <div className="left-nav">
        <Link to='/home' className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>后台管理</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

/*
withRouter高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history location match
*/
export default connect(
  state => ({ user: state.user }),
  { setHeadTitle }
)(withRouter(LeftNav));