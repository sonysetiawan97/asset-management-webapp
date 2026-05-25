import { setPageTitle } from "@stores/PageHeaderStore";
import { lazy, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { moduleName } from "./types/UserTypes";
const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const ListWrapper = lazy(() => import("./pages/list/ListWrapper"));
const CreateWrapper = lazy(() => import("./pages/create/CreateWrapper"));
const ReadWrapper = lazy(() => import("./pages/read/ReadWrapper"));
const UpdateWrapper = lazy(() => import("./pages/update/UpdateWrapper"));
const TrashWrapper = lazy(() => import("./pages/trash/ListTrashWrapper"));

const PrivateRoutes: FC = () => {
  useEffect(() => {
    setPageTitle(moduleName);
  }, []);

  return (
    <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
          <Route path="/create" index element={<CreateWrapper />} />
          <Route path="/:id" index element={<ReadWrapper />} />
          <Route path="/:id/update" index element={<UpdateWrapper />} />
          <Route path="/trash" index element={<TrashWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
  );
};

export default PrivateRoutes;
