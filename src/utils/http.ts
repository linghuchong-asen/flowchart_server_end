/*
 * @Author: yangsen
 * @Date: 2021-11-04 14:51:57
 * @LastEditTime: 2024-12-07 17:16:05
 * @Description: file content
 */
import { notification } from "antd";
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
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
        if (headers) {
          headers["Authorization"] = token;
          headers["Cache-Control"] =
            props?.headers?.["Cache-Control"] ?? "no-cache";
        }
      }

      return config;
    },
    (error: any) => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  doHttp.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("axios响应拦截器中点response", response);
      // 拦截响应，做统一处理
      if (response.data.code === 0) {
        const { data, code, message } = response.data;
        return { data, code, message };
      } else if (response.data instanceof Blob) {
        return response;
      } else {
        if (!response.data?.code) {
          notification.error({
            message: "发生错误",
            description: response.data.message || "未知错误",
          });
          console.error("接口返回数据异常", response);
        }
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

// /** 用于下载文件的场景，返回的数据类型为Blob */
// export const requestForFile = () => {
//   const request =  axios.create({
//     method: "get",
//     baseURL: "/api",
//     responseType: "blob",
//   })
// }
