/*
管理商品图片组件（上传/删除图片）
*/

import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from '../../api';
import { BASE_IMG_PATH, UPLOAD_IMG_NAME } from '../../utils/constants';


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



export default class PicturesWall extends Component {

  // 关闭预览大图
  handleCancel = () => this.setState({ previewVisible: false });

  // 打开预览大图Modal
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // console.log(file.url)
    let url = BASE_IMG_PATH + file.url.substr(file.url.indexOf('image'))
    this.setState({
      previewImage: url || file.thumbUrl,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };


  // file当前操作文件信息对象；fileList包含所有文件信息对象的数组
  // 注意：file与fileList中的元素内容相同，但并不相等（内存地址不同）；因此修改file无法达到修改fileList中元素的目的
  handleChange = async ({ fileList, file }) => {
    console.log(file, 'file')
    console.log(fileList)
    // console.log(fileList[fileList.length - 1] === file)
    if (file.status === 'done') { // 上传成功
      const res = file.response;
      if (res.status === 0) {
        message.success('上传图片成功');
        const { name, url } = res.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error('图片上传失败')
      }
    } else if (file.status === 'removed') { // 删除图片
      const res = await reqDeleteImg(file.name)
      if (res.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error(res.msg)
      }
    }
    this.setState({ fileList })
  };


  // 获取当前已经上传图片文件的文件名（用于父组件提交）
  getImgs = () => {
    return this.state.fileList.map(item => item.name)
  }



  constructor(props) {
    super(props)
    // 如果当前为更新，有imgs数组传入
    const imgs = this.props.imgs;
    let fileList = [];
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item, index) => ({
        uid: -index,
        name: item,
        status: 'done',
        url: BASE_IMG_PATH + item,
      }))
    }


    // 初始化状态
    this.state = {
      previewVisible: false, // 是否显示大图预览Modal
      previewImage: '',   // 大图的url
      previewTitle: '',  // 大图预览标题名
      fileList: fileList  // 所有需要显示的图片信息对象的数组
    };
  }


  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" // 上传图片的接口地址
          listType="picture-card" // 图片列表显示样式
          accept='image/*' // 接受的文件格式
          name={UPLOAD_IMG_NAME} // 请求参数名
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
