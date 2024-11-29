/*
 * @Author: yangsen
 * @Date: 2022-04-15 19:27:09
 * @LastEditTime: 2024-11-28 15:01:00
 * @Description: file content
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/home";
import { ImportOutSystem } from "../pages/imoprtOutsystem";
import { PreViewPage } from "../pages/preView";
import { X6Page } from "../pages/x6Editor";
import Login from "../pages/login/login";
import { PrivateRoute } from "./private_router";
import Register from "../pages/login/register";


export const RouterPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/" element={< PrivateRoute component={HomePage} />} />
        <Route path="/outsys/*" element={<PrivateRoute component={ImportOutSystem} />} />
        <Route path="/editor/:projectid/:projectName" element={<PrivateRoute component={X6Page} />} />
        <Route path="/preview/:projectid" element={<PrivateRoute component={PreViewPage} />} />
      </Routes>
    </BrowserRouter>
  );
};

