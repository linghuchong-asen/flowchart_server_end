/*
 * @Author: Dongge
 * @Date: 2022-04-15 19:27:09
 * @LastEditTime: 2022-05-10 13:50:55
 * @Description: file content
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ImportOutSystem } from "./pages/imoprtOutsystem";
import { PreViewPage } from "./pages/preView";
import { X6Page } from "./pages/x6Editor";

export const RouterPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/outsys/*" element={<ImportOutSystem />} />
        <Route path="/editor/:projectid/:projectName" element={<X6Page />} />
        <Route path="/preview/:projectid" element={<PreViewPage />} />
      </Routes>
    </BrowserRouter>
  );
};

