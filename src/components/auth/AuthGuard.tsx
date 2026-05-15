import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { LoadingAuthPage } from "@components/loadings/LoadingAuthPage";

const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/403", { replace: true });
    }
    setCheckingAuth(false);
  }, [isAuthenticated, navigate]);

  if (checkingAuth) return <LoadingAuthPage />;

  return <Outlet />;
};

export { AuthGuard };
