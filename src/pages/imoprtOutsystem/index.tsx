/*
 * @Author: Dongge
 * @Date: 2022-04-13 17:19:49
 * @LastEditTime: 2022-05-01 13:38:59
 * @Description: 导出外部系统
 */

import styled from "@emotion/styled";
import { Button, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { OutSysLLGK } from "./outsystem/lianluguankong";

export const ImportOutSystem = () => {
  const navigate = useNavigate();
  return (
    <>
      <SimpleTitle>X6JSON导入外部系统功能V1.0版本</SimpleTitle>
      <div style={{ padding: 20 }}>
        <Button
          type="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          返回
        </Button>
      </div>
      <Container>
        <Tabs tabPosition="left" style={{ height: 400 }}>
          <Tabs.TabPane tab="数据治理系统" key="1">
            <OutSysLLGK />
          </Tabs.TabPane>
        </Tabs>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 40px auto;
`;
const SimpleTitle = styled.header`
  font-size: 23px;
  color: #333333;
  text-align: center;
  padding-top: 10px;
`;
