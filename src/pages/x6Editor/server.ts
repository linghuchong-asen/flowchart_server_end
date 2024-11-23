/*
 * @Description: 编辑器请求后端接口文件
 * @Version: 2.0
 * @Author: yangsen
 * @Date: 2022-04-22 13:45:26
 * @LastEditors: yangsen
 * @LastEditTime: 2022-06-02 11:40:53
 */
import { notification } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNormalQueryOptions } from "../../utils/hooks/useQueryOptions";
import { http, onErrorTips } from "../../utils/http";
import { fromjsonData } from "../preView";



// 保存接口
export const useSaveProject = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: any) =>
      http<{ notice: boolean }>(`/editdata/updataEditdata`, {
        method: "post",
        params,
      }),
    {
      onSuccess: (response) => {
        const { data, message } = response;
        if (data.notice === true) {
          notification["success"]({
            message: "提示",
            description: "保存成功！",
          });
        }
        // 保存成功，使缓存中的useGetEditordata查询无效
        queryClient.invalidateQueries('useGetEditordata')
      },
      onError: onErrorTips,
    }
  );
};
// 获取项目JSON数据接口
interface editorDataProp {
  data: { projectId: string; editData: fromjsonData[] };
}
export const GetEditordata = (params: { projectId?: string }) => {
  return useQuery<editorDataProp>(
    ["useGetEditordata", params],
    () => http("/editdata/getEditdataById", { params }),
    useNormalQueryOptions({ enabled: params.projectId !== undefined })
  );
};