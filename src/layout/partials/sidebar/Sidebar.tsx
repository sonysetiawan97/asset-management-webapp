import { forwardRef } from "react";
import Logo from "../../../assets/images/logo-blue.png";
import { useTranslation } from "react-i18next";
import { SidebarMenuItem } from "@components/menu/SidebarMenuItem";
import { SidebarMenuTitle } from "@components/menu/SidebarMenuTitle";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import {
  DashboardIcon,
  CategoriesIcon,
  LocationsIcon,
  AssetsIcon,
  CheckoutsIcon,
  TransfersIcon,
  MaintenanceIcon,
  ReportsIcon,
  DisposalsIcon,
  AuditTrailIcon,
  NotificationsIcon,
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
          <SidebarMenuTitle title={t("sidebar.master.title")} />

          <AuthPrivilegesChecker link="/dashboard">
            <SidebarMenuItem
              url="/dashboard"
              title={t("sidebar.master.menu.dashboard")}
              icon={<DashboardIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/categories">
            <SidebarMenuItem
              url="/categories"
              title={t("sidebar.master.menu.categories")}
              icon={<CategoriesIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/locations">
            <SidebarMenuItem
              url="/locations"
              title={t("sidebar.master.menu.locations")}
              icon={<LocationsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/assets">
            <SidebarMenuItem
              url="/assets"
              title={t("sidebar.master.menu.assets")}
              icon={<AssetsIcon />}
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/checkouts">
            <SidebarMenuItem url="/checkouts" title={t("sidebar.master.menu.checkouts")} icon={<CheckoutsIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/transfers">
            <SidebarMenuItem url="/transfers" title={t("sidebar.master.menu.transfers")} icon={<TransfersIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/maintenance">
            <SidebarMenuItem url="/maintenance" title={t("sidebar.master.menu.maintenance")} icon={<MaintenanceIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/reports">
            <SidebarMenuItem url="/reports" title={t("sidebar.master.menu.reports")} icon={<ReportsIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/disposals">
            <SidebarMenuItem url="/disposals" title={t("sidebar.master.menu.disposals")} icon={<DisposalsIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/audit-trail">
            <SidebarMenuItem url="/audit-trail" title={t("sidebar.master.menu.audit_trail")} icon={<AuditTrailIcon />} />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/notifications">
            <SidebarMenuItem url="/notifications" title={t("sidebar.master.menu.notifications")} icon={<NotificationsIcon />} />
          </AuthPrivilegesChecker>

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

          <SidebarMenuTitle title={t("sidebar.system.title")} links={["/sysparams"]} />
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
  }
);

export default Sidebar;
