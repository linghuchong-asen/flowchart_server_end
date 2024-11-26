/*
 * @Author: yangsen
 * @Date: 2022-04-15 19:27:09
 * @LastEditTime: 2024-11-26 13:47:26
 * @Description: file content
 */

import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "../home";
import { ImportOutSystem } from "../imoprtOutsystem";
import { PreViewPage } from "../preView";
import { X6Page } from "../x6Editor";
import Login from "../login";
import { PrivateRoute } from "./private_router";


export const RouterPage = () => {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route path="/" element={< HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path="/outsys/*" element={<ImportOutSystem />} />
        <Route path="/editor/:projectid/:projectName" element={<X6Page />} />
        <Route path="/preview/:projectid" element={<PreViewPage />} />
      </Routes> */}
      <Routes>
        <Route path="/" element={< PrivateRoute component={HomePage} />} />
        <Route path='/login' element={<Login />} />
        <Route path="/outsys/*" element={<PrivateRoute component={ImportOutSystem} />} />
        <Route path="/editor/:projectid/:projectName" element={<PrivateRoute component={X6Page} />} />
        <Route path="/preview/:projectid" element={<PrivateRoute component={PreViewPage} />} />
      </Routes>
    </BrowserRouter>
  );
};

