/*
 * @Author: yangsen
 * @Date: 2022-04-22 16:21:42
 * @LastEditTime: 2024-12-02 14:28:54
 * @Description: 根据id获取要展示的内容
 */

import { useQuery } from "react-query";
import { fromjsonData } from ".";
import { useNormalQueryOptions } from "../../utils/hooks/useQueryOptions";
import { http } from "../../utils/http";

interface editorDataProp {
  data: { projectId: string; editorData: fromjsonData[] };
}
export const useGetEditorData = (params: { projectId: string }) => {
  return useQuery<editorDataProp>(
    ["useGetEditordata", params],
    () => http(`/editor/getEditorById/${params.projectId}`),
    useNormalQueryOptions({ enabled: params.projectId !== undefined })
  );
};
