import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { setPageTitle } from "@stores/PageHeaderStore";
import { moduleName } from "./types/Model";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const ListWrapper = lazy(() => import("./pages/list/ListWrapper"));
const CreateWrapper = lazy(() => import("./pages/create/CreateWrapper"));
const ReadWrapper = lazy(() => import("./pages/read/ReadWrapper"));

const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle(moduleName); }, []);
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
          <Route path="/create" element={<CreateWrapper />} />
          <Route path="/:id" element={<ReadWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;