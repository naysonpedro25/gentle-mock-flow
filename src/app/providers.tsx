"use client";

import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { PrototypeProvider, usePrototype } from "@/components/prototype-state";

function ToastNotice() {
  const { toast } = usePrototype();

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-2 rounded-md border border-success/20 bg-card px-4 py-3 text-sm font-medium shadow-elevated"
    >
      <CheckCircle2 className="size-5 text-success" />
      {toast}
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PrototypeProvider>
      <ToastNotice />
      {children}
    </PrototypeProvider>
  );
}
