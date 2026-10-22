import type { ReactNode } from "react";
import { RoleLayout } from "@/components/role-layout";

export default function MonitorLayout({ children }: { children: ReactNode }) {
  return <RoleLayout role="monitor">{children}</RoleLayout>;
}
