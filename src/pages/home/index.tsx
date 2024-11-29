/*
 * @Author: yangsen
 * @Date: 2022-04-13 10:00:33
 * @LastEditTime: 2024-11-28 15:13:03
 * @Description: file content
 */

import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Form, Input, Modal, notification, Space, Table, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile } from "antd/lib/upload/interface";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetProjectQueryData,
  useAddProject,
  useDeleteProject,
  useGetDownload,
  useGetProject,
  useImportProject
} from "./server";


export interface tableDataProp {
  projectName: string;
  projectDesc: string;
  projectId: string;
  rowNum: number;
}

export const HomePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [params, setParams] = useState({ pageSize: 10, pageNumber: 1 });
  const [nowid, setNowid] = useState<string>();
  const [localVisible, setLocalVisible] = useState<boolean>(false)
  const [importId, setImportId] = useState<string>()
  const [fileList, setFileList] = useState<UploadFile<unknown>[]>([]);
  const { data: projectListResponse, isSuccess, isFetching } = useGetProject(params);
  const { data: DownloadUrl } = useGetDownload({ projectId: nowid });
  const { confirm } = Modal;

  useEffect(() => {
    if (DownloadUrl?.data.url) {
      // todo：这里url是reat router的地址，还是后端返回的一个完整的http网址；导出按钮就是执行这个逻辑，还有必要在useEffect中再写一遍吗？
      window.open(DownloadUrl.data.url, "_self");
    }
  }, [DownloadUrl?.data.url]);


  let tableSource: GetProjectQueryData["data"] = {
    page: { total: 0, pageSize: 1 },
    tableData: [],
  };

  if (isSuccess) {
    const { page, tableData } = projectListResponse.data;
    tableSource = { ...tableSource, page, tableData };
  }

  const [form] = useForm();

  const { mutateAsync } = useAddProject();
  const { mutateAsync: deleteProject } = useDeleteProject();

  const showModal = () => {
    setIsModalVisible(true);
  };
  const onChange = (pageNumber: number, pageSize: number) => {
    setParams({ pageNumber, pageSize });
  };
  const onDelProject = (projectId: string) => {
    deleteProject({ projectIds: [projectId] });
  };
  // 导入本地JSON接口
  const { mutateAsync: importJson } = useImportProject(setLocalVisible, setFileList, form);

  // 删除确认对话框
  const showDeleteConfirm = (projectId: string, projectName: string): void => {
    confirm({
      title: `请确认是否删除 ${projectName} 项目?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '是',
      okType: 'primary',
      cancelText: '否',
      onOk() {
        onDelProject(projectId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <div>
      <SimpleTitle>链路编辑器项目集V0.1简略版</SimpleTitle>
      <TableParent>
        <Button
          type="primary"
          onClick={() => {
            showModal();
          }}
        >
          新建项目
        </Button>
        <Button type="primary" style={{ marginLeft: "20px" }}>
          <Link to="/outsys">导入外部系统</Link>
        </Button>
        <Table
          loading={isFetching}
          style={{ marginTop: "20px" }}
          rowKey="projectId"
          dataSource={tableSource.tableData}
          pagination={{
            pageSize: tableSource.page.pageSize,
            total: tableSource.page.total,
            onChange: onChange,
          }}
          columns={[
            {
              title: "",
              dataIndex: "rowNum",
              width: 30,
            },
            {
              title: "项目名称",
              dataIndex: "projectName",
            },
            {
              title: "操作",
              render: (text, record) => (
                <Space size="middle" align="center">
                  <a href={`/preview/${record.projectId}`} target="_blank">
                    预览
                  </a>
                  <a href={`/editor/${record.projectId}/${record.projectName}`} target="_blank">
                    编辑
                  </a>
                  <a
                    onClick={() => {
                      if (record.projectId === nowid && DownloadUrl) {
                        window.open(DownloadUrl.data.url, "_self");
                      }
                      setNowid(record.projectId);
                    }}
                  >
                    导出
                  </a>
                  <a onClick={() => showDeleteConfirm(record.projectId, record.projectName)}>
                    删除
                  </a>
                  <a
                    onClick={() => {
                      setLocalVisible(true);
                      setImportId(record.projectId)
                    }}
                  >
                    导入
                  </a>
                </Space>
              ),
            },
          ]}
        />
      </TableParent>
      <PopPage
        title="新建项目"
        callback={async () => {
          const params = form.getFieldsValue();
          await mutateAsync(params);
          form.resetFields();
        }}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      >
        <Form form={form}>
          <Form.Item label="项目名称" name="projectName">
            <Input />
          </Form.Item>
          <Form.Item label="项目描述" name="projectDesc">
            <TextArea showCount maxLength={100} />
          </Form.Item>
        </Form>
      </PopPage>
      <Modal
        visible={localVisible}
        title="导入本地json数据"
        okText="导入"
        cancelText="取消"
        onCancel={() => {
          setLocalVisible(false)
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              const reader = new FileReader();
              reader.readAsArrayBuffer(values.localJson.file);
              reader.onload = () => {
                const result = reader.result;
                let resultBuffer!: ArrayBuffer;
                if (Object.prototype.toString.call(result) === "[object ArrayBuffer]") {
                  resultBuffer = result as ArrayBuffer;
                }
                // 生成utf-8文本解码器
                const enc = new TextDecoder("utf-8");
                // 将ArrayBuffer转换为8位无符号整形数组
                const resultUnit8: Uint8Array = new Uint8Array(resultBuffer);
                // 按着utf-8方式解码，返回一个字符串
                const resultString: string = enc.decode(resultUnit8);
                const resultArr = JSON.parse(resultString); // resultArr是转换完成要传给后端的JSON数组
                console.log(resultArr);
                importJson({
                  projectId: importId,
                  editData: resultArr,
                })
              }

            })
            .catch((info) => {
              console.log('Validate Failed:', typeof info);
              notification["error"]({
                message: "发生错误",
                description: info.toString(),
              });
            });
        }}
        transitionName=""
        maskTransitionName=""
      >
        <Form
          form={form}
          layout="vertical"
          name="form_import"
        >
          <Form.Item
            name='localJson'
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: '请上传文件',
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => { setFileList([file]); return false }}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>本地X6JSON导入</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
interface PopPagePro {
  title: string;
  callback: () => void;
  children: ReactNode;
  isModalVisible: boolean;
  setIsModalVisible: (params: boolean) => void;
}
const PopPage = ({ title, callback, children, isModalVisible, setIsModalVisible }: PopPagePro) => {
  const handleOk = () => {
    callback();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      transitionName=""
      maskTransitionName=""
    >
      {children}
    </Modal>
  );
};

const SimpleTitle = styled.header`
  font-size: 23px;
  color: #333333;
  text-align: center;
`;
const TableParent = styled.div`
  margin: 40px auto;
  width: 60%;
`;
