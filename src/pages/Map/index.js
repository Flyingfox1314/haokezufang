import React from "react";

import NavHeader from "../../components/NavHeader";

import './index.scss'

export default class Map extends React.Component {

  componentDidMount() {

     // 获取当前定位城市
    const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
    // console.log(label, value);

    // 初始化地图实例
    const map = new window.BMap.Map('container');
    // 设置中心点坐标
    // const point = new window.BMap.Point(116.404,39.915);

    // 创建地址解析器
    const myGeo = new window.BMap.Geocoder();
    // 将地址解析的结果显示在页面上， 并调整视图视野
    myGeo.getPoint(label, (point) => {
      if(point){
         // 初始化地图
        map.centerAndZoom(point, 11);
        // map.addOverlay(new window.BMap.Marker(point));

        // 添加常用控件
        map.addControl(new window.BMap.NavigationControl())
        map.addControl(new window.BMap.ScaleControl())

        const opts = {
          position:point, 
          // offset:new window.BMap.Size(30, -30)
        }
        const label = new window.BMap.Label('文本覆盖物', opts)
        label.setStyle({
          color:'red'
        })
        // 添加覆盖物到样式中
        map.addOverlay(label)

      }
    }, label);

    // 初始化地图
    // map.centerAndZoom(point, 15); 
  }


  render() {
    return <div className="map">
      {/* 顶部导航栏 */}
      <NavHeader>
        地图找房
      </NavHeader>
      {/* 地图容器元素 */}
      <div id="container"></div>
    </div>
  }
}