import { type FC, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "../../layout/AuthLayout";
import { Signin } from "./pages/Signin";
import { Register } from "./pages/Register";
// import { AuthChecker } from "@components/auth/AuthChecker";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));

const PrivateRoutes: FC = () => {
  return (
    <Routes>
        {/* <Route element={<AuthChecker />}> */}
          <Route element={<AuthLayout />}>
            <Route path="Signin" element={<Signin />} />
            <Route path="register" element={<Register />} />
            <Route index element={<Signin />} />
          </Route>
        {/* </Route> */}
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
  );
};

export default PrivateRoutes;
