const { override, fixBabelImports, addLessLoader } = require("customize-cra");
// const path = require("path");

module.exports = override(
  // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)  
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true, //自动打包相关的样式 默认为 style:'css'  注意：该操作会在最后引入antd相关样式，因此会无法在公共css中覆盖antd的样式
  }),
  // 使用less-loader对源码中的less的变量进行重新指定，设置antd自定义主题  
  addLessLoader({
    lessOptions: { //注意：现版本less-loader需要写在lessOptions中
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#f40' }
    }
  }),
  //增加路径别名的处理 
  // addWebpackAlias({  
  //   '@': path.resolve('./src')  
  // })
); 
