import type { FC } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./partials/header/Header";
import Sidebar from "./partials/sidebar/Sidebar";
import { LoadingInline } from "@components/loadings/LoadingInline";
import { $isPageLoading } from "@stores/LoadingStore";

const MasterLayout: FC = () => {
  const [isActive, setIsActive] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const onToggle = useCallback(() => setIsActive((prev) => !prev), []);

  useEffect(() => {
    setIsActive(false);
    // Briefly show inline loading on every route change
    $isPageLoading.set(true);
    const timer = setTimeout(() => $isPageLoading.set(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        isActive &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target)
      ) {
        setIsActive(false);
        onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onToggle]);

  return (
    <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
      <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
        {/* TODO: HEADER */}
        <Header
          onToggle={() => setIsActive((prev) => !prev)}
          isActive={isActive}
        />
        <div
          className="app-wrapper flex-column flex-row-fluid"
          id="kt_app_wrapper"
        >
          <Sidebar isActive={isActive} ref={sidebarRef} />

          <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
            <div className="d-flex flex-column flex-column-fluid">
              <div
                id="kt_app_content"
                className="app-content flex-column-fluid py-4"
              >
                <div
                  id="kt_app_content_container"
                  className="app-container container-fluid px-4"
                  style={{ position: "relative", minHeight: "400px" }}
                >
                  <LoadingInline />
                  <Outlet />
                </div>
              </div>
            </div>
            {/* TODO: FOOTER */}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MasterLayout };
