import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@hooks/useAuth";
import { getAuth, PrivilegesValidation } from "./AuthHelpers";
import Unauthenticated from "@modules/errors/pages/Unauthenticated";
import Unauthorized from "@modules/errors/pages/Unauthorized";

const PUBLIC_PATHS = ["/dashboard", "/auth/signin"];

interface AuthMiddlewareProps {
  children?: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Auth status is already reactive — no manual refresh needed here.
    // Token refresh is handled by the 401 interceptor in axiosSetup.ts.
  }, [location, isAuthenticated]);

  if (!isAuthenticated) return <Unauthenticated />;

  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  const hasAccess = PrivilegesValidation({
    auth: getAuth(),
    path: location.pathname,
  });

  if (!isPublicPath && !hasAccess) return <Unauthorized />;

  return <>{children}</>;
};

export { AuthMiddleware };