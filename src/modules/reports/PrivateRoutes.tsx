import { lazy, Suspense, useEffect, type FC } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LoadingPage } from "@components/loadings/LoadingPage";
import { setPageTitle } from "@stores/PageHeaderStore";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const InventoryReport = lazy(() => import("./pages/inventory/ReportPage"));
const ByCategory = lazy(() => import("./pages/by-category/ReportPage"));
const ByLocation = lazy(() => import("./pages/by-location/ReportPage"));
const Depreciation = lazy(() => import("./pages/depreciation/ReportPage"));

const PrivateRoutes: FC = () => {
  useEffect(() => { setPageTitle("reports"); }, []);
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<InventoryReport />} />
          <Route path="by-category" element={<ByCategory />} />
          <Route path="by-location" element={<ByLocation />} />
          <Route path="depreciation" element={<Depreciation />} />
        </Route>
        <Route path="*" element={<ErrorRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;