import { lazy, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { setPageTitle } from "@stores/PageHeaderStore";
import { moduleName } from "./types/Model";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const ListWrapper = lazy(() => import("./pages/list/ListWrapper"));
const ReadWrapper = lazy(() => import("./pages/read/ReadWrapper"));

const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle(moduleName); }, []);
  return (
    <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
          <Route path="/:id" element={<ReadWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
  );
};

export default PrivateRoutes;
