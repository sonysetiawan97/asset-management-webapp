import { forwardRef } from "react";
import Logo from "../../../assets/images/logo-blue.png";
import { useTranslation } from "react-i18next";
import { SidebarMenuItem } from "@components/menu/SidebarMenuItem";
import { SidebarMenuTitle } from "@components/menu/SidebarMenuTitle";
import { SidebarParentMenu } from "@components/menu/SidebarParentMenu";
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

          {/* <div className="d-block d-lg-none text-black button-close-sidebar" >
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#555"><path d="M366.92-213.46 100-480.38l266.92-266.93 41.77 41.77-194.54 195.16h646.23v59.99H214.54l195.15 195.16-42.77 41.77Z"/></svg>
        </div> */}
        </div>
        <div className="list-group list-group-flush overflow-auto">
          <SidebarMenuTitle title={t("sidebar.master.title")} />

          <AuthPrivilegesChecker link="/dashboard">
            <SidebarMenuItem
              url="/dashboard"
              title={t("sidebar.master.menu.dashboard")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>menu</title>
                  <path d="M140-520v-300h300v300H140Zm0 380v-300h300v300H140Zm380-380v-300h300v300H520Zm0 380v-300h300v300H520ZM200-580h180v-180H200v180Zm380 0h180v-180H580v180Zm0 380h180v-180H580v180Zm-380 0h180v-180H200v180Zm380-380Zm0 200Zm-200 0Zm0-200Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/products/create">
            <SidebarMenuItem
              url="/products/create"
              title={t("sidebar.master.menu.products")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <path d="M212.31-100q-29.92 0-51.12-21.19Q140-142.39 140-172.31v-447.92q-17.61-9.08-28.81-25.81Q100-662.77 100-684.62v-103.07q0-29.92 21.19-51.12Q142.39-860 172.31-860h615.38q29.92 0 51.12 21.19Q860-817.61 860-787.69v103.07q0 21.85-11.19 38.58-11.2 16.73-28.81 25.81v447.92q0 29.92-21.19 51.12Q777.61-100 747.69-100H212.31ZM200-612.31v438.08q0 6.15 4.42 10.19 4.43 4.04 10.97 4.04h532.3q5.39 0 8.85-3.46t3.46-8.85v-440H200Zm-27.69-60h615.38q5.39 0 8.85-3.46t3.46-8.85v-103.07q0-5.39-3.46-8.85t-8.85-3.46H172.31q-5.39 0-8.85 3.46t-3.46 8.85v103.07q0 5.39 3.46 8.85t8.85 3.46Zm195.38 249.62h224.62V-480H367.69v57.31ZM480-386.15Z" />
                  <title>menu</title>
                </svg>
              }
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/examples">
            <SidebarMenuItem
              url="/examples"
              title={t("sidebar.master.menu.examples")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>example menu</title>
                  <path d="m480-146.93-44.15-39.69q-99.46-90.23-164.5-155.07-65.04-64.85-103.08-115.43-38.04-50.57-53.15-92.27Q100-591.08 100-634q0-85.15 57.42-142.58Q214.85-834 300-834q52.38 0 99 24.5t81 70.27q34.38-45.77 81-70.27 46.62-24.5 99-24.5 85.15 0 142.58 57.42Q860-719.15 860-634q0 42.92-15.12 84.61-15.11 41.7-53.15 92.27-38.04 50.58-102.89 115.43Q624-276.85 524.15-186.62L480-146.93Zm0-81.07q96-86.38 158-148.08 62-61.69 98-107.19t50-80.81q14-35.3 14-69.92 0-60-40-100t-100-40q-47.38 0-87.58 26.88-40.19 26.89-63.65 74.81h-57.54q-23.85-48.31-63.85-75Q347.38-774 300-774q-59.62 0-99.81 40Q160-694 160-634q0 34.62 14 69.92 14 35.31 50 80.81t98 107q62 61.5 158 148.27Zm0-273Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>
          <SidebarParentMenu
            url="/"
            title={t("sidebar.master.menu.trash")}
            icon={
              <svg
                height="22px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#1f1f1f"
              >
                <title>trash menu</title>
                <path d="M324.31-164q-26.62 0-45.47-18.84Q260-201.69 260-228.31V-696h-48v-52h172v-43.38h192V-748h172v52h-48v467.26q0 27.74-18.65 46.24Q662.7-164 635.69-164H324.31ZM648-696H312v467.69q0 5.39 3.46 8.85t8.85 3.46h311.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-696ZM400.16-288h51.99v-336h-51.99v336Zm107.69 0h51.99v-336h-51.99v336ZM312-696v480-480Z" />
              </svg>
            }
            collapseTargetId="collapseTrash"
            links={["/sysparams/trash", "/roles/trash", "/privileges/trash", "/users/trash"]}
          >
            <div className="collapse" id="collapseTrash">
              <AuthPrivilegesChecker link="/sysparams/trash">
                <SidebarMenuItem
                  url="sysparams/trash"
                  title={t("sidebar.master.menu.sysparams")}
                />
              </AuthPrivilegesChecker>
              <AuthPrivilegesChecker link="/roles/trash">
                <SidebarMenuItem
                  url="roles/trash"
                  title={t("sidebar.master.menu.roles")}
                />
              </AuthPrivilegesChecker>
              <AuthPrivilegesChecker link="/privileges/trash">
                <SidebarMenuItem
                  url="privileges/trash"
                  title={t("sidebar.master.menu.privileges")}
                />
              </AuthPrivilegesChecker>
              <AuthPrivilegesChecker link="/users/trash">
                <SidebarMenuItem
                  url="users/trash"
                  title={t("sidebar.master.menu.users")}
                />
              </AuthPrivilegesChecker>
            </div>
          </SidebarParentMenu>

          <SidebarMenuTitle title={t("sidebar.user-management.title")} />
          <AuthPrivilegesChecker link="/users">
            <SidebarMenuItem
              url="/users"
              title={t("sidebar.user-management.menu.user")}
              icon={
                <svg
                  height="22px"
                  viewBox="0 -960 960 960"
                  width="22px"
                  fill="#1f1f1f"
                >
                  <title>user</title>
                  <path d="M384-492.31q-51.75 0-87.87-36.12Q260-564.56 260-616.31q0-51.75 36.13-87.87 36.12-36.13 87.87-36.13 51.75 0 87.87 36.13Q508-668.06 508-616.31q0 51.75-36.13 87.88-36.12 36.12-87.87 36.12ZM116-219.69v-68.93q0-23.3 10.96-40.38 10.96-17.08 30.66-28.54 53.84-30.84 108.69-46.5 54.84-15.65 117.69-15.65 9.85 0 18.19.5 8.35.5 18.96.73-5.07 13.15-7.03 26.34-1.97 13.2-3.58 25.43l-26.54-1q-52.08 0-100.81 11.88-48.73 11.89-98.04 41.81-9.56 5.25-13.36 11.31-3.79 6.07-3.79 14.07v16.93h251q3.31 12.86 8.5 26.23 5.19 13.38 12.73 25.77H116Zm527.23 37.61-8.92-49.08q-16.31-4.23-30.93-12.57-14.61-8.35-26-19.66l-47.69 16.62-20.46-35.39L545.62-316q-6.31-15.54-5.81-33.62.5-18.07 5.81-33.61l-36-33.62 20.46-36.38 46.3 16q11-12.31 26.31-20.96 15.31-8.66 31.62-11.89l9.92-49.07h40.92l9.54 49.07q16.31 4.23 31.62 12.2 15.3 7.96 26.3 19.88l46.31-14.23 20.46 34.61-35 32.62q4.31 17.43 4.31 35.11 0 17.69-5.31 33.89l36.39 32.84-20.46 35.39-47.7-15.62q-11.38 11.31-26 20.16-14.61 8.84-30.92 12.07l-10.54 49.08h-40.92Zm21.32-100.38q28.22 0 48.06-20.1 19.85-20.09 19.85-48.3 0-28.22-20.09-48.06-20.09-19.85-48.31-19.85-28.21 0-48.06 20.09t-19.85 48.31q0 28.21 20.1 48.06 20.09 19.85 48.3 19.85ZM384.21-544.31q29.79 0 50.79-21.21t21-51q0-29.79-21.21-50.79t-51-21q-29.79 0-50.79 21.22-21 21.21-21 51 0 29.78 21.21 50.78t51 21Zm-.21-72Zm35 344.62Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/privileges">
            <SidebarMenuItem
              url="/privileges"
              title={t("sidebar.user-management.menu.privilege")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>privilege</title>
                  <path d="M633.85-452.31 475.54-605.46q-28.69-27.69-48.27-61.65-19.58-33.96-19.58-73.97 0-49.55 34.69-84.23Q477.06-860 526.61-860q32.39 0 59.81 15.62 27.43 15.61 47.43 39.77 20-24.16 47.42-39.77Q708.69-860 741.08-860q49.55 0 84.23 34.69Q860-790.63 860-741.08q0 40.01-19.27 73.97t-47.96 61.65L633.85-452.31Zm0-83.53 114.38-110.85q20.15-19.77 35.96-43Q800-712.92 800-741.08q0-24.69-17.12-41.8Q765.77-800 741.08-800q-19 0-34.77 9.92-15.77 9.93-27.85 25.16l-44.61 54.3-44.62-54.3q-12.08-15.23-27.85-25.16-15.76-9.92-34.77-9.92-24.69 0-41.8 17.12-17.12 17.11-17.12 41.8 0 28.16 15.81 51.39t35.96 43l114.39 110.85ZM268.08-216.92l290.3 82.15 238.77-74q-3.07-13.61-12.69-20.88t-21.77-7.27H566.8q-26.18 0-44.49-2-18.31-2-37.62-8.77l-90.3-29.85 17.76-58.77 81 28.16q18.16 6.15 41.93 8.38 23.77 2.23 67.61 2.85 0-14.85-6.69-25.62-6.69-10.77-17.62-14.54l-232.07-85.23q-1.16-.38-2.12-.57-.96-.2-2.11-.2h-74v206.16ZM68.08-100v-383.07h273.54q6.3 0 12.76 1.38 6.47 1.39 12 3.23l233.08 85.85q27.23 10.07 45.23 35.65 18 25.58 18 60.04h100q43.08 0 70.19 27.81Q860-241.31 860-196.92v32.3L560.38-71.54l-292.3-83.38V-100h-200Zm60-60h80v-263.08h-80V-160Zm505.77-550.62Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>
          <AuthPrivilegesChecker link="/roles">
            <SidebarMenuItem
              url="/roles"
              title={t("sidebar.user-management.menu.role")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>role</title>
                  <path d="M228.31-164q-27.01 0-45.66-18.65Q164-201.3 164-228.31v-503.38q0-27.01 18.65-45.66Q201.3-796 228.31-796h181q-1.23-29.69 19.8-50.84Q450.14-868 480.03-868t50.89 21.16q21 21.15 19.77 50.84h181q27.01 0 45.66 18.65Q796-758.7 796-731.69v503.38q0 27.01-18.65 45.66Q758.7-164 731.69-164H228.31ZM480-764.15q10.4 0 17.2-6.8 6.8-6.8 6.8-17.2 0-10.4-6.8-17.2-6.8-6.8-17.2-6.8-10.4 0-17.2 6.8-6.8 6.8-6.8 17.2 0 10.4 6.8 17.2 6.8 6.8 17.2 6.8ZM216-261.31q56-46 124-68.5t140-22.5q72 0 140 22t124 69v-470.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v470.38Zm264.24-145.15q55.91 0 94.84-39.17Q614-484.79 614-540.7t-39.17-94.84q-39.16-38.92-95.07-38.92t-94.84 39.17Q346-596.13 346-540.22t39.17 94.84q39.16 38.92 95.07 38.92ZM242.69-216h474.62v1.54q-51.39-42.31-111.96-64.08-60.58-21.77-125.35-21.77-64 0-124.27 21.58-60.27 21.58-113.04 63.5v-.77ZM480-458.46q-33.85 0-57.92-24.08Q398-506.61 398-540.46t24.08-57.92q24.07-24.08 57.92-24.08t57.92 24.08Q562-574.31 562-540.46t-24.08 57.92q-24.07 24.08-57.92 24.08Zm0-89.69Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>

          <SidebarMenuTitle title={t("sidebar.system.title")} links={["/sysparams"]} />
          <AuthPrivilegesChecker link="/sysparams">
            <SidebarMenuItem
              url="/sysparams"
              title={t("sidebar.system.menu.sysparams")}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>Sysparams</title>
                  <path d="M440-280h80l12-60q12-5 22.5-10.5T576-364l58 18 40-68-46-40q2-14 2-26t-2-26l46-40-40-68-58 18q-11-8-21.5-13.5T532-620l-12-60h-80l-12 60q-12 5-22.5 10.5T384-596l-58-18-40 68 46 40q-2 14-2 26t2 26l-46 40 40 68 58-18q11 8 21.5 13.5T428-340l12 60Zm40-120q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>

          <SidebarMenuTitle title={t("sidebar.base.title")} links={["/setting", "/themes"]} />
          <AuthPrivilegesChecker link="/setting">
            <SidebarMenuItem
              url="/setting"
              title={t("sidebar.base.menu.setting")}
              icon={
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <title>setting menu</title>
                  <path d="M450-130v-220h60v80h320v60H510v80h-60Zm-320-80v-60h220v60H130Zm160-160v-80H130v-60h160v-80h60v220h-60Zm160-80v-60h380v60H450Zm160-160v-220h60v80h160v60H670v80h-60Zm-480-80v-60h380v60H130Z" />
                </svg>
              }
            />
          </AuthPrivilegesChecker>

          {/* use child menu */}
          <SidebarParentMenu
            url="/"
            title={t("sidebar.base.menu.themes")}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#1f1f1f"
              >
                <title>theme menu</title>
                <path d="M480.13-120q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120ZM500-160.69q123.62-8.08 211.81-98.35T800-480q0-130.69-87.42-220.19-87.43-89.5-212.58-99.12v638.62Z" />
              </svg>
            }
            collapseTargetId="collapseExample"
            links={["/themes"]}
          />
          <div className="collapse" id="collapseExample">
            <AuthPrivilegesChecker link="/themes">
              <SidebarMenuItem
                url="/themes"
                title={t("sidebar.base.menu.themes")}
              />
            </AuthPrivilegesChecker>
            <AuthPrivilegesChecker link="/themes">
              <SidebarMenuItem
                url="/themes"
                title={t("sidebar.base.menu.setting")}
              />
            </AuthPrivilegesChecker>
          </div>
        </div>
      </div>
    );
  }
);

export default Sidebar;
