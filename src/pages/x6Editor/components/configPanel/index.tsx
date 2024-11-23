/*
 * @Author: Dongge
 * @Date: 2022-04-06 16:37:25
 * @LastEditTime: 2022-05-10 16:19:33
 * @Description: 属性展示模块demo，需要拓展成多种模块，后期可以优化，编辑器右侧
 */

import NodePanel from "./ConfigNode";
import EdgePanel from "./ConfigEdge";
import { Divider, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import GridPanel from "./ConfigGrid";
import { CloseOutlined } from "@ant-design/icons";
import { Graph, Cell } from "@antv/x6";


interface attrProp {
  clickType: number;
  nowCell: { cell: Cell<Cell.Properties>; } | undefined;
  graph: Graph | undefined;
  attrVisible: boolean;
  setAttrVisible: React.Dispatch<React.SetStateAction<boolean>>
}
// 总出口
export const CellAttrs = (props: attrProp) => {
  const attrVisible = props.attrVisible;
  const setAttrVisible = props.setAttrVisible;
  useEffect(() => {
    setAttrVisible(true);
  }, [setAttrVisible]);
  if (props.graph && props.nowCell) {
    if (props.clickType === 1) {
      return (
        <Drawer
          visible={attrVisible}
          onClose={() => {
            setAttrVisible(false);
          }}
          mask={false}
          maskClosable={false}
          closeIcon={
            <CloseOutlined style={{ position: "absolute", right: "20px", top: '10px' }} />
          }
          title={<div style={{ fontWeight: 700, fontSize: '14px', color: '#666' }}>节点属性</div>}
          headerStyle={{ backgroundColor: '#EDEDED', height: '30px' }}
          bodyStyle={{ backgroundColor: '#F5F5F5', padding: 0 }}
        >
          <NodePanel
            graph={props.graph}
            cell={props.nowCell?.cell}
            id={props.nowCell?.cell.id}
          />
        </Drawer>
      );
    } else if (props.clickType === 2) {
      return (
        <Drawer
          visible={attrVisible}
          onClose={() => {
            setAttrVisible(false);
          }}
          mask={false}
          maskClosable={false}
          closeIcon={
            <CloseOutlined style={{ position: "absolute", right: "20px", top: '10px' }} />
          }
          title={<div style={{ fontWeight: 700, fontSize: '14px', color: '#666' }}>边属性</div>}
          headerStyle={{ backgroundColor: '#EDEDED', height: '30px' }}
          bodyStyle={{ backgroundColor: '#F5F5F5', padding: 0 }}
        >
          <EdgePanel
            graph={props.graph}
            cell={props.nowCell?.cell}
            id={props.nowCell?.cell.id}
          />
        </Drawer>
      );
    }
    //  else if (props.clickType === 3) {
    //   return (
    //     <Drawer
    //       visible={attrVisible}
    //       onClose={() => {
    //         setAttrVisible(false);
    //       }}
    //       mask={false}
    //       maskClosable={false}
    //     >
    //       <GridPanel graph={props.graph} />
    //     </Drawer>
    //   );
    // } 
    else {
      return (<div />);
    }
  } else {
    return (<div />)
  }

};
