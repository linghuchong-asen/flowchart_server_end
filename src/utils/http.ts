/*
 * @Author: yangsen
 * @Date: 2021-11-04 14:51:57
 * @LastEditTime: 2022-05-01 09:08:58
 * @Description: file content
 */
import { notification } from "antd";
import axios, { AxiosRequestConfig } from "axios";
export interface normalResults {
  message: string;
}
export const http = async <T>(
  url: string,
  { params, ...props }: AxiosRequestConfig = {}
) => {
  const config: AxiosRequestConfig = {
    baseURL: "/api",
    method: "get",
    ...props,
  };

  const doHttp = axios.create(config);

  doHttp.interceptors.response.use(
    (response: { data: { code?: any; data?: any; message?: any } }) => {
      // 拦截响应，做统一处理
      if (response.data.code === 0) {
        const { data, message } = response.data;
        return { data, message };
      } else {
        return Promise.reject(response.data);
      }
    },
    // 说无响应时的处理
    (error: any) => {
      return Promise.reject(error);
    }
  );
  if (config.method !== "get" && config.method !== "delete") {
    const dataT = await doHttp({ url, data: params });
    const { data, message }: { data: T; message: string } = dataT as any;
    return { data, message };
  } else {
    const p = params ? { url, params } : { url };
    const dataT = await doHttp(p);
    const { data, message }: { data: T; message: string } = dataT as any;
    return { data, message };
  }
};

export const onErrorTips = (error: { message: string }) => {
  notification["error"]({
    message: "发生错误",
    description: error.message,
  });
};
