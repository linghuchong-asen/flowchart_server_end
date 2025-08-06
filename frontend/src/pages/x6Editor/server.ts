/*
 * @Description: 编辑器请求后端接口文件
 * @Version: 2.0
 * @Author: yangsen
 * @Date: 2022-04-22 13:45:26
 * @LastEditors: yangsen
 * @LastEditTime: 2024-12-02 15:53:46
 */
import { notification } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNormalQueryOptions } from "../../utils/hooks/useQueryOptions";
import { http, onErrorTips } from "../../utils/http";
import { fromjsonData } from "../preView";
import { Cell } from "@antv/x6";

interface ISaveParams {
  projectId: string;
  projectName: string;
  editorData: Cell.Properties[];
}

// 保存接口
export const useSaveEditorData = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: ISaveParams) =>
      http(`/editor/saveEditorData`, {
        method: "post",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, code, message } = response;
        if (code === 0) {
          notification["success"]({
            message: "提示",
            description: "保存成功！",
          });
        }
        // 保存成功，使缓存中的useGetEditordata查询无效
        queryClient.invalidateQueries("useGetEditordata");
      },
      onError: onErrorTips,
    }
  );
};
