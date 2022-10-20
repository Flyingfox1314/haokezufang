import React from "react";

// 导入axios
import axios from "axios";

import {Toast } from 'antd-mobile-v2'

import { List, AutoSizer } from 'react-virtualized'

import NavHeader from "../../components/NavHeader";

import './index.scss'

// 导入utils中获取当前定位城市的方法
import { getCurrentCity } from '../../utils/index'

// 数据格式化
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex = []

  // 1.遍历数组
  list.forEach(item => {
    // 2.获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3.判断是否有分类
    if (cityList[first]) {
      // 4.如果有，直接push
      cityList[first].push(item)
    } else {
      // 5.如果没有,先创建
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()


  return {
    cityList,
    cityIndex
  }
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每隔城市名称的高度
const NAME_HEIGHT = 50

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

// 后端返回的数据中有房源的城市只有四个
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']


export default class CityList extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      cityList:{},
      cityIndex: [], 
      activeIndex:0
    }

  // 创建ref对象
  this.cityListComponent = React.createRef()
  }

  

  componentDidMount() {
     this.getCityList()
    // 调用measureAllRows,提前计算List中每一行的高度,实现scrollToRow的精确跳转
    // 因为getCityLIst是异步调用,所有此时其实还没有任何数据
  }

  componentDidUpdate(){
    this.cityListComponent.current.measureAllRows()
  }

  // 获取城市列表数据
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    // console.log('城市列表数据', res);
    const { cityList, cityIndex } = formatCityData(res.data.body)
    // console.log(cityList, cityIndex);

    // 获取热门列表数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // console.log('热门城市列表数据', hotRes);
    // console.log(hotRes.data.body);
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')


    // 获取当前定位城市
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    // console.log(cityList, cityIndex, curCity);
    this.setState({
      cityList,
      cityIndex
    })

  }

  changeCity({label, value}) {
    // console.log(curcity);
    if(HOUSE_CITY.indexOf(label) > -1) {
      // 有
      localStorage.setItem('hkzf_city', JSON.stringify({label, value}))
      // console.log(label);
      this.props.history.go(-1)
    } else {
        Toast.info('该城市暂无房源信息', 1, null, false)
    }
  }

 // 渲染每一行数据的函数
  rowRenderer = ({
      key,
      index,
      isScrolling,
      isVisible,
      style
    }) => {
      // 获取每一行的字母索引
      const {cityIndex, cityList} = this.state
      const letter = cityIndex[index]

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item => 
            <div className="name" key={item.value} onClick={()=>this.changeCity(item)}>
              {item.label}
            </div>
        )
        }
      </div>
    )
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({index}) => {
    // 索引标题高度 + 城市数量 * 城市名称的高度
    const {cityList, cityIndex} = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    const {cityIndex, activeIndex} = this.state
    return cityIndex.map((item, index) => 
    <li className="city-index-item" key={item} onClick={()=>{
      // console.log(index);
      this.cityListComponent.current.scrollToRow(index)
    }}>
      <span className={this.state.activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
    </li>)
  }

  // 用于获取list组件渲染信息
  onRowsRendered = ({startIndex}) => {
    // console.log(startIndex);
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex:startIndex
      })
    }
  }

render() {
  return (
    <div className="cityList">
      {/* 顶部导航栏 */}
      <NavHeader>城市选择</NavHeader>

      {/* 城市列表 */}
      <AutoSizer>
        {
          ({ width, height }) =>
            <List 
            ref={this.cityListComponent}
            width={width} 
            height={height} 
            rowCount={this.state.cityIndex.length} 
            rowHeight={this.getRowHeight} 
            rowRenderer={this.rowRenderer}
            scrollToAlignment='start'
            onRowsRendered={this.onRowsRendered}></List>
        }
      </AutoSizer>

      {/* 右侧索引列表 */}
      <ul className="city-index">
        {this.renderCityIndex()}
      </ul>


    </div>
  )
}
}