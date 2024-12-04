/*
 * @Author: yangsen
 * @Date: 2022-04-19 10:20:08
 * @LastEditTime: 2024-12-04 19:00:46
 * @Description: 项目管理模块，后端api
 */

import { FormInstance, notification } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { tableDataProp } from ".";
import { useNormalQueryOptions } from "../../utils/hooks/useQueryOptions";
import { http, onErrorTips } from "../../utils/http";

export interface GetProjectQueryData {
  data: {
    page: { pageSize: number; total: number };
    tableData: tableDataProp[];
  };
}

/**
 * 数据量单条数据查询--可以用作基本请求模板
 *
 * 用法：const {isLoading,isSuccess,isError,data} = useGetProject(),具体见react-query官网
 */

// TODO:使用react-query有什么好处
export const useGetProject = (params: {
  pageSize: number;
  pageNumber: number;
}) => {
  return useQuery<GetProjectQueryData>(
    ["useGetProject", params],
    () => http("/project", { params }),
    useNormalQueryOptions()
  );
};

// todo：返回一个url是什么意思，是MongoDB上的存储地址吗?为什么不是直接返回数据
// interface useGetDownloadprop {
//   data: { url: string };
// }
export const useGetDownload = () => {
  return useMutation(
    (projectId: string) =>
      http("/project/editDataFile", {
        method: "get",
        params: { projectId },
        responseType: "blob",
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        console.log("导出json文件", data);
      },
      onError: onErrorTips,
    }
  );
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { projectName: string; projectDesc: string }) =>
      http<[]>(`/project`, {
        method: "post",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        if (data.length === 0) {
          notification["error"]({
            message: "error",
            description: message,
          });
        } else {
          notification["success"]({
            message: "提示",
            description: "添加成功！",
          });
        }

        // 刷新需要更新的query
        queryClient.invalidateQueries("useGetProject");
        // queryClient.invalidateQueries("useLLJobData");
      },
      onError: onErrorTips,
    }
  );
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { projectIds: string[] }) =>
      http(`/project/delProject`, {
        method: "delete",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        notification["success"]({
          message: "提示",
          description: message,
        });
        queryClient.invalidateQueries("useGetProject");
      },
      onError: onErrorTips,
    }
  );
};
// 导入接口(本地JSON)
export const useImportProject = (
  setLocalVisible: (param: boolean) => void,
  setFileList: (param: []) => void,
  form: FormInstance
) => {
  return useMutation(
    (params: any) =>
      http<[]>(`/editdata/importEditdata`, {
        method: "post",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        if (Object.keys(data).length === 0) {
          notification["success"]({
            message: "error",
            description: message,
          });
        } else {
          // 隐藏对话框
          setLocalVisible(false);
          // 清空upload组件的fileList
          setFileList([]);
          // 清空form内容
          form.setFieldsValue({ localJson: { file: null, fileList: null } });
          notification["success"]({
            message: "提示",
            description: "导入成功！",
          });
        }
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
