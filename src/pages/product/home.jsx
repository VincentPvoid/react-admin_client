import React, { Component } from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import { reqSearchProducts, reqUpdateProStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';

const { Option } = Select;

export default class ProductHome extends Component {

  state = {
    total: 0, // 商品总条目数
    products: [], // 商品数据列表
    loading: false, // 表示是否为loading状态
    searchType: '0', // 搜索类型；0表示根据商品名称productName搜索，1表示根据商品描述productDesc搜索
    searchWord: '', // 搜索关键词
  }

  // 初始化列表所有的列名（th名称）
  initColumn = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name', // 显示数据对应的属性名
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 170,
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        render: (proItem) => { // status 1表示在售，2表示已下架
          return (
            <span>
              <Button type="primary" onClick={() => { this.updateProStatus(proItem) }}>{proItem.status === 1 ? '下架' : '上架'}</Button>
              <span>{proItem.status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        },
      },
      {
        title: '操作',
        width: 100,
        render: (proItem) => { // 返回需要显示的界面标签
          return (
            <span>
              <LinkButton onClick={() => { this.props.history.push('/product/detail', proItem) }}>详情</LinkButton>
              <LinkButton onClick={() => { this.props.history.push('/product/addupdate', proItem) }}>修改</LinkButton>
            </span>
          )
        },
      },
    ]
  }

  // 获取商品数据列表
  getProducts = async (pageNum) => {
    this.setState({
      loading: true
    })
    this.pageNum = pageNum;
    let { searchType, searchWord } = this.state;
    let res = {};
    let param = {
      pageNum,
      pageSize: PAGE_SIZE,
    }

    if (searchWord) {
      let type = searchType === '0' ? 'productName' : 'productDesc';
      param[type] = searchWord;

      res = await reqSearchProducts(param)
    } else {
      res = await reqSearchProducts(param);
    }

    this.setState({
      loading: false
    })
    if (res.status === 0) {
      this.setState({
        products: res.data.list,
        total: res.data.total
      })
    }
  }

  // 更新指定商品的状态
  updateProStatus = async (proItem) => {
    let productId = proItem._id;
    let { status } = proItem;
    status = status === 1 ? 2 : 1;
    const res = await reqUpdateProStatus(productId, status)
    // console.log(res,'-------------')
    if (res.status === 0) {
      message.success('更新商品状态成功！')
      this.getProducts(this.pageNum)
    } else {
      message.error(res.msg)
    }
  }

  constructor(props) {
    super(props)
    this.initColumn();
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const { products, loading, total } = this.state;

    // Card的左侧
    const title = (
      <span>
        <Select defaultValue='0' style={{ width: 150 }} onChange={(value) => this.setState({ searchType: value })}>
          <Option value='0'>按名称搜索</Option>
          <Option value='1'>按描述搜索</Option>
        </Select>
        <Input
          style={{ width: 150, margin: '0 10px' }}
          placeholder='关键字'
          onChange={(e) => this.setState({ searchWord: e.target.value })}
        />
        <Button type="primary" onClick={() => { this.getProducts(1) }}>搜索</Button>
      </span>
    )
    // Card的右侧
    const extra = (
      <Button type="primary" onClick={() => { this.props.history.push('/product/addupdate') }}>
        <PlusOutlined />
        <span>添加商品</span>
      </Button>
    )

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            dataSource={products}
            columns={this.columns}
            bordered
            rowKey='_id'
            loading={loading}
            pagination={{
              total,
              showQuickJumper: true,
              defaultPageSize: PAGE_SIZE,
              onChange: this.getProducts
            }}
          />
        </Card>
      </div>
    )
  }
}