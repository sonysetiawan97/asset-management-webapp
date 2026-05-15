import { type FC, lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { App } from "../App";

import { LoadingPage } from "@components/loadings/LoadingPage";
import { useAuth } from "@hooks/useAuth";

const { VITE_APP_BASE_URL } = import.meta.env;

const AuthRoutes = lazy(() => import("@modules/auth/PrivateRoutes"));
const PrivateRoutes = lazy(() => import("./PrivateRoutes"));
const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));

const AppRoutes: FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Suspense fallback={<LoadingPage />}>
      <BrowserRouter basename={VITE_APP_BASE_URL}>
        <Routes>
          <Route element={<App />}>
            {!isAuthenticated? (
              <>
                {/* Home page */}
                <Route path="*" element={<Navigate to="/auth/signin" />} />
                {/* Auth routes */}
                <Route path="/auth/*" element={<AuthRoutes />} />
              </>

            ) : (
              <>
                {/* Home page */}
                <Route index element={<Navigate to='/dashboard' />} />
                <Route path="/*" element={<PrivateRoutes />} />
              </>
            ) }

            <Route path="*" element={<ErrorRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export { AppRoutes };
