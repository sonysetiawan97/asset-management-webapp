import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { LoadingAuthPage } from "@components/loadings/LoadingAuthPage";
import { useSnackbar } from "notistack";

const AuthChecker = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [signin, setSignin] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const hasShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasShown.current) {
      enqueueSnackbar("You're logged in.", {
        variant: "info",
      });
      hasShown.current = true;
      navigate("/dashboard", { replace: true });
    }
    setSignin(true);
  }, [enqueueSnackbar, isAuthenticated, navigate]);

  if (!signin) return <LoadingAuthPage />;

  return <Outlet />;
};

export { AuthChecker };
