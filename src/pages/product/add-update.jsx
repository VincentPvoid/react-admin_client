/*
添加/更新商品信息的路由组件
*/

import React, { Component } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Cascader,
  message
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import { reqCategory, reqAddUpdateProduct } from '../../api';
import LinkButton from '../../components/link-button';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';

const { TextArea } = Input;


export default class AddUpdate extends Component {

  state = {
    optionLists: [], // 级联列表的数据
  }

  // 初始化生成级联的列表（注意：可能是一层或二层）
  initOptions = async (categorys) => {
    const optionLists = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))

    const { product, isUpdate } = this;
    // 如果当前为更新页面，并且该商品为二级分类下的商品
    if (isUpdate && product.pCategoryId != 0) {
      const data = await this.getCategory(product.pCategoryId);
      if (data && data.length > 0) {
        let option = optionLists.find(item => item.value === product.pCategoryId)
        option.children = data.map(item => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        }));
      }

    }
    this.setState({
      optionLists
    })
  }

  // 获取指定分类列表；如果parentId为0，表示获取一级列表
  getCategory = async (parentId) => {
    const res = await reqCategory(parentId)
    if (res.status === 0) {
      const data = res.data;
      if (parentId == 0) { // 当前获取的是一级分类列表
        this.initOptions(data);
      } else { // 当前获取的是二级分类列表
        // 返回二级分类列表（作为async函数的promise对象的成功的value值）
        return data;
      }
    }
  }


  // 选择某个分类时的回调；加载对应的二级分类显示
  loadData = async (selectedOptions) => {
    // 当前的选择项
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // const { optionLists } = this.state; // 当前的级联列表数据
    // console.log(targetOption, 'ttttttt')

    // 异步请求获取对应的二级分类列表
    const res = await reqCategory(targetOption.value)
    targetOption.loading = false;
    if (res.status === 0) {
      // 如果有二级分类列表
      if (res.data.length > 0) {
        targetOption.children = res.data.map(item => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        }))
      } else { // 如果没有二级分类列表
        // 在级联列表数据中找到当前选择的项，把其设置为叶子（没有二级分类）
        // let option = optionLists.find(item => item.value === targetOption.value)
        // option.isLeaf = true;
        targetOption.isLeaf = true;
      }
      this.setState({
        optionLists: [...this.state.optionLists]
      })
    }
  };


  // 提交表单
  submit = () => {
    // console.log(this.formRef)
    // 表单验证
    this.formRef.current.validateFields().then(
      async (value) => {
        // console.log(value)
        // console.log(this.picwall.current.getImgs(),'wall')
        // console.log(this.richtext.current.getDetailText(),'richtext')
        let pCategoryId
        let categoryId;
        const { name, desc, price } = value;
        const imgs = this.picwall.current.getImgs();
        const detail = this.richtext.current.getDetailText();
        
        if (value.category.length === 1) {
          pCategoryId = '0';
          categoryId = value.category[0]
        } else {
          pCategoryId = value.category[0];
          categoryId = value.category[1]
        }
        let product = {
          pCategoryId,
          categoryId,
          name,
          desc,
          price,
          detail
        }
        if(imgs.length>0) product.imgs = imgs;
        
        if (this.isUpdate) {
          product._id = this.product._id;
        } 
        const res = await reqAddUpdateProduct(product)
        if(res.status === 0){
          message.success('保存商品成功')
          this.props.history.goBack();
        }else{
          message.error('保存商品失败')
        }
      }
    )
  }

  constructor(props) {
    super(props)
    // 取出跳转时传递的数据
    const product = this.props.location.state;
    this.product = product || {};
    this.isUpdate = !!product; // 将数据转换为Boolean类型
  }

  componentDidMount() {
    this.getCategory('0');
    // 用于保存当前form的容器
    this.formRef = React.createRef();
    // 用于保存picture-wall的容器
    this.picwall = React.createRef();
    // 用于保存rich-text-editor的容器
    this.richtext = React.createRef();
  }


  render() {

    const { optionLists } = this.state;
    const { product, isUpdate } = this;
    const { pCategoryId, categoryId } = this.product;

    // 用于获取级联数据的Ids数组
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId);
      } else {
        categoryIds.push(pCategoryId, categoryId);
      }
    }

    // console.log(categoryIds, 'ids')

    // 指定表单form的item布局的对象
    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };

    // 表单form价格自定义验证
    const validatorPrice = (rule, value) => {
      if (+value < 0) {
        return Promise.reject('价格不能为负数');
      } else {
        return Promise.resolve()
      }
    }


    const title = (
      <div>
        <LinkButton onClick={() => { this.props.history.goBack() }}>
          <LeftOutlined />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </div>
    )

    return (
      <Card title={title}>
        <Form
          {...layout}
          ref={this.formRef}
        >
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: '必须输入商品名称' }]}
            initialValue={product.name}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            label="商品描述"
            name="desc"
            rules={[{ required: true, message: '必须输入商品描述' }]}
            initialValue={product.desc}
          >
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="请输入商品描述"
            />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="price"
            rules={[
              { required: true, message: '必须输入商品价格' },
              { validator: validatorPrice }
            ]}
            initialValue={product.price}
          >
            <Input type="number" addonAfter="元" placeholder="请输入商品价格" />
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="category"
            rules={[{ required: true, message: '必须输入商品分类' }]}
            initialValue={categoryIds}
          >
            <Cascader
              placeholder="请选择商品分类"
              options={optionLists}
              loadData={this.loadData}
              changeOnSelect />
          </Form.Item>
          <Form.Item
            label="商品图片"
          >
            <PicturesWall ref={this.picwall} imgs={product.imgs} />
          </Form.Item>
          <Form.Item
            label="商品详情"
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.richtext} detail={product.detail} />
          </Form.Item>

          <div style={{ marginLeft: 60 }}>
            <Button type="primary" onClick={this.submit}>提交</Button>

          </div>

        </Form>
      </Card>
    )
  }
}


/*
1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2. 父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/

/*
使用ref
1. 创建ref容器 this.xxx = React.createRef()
2. 将ref容器交给需要获取的标签元素 <XXX ref={this.xxx} />
3. 通过ref容器读取标签元素 this.xxx.current
*/