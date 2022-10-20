import React from "react";
import { Route } from "react-router-dom";

import News from "../News";
import Index from "../Index"
import HouseList from "../HouseList"
import Profile from '../Profile';


import { TabBar } from 'antd-mobile-v2';

import './index.css'

const tabItems = [
  {
    title:"首页", 
    icom:'icon-ind', 
    path:'/home'
  }, 
  {
    title:"找房", 
    icom:'icon-findHouse', 
    path:'/home/houselist'
  }, 
  {
    title:"咨询", 
    icom:'icon-infom', 
    path:'/home/news'
  }, 
  {
    title:"我的", 
    icom:'icon-my', 
    path:'/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
  };

  componentDidUpdate(prevProps){
    // console.log(prevProps);  先前路由信息
    // console.log(this.props);   现在路由信息
    if(prevProps.location.pathname !== this.props.location.pathname){
      // 说明路由切换了
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
  
  // 渲染tabBar.item
  renderTabBarItem(){
    return tabItems.map(item =>  <TabBar.Item
      title={item.title}
      key={item.title}
      icon={<i className={`iconfont ${item.icom}`}></i>}
      selectedIcon={<i className={`iconfont ${item.icom}`}></i>}
      selected={this.state.selectedTab === item.path}
      // badge={1}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });
        this.props.history.push(item.path)
      }}
    >
    </TabBar.Item>)
  }

  render(){
    return (
      <div className="home">
        {/* 渲染子路由 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        {/* tabbar */}
        
        <TabBar tintColor="#21b97a" noRenderContent={true} barTintColor="white">
            {/* 原先四个 tabBar.item*/}
            {this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}