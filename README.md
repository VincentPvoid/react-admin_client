# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# 问题和记录
## bug  
- 无法改变主题颜色
- Form组件中无法使用resetFields清空表单数据  
- 修改商品时 在没有获取到商品分类之前分类区域显示的是category值  
- 数据库数据有问题 用户列表有些数据中缺少role_id值  
- 在render中重置表单时会有报错（但功能能实现，不受影响）Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.  
- 选择相同用户role时，如果在authForm中进行了修改但不保存，不改变role时再次打开authForm，状态会进行保留 

## 已解决
- 设置权限时 checkbox选择有bug：  
 使用了shouldComponentUpdate，设置不正确导致tree的状态更新出现问题

- 无法更新authForm中checkedKeys的状态；或是并没有改变role的值就重复更新：  
 使用PureComponent，组件role不变时不进行更新（不会进行render）；这样就可以在每次render时获取最新的checkedKeys值

- 添加/更新用户信息弹框，第一次打开时无法更新数据，第二次再开才会更新数据：  
 antd4.x版本之前的bug
 官方文档原话：在 v3 版本中，修改未操作的字段 initialValue 会同步更新字段值，这是一个 BUG。但是由于被长期作为一个 feature 使用，因而我们一直没有修复。在 v4 中，该 BUG 已被修复。initialValue 只有在初始化以及重置表单时生效。
 https://ant.design/components/form/v3-cn/
 因此应该使用setFieldsValue来设定新的值，或重置表单

- 点击选择role时如果点击的是checkbox本身，则无法进行选中：  
 为checkbox加入点击监听事件
