import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { setPageTitle } from "@stores/PageHeaderStore";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const InventoryReport = lazy(() => import("./pages/inventory/ReportPage"));

const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle("reports"); }, []);
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<InventoryReport />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;