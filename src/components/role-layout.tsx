"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CircleHelp,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared-ui";
import { usePrototype } from "@/components/prototype-state";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navigation = {
  aluno: [
    { href: "/aluno", label: "Visão geral", icon: LayoutDashboard },
    { href: "/aluno/acervo", label: "Buscar no acervo", icon: Search },
    { href: "/aluno/nova-duvida", label: "Nova dúvida", icon: CircleHelp },
    { href: "/aluno/duvidas", label: "Minhas dúvidas", icon: MessageSquareText },
    { href: "/aluno/aulas", label: "Aulas coletivas", icon: Users },
  ],
  monitor: [
    { href: "/monitor", label: "Visão geral", icon: LayoutDashboard },
    { href: "/monitor/fila", label: "Fila de atendimento", icon: Inbox },
    { href: "/monitor/aulas", label: "Aulas coletivas", icon: Users },
  ],
};

export function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  const { role: signedInRole, signOut } = usePrototype();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (signedInRole !== role) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [role, router, signedInRole]);

  const logout = () => {
    signOut();
    router.replace("/login");
  };

  if (!authorized || signedInRole !== role) return null;

  const navItems = navigation[role];
  const name = role === "aluno" ? "Gabriel Souza" : "Carlos Lima";
  const description = role === "aluno" ? "Aluno • Computação" : "Monitor • Algoritmos";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card/95 px-4 backdrop-blur lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenu((open) => !open)}
          aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenu ? <X /> : <Menu />}
        </Button>
        <Brand compact />
      </header>
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card p-5 transition-transform lg:translate-x-0",
            mobileMenu ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Brand />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenu(false)}
              aria-label="Fechar menu"
            >
              <X />
            </Button>
          </div>
          <div className="mb-6 rounded-md bg-primary-soft p-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <UserRound className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1" aria-label="Menu principal">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "h-11 w-full justify-start px-3",
                    active && "bg-primary-soft text-primary hover:bg-primary-soft",
                  )}
                >
                  <Link href={item.href} onClick={() => setMobileMenu(false)}>
                    <Icon />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut />
              Sair da conta
            </Button>
          </div>
        </aside>
        {mobileMenu && (
          <button
            className="fixed inset-0 z-30 bg-overlay lg:hidden"
            onClick={() => setMobileMenu(false)}
            aria-label="Fechar menu"
          />
        )}
        <main className="min-w-0 flex-1 px-4 py-7 lg:ml-72 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
