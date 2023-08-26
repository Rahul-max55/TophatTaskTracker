import { Outlet, Navigate } from "react-router-dom";
import { PATHS } from "../router/paths";
import { decodeToken } from "react-jwt";

const PrivateRoute = () => {
  const token = sessionStorage.getItem("authToken");
  let auth = { token };
  console.log("AUTH TOKEN: ", auth);
  const decodedToken = auth.token && decodeToken(auth.token);

  return auth.token ? <Outlet /> : <Navigate to={PATHS.root} />;
};

export default PrivateRoute;


