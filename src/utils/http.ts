/*
 * @Author: yangsen
 * @Date: 2021-11-04 14:51:57
 * @LastEditTime: 2024-12-04 15:55:40
 * @Description: file content
 */
import { notification } from "antd";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
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

  doHttp.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // 在发送请求之前做些什么
      const token: string | null = localStorage.getItem("Authorization");
      if (token) {
        const headers: AxiosRequestHeaders | undefined = config.headers;
        if (headers) headers["Authorization"] = token;
      }

      return config;
    },
    (error: any) => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  doHttp.interceptors.response.use(
    (response: { data: { code?: any; data?: any; message?: any } }) => {
      console.log("axios响应拦截器中点response", response);
      // 拦截响应，做统一处理
      if (response.data.code === 0) {
        const { data, code, message } = response.data;
        return { data, code, message };
      } else if (response.data instanceof Blob) {
        return response;
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
    const { data, code, message }: { data: T; code: number; message: string } =
      dataT as any;
    return { data, code, message };
  } else {
    const p = params ? { url, params } : { url };
    const dataT = await doHttp(p);
    const { data, code, message }: { data: T; code: number; message: string } =
      dataT as any;
    return { data, code, message };
  }
};

export const onErrorTips = (error: { message: string }) => {
  notification["error"]({
    message: "发生错误",
    description: error.message,
  });
};
