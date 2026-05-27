import { type FC, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../layout/MasterLayout";

const ErrorRoutes = lazy(() => import("@modules/errors/ErrorRoutes"));
const Dashboard = lazy(() => import("@modules/dashboard/dashboard"));
const UserRoutes = lazy(() => import("@modules/users/PrivateRoutes"));
const PrivilegeRoutes = lazy(() => import("@modules/privileges/PrivateRoutes"));
const RoleRoutes = lazy(() => import("@modules/roles/PrivateRoutes"));
const ProductRoutes = lazy(() => import("@modules/products/PrivateRoutes"));
const ExampleRoutes = lazy(() => import("@modules/examples/PrivateRoutes"));
const SupplierRoutes = lazy(() => import("@modules/suppliers/PrivateRoutes"));
const CategoryRoutes = lazy(() => import("@modules/categories/PrivateRoutes"));
const LocationRoutes = lazy(() => import("@modules/locations/PrivateRoutes"));
const DepartmentRoutes = lazy(() => import("@modules/departments/PrivateRoutes"));
const AssetRoutes = lazy(() => import("@modules/assets/PrivateRoutes"));
const ScanRoutes = lazy(() => import("@modules/scan/PrivateRoutes"));
const CheckoutRoutes = lazy(() => import("@modules/checkout/PrivateRoutes"));
const TransferRoutes = lazy(() => import("@modules/transfers/PrivateRoutes"));
const MaintenanceRoutes = lazy(() => import("@modules/maintenance/PrivateRoutes"));
const NotificationRoutes = lazy(() => import("@modules/notifications/PrivateRoutes"));
const ReportRoutes = lazy(() => import("@modules/reports/PrivateRoutes"));
const DisposalRoutes = lazy(() => import("@modules/disposals/PrivateRoutes"));
const AuditTrailRoutes = lazy(() => import("@modules/audit-trail/PrivateRoutes"));
// const OrderRoutes = lazy(() => import("@modules/orders/PrivateRoutes"));
// const TrashRoutes = lazy(() => import("@modules/trash/PrivateRoutes"));
const ProfileRoutes = lazy(() => import("@modules/profile/ProfileRoutes"));
const SysparamRoutes = lazy(() => import("@modules/sysparam/PrivateRoutes"));

const PrivateRoutes: FC = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<Navigate to="/dashboard" />} />
      <Route element={<MasterLayout />}>
        <Route path="/users/*" element={<UserRoutes />} />
        <Route path="/privileges/*" element={<PrivilegeRoutes />} />
        <Route path="/roles/*" element={<RoleRoutes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/*" element={<ProductRoutes />} />
        <Route path="/suppliers/*" element={<SupplierRoutes />} />
        <Route path="/categories/*" element={<CategoryRoutes />} />
        <Route path="/locations/*" element={<LocationRoutes />} />
        <Route path="/departments/*" element={<DepartmentRoutes />} />
        <Route path="/assets/*" element={<AssetRoutes />} />
        <Route path="/checkouts/*" element={<CheckoutRoutes />} />
        <Route path="/transfers/*" element={<TransferRoutes />} />
        <Route path="/maintenance/*" element={<MaintenanceRoutes />} />
        <Route path="/notifications/*" element={<NotificationRoutes />} />
        <Route path="/reports/*" element={<ReportRoutes />} />
        <Route path="/disposals/*" element={<DisposalRoutes />} />
        <Route path="/audit-trail/*" element={<AuditTrailRoutes />} />
        <Route path="/scan" element={<ScanRoutes />} />
        <Route path="/examples/*" element={<ExampleRoutes />} />
        {/* <Route path="/orders/*" element={<OrderRoutes />} /> */}
        <Route path="/profile/*" element={<ProfileRoutes />} />
        <Route path="/sysparams/*" element={<SysparamRoutes />} />
      </Route>
      <Route path="*" element={<ErrorRoutes />} />
    </Routes>
  );
};

export default PrivateRoutes;