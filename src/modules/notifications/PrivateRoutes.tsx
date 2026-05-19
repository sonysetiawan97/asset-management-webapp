import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { setPageTitle } from "@stores/PageHeaderStore";
import { moduleName } from "./types/Model";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const ListWrapper = lazy(() => import("./pages/list/ListWrapper"));

const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle(moduleName); }, []);
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<ListWrapper />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;