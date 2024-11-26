import { useMutation } from "react-query";
import { http } from "../../utils/http";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

interface ILoginParams {
  username: string;
  password: string;
}
const navigate = useNavigate()
export const useLogin = () => {
  return useMutation((params: ILoginParams) => http(`/login`, { params }), {
    onSuccess: (response) => {
      const { code, data, message } = response;
      if (code === 1) {
        notification["success"]({
          message: "提示",
          description: "添加成功！",
        });
        // 重定向到首页
        navigate('/')
      } else {
        notification["error"]({
          message: "发生错误",
          description: message,
        });
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // 错误触发！
      notification["error"]({
        message: "发生错误",
        description: error.response.data.message,
      });
    },
  });
};
