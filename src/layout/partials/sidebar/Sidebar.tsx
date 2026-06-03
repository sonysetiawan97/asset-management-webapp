import { forwardRef } from "react";
import Logo from "../../../assets/images/logo-blue.png";
import { useTranslation } from "react-i18next";
import { SidebarMenuItem } from "@components/menu/SidebarMenuItem";
import { SidebarMenuTitle } from "@components/menu/SidebarMenuTitle";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import {
  DashboardIcon,
  AssetsIcon,
  CheckoutsIcon,
  TransfersIcon,
  MaintenanceIcon,
  ReportsIcon,
  OpnameIcon,
  ScanIcon,
  DepartmentsIcon,
  CategoriesIcon,
  LocationsIcon,
  UsersIcon,
  PrivilegesIcon,
  RolesIcon,
  SysparamsIcon,
} from "@components/icons/Icons";

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
              icon={<DashboardIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/assets">
            <SidebarMenuItem
              url="/assets"
              title={t("sidebar.assets_management.menu.assets")}
              icon={<AssetsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/checkouts">
            <SidebarMenuItem
              url="/checkouts"
              title={t("sidebar.assets_management.menu.checkouts")}
              icon={<CheckoutsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/transfers">
            <SidebarMenuItem
              url="/transfers"
              title={t("sidebar.assets_management.menu.transfers")}
              icon={<TransfersIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/maintenance">
            <SidebarMenuItem
              url="/maintenance"
              title={t("sidebar.assets_management.menu.maintenance")}
              icon={<MaintenanceIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/reports">
            <SidebarMenuItem
              url="/reports"
              title={t("sidebar.assets_management.menu.report")}
              icon={<ReportsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/opname">
            <SidebarMenuItem
              url="/opname"
              title={t("sidebar.assets_management.menu.opname")}
              icon={<OpnameIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/scan">
            <SidebarMenuItem
              url="/scan"
              title={t("sidebar.assets_management.menu.scan")}
              icon={<ScanIcon />}
            />
          </AuthPrivilegesChecker>

          {/* Master Data */}
          <SidebarMenuTitle title={t("sidebar.master_data.title")} />
          <AuthPrivilegesChecker link="/departments">
            <SidebarMenuItem
              url="/departments"
              title={t("sidebar.master_data.menu.departments")}
              icon={<DepartmentsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/categories">
            <SidebarMenuItem
              url="/categories"
              title={t("sidebar.master_data.menu.categories")}
              icon={<CategoriesIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/locations">
            <SidebarMenuItem
              url="/locations"
              title={t("sidebar.master_data.menu.locations")}
              icon={<LocationsIcon />}
            />
          </AuthPrivilegesChecker>

          {/* User Management */}
          <SidebarMenuTitle title={t("sidebar.user-management.title")} />
          <AuthPrivilegesChecker link="/users">
            <SidebarMenuItem
              url="/users"
              title={t("sidebar.user-management.menu.user")}
              icon={<UsersIcon size={22} />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/privileges">
            <SidebarMenuItem
              url="/privileges"
              title={t("sidebar.user-management.menu.privilege")}
              icon={<PrivilegesIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/roles">
            <SidebarMenuItem
              url="/roles"
              title={t("sidebar.user-management.menu.role")}
              icon={<RolesIcon />}
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
              icon={<SysparamsIcon />}
            />
          </AuthPrivilegesChecker>
        </div>
      </div>
    );
  },
);

export default Sidebar;
