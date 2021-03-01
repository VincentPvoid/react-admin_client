import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, message } from 'antd';
import { connect } from 'react-redux';

import './index.less';
import { reqWeather } from '../../api';
import { formatDate } from '../../utils/dateFormat';
import LinkButton from '../../components/link-button';
import { logout } from '../../redux/actions'

const { confirm } = Modal;

class Header extends Component {

  state = {
    weather: '',
    city: '',
    sysTime: formatDate(Date.now()),
    timer: null
  }

  // 确认退出登录弹出框
  showLogout = () => {
    confirm({
      content: '确定退出吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 移除保存的user
        this.props.logout()
      },
    });
  }

  // 发异步ajax获取天气数据并更新状态
  getWeather = async () => {
    const res = await reqWeather('110000')
    if (res.status === '1') {
      const { city, weather } = res.lives[0];
      this.setState({
        weather,
        city
      })
    } else {
      message.error(res.info);
    }
  }


  // getTime = () => {
  //   this.setState({
  //     sysTime:formatDate(Date.now())
  //   })
  //   new Promise((resolve, reject) => {
  //     setTimeout(()=>{
  //       resolve()
  //     },1000)
  //   }).then(res => {
  //     console.log(this, 'time', this.state.clearTimer)
  //     if(!this.state.clearTimer) this.getTime()
  //   })
  // }

  // 每隔1s更新一次sysTime
  getTime = () => {
    this.timer = setInterval(() => {
      // console.log(this, 'test')
      this.setState({
        sysTime: formatDate(Date.now()),
      })
    }, 1000)
  }

  // getTitle = () => {
  //   const path = this.props.location.pathname;
  //   let title = '';
  //   menuList.forEach(item => {
  //     if(path===item.key){ // 如果当前item对象的key等于当前path，item的title就是当前要显示的title
  //       title = item.title;
  //     }else if(item.children){
  //       const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
  //       if(cItem) title = cItem.title;
  //     }
  //   })
  //   return title;
  // }


  componentDidMount() {
    this.getWeather();
    this.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }


  render() {

    const { weather, city, sysTime } = this.state;

    // 得到当前用户user
    const { username } = this.props.user;

    // 得到当前title
    const title = this.props.headTitle;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.showLogout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="tab-name">{title}</div>
          <div className="header-bottom-right">
            <span>{sysTime}</span>
            <span>{city}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    headTitle: state.headTitle,
    user: state.user
  }),
  { logout }
)(withRouter(Header))