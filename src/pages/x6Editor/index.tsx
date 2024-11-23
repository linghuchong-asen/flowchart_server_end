/*
 * @Author: Dongge
 * @Date: 2022-04-06 12:22:01
 * @LastEditTime: 2022-05-16 17:56:30
 * @Description: file content
 */

import { Cell, Graph } from "@antv/x6";
import styled from "@emotion/styled";
import { Row, Col } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSVgImgUrl } from "../../utils";
import { useGraph } from "../../utils/hooks/useGraph";
import { fromjsonData } from "../preView";
import { useGetEditordata } from "../preView/server";
import { CellAttrs } from "./components/configPanel";
import { NodeTypes } from "./components/node_types";
import ToolBar from "./components/toolBar";

export interface nowNodePro {
  x: number;
  y: number;
  cell: Cell;
}

interface EditorUrlParams {
  projectid: string;
  projectName: string;

}
// 设置链接桩
export const ports = {
  groups: {
    top: {
      position: "top",
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
          visibility: "hidden",
        },
      },
    },
    bottom: {
      position: "bottom",
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
          visibility: "hidden",
        },
      },
    },
    left: {
      position: "left",
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
          visibility: "hidden",
        },
      },
    },
    right: {
      position: "right",
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
          visibility: "hidden",
        },
      },
    },
  },
  items: [
    {
      id: "[0.5,0]",
      group: "top", // 指定分组名称
    },
    {
      id: "[0.5,1]",
      group: "bottom", // 指定分组名称
    },
    {
      id: "[0,0.5]",
      group: "left", // 指定分组名称
    },
    {
      id: "[1,0.5]",
      group: "right", // 指定分组名称
    },
  ],
};

export const X6Page = () => {
  const [nowCell, setCell] = useState<nowNodePro>();
  const { projectid, projectName } = useParams<keyof EditorUrlParams>();
  const [ready, setReady] = useState<Boolean>(false);
  const [attrVisible, setAttrVisible] = useState<boolean>(false);
  const [preData, setPreData] = useState<fromjsonData[]>([]);
  const [miniVisible, setMiniVisible] = useState<boolean>(true)
  const { data } = useGetEditordata({ projectId: projectid });

  useEffect(() => {
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
    if (data) {
      const { editData } = data.data;
      setPreData(dataClean(editData));
    }
  }, [data]);
  // 0:画布 1：点 2：边
  const [clickType, setClickType] = useState<number>(0);

  // 业务特殊配置,需要拓展
  const configFun = (graph: Graph) => {
    graph?.on("cell:mouseup", ({ e, x, y, cell }) => {
      console.log(cell);
      setAttrVisible(true);
      if (cell.isEdge()) {
        setClickType(2);
        setCell({ x, y, cell });
      }
    });
    graph?.on("cell:dblclick", ({ e, x, y, cell }) => {
      if (cell.isNode()) {
        setClickType(1);
        setCell({ x, y, cell });
      }
    });
    graph?.on("blank:click", () => {
      setAttrVisible(true);
      setClickType(3);
      console.log(graph.toJSON());
      const container = document.getElementById("container");
      const ports = container?.querySelectorAll(".x6-port-body");
      showPorts(ports, false);
      graph.getNodes().forEach((item) => {
        item.removeTools();
      });
    });
    graph.on("cell:dblclick", ({ e, x, y, cell }) => {
      if (cell.isEdge()) {
        cell.removeTools();
      }
    });
    // 控制连接桩显示/隐藏
    const showPorts = (ports: any, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    };
    graph.on("cell:mouseenter", ({ cell }) => {
      const container = document.getElementById("container");
      const ports = container?.querySelectorAll(".x6-port-body");
      showPorts(ports, true);

      if (cell.isNode()) {
        cell.addTools([
          {
            name: "button-remove",
            args: {
              x: 0,
              y: 0,
              offset: { x: -10, y: 10 },
            },
          },
        ]);
      } else {
        cell.addTools([
          {
            name: "vertices",
            args: { stopPropagation: false }, // 防止触发边的mouseup
          },
          {
            name: "button-remove",
            args: {
              x: 0,
              y: 0,
              width: '1px',
              height: '1px',
              offset: { x: 20, y: 0 },
            },
          },
        ]);
      }
    });
    graph.on("cell:mouseleave", ({ cell }) => {
      cell.removeTools();
      const container = document.getElementById("container");
      const ports = container?.querySelectorAll(".x6-port-body");
      showPorts(ports, false);
    });
    setReady(true);


  };
  // 生成graph实例
  const graph = useGraph({
    id: "container",
    callback: configFun,
  });
  useEffect(() => {
    // 从数据库查询当前项目JSON数据，生成之前的链路图
    if (graph) {
      console.log("重新生成画布");
      graph?.fromJSON(preData);
    }
  }, [graph, preData]);

  return (
    <div>
      <Container>
        <Row style={{ height: "100%", overflow: 'hidden' }}>
          <Col span={4}>
            <NodeTypes graph={graph} />
          </Col>
          <Col span={20}>
            <div id="container" style={{ width: "100%", height: "100%" }} />
            {ready && graph && projectid && projectName && <ToolBar graph={graph} projectid={projectid} projectName={projectName} miniVisible={miniVisible} setMiniVisible={setMiniVisible} />}
          </Col>
          <CellAttrs
            clickType={clickType}
            nowCell={nowCell}
            graph={graph}
            attrVisible={attrVisible}
            setAttrVisible={setAttrVisible}
          />
        </Row>
      </Container>
      <MinimapContainer id="minimapContainer" style={{ display: miniVisible ? 'block' : 'none' }} />
    </div>

  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;
const MinimapContainer = styled.div`
  width: 192px;
  height: 108px;
  position: fixed;
  top: 10px;
  right:10px;
`
