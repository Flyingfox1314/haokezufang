import React from "react";

import { NavBar } from "antd-mobile-v2";

import { withRouter } from "react-router-dom";

// import { propTypes } from "prop-types";

import './index.scss'
 
function NavHeader({children, history, onLeftClick}) {
  const defaultHandler = ()=>history.go(-1)
  return (
   <NavBar 
   className="navbar" 
   mode="light" 
   icon={<i className="iconfont icon-back"></i>} 
   onLeftClick={onLeftClick || defaultHandler}
   >
    {children}
   </NavBar>
  )
}

// NavHeader.propTypes = {
//   children:propTypes.string.isRequired,
//   onLeftClick:propTypes.func
// }

export default withRouter(NavHeader)