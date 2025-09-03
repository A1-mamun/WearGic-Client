import { DashboardHeader } from "@/components/modules/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/modules/dashboard/DashboardSidebar";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col md:ml-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
