/*
 * @Description: 注册页面
 * @Author: yangsen
 * @Date: 2024-11-26 09:53:12
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-28 10:55:56
 */
import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLogin, useRegister } from "./server";

const Register = () => {

  const { mutateAsync: register } = useRegister()
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    register(values)
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
            注册
          </Button>
          or <a href="/login">去登录!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
