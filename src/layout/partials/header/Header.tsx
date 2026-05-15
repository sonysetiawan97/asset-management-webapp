import type { FC } from "react";
import PageHeader from "./PageHeader";
import Navbar from "./Navbar";
import Logo from "../../../assets/images/logo-color-vertical.svg";

type ToggleMenuMobile = {
  onToggle: () => void;
  isActive: boolean;
};

const Header: FC<ToggleMenuMobile> = ({ onToggle, isActive }) => {
  const handleToggle = () => {
    onToggle();
  };

  return (
    <div
      id="kt_app_header"
      className="app-header"
      data-kt-sticky="true"
      data-kt-sticky-activate="{default: true, lg: true}"
      data-kt-sticky-name="app-header-minimize"
      data-kt-sticky-offset="{default: '200px', lg: '0'}"
      data-kt-sticky-animation="false"
    >
      {/* begin::Header container */}
      <div
        className="app-container container-fluid d-flex align-items-stretch justify-content-between  px-4 py-3"
        id="kt_app_header_container"
      >
        {/* begin::Sidebar mobile toggle */}
        <div
          className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2"
          title="Show sidebar menu"
        >
          <div
            id="kt_app_sidebar_mobile_toggle"
            onClick={handleToggle}
            className={isActive ? "ps-0 active" : "ps-0"}
          >
            <svg
              className="icon-close-sidebar"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#555"
            >
              <path d="M366.92-213.46 100-480.38l266.92-266.93 41.77 41.77-194.54 195.16h646.23v59.99H214.54l195.15 195.16-42.77 41.77Z" />
            </svg>
            <svg
              className="icon-show-sidebar"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#666666"
            >
              <path d="M380-254.62v-59.99h440v59.99H380ZM380-450v-60h440v60H380ZM140-645.39v-59.99h680v59.99H140Z" />
            </svg>
          </div>
        </div>
        {/* end::Sidebar mobile toggle */}
        {/* begin::Mobile logo */}
        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
          <a href="?page=index" className="d-lg-none">
            <img alt="Logo" src={Logo} width={32} />
          </a>
        </div>
        {/* end::Mobile logo */}

        {/* begin::Header wrapper */}
        <div
          className="d-flex align-items-stretch justify-content-between flex-lg-grow-1 align-items-center"
          id="kt_app_header_wrapper"
        >
          <PageHeader />
          <Navbar />
        </div>
        {/* end::Header wrapper */}
      </div>
      {/* end::Header container */}
    </div>
  );
};

export default Header;
