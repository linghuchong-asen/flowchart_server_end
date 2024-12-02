/*
 * @Author: yangsen
 * @Date: 2022-04-13 10:50:37
 * @LastEditTime: 2024-12-02 16:49:57
 * @Description: 预览页面
 */

import { Edge, Graph, Model, Node } from "@antv/x6";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSVgImgUrl } from "../../utils";
import { useGraph } from "../../utils/hooks/useGraph";
import { useGetEditorData } from "./server";
import { notification } from "antd";
interface PreviewUrlParams {
  projectid: string;
}
export type fromjsonData = Node.Metadata | Edge.Metadata;
// 处理获取到的editor数据
function dataClean(data: fromjsonData[]) {
  const tempData: fromjsonData[] = JSON.parse(JSON.stringify(data));
  const result = tempData.map((item) => {
    if (item.shape === "image") {
      const img = item.attrs.image["xlink:href"];
      item.attrs.image["xlink:href"] = getSVgImgUrl(img);
      console.log(getSVgImgUrl(img));
    }
    return item;
  });
  return result;
}

export const PreViewPage = () => {
  const { projectid } = useParams<keyof PreviewUrlParams>();
  if (!projectid) {
    notification.error({
      message: "项目id为空",
    });
  };
  const { data } = useGetEditorData({ projectId: projectid as string });

  const graph = useGraph({
    id: "container",
    callback: () => { },
    isPreview: true,
  });

  useEffect(() => {
    if (data?.data && graph) {
      const { editorData } = data.data;
      const result = dataClean(editorData);
      graph?.fromJSON(result);
    }
  }, [data, graph]);

  return <div id="container" style={{ width: "100vw", height: "100vh" }} />;
};
