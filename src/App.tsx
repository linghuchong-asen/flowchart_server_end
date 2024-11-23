/*
 * @Author: Dongge
 * @Date: 2022-04-06 11:31:01
 * @LastEditTime: 2022-04-15 20:01:25
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
