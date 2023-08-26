import React from "react";
import AppRouter from "../router/router";
import { Navbar } from "../components";
const AppLayout = () => {
  return (
    <>
      <Navbar />
      <AppRouter />
    </>
  );
};

export default AppLayout;
