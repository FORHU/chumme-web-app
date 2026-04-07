import type { ReactNode } from "react";

import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout";
import { RouteGuard } from "@/modules/shared/components/RouteGuard";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <RouteGuard>
    <DashboardLayout>{children}</DashboardLayout>
  </RouteGuard>
);

export default Layout;
