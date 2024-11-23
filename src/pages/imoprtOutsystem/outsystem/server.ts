/*
 * @Description: 
 * @Version: 2.0
 * @Author: yangsen
 * @Date: 2022-04-28 16:17:22
 * @LastEditors: yangsen
 * @LastEditTime: 2022-05-01 09:04:07
 */
import { notification } from "antd";
import { useMutation } from "react-query";
import { http, onErrorTips } from "../../../utils/http";


export const useImport = () => {
  return useMutation(
    (params: any) =>
      http<[]>(`/importmysql`, {
        method: "post",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        notification["success"]({
          message: "提示",
          description: "导入成功！",
        });
      },
      onError: (error: { response: { data: { message: string } } }) => {
        // 错误触发！
        notification["error"]({
          message: "发生错误",
          description: error.response.data.message,
        });
      },
    }
  );
};