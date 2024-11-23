/*
 * @Author: yangsen
 * @Date: 2021-11-12 16:10:09
 * @LastEditTime: 2022-05-01 00:29:43
 * @Description: file content
 */
import { notification } from "antd";
import { UseQueryOptions } from "react-query";
export const useNormalQueryOptions = <T = any>(option?: UseQueryOptions<T>) => {
  const options: UseQueryOptions<T> = {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log("query");
      const err = error as { code: number; msg: string };
      console.log(err);
      notification["error"]({
        message: "发生错误",
        description: err.msg,
      });
    },
    ...option,
  };
  return options;
};
