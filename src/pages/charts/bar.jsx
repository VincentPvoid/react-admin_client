import React, { Component } from 'react';
import {
  Button,
  Card
} from 'antd';
import ReactECharts from 'echarts-for-react';

export default class Bar extends Component {

  state = {
    sales: [5, 20, 36, 10, 10, 20], // 表示销量
    inventorys: [15, 25, 5, 15, 12, 7] // 表示库存
  }

  getOption = () => {
    const { sales, inventorys } = this.state;

    return {
      title: {
        text: '简单示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["笔记本", "电脑", "显卡", "内存", "显示器", "键盘"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: sales
      },
      {
        name: '库存',
        type: 'bar',
        data: inventorys
      }],
      // color:['#f40','yellowgreen']
    }
  }

  update = () => {
    this.setState(state => ({
      sales: this.state.sales.map(sale => sale + 1),
      inventorys: this.state.inventorys.reduce((pre, inventory) => { // 强行使用reduce，实际不需要
        pre.push(inventory - 1)
        return pre;
      }, [])
    }))
  }

  render() {

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.update}>更新</Button>
        </Card>
        <Card title='柱状图1'>
          <ReactECharts option={this.getOption()} />
        </Card>
      </div>
    )
  }
}