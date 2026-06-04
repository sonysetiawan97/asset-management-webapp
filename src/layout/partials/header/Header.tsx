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
            <i className="bi bi-list"></i>
            <i className="bi bi-list"></i>
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
