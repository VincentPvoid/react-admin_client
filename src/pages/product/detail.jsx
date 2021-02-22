import React, { Component } from 'react';
import { Card, List } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import './detail.less';
import LinkButton from '../../components/link-button'
import { BASE_IMG_PATH } from '../../utils/constants';
import { reqCategoryName } from '../../api';

export default class Detail extends Component {

  state = {
    pName: '', // 一级分类名称
    cName: '', // 二级分类名称
  }


  // 获取当前对应的分类名称
  getCategoryName = async () => {
    const { categoryId, pCategoryId } = this.props.location.state;
    let res = {}
    if (pCategoryId == 0) { // 如果pCategoryId为0说明当前是一级分类
      res = await reqCategoryName(categoryId)
      if (res.status === 0) {
        this.setState({
          pName: res.data.name
        })
      }
    } else {
      /* 
      一次发多个请求，等所有请求都返回后一起处理；如果有一个请求出错了，结果为失败
      Promise.all([promise1, promise2]) 返回值为一个promise对象；异步成功返回的是[result1, result2]
      */
      res = await Promise.all([reqCategoryName(pCategoryId), reqCategoryName(categoryId)])
      this.setState({
        pName: res[0].data.name,
        cName: res[1].data.name
      })
    }
  }

  componentDidMount() {
    this.getCategoryName();
  }

  render() {
    const data = [this.props.location.state]
    const { pName, cName } = this.state;

    const title = (
      <div>
        <LinkButton onClick={() => { this.props.history.goBack() }}>
          <LeftOutlined />
        </LinkButton>
        <span>商品详情</span>
      </div>
    )

    return (
      <div className="detail-page">
        <Card title={title}>
          <List
            key={data._id}
            size="large"
            dataSource={data}
            renderItem={(item) => {
              return (
                <div>
                  <List.Item>
                    <span className="product-title">商品名称：</span>
                    <span>{item.name}</span>
                  </List.Item>
                  <List.Item>
                    <span className="product-title">商品描述：</span>
                    <span>{item.desc}</span>
                  </List.Item>
                  <List.Item>
                    <span className="product-title">商品价格：</span>
                    <span>{item.price}元</span>
                  </List.Item>
                  <List.Item>
                    <span className="product-title">所属分类：</span>
                    <span>{pName + (cName ? (' --> ' + cName) : '')}</span>
                  </List.Item>
                  <List.Item>
                    <span className="product-title">商品图片：</span>
                    <span>{
                      item.imgs.map(img => {
                        return (
                          <img src={BASE_IMG_PATH + img} alt={img} className="img" />
                        )
                      })
                    }</span>
                  </List.Item>
                  <List.Item>
                    <span className="product-title">商品详情：</span>
                    <div dangerouslySetInnerHTML={{ __html: item.detail }}>
                    </div>
                  </List.Item>
                </div>
              )
            }}
          />

        </Card>
      </div>
    )
  }
}