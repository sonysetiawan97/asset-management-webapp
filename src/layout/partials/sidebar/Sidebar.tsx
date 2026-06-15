import { forwardRef } from "react";
import Logo from "../../../assets/images/logo-blue.png";
import { useTranslation } from "react-i18next";
import { SidebarMenuItem } from "@components/menu/SidebarMenuItem";
import { SidebarMenuTitle } from "@components/menu/SidebarMenuTitle";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

type ToggleMenuSidebar = {
  isActive: boolean;
};

const Sidebar = forwardRef<HTMLDivElement, ToggleMenuSidebar>(
  ({ isActive }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        ref={ref}
        className={
          isActive
            ? "app-sidebar d-flex flex-column active"
            : "app-sidebar d-flex flex-column"
        }
      >
        <div className="app-sidebar-logo px-4 mb-2 d-flex justify-content-between align-items-center">
          <img alt="Logo" src={Logo} width={80} />
        </div>
        <div className="list-group list-group-flush overflow-auto">
          {/* Assets Management */}
          <SidebarMenuTitle title={t("sidebar.assets_management.title")} />
          <AuthPrivilegesChecker link="/dashboard">
            <SidebarMenuItem
              url="/dashboard"
              title={t("sidebar.assets_management.menu.dashboard")}
              icon={<i className="bi bi-grid" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/assets">
            <SidebarMenuItem
              url="/assets"
              title={t("sidebar.assets_management.menu.assets")}
              icon={<i className="bi bi-box-seam" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/checkouts">
            <SidebarMenuItem
              url="/checkouts"
              title={t("sidebar.assets_management.menu.checkouts")}
              icon={<i className="bi bi-send" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/transfers">
            <SidebarMenuItem
              url="/transfers"
              title={t("sidebar.assets_management.menu.transfers")}
              icon={<i className="bi bi-arrow-left-right" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/maintenance">
            <SidebarMenuItem
              url="/maintenance"
              title={t("sidebar.assets_management.menu.maintenance")}
              icon={<i className="bi bi-wrench" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/reports">
            <SidebarMenuItem
              url="/reports"
              title={t("sidebar.assets_management.menu.report")}
              icon={<i className="bi bi-file-text" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/opname">
            <SidebarMenuItem
              url="/opname"
              title={t("sidebar.assets_management.menu.opname")}
              icon={<i className="bi bi-clipboard-check" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/scan">
            <SidebarMenuItem
              url="/scan"
              title={t("sidebar.assets_management.menu.scan")}
              icon={<i className="bi bi-qr-code-scan" />}
            />
          </AuthPrivilegesChecker>

          {/* Master Data */}
          <SidebarMenuTitle
            title={t("sidebar.master_data.title")}
            links={["/departments", "/categories", "/locations"]}
          />
          <AuthPrivilegesChecker link="/departments">
            <SidebarMenuItem
              url="/departments"
              title={t("sidebar.master_data.menu.departments")}
              icon={<i className="bi bi-diagram-3" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/categories">
            <SidebarMenuItem
              url="/categories"
              title={t("sidebar.master_data.menu.categories")}
              icon={<i className="bi bi-tags" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/locations">
            <SidebarMenuItem
              url="/locations"
              title={t("sidebar.master_data.menu.locations")}
              icon={<i className="bi bi-geo-alt" />}
            />
          </AuthPrivilegesChecker>

          {/* User Management */}
          <SidebarMenuTitle
            title={t("sidebar.user-management.title")}
            links={["/users", "/privileges", "/roles"]}
          />
          <AuthPrivilegesChecker link="/users">
            <SidebarMenuItem
              url="/users"
              title={t("sidebar.user-management.menu.user")}
              icon={<i className="bi bi-people" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/privileges">
            <SidebarMenuItem
              url="/privileges"
              title={t("sidebar.user-management.menu.privilege")}
              icon={<i className="bi bi-shield-lock" />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/roles">
            <SidebarMenuItem
              url="/roles"
              title={t("sidebar.user-management.menu.role")}
              icon={<i className="bi bi-person-badge" />}
            />
          </AuthPrivilegesChecker>

          {/* System */}
          <SidebarMenuTitle
            title={t("sidebar.system.title")}
            links={["/sysparams"]}
          />
          <AuthPrivilegesChecker link="/sysparams">
            <SidebarMenuItem
              url="/sysparams"
              title={t("sidebar.system.menu.sysparams")}
              icon={<i className="bi bi-gear-wide-connected" />}
            />
          </AuthPrivilegesChecker>
        </div>
      </div>
    );
  },
);

export default Sidebar;
