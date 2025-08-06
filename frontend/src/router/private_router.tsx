import { Navigate, useLocation } from "react-router-dom";
import React, { useMemo } from "react";
import { notification } from "antd";

/** 登录鉴权组件 */
export const PrivateRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const isTokenValid = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      // exp是jwt payload中的一个字段，表示到期时间，是一个时间戳，单位秒
      return payload.exp > currentTime;
    } catch (err) {
      console.error(err)
      return false
    }
  };

  const location = useLocation();
  const token = localStorage.getItem("Authorization");
  const isValidToken = useMemo(() => token ? isTokenValid(token) : false, [token]);
  if (!token) {
    // 用户未登录，重定向到登录页面 
    // location对象上记录有当前的路由信息，以便后续登录成功后跳转回该页面
    return <Navigate to="/login" state={{ from: location }} replace />
  } else if (!isValidToken) {
    // 用户登录超时，重定向到登录页面 
    notification['info']({ message: '登录超时，请重新登录' });
    return <Navigate to="/login" state={{ from: location }} replace />
  } else {
    // 用户已登录，显示目标组件
    return < Component />
  }
};

