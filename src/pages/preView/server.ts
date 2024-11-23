/*
 * @Author: Dongge
 * @Date: 2022-04-22 16:21:42
 * @LastEditTime: 2022-04-22 16:54:30
 * @Description: 根据id获取要展示的内容
 */

import { useQuery } from "react-query";
import { fromjsonData } from ".";
import { useNormalQueryOptions } from "../../utils/hooks/useQueryOptions";
import { http } from "../../utils/http";

interface editorDataProp {
  data: { projectId: string; editData: fromjsonData[] };
}
export const useGetEditordata = (params: { projectId?: string }) => {
  return useQuery<editorDataProp>(
    ["useGetEditordata", params],
    () => http("/editdata/getEditdataById", { params }),
    useNormalQueryOptions({ enabled: params.projectId !== undefined })
  );
};

