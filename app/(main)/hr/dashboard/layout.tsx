
import { AppSidebar } from "@/components/app-sidebar";
import { SideNav } from "./_components/SideNav";
import { Header } from "./_components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HRAppSidebar } from "../_components/hr-app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <HRAppSidebar variant="inset" />
        {children}
      </SidebarProvider>
    </div>
  );
}
