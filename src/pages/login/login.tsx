/*
 * @Description: 登录页面
 * @Author: yangsen
 * @Date: 2024-11-26 09:53:12
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-28 15:04:48
 */

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "./server";
import { useLocation } from "react-router-dom";

const Login = () => {

  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  const { mutateAsync: loginRequest } = useLogin(from);
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    loginRequest(values)
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        name="login/register"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360, width: "100%" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
          or <a href="/register">去注册!</a>
        </Form.Item>

      </Form>
    </div>
  );
};

export default Login;
