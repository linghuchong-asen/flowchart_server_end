/*
 * @Description:
 * @Version: 2.0
 * @Author: yangsen
 * @Date: 2022-04-14 15:36:12
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-26 14:41:38
 */
import { useEffect, useRef, useState } from "react";
import { Menu, Toolbar } from "@antv/x6-react-components";

import {
  UndoOutlined,
  RedoOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  SaveOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import "@antv/x6-react-components/es/toolbar/style/index.css";
import "@antv/x6-react-components/es/menu/style/index.css";
import _, { after } from "underscore";
import { Button, Modal } from 'antd';
import { useSaveProject, GetEditordata } from "../server";
import { fromjsonData } from "../../preView";
import { Graph, Node } from "@antv/x6";
import { getUid } from '../../imoprtOutsystem/outsystem/G6translate'
import Icon from "../../../assets/icon/icon";

const Item = Toolbar.Item;
const Group = Toolbar.Group;
const { confirm } = Modal

// 缩放下拉组件
const zoomDropdown = () => {
  const MenuItem = Menu.Item;
  const Divider = Menu.Divider;

  return (
    <Menu className="menu">
      <MenuItem name="resetView" hotkey="Cmd+H" className="menuItem">
        重置窗口
      </MenuItem>
      {/* <MenuItem name="fitWindow" hotkey="Cmd+Shift+H" className="menuItem">
        Fit Window
      </MenuItem> */}
      <Divider />
      <MenuItem name="25" className="menuItem">
        25%
      </MenuItem>
      <MenuItem name="50" className="menuItem">
        50%
      </MenuItem>
      <MenuItem name="75" className="menuItem">
        75%
      </MenuItem>
      <MenuItem name="100" className="menuItem">
        100%
      </MenuItem>
      <MenuItem name="125" className="menuItem">
        125%
      </MenuItem>
      <MenuItem name="150" className="menuItem">
        150%
      </MenuItem>
      <MenuItem name="200" className="menuItem">
        200%
      </MenuItem>
      <MenuItem name="300" className="menuItem">
        300%
      </MenuItem>
      <MenuItem name="400" className="menuItem">
        400%
      </MenuItem>
    </Menu>
  );
};


interface props {
  graph: Graph;
  projectid: string;
  projectName: string;
  setMiniVisible: (param: boolean) => void;
  miniVisible: boolean;
}

const ToolBar = (props: props) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [visible, setVisible] = useState<boolean>(false)
  const [scale, setScale] = useState<string>('100%')
  const [nowScale, setNowScale] = useState<number>(1)
  const { mutateAsync } = useSaveProject();
  let result!: fromjsonData[];
  let localResult!: fromjsonData[];
  const graph = props.graph;
  let isSave!: boolean

  // 获取后端数据
  const { data } = GetEditordata({ projectId: props.projectid });
  console.log(data);
  if (data) {
    const { editData } = data.data;
    result = editData;
    console.log('');
    // queryCache.invalidateQueries('useGetEditordata')
  }
  // 绑定快捷键--保存
  graph.bindKey('ctrl+s', () => {
    mutateAsync({
      projectId: props.projectid,
      editData: projectJson(),
      notice: true
    });
    return false
  })
  // 绑定快捷键--撤销
  graph.bindKey('ctrl+z', () => {
    console.log(234523);
    graph.history.undo();
    return false;
  })
  // 绑定快捷键--复制
  graph.bindKey('ctrl+c', () => {
    console.log('复制');
    const cells_copy = graph.getSelectedCells()
    if (cells_copy.length) {
      graph.copy(cells_copy)
    }
    return false
  })
  // 绑定快捷键--粘贴
  graph.bindKey('ctrl+v', () => {
    console.log('粘贴');
    if (!graph.isClipboardEmpty()) {
      const cells_paste = graph.paste({ offset: 32 })
      // 修改ID为8位数
      cells_paste[0].setProp("id", getUid(8));
      // 更新数据库数据，并刷新
      mutateAsync({
        projectId: props.projectid,
        editData: projectJson(),
        notice: false,
      });
      console.log(cells_paste);
      graph.cleanSelection()
      graph.select(cells_paste)
    }
    return false
  })
  // 绑定快捷键--放大
  graph.bindKey("ctrl+=", () => {
    graph.zoom(0.1);
    return false
  })
  // 绑定快捷键--缩小
  graph.bindKey('ctrl+ -', () => {
    graph.zoom(-0.1);
    return false
  })
  useEffect(() => {
    const graph = props.graph;
    const history = graph.history;
    console.log(history);
    setCanUndo(history.canUndo());
    setCanRedo(history.canRedo());
    history.on("change", () => {
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    });
  }, [props.graph]);
  const projectJson = () => {
    graph.getNodes().forEach((item: { removeTools: () => void }) => {
      item.removeTools();
    });
    const x6JSON = graph.toJSON();
    const newX6Json = x6JSON.cells.map((item: any) => {
      if (item.shape === "image") {
        const url = item?.attrs?.image["xlink:href"];
        let imgName;
        if (typeof url === "string") {
          const imgArr = url?.split("/");
          const length = imgArr.length;
          imgName = imgArr[length - 1].split('.')[0];
        }
        if (item.attrs) {
          item.attrs.image["xlink:href"] = imgName;
        }
      }
      return item;
    });

    console.log(newX6Json);
    return newX6Json;
  };
  const handleClick = (name: string) => {
    switch (name) {
      case "undo":
        console.log("undo");
        graph.history.undo();
        break;
      case "redo":
        graph.history.redo();
        break;
      case "resetView":
        graph.centerContent();
        break;
      case "25":

        graph.zoom(0.25);


        setScale('25%')
        break;
      case "50":
        graph.zoom(-parseInt(name, 10) / 100);
        setScale('50%')
        break;
      case "75":
        graph.zoom(-parseInt(name, 10) / 100);
        setScale('75%')
        break;
      case "100":
        graph.zoom(0);
        setScale('100%')
        break;
      case "125":
        graph.zoom(parseInt(name, 10) / 100);
        setScale('125%')
        break;
      case "150":
        graph.zoom(parseInt(name, 10) / 100);
        setScale('150%')
        break;
      case "200":
        graph.zoom(parseInt(name, 10) / 100);
        setScale('200%')
        break;
      case "300":
        graph.zoom(parseInt(name, 10) / 100);
        setScale('300%')
        break;
      case "400":
        graph.zoom(parseInt(name, 10) / 100);
        setScale('400%')
        break;
      case "zoomIn":
        graph.zoom(0.1);
        break;
      case "zoomOut":
        graph.zoom(-0.1);
        break;
      case "preview":
        // 获取数据库的JSON和本地JSON对比
        localResult = projectJson()
        console.log([localResult, result]);
        if (localResult.length === result.length) {
          isSave = localResult.some((item, index) => {
            console.log(index);
            console.log(_.isEqual(item, result[index]));
            return _.isEqual(item, result[index]) === false
          })
        } else {
          console.log(23);
          isSave = false
        }
        isSave = _.isEqual(result, localResult)
        if (isSave === false) {
          setVisible(true)
        } else {
          window.open(`/preview/${props.projectid}`, "_self");
        }

        break;
      case "save":
        mutateAsync({
          projectId: props.projectid,
          editData: projectJson(),
          notice: true
        });
        break;
      case 'minimap':
        props.setMiniVisible(!props.miniVisible);
        break;
      default:
        console.log("default");
        break;
    }
  };
  // 确认保存弹出框的方法
  const save = () => {
    const mutation = mutateAsync({
      projectId: props.projectid,
      editData: projectJson(),
      notice: true
    })
    mutation.then((response) => {
      if (response.message === '保存成功') {
        setVisible(false)
        window.open(`/preview/${props.projectid}`, "_self")
      }
    })
  }
  const noSave = () => {
    setVisible(false)
    window.open(`/preview/${props.projectid}`, "_self")
  }
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "1px",
          background: "#f5f5f5",
          marginLeft: "5px",
        }}
      >
        <Toolbar hoverEffect size="small" onClick={handleClick}>
          <Group>
            <Item
              name="zoom"
              tooltipAsTitle={true}
              tooltip="Zoom (Alt+Mousewheel)"
              dropdown={zoomDropdown()}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 40,
                  textAlign: "right",
                }}
              >
                {scale}
              </span>
            </Item>
          </Group>
          <Group>
            <Item
              name="zoomIn"
              tooltip="Zoom In (Ctrl +)"
              icon={<ZoomInOutlined />}
            />
            <Item
              name="zoomOut"
              tooltip="Zoom Out (Ctrl -)"
              icon={<ZoomOutOutlined />}
            />
          </Group>
          <Group>
            <Item
              name="undo"
              tooltip="撤销 ( Ctrl + Z)"
              icon={<UndoOutlined />}
              disabled={!canUndo}
            />
            <Item
              name="redo"
              tooltip="重做"
              icon={<RedoOutlined />}
              disabled={!canRedo}
            />
          </Group>
          <Group>
            <Item name="save" tooltip="保存(Ctrl+s)" icon={<SaveOutlined />} />
          </Group>
          <Group>
            <Item name="preview" tooltip="预览" icon={<EyeOutlined />} />
          </Group>
          <Group>
            <Item name="minimap" tooltip="小地图" icon={<Icon type="icon-minimap" />} />
          </Group>
        </Toolbar>

        <Modal
          visible={visible}
          title="您本次编辑未进行保存"
          transitionName=""
          maskTransitionName=""
          footer={[
            <Button key="save" type="primary" onClick={save}>
              保存
            </Button>,
            <Button key="noSave" type="dashed" onClick={noSave}>
              不保存
            </Button>,
            <Button
              key='cancel'
              onClick={() => {
                setVisible(false)
              }}
            >
              取消
            </Button>,
          ]}
        >
          如果不进行保存,本次的编辑将会消失
        </Modal>
      </div>
      <h3 style={{
        position: "fixed",
        top: "1px",
        marginLeft: "350px",
        background: "#aed0ee",
        textAlign: 'center',
        padding: '1px 10px'
      }}>
        {props.projectName}
      </h3>
    </div>

  );
};
export default ToolBar;
