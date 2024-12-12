/*
 * @Author: yangsen
 * @Date: 2021-11-04 14:51:57
 * @LastEditTime: 2024-12-12 16:31:52
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
      // 拦截响应，做统一处理
      return response;
    },
    // 状态码非2xx 的情况
    (error: any) => {
      return Promise.reject(error);
    }
  );
  try {
    let response;
    if (config.method !== "get" && config.method !== "delete") {
      response = await doHttp({ url, data: params });
    } else {
      const p = params ? { url, params } : { url };
      response = await doHttp(p);
    }
    const responseData =
      config.responseType === "blob" ? response : response.data;
    const { data, code, message }: { data: T; code: number; message: string } =
      responseData;
    return { data, code, message, responseHeaders: response.headers };
  } catch (err) {
    throw new Error(typeof err === "string" ? err : JSON.stringify(err));
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
