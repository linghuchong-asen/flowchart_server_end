/*
 * @Author: yangsen
 * @Date: 2022-04-13 14:02:15
 * @LastEditTime: 2024-11-29 13:45:59
 * @Description: file content
 */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AppProviders } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

