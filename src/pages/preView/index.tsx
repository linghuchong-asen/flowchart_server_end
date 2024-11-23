/*
 * @Author: Dongge
 * @Date: 2022-04-13 10:50:37
 * @LastEditTime: 2022-05-06 16:38:04
 * @Description: 预览页面
 */

import { Edge, Graph, Model, Node } from "@antv/x6";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSVgImgUrl } from "../../utils";
import { useGraph } from "../../utils/hooks/useGraph";
import { useGetEditordata } from "./server";
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
  console.log('yulan');
  const { projectid } = useParams<keyof PreviewUrlParams>();
  const { data } = useGetEditordata({ projectId: projectid });

  const graph = useGraph({
    id: "container",
    callback: () => { },
    isPreview: true,
  });
  let result: fromjsonData[] = [];
  if (data) {
    const { editData } = data.data;
    result = dataClean(editData);
  }
  if (graph) {
    graph?.fromJSON(result);
  }
  return <div id="container" style={{ width: "100vw", height: "100vh" }} />;
};
