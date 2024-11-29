import { Navigate, useLocation } from "react-router-dom";
import React from "react";

/** 登录鉴权组件 */
export const PrivateRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const location = useLocation();
  const token = localStorage.getItem("Authorization");
  if (!token) {
    // 用户未登录，重定向到登录页面 
    // todo:记录location的作用，navigate作用
    return <Navigate to="/login" state={{ from: location }} replace />
  } else {
    // 用户已登录，显示目标组件
    return < Component />
  }
};