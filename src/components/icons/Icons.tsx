import type { FC } from "react";

interface IconProps {
  size?: number;
  className?: string;
}

// Dashboard
export const DashboardIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M140-520v-300h300v300H140Zm0 380v-300h300v300H140Zm380-380v-300h300v300H520Zm0 380v-300h300v300H520ZM200-580h180v-180H200v180Zm380 0h180v-180H580v180Zm0 380h180v-180H580v180Zm-380 0h180v-180H200v180Zm380-380Zm0 200Zm-200 0Zm0-200Z" />
  </svg>
);

// Categories
export const CategoriesIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M560-120q-17 0-28.5-11.5T520-160q0-17 11.5-28.5T560-200h320q17 0 28.5 11.5T920-160q0 17-11.5 28.5T880-120H560Zm0-160q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h320q17 0 28.5 11.5T920-320q0 17-11.5 28.5T880-280H560Zm0-160q-17 0-28.5-11.5T520-480q0-17 11.5-28.5T560-520h320q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440H560Zm0-160q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h320q17 0 28.5 11.5T920-640q0 17-11.5 28.5T880-600H560Zm0-160q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h320q17 0 28.5 11.5T920-800q0 17-11.5 28.5T880-760H560Z" />
  </svg>
);

// Locations
export const LocationsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M280-120q-33 0-56.5-23.5T200-200v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560q0 33-23.5 56.5T680-120H280Z" />
  </svg>
);

// Vendors
export const VendorsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Zm0-160q-17 0-28.5-11.5T480-360q0-17 11.5-28.5T520-400h320q17 0 28.5 11.5T880-360q0 17-11.5 28.5T840-320H520Z" />
  </svg>
);

// Assets
export const AssetsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M520-120q-17 0-28.5-11.5T480-160q0-17 11.5-28.5T520-200h320q17 0 28.5 11.5T880-160q0 17-11.5 28.5T840-120H520Zm0-160q-17 0-28.5-11.5T480-360q0-17 11.5-28.5T520-400h320q17 0 28.5 11.5T880-360q0 17-11.5 28.5T840-320H520Z" />
  </svg>
);

// Checkouts
export const CheckoutsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Z" />
  </svg>
);

// Transfers
export const TransfersIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Z" />
  </svg>
);

// Maintenance
export const MaintenanceIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M440-280v-80h80v80h-80Zm160 0v-80h80v80h-80Z" />
  </svg>
);

// Reports
export const ReportsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M760-160q-33 0-56.5-23.5T680-240v-320h120v-120H240v120h120v320q0 33-23.5 56.5T300-160H760Zm-40-280v-200H280v200H240v-240q0-33 23.5-56.5T300-680h440q33 0 56.5 23.5T820-600v240H720Zm40 40v-80h280v80H760Z" />
  </svg>
);

// Disposals
export const DisposalsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M324.31-164q-26.62 0-45.47-18.84Q260-201.69 260-228.31V-696h-48v-52h172v-43.38h192V-748h172v52h-48v467.26q0 27.74-18.65 46.24Q662.7-164 635.69-164H324.31ZM648-696H312v467.69q0 5.39 3.46 8.85t8.85 3.46h311.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-696ZM400.16-288h51.99v-336h-51.99v336Zm107.69 0h51.99v-336h-51.99v336ZM312-696v480-480Z" />
  </svg>
);

// Audit Trail
export const AuditTrailIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M480-192q34 0 59-25t25-59q0-34-25-59t-59-25q-34 0-59 25t-25 59q0 34 25 59t59 25Zm0-216Zm0-216q101 0 171-70t70-171q0-101-70-171T480-934q-101 0-171 70t-70 171q0 101 70 171t171 70Z" />
  </svg>
);

// Notifications
export const NotificationsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z" />
  </svg>
);

// Users
export const UsersIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M384-492.31q-51.75 0-87.87-36.12Q260-564.56 260-616.31q0-51.75 36.13-87.87 36.12-36.13 87.87-36.13 51.75 0 87.87 36.13Q508-668.06 508-616.31q0 51.75-36.13 87.88-36.12 36.12-87.87 36.12ZM116-219.69v-68.93q0-23.3 10.96-40.38 10.96-17.08 30.66-28.54 53.84-30.84 108.69-46.5 54.84-15.65 117.69-15.65 9.85 0 18.19.5 8.35.5 18.96.73-5.07 13.15-7.03 26.34-1.97 13.2-3.58 25.43l-26.54-1q-52.08 0-100.81 11.88-48.73 11.89-98.04 41.81-9.56 5.25-13.36 11.31-3.79 6.07-3.79 14.07v16.93h251q3.31 12.86 8.5 26.23 5.19 13.38 12.73 25.77H116Zm527.23 37.61-8.92-49.08q-16.31-4.23-30.93-12.57-14.61-8.35-26-19.66l-47.69 16.62-20.46-35.39L545.62-316q-6.31-15.54-5.81-33.62.5-18.07 5.81-33.61l-36-33.62 20.46-36.38 46.3 16q11-12.31 26.31-20.96 15.31-8.66 31.62-11.89l9.92-49.07h40.92l9.54 49.07q16.31 4.23 31.62 12.2 15.3 7.96 26.3 19.88l46.31-14.23 20.46 34.61-35 32.62q4.31 17.43 4.31 35.11 0 17.69-5.31 33.89l36.39 32.84-20.46 35.39-47.7-15.62q-11.38 11.31-26 20.16-14.61 8.84-30.92 12.07l-10.54 49.08h-40.92Zm21.32-100.38q28.22 0 48.06-20.1 19.85-20.09 19.85-48.3 0-28.22-20.09-48.06-20.09-19.85-48.31-19.85-28.21 0-48.06 20.09t-19.85 48.31q0 28.21 20.1 48.06 20.09 19.85 48.3 19.85ZM384.21-544.31q29.79 0 50.79-21.21t21-51q0-29.79-21.21-50.79t-51-21q-29.79 0-50.79 21.22-21 21.21-21 51 0 29.78 21.21 50.78t51 21Zm-.21-72Zm35 344.62Z" />
  </svg>
);

