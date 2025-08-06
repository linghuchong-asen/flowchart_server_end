/*
 * @Author: yangsen
 * @Date: 2022-04-06 11:31:01
 * @LastEditTime: 2024-11-26 18:44:57
 * @Description: file content
 */

import "./App.css";
import "antd/dist/antd.less";
import { ErrorBoundary } from "./components/error-boundary";
import { FullpageErrorFallback } from "./components/lib";
import { RouterPage } from "./router/routes";
function App() {
  return (
    <ErrorBoundary fallbackRender={FullpageErrorFallback}>
      <div className="App">
        <RouterPage />
      </div>
    </ErrorBoundary>
  );
}

export default App;
