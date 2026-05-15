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
        <svg height="26px" viewBox="0 -960 960 960" width="26px" fill="#1f1f1f">
          <title>user</title>
          <path d="M237-285q54-38 115.5-56.5T480-360q66 0 127.5 18.5T723-285q35-41 52-91t17-104q0-129.67-91.23-220.84-91.23-91.16-221-91.16Q350-792 259-700.84 168-609.67 168-480q0 54 17 104t52 91Zm243-123q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm.28 312Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q52 0 100-16.5t90-48.5q-43-27-91-41t-99-14q-51 0-99.5 13.5T290-233q42 32 90 48.5T480-168Zm0-312q30 0 51-21t21-51q0-30-21-51t-51-21q-30 0-51 21t-21 51q0 30 21 51t51 21Zm0-72Zm0 319Z" />
        </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1f1f1f"
            >
              <path d="M172.31-100Q142-100 121-121q-21-21-21-51.31v-415.38Q100-618 121-639q21-21 51.31-21H380v-140q0-24.92 17.54-42.46T440-860h80q24.92 0 42.46 17.54T580-800v140h207.69Q818-660 839-639q21 21 21 51.31v415.38Q860-142 839-121q-21 21-51.31 21H172.31Zm0-60h615.38q5.39 0 8.85-3.46t3.46-8.85v-415.38q0-5.39-3.46-8.85t-8.85-3.46H580v15.39q0 24.53-17.73 42.26-17.73 17.73-42.27 17.73h-80q-24.54 0-42.27-17.73Q380-560.08 380-584.61V-600H172.31q-5.39 0-8.85 3.46t-3.46 8.85v415.38q0 5.39 3.46 8.85t8.85 3.46Zm73.84-91.54h227.7v-11.85q0-15.46-8.54-28.42T441.69-312q-19.61-8.62-39.73-12.92-20.11-4.31-41.96-4.31t-41.96 4.31q-20.12 4.3-39.73 12.92-15.08 7.23-23.62 20.19-8.54 12.96-8.54 28.42v11.85ZM560-312.31h160V-360H560v47.69ZM360-360q22.31 0 38.08-15.77t15.77-38.08q0-22.3-15.77-38.07T360-467.69q-22.31 0-38.08 15.77t-15.77 38.07q0 22.31 15.77 38.08T360-360Zm200-60h160v-47.69H560V-420ZM440-584.61h80V-800h-80v215.39ZM480-380Z" />
            </svg>
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
