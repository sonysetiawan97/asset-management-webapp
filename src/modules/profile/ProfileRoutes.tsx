import { setPageTitle } from "@stores/PageHeaderStore";
import { FC, lazy, useEffect } from "react";
import { moduleName } from "./types/ProfileTypes";
import { Outlet, Route, Routes } from "react-router-dom";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const DetailProfileWrapper = lazy(
  () => import("./pages/detail/DetailProfileWrapper")
);
const UpdateWrapper = lazy(() => import("./pages/update/UpdateWrapper"));

const ProfileRoutes: FC = () => {
  useEffect(() => {
    setPageTitle(moduleName);
  }, []);

  return (
    <Routes>
        <Route element={<Outlet />}>
          <Route index element={<DetailProfileWrapper />} />
          <Route path="" element={<DetailProfileWrapper />} />
          <Route path="/:id/update" index element={<UpdateWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
  );
};

export default ProfileRoutes;
