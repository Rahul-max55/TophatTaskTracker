import React from "react";
import { routesMap } from "./routeMaps";
import { PATHS } from "./paths";
import { ErrorPage, LoginPage } from "../pages";
import { Route, Routes, Navigate } from "react-router-dom";
import ReverseAuthRoute from "./ReverseAuth";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* login route */}
      <Route element={<ReverseAuthRoute />}>
        <Route path={PATHS.login} element={<LoginPage />} />
      </Route>
      {/* default page redirection */}
      <Route path={PATHS.root} element={<Navigate to={PATHS.login} />} />
      {/* error page */}
      <Route path="/*" element={<ErrorPage />} />

      {/* protected routes */}
      {routesMap.map(({ id, isProtected, path, Element }) => {
        return (
          <Route key={id} element={isProtected && <ProtectedRoute />}>
            <Route path={path} element={<Element />} />
          </Route>
        );
      })}
    </Routes>
  );
};

export default AppRouter;
