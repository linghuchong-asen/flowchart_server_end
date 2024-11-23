/*
 * @Author: yangsen
 * @Date: 2022-04-06 11:31:01
 * @LastEditTime: 2024-11-23 16:12:03
 * @Description: file content
 */

import "./App.css";
import "antd/dist/antd.less";
import { ErrorBoundary } from "./components/error-boundary";
import { FullpageErrorFallback } from "./components/lib";
import { RouterPage } from "./routes";
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
