import type React from "react";
import { useState } from "react";
import { signin } from "../services/signinService";
import type { SigninRequest } from "../types/SigninRequest";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Logo from "../../../assets/images/logo-colorful.png";
import LoadingSpinner from "@components/loadings/LoadingSpinner";

export const Signin: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: SigninRequest = { username, password };

    try {
      setIsSubmit(true);
      await signin(request);
      enqueueSnackbar(t("signin.notification.success"), {
        variant: "success",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Signin failed:", err);
      const msg = (err as Error).message || t("signin.notification.failed");
      enqueueSnackbar(msg, {
        variant: "error",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column gap-2 align-items-center form-login"
    >
      <img alt="Logo" src={Logo} width={170} className="mb-3" />

      <h5>{t("signin.form.title")}</h5>
      <div className="mb-lg-2">
        <label htmlFor="Username" className="form-label">
          Username
        </label>
        <input
          className="form-control rounded-pill"
          id="Username"
          type="text"
          placeholder={t("signin.form.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-lg-2">
        <label htmlFor="Password" className="form-label">
          Password
        </label>
        <input
          className="form-control rounded-pill"
          id="Password"
          type="password"
          placeholder={t("signin.form.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a href="">
          <small className="text-muted text-decoration-underline">
            Forgot password?
          </small>
        </a>
      </div>
      <button
        type="submit"
        className="btn btn-dark w-100 rounded-pill mt-3"
        disabled={isSubmit}
      >
        {isSubmit ? (
          <LoadingSpinner color="text-white" />
        ) : (
          t("signin.form.button")
        )}
      </button>
    </form>
  );
};
