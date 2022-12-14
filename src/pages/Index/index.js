import React from "react";

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile-v2';
import axios from "axios";
import './index.scss'

import img1 from '../../assets/images/房子.png'
import img2 from '../../assets/images/联系人.png'
import img3 from '../../assets/images/地图.png'
import img4 from '../../assets/images/出租.png'

// 导入utils中获取当前定位城市的方法
import {getCurrentCity} from '../../utils/index'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: img1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: img2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: img3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: img4,
    title: '去出租',
    path: '/rent'
  }
]

// 获取地理位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   // console.log('当前位置信息:', position)
// })



export default class index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    isSwiperLoaded: false,

    // 租房小组数据
    groups: [],

    // 最新咨询数据
    news: [],

    // 当前城市名称
    curCityName:'北京', 
  }


  // 获取轮播图状态数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  // 获取租房小组数据
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res);
    this.setState({
      groups: res.data.body
    })
  }

  // 获取最新咨询数据
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.data.body
    })
  }

  // 获取当前定位城市

 async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // // 通过IP定位获取到当前城市名字
    // const curCity = new window.BMap.LocalCity()
    // curCity.get(async res => {
    //   // console.log("当前城市信息：", res);
    //   const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
    //   // console.log(result);
    //   this.setState({
    //     curCityName:result.data.body.label
    //   })
    // })

    const curCity = await getCurrentCity()
    this.setState({
      curCityName:curCity.label
    })
  

  }

  // 渲染轮播图图片的方法
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a key={item.id} style={{ display: 'inline-block', width: '100%', height: 212 }} >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
      <img src={item.img} />
      <h2>{item.title}</h2>
    </Flex.Item>)
  }

  // 渲染最新咨询
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={`http://localhost:8080${item.imgSrc}`} alt=''></img>
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.data}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">

        {/* 轮播图 */}
        <div className="swiper">
          {
            this.state.isSwiperLoaded ?
              <Carousel autoplay={true} infinite={true} dots={false}>
                {this.renderSwipers()}
              </Carousel> : ('')
          }

          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div className="location" onClick={() => this.props.history.push('/citylist')}>
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              {/* 搜索表单 */}
              <div className="form" onClick={() => this.props.history.push('/search')}>
                <i className="iconfont icon-seach"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
          </Flex>

        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组
            <span className="more">更多</span>
          </h3>

          {/* 宫格组件 */}
          <Grid data={this.state.groups} square={false} hasLine={false} columnNum={2} renderItem={(item) => (
            <Flex className="group-item" justify="around" key={item.id}>
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )} />

        </div>

        {/* 最新咨询 */}
        <div className="news">
          <h3 className="group-title">最新咨询</h3>
          <WingBlank size='md'>{this.renderNews()}</WingBlank>
        </div>


      </div>
    )
  }
}