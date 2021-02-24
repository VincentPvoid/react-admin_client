import React, { Component, createRef } from 'react';
import {
  Card,
  Table,
  Button,
  message,
  Modal
} from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';

import UpdateForm from './update-form';
import AddForm from './add-form';
import LinkButton from '../../components/link-button';
import { reqCategory, reqUpdateCategory, reqAddCategory } from '../../api';


export default class Category extends Component {

  state = {
    categorys: [], // 一级分类列表数据
    subCategorys: [], // 特定一级分类下的二级分类列表数据
    parentId: '0', // 父分类id；根据此项判断请求的是什么分类；默认为0，表示请求一级分类
    parentName: '', // 当前需要显示的分类列表的父分类的名称
    loading: false, // 表示是否为loading状态
    showModel: 0, // 表示是否显示弹出框；0表示都不显示；1表示显示修改（更新）弹出框；2表示显示显示添加弹出框
  }

  // 初始化列表所有的列名（th名称）
  initColumn = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', // 显示数据对应的属性名
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (cateItem) => { // 返回需要显示的界面标签
          return (
            <span>
              <LinkButton onClick={() => { this.showUpdateModel(cateItem) }}>修改分类</LinkButton>
              {/* {如何向事件回调函数传参：先定义一个匿名函数，在函数调用要使用的函数并传入数据} */}
              {this.state.parentId === '0' ? (<LinkButton onClick={() => { this.showSubCate(cateItem) }}>查看子分类</LinkButton>) : null}
            </span>
          )
        },
      },
    ]
  }


  // 异步获取一级或二级商品分类列表
  // parentId 如果没有指定，则使用state状态中的parentId，如果指定了则使用指定的值
  getCategory = async (parentId) => {
    // 设置loading状态
    this.setState({
      loading: true
    })

    // 如果有参数，优先使用参数中的值；如果没有则使用state中的值
    parentId = parentId || this.state.parentId;

    // 获取列表数据
    const res = await reqCategory(parentId);

    // 获取数据后结束loading状态
    this.setState({
      loading: false
    })

    if (res.status === 0) {
      // 取出分类数据（可能是一级分类也可能是二级分类）
      const categorys = res.data;
      // console.log(parentId)
      if (parentId === '0') { // 更新一级分类数据状态
        this.setState({
          categorys
        })
      } else {
        this.setState({ // 更新二级分类数据状态
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取数据失败')
    }
  }

  // 显示一级分类列表（在二级列表时点击标题返回一级列表，不需要发请求）
  showCate = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  // 显示指定一级分类对象的二级子列表
  showSubCate = (cateItem) => {
    // console.log(cateItem)
    // 更新状态
    this.setState({ // 注意：setState()不能立即获取最新的状态，因为它是异步更新状态的
      parentId: cateItem._id,
      parentName: cateItem.name
    }, () => { // 在状态更新且重新render()后执行
      // 获取二级分类列表显示
      this.getCategory()
    })
  }


  /* 弹框相关 */
  // 关闭弹框
  closeModal = () => {
    // console.log(this.form)
    // this.form.resetFields();
    // this.getUpdateValue.current.resetFields();
    this.setState({
      showModel: 0
    })
  }

  // 显示更新（修改）分类弹框
  showUpdateModel = (cateItem) => {
    this.setState({
      showModel: 1
    })
    this.cateItem = cateItem;
  }

  // 确认更新（修改）分类
  updateCategory = async () => {
    // console.log(this.getUpdateValue.current, 'ab')

    this.getUpdateValue.current.validateFields().then(
      async (values) => {
        // 获取数据
        const categoryId = this.cateItem._id;
        const { categoryName } = values;

        // 发送更新（修改）请求
        const res = await reqUpdateCategory(categoryId, categoryName)

        // 修改分类后重新获取分类列表数据
        if (res.status === 0) {
          this.getCategory()
          this.setState({
            showModel: 0
          })
        } 
      }
    )


    /*
    // 1. 获取数据
    const categoryId = this.cateItem._id;
    const { categoryName } = this.getUpdateValue.current.getFieldValue();

    // 2. 关闭对话框
    this.setState({
      showModel: 0
    })

    // 3. 重置表单（未实现）
    // this.getUpdateValue.current.resetFields();

    // 发送更新（修改）请求
    const res = await reqUpdateCategory(categoryId, categoryName)

    // 修改分类后重新获取分类列表数据
    if (res.status === 0) {
      this.getCategory()
    } else {
      message.error(res.msg)
    }
    */
  }

  // 显示添加分类弹框
  showAddModel = () => {
    this.setState({
      showModel: 2
    })
  }

  // 确认添加分类
  addCategory = () => {

    // 当表单验证通过时才进行添加
    this.form.validateFields().then(
      async (values) => {
        // 1. 获取数据
        const { parentId, categoryName } = values;
        // 2. 关闭对话框
        // this.setState({
        //   showModel: 0
        // })
        // 3. 重置表单（未实现）

        // 提交添加分类的请求
        const res = await reqAddCategory(parentId, categoryName);
        if (res.status === 0) {
          // 如果添加的分类就是当前显示分类列表下的分类
          if (parentId === this.state.parentId) {
            // 重新获取当前分类列表显示
            this.getCategory()
          } else if (parentId === '0') { // 在二级列表下添加一级分类成功后，重新获取一级分类列表，但不需要显示一级列表
            this.getCategory(parentId)
          }
          // 如果修改成功，则关闭对话框
          this.setState({
            showModel: 0
          })

        } 
      }
    )

    /*
    // 1. 获取数据
    const {parentId, categoryName} = this.form.getFieldValue();

    // 2. 关闭对话框
    this.setState({
      showModel:0
    })
    
    // 3. 重置表单（未实现）
    
    // 提交添加分类的请求
    const res = await reqAddCategory(parentId, categoryName);
    if (res.status === 0) {
      // 如果添加的分类就是当前显示分类列表下的分类
      if(parentId === this.state.parentId){
        // 重新获取当前分类列表显示
        this.getCategory()
      }else if(parentId === '0'){ // 在二级列表下添加一级分类成功后，重新获取一级分类列表，但不需要显示一级列表
        this.getCategory(parentId)
      }
    } else {
      message.error(res.msg)
    }
    */

  }




  constructor(props) {
    super(props)
    this.initColumn();
    this.getUpdateValue = createRef() // 用于获取子组件的数据
    this.getAddValue = createRef();
  }

  componentDidMount() {
    this.getCategory();
  }

  render() {

    // 读取状态数据
    const { parentId, categorys, subCategorys, parentName, loading, showModel } = this.state;

    // 读取指定分类；如果没有值则指定为一个空对象
    const cateItem = this.cateItem || {};

    // Card的左侧
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCate}>一级分类列表</LinkButton> <RightOutlined /> {parentName}
      </span>
    );

    // Card的右侧
    const extra = (
      <Button type="primary" onClick={() => { this.showAddModel() }}>
        <PlusOutlined />
        <span>添加</span>
      </Button>
    )
    return (
      <div className="category">
        <Card title={title} extra={extra}>
          <Table
            dataSource={parentId === '0' ? categorys : subCategorys}
            columns={this.columns}
            bordered
            rowKey='_id'
            loading={loading}
            pagination={{ showQuickJumper: true }}
          />
        </Card>

        <Modal title="修改分类"
          visible={showModel === 1}
          onOk={this.updateCategory}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'
        >
          <UpdateForm
            item={cateItem}
            // setForm={form => this.form = form}
            formRef={this.getUpdateValue}
          />
        </Modal>

        <Modal title="添加分类"
          visible={showModel === 2}
          onOk={this.addCategory}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'
        >
          <AddForm
            formRef={this.getAddValue}
            setForm={form => this.form = form}
            list={categorys}
            parentId={parentId}
          />
        </Modal>


      </div>
    )
  }
}