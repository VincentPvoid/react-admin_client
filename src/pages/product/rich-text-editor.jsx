/*
商品详情的富文本编辑器组件
*/

import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { BASE_IMG_PATH } from '../../utils/constants';

export default class RichTextEditor extends Component {

  // 当输入框的值改变时调用
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  // 获取当前输入框中的数据
  getDetailText = () => {
    // 返回输入数据对应的html文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const res = JSON.parse(xhr.responseText);
          const url = BASE_IMG_PATH + res.data.url.substr(res.data.url.indexOf('image'));
          resolve({ data: { link: url } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    )
  }

  constructor(props) {
    super(props)
    const detail = this.props.detail;
    let editorState;
    // 如果当前有传入detail值
    if (detail) {
      const contentBlock = htmlToDraft(detail);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty(); // 创建一个没有内容的编辑对象
    }
    console.log(editorState, 'text')
    // 初始化状态
    this.state = {
      editorState
    }
  }

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <Editor
          editorStyle={{ border: '1px solid #ccc', height: 300, paddingLeft: 10 }}
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              urlEnabled: true,
              uploadCallback: this.uploadImageCallBack,
              // alt: { present: true, mandatory: true }
            }
          }}
        />
      </div>
    )
  }
}