import { lazy, Suspense, type FC } from "react";
import { Route, Routes } from "react-router-dom";

const NotFound = lazy(() => import("./pages/404NotFound"));
const Unauthenticated = lazy(() => import("./pages/Unauthenticated"));

const ErrorRoutes: FC = () => {
  return (
    <Suspense>
      <Routes>
        {/* TODO: create error page */}
        <Route path="/403" element={<Unauthenticated />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default ErrorRoutes;
