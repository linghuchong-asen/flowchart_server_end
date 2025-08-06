/*
 * @Author: yangsen
 * @Date: 2021-05-28 10:53:29
 * @LastEditTime: 2024-11-23 16:30:11
 * @Description: file content
 */
import React from "react";
// 有现成的库 react-error-boundary
// React.Component 的两个泛型 p和s
type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

// children:ReactNode类型的简单引用方式为React.PropsWithChildren<>，就是里面的类型+children类型的简写方式
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  public state = { error: null };
  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
