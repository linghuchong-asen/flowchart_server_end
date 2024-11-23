/*
 * @Author: Dongge
 * @Date: 2022-04-19 10:22:33
 * @LastEditTime: 2022-04-19 11:00:41
 * @Description:contextTotal
 */
import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
// 国际化为中文显示
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
};

