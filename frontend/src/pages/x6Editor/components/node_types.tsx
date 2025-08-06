/*
 * @Author: yangsen
 * @Date: 2022-04-08 17:44:15
 * @LastEditTime: 2022-05-17 21:05:28
 * @Description: 组件节点元素集合-编辑器左侧
 */

import { Addon, Graph } from "@antv/x6";
import { useEffect } from "react";
import { getSVgImgUrl } from "../../../utils";
import { ports } from "../index";
import { getUid } from '../../imoprtOutsystem/outsystem/G6translate'

interface NodeTypesProps {
  graph: Graph | undefined;
}
// 设置链接桩
const ports_10 = {
  groups: {
    group1: {
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
          visibility: "hidden",
        },
      },
      // 使用绝对定位的链接桩
      position: {
        name: 'absolute',
      },
    },
  },
  items: [
    {
      id: "[0,0]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: 0,
      }
    },
    {
      id: "[0.1,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '10%',
        y: 0,
      }
    },
    {
      id: "[0.2,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '20%',
        y: 0,
      }
    },
    {
      id: "[0.3,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '30%',
        y: 0,
      }
    },
    {
      id: "[0.4,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '40%',
        y: 0,
      }
    },
    {
      id: "[0.5,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '50%',
        y: 0,
      }
    },
    {
      id: "[0.6,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '60%',
        y: 0,
      }
    },
    {
      id: "[0.7,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '70%',
        y: 0,
      }
    },
    {
      id: "[0.8,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '80%',
        y: 0,
      }
    },
    {
      id: "[0.9,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '90%',
        y: 0,
      }
    },
    {
      id: "[1,0]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: 0,
      }
    },
    {
      id: "[0,1]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '100%',
      }
    },
    {
      id: "[0.1,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '10%',
        y: '100%',
      }
    },
    {
      id: "[0.2,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '20%',
        y: '100%',
      }
    },
    {
      id: "[0.3,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '30%',
        y: '100%',
      }
    },
    {
      id: "[0.4,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '40%',
        y: '100%',
      }
    },
    {
      id: "[0.5,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '50%',
        y: '100%',
      }
    },
    {
      id: "[0.6,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '60%',
        y: '100%',
      }
    },
    {
      id: "[0.7,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '70%',
        y: '100%',
      }
    },
    {
      id: "[0.8,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '80%',
        y: '100%',
      }
    },
    {
      id: "[0.9,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '90%',
        y: '100%',
      }
    },
    {
      id: "[1,1]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '100%',
      }
    },
    {
      id: "[0,0.1]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '10%',
      }
    },
    {
      id: "[0,0.2]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '20%',
      }
    },
    {
      id: "[0,0.3]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '30%',
      }
    },
    {
      id: "[0,0.4]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '40%',
      }
    },
    {
      id: "[0,0.5]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '50%',
      }
    },
    {
      id: "[0,0.6]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '60%',
      }
    },
    {
      id: "[0,0.7]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '70%',
      }
    },
    {
      id: "[0,0.8]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '80%',
      }
    },
    {
      id: "[0,0.9]",
      group: "group1", // 指定分组名称
      args: {
        x: 0,
        y: '90%',
      }
    },
    {
      id: "[1,0.1]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '10%',
      }
    },
    {
      id: "[1,0.2]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '20%',
      }
    },
    {
      id: "[1,0.3]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '30%',
      }
    },
    {
      id: "[1,0.4]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '40%',
      }
    },
    {
      id: "[1,0.5]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '50%',
      }
    },
    {
      id: "[1,0.6]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '60%',
      }
    },
    {
      id: "[1,0.7]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '70%',
      }
    },
    {
      id: "[1,0.8]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '80%',
      }
    },
    {
      id: "[1,0.9]",
      group: "group1", // 指定分组名称
      args: {
        x: '100%',
        y: '90%',
      }
    },
  ],
};
export const NodeTypes = (props: any) => {
  useEffect(() => {
    if (props.graph) {
      const stencil = new Addon.Stencil({
        getDragNode: (node) => {
          return node.clone({ keepId: true });
        },
        getDropNode: (node) => {
          // 修改ID为8位数（边未实现）
          node.setProp("id", getUid(8));
          const imgHref: string = node.attrs?.image['xlink:href'] as string;
          const imgName: string = imgHref.split('/').slice(-1)[0].split('.')[0];
          const nodeFlag: boolean = imgName === 'arch_node_blue' ? true : false
          const cluster: boolean = imgName === 'arch_cluster_blue' ? true : false
          const imgFlag: boolean = nodeFlag || cluster ? true : false
          if (imgFlag) {
            // 改变常用节点的宽高
            node.setProp("size", { width: 120, height: 70 });
          }
          return node.clone({ keepId: true });
        },
        target: props.graph,
        stencilGraphWidth: 250,
        stencilGraphHeight: 180,
        groups: [
          {
            title: "图形库",
            name: "group1",
          },
        ],
        layoutOptions: {
          columns: 3,
          columnWidth: 80,
          rowHeight: 55,
        },
      });
      document.getElementById("LeftMenu")!.appendChild(stencil.container);

      // 添加图片类型节点--长宽比为12:7,默认链接桩是10个
      const imgUrls = [{ img: "arch_node_blue" }, { img: "arch_cluster_blue" }];
      const imgNodes = imgUrls.map((item) =>
        props.graph.createNode({
          shape: "image",
          width: 60,
          height: 35,
          imageUrl: getSVgImgUrl(item.img),
          attrs: {
            body: {},
            label: {
              text: "图片",
              refX: 0.5,
              refY: 0.5,
              refX2: 0,
              refY2: 0,
              fontSize: 14,
              fill: '#000000',
              fontWeight: 400,
            },
            text: {}
          },
          ports: ports_10,
        })
      );
      // 添加图片类型节点--长宽比为1:1
      const imgUrls_1_1 = [{ img: 'arch_node_province_gray' }, { img: 'arch_node_province' }];
      const imgNodes_1_1 = imgUrls_1_1.map((item) =>
        props.graph.createNode({
          shape: "image",
          width: 50,
          height: 50,
          imageUrl: getSVgImgUrl(item.img),
          attrs: {
            body: {},
            label: {
              text: "图片",
              refX: 0.5,
              refY: 0.5,
              refX2: 0,
              refY2: 0,
              fontSize: 14,
              fill: '#000000',
              fontWeight: 400,
            },
            text: {}
          },
          ports: ports,
        })
      );
      // 透明节点类型
      const transparent = props.graph.createNode({
        shape: "image",
        width: 70,
        height: 10,
        imageUrl: getSVgImgUrl('transparent'),
        attrs: {
          body: {
            opacity: 0
          },
          label: {
            text: "透明",
            refX: 0.5,
            refY: 0.5,
            refX2: 0,
            refY2: 0,
            fontSize: 14,
            fill: '#000000',
            fontWeight: 400,
          },
          text: {}
        },
        ports: ports,
      })
      // 添加有背景文本节点
      const text = props.graph.createNode({
        shape: "image",
        width: 60,
        height: 20,
        imageUrl: getSVgImgUrl('text'),
        attrs: {
          body: {},
          label: {
            text: "文本",
            refX: 0.5,
            refY: 0.5,
            refX2: 0,
            refY2: 0,
            fontSize: 14,
            fill: '#000000',
            fontWeight: 400,
          },
          text: {}
        },
        ports: ports,
      })
      // 添加原始类型节点
      const reactNode = props.graph.createNode({
        shape: "rect",
        width: 50,
        height: 28,
        attrs: {
          body: {
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#ffffff'
          },
          label: {
            text: "矩形",
            refX: 0.5,
            refY: 0.5,
            refX2: 0,
            refY2: 0,
            fontSize: 14,
            fontWeight: 400,
            fill: '#000000'
          },
        },
        ports: ports,
      });
      // 暂时取消原始类型节点
      const loadNode = [reactNode].concat(imgNodes, imgNodes_1_1);
      stencil.load([...imgNodes, ...imgNodes_1_1, transparent, text], "group1");
    }
  }, [props.graph]);
  return <div id="LeftMenu" style={{ width: "100%", height: "100%" }} />;
};