// Privileges
export const PrivilegesIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M633.85-452.31 475.54-605.46q-28.69-27.69-48.27-61.65-19.58-33.96-19.58-73.97 0-49.55 34.69-84.23Q477.06-860 526.61-860q32.39 0 59.81 15.62 27.43 15.61 47.43 39.77 20-24.16 47.42-39.77Q708.69-860 741.08-860q49.55 0 84.23 34.69Q860-790.63 860-741.08q0 40.01-19.27 73.97t-47.96 61.65L633.85-452.31Zm0-83.53 114.38-110.85q20.15-19.77 35.96-43Q800-712.92 800-741.08q0-24.69-17.12-41.8Q765.77-800 741.08-800q-19 0-34.77 9.92-15.77 9.93-27.85 25.16l-44.61 54.3-44.62-54.3q-12.08-15.23-27.85-25.16-15.76-9.92-34.77-9.92-24.69 0-41.8 17.12-17.12 17.11-17.12 41.8 0 28.16 15.81 51.39t35.96 43l114.39 110.85ZM268.08-216.92l290.3 82.15 238.77-74q-3.07-13.61-12.69-20.88t-21.77-7.27H566.8q-26.18 0-44.49-2-18.31-2-37.62-8.77l-90.3-29.85 17.76-58.77 81 28.16q18.16 6.15 41.93 8.38 23.77 2.23 67.61 2.85 0-14.85-6.69-25.62-6.69-10.77-17.62-14.54l-232.07-85.23q-1.16-.38-2.12-.57-.96-.2-2.11-.2h-74v206.16ZM68.08-100v-383.07h273.54q6.3 0 12.76 1.38 6.47 1.39 12 3.23l233.08 85.85q27.23 10.07 45.23 35.65 18 25.58 18 60.04h100q43.08 0 70.19 27.81Q860-241.31 860-196.92v32.3L560.38-71.54l-292.3-83.38V-100h-200Zm60-60h80v-263.08h-80V-160Zm505.77-550.62Z" />
  </svg>
);

// Roles
export const RolesIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M228.31-164q-27.01 0-45.66-18.65Q164-201.3 164-228.31v-503.38q0-27.01 18.65-45.66Q201.3-796 228.31-796h181q-1.23-29.69 19.8-50.84Q450.14-868 480.03-868t50.89 21.16q21 21.15 19.77 50.84h181q27.01 0 45.66 18.65Q796-758.7 796-731.69v503.38q0 27.01-18.65 45.66Q758.7-164 731.69-164H228.31ZM480-764.15q10.4 0 17.2-6.8 6.8-6.8 6.8-17.2 0-10.4-6.8-17.2-6.8-6.8-17.2-6.8-10.4 0-17.2 6.8-6.8 6.8-6.8 17.2 0 10.4 6.8 17.2 6.8 6.8 17.2 6.8ZM216-261.31q56-46 124-68.5t140-22.5q72 0 140 22t124 69v-470.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v470.38Zm264.24-145.15q55.91 0 94.84-39.17Q614-484.79 614-540.7t-39.17-94.84q-39.16-38.92-95.07-38.92t-94.84 39.17Q346-596.13 346-540.22t39.17 94.84q39.16 38.92 95.07 38.92ZM242.69-216h474.62v1.54q-51.39-42.31-111.96-64.08-60.58-21.77-125.35-21.77-64 0-124.27 21.58-60.27 21.58-113.04 63.5v-.77ZM480-458.46q-33.85 0-57.92-24.08Q398-506.61 398-540.46t24.08-57.92q24.07-24.08 57.92-24.08t57.92 24.08Q562-574.31 562-540.46t-24.08 57.92q-24.07 24.08-57.92 24.08Zm0-89.69Z" />
  </svg>
);

// Sysparams
export const SysparamsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M440-280h80l12-60q12-5 22.5-10.5T576-364l58 18 40-68-46-40q2-14 2-26t-2-26l46-40-40-68-58 18q-11-8-21.5-13.5T532-620l-12-60h-80l-12 60q-12 5-22.5 10.5T384-596l-58-18-40 68 46 40q-2 14-2 26t2 26l-46 40 40 68 58-18q11 8 21.5 13.5T428-340l12 60Zm40-120q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
  </svg>
);

// Departments
export const DepartmentsIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M480-80q-17 0-28.5-11.5T440-120v-120H280q-17 0-28.5-11.5T240-160v-160q0-17 11.5-28.5T280-200h160v-120q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-300v120h160q17 0 28.5 11.5T720-160v160q0 17-11.5 28.5T680-120H520v120q0 17-11.5 28.5T480-80Zm0-240Zm-200 0Zm400 0Z" />
  </svg>
);

// Scan / QR Scanner
export const ScanIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M240-240v-120h120v120H240Zm160 0v-120h120v120H400Zm160 0v-120h120v120H560Zm160 0v-480h120v120H720v360h-60Zm0-480v120H560v-120h360Zm0 0v120H560V-720h360Z" />
  </svg>
);

// Plus (Create button)
export const PlusIcon: FC<IconProps> = ({ size = 16, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
);

// Edit
export const EditIcon: FC<IconProps> = ({ size = 14, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Z" />
  </svg>
);

// View
export const ViewIcon: FC<IconProps> = ({ size = 14, className }) => (
  <svg height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" className={className}>
    <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
  </svg>
);
