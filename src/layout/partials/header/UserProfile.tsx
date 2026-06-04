import { LanguageButton } from "@components/buttons/LanguageButton";
import { useAuth } from "@hooks/useAuth";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const UserProfile: FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="dropdown ms-3 ">
      <button
        className="bg-transparent border-0 shadow-none d-flex align-items-center gap-1 px-0"
        id="dropdownUserButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-person"></i>
        <span className="text-muted d-none d-md-block">
          {t("header.navbar.user_profile.greeting")}
          {user?.username || ""}
        </span>
      </button>

      <ul className="dropdown-menu p-3" aria-labelledby="dropdownUserButton">
        <li>
          <Link
            to={"/profile"}
            className="d-flex align-items-center gap-1 text-dark py-1"
          >
            <i className="bi bi-gear"></i>
            {t("header.navbar.user_profile.profile")}
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="dropdown-item text-danger bg-transparent border-0 d-flex gap-1 align-items-center px-0 py-1"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#dc3645"
            >
              <path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h268.07v60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h268.07v60H212.31Zm436.92-169.23-41.54-43.39L705.08-450H363.85v-60h341.23l-97.39-97.38 41.54-43.39L820-480 649.23-309.23Z" />
            </svg>
            {t("header.navbar.user_profile.logout")}
          </button>
        </li>
        <li>
          <hr />
        </li>
        <li>
          <LanguageButton />
        </li>
      </ul>
    </div>
  );
};
