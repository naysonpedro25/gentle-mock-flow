"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChatText,
  MagnifyingGlass,
  Question,
  SquaresFour,
  SignOut,
  Tray,
  Users,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared-ui";
import { usePrototype } from "@/components/prototype-state";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navigation = {
  aluno: [
    { href: "/aluno", label: "Início", icon: SquaresFour },
    { href: "/aluno/acervo", label: "Acervo", icon: MagnifyingGlass },
    { href: "/aluno/nova-duvida", label: "Nova dúvida", icon: Question },
    { href: "/aluno/duvidas", label: "Minhas dúvidas", icon: ChatText },
    { href: "/aluno/aulas", label: "Aulas", icon: Users },
  ],
  monitor: [
    { href: "/monitor", label: "Início", icon: SquaresFour },
    { href: "/monitor/fila", label: "Fila", icon: Tray },
    { href: "/monitor/aulas", label: "Aulas", icon: Users },
  ],
};

export function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  const { role: signedInRole, signOut } = usePrototype();
  const router = useRouter();
  const pathname = usePathname();
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
  const description = role === "aluno" ? "Aluno · Computação" : "Monitor · Algoritmos";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-3 focus:text-foreground"
      >
        Ir para o conteúdo
      </a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Brand compact />
        <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
          <SignOut aria-hidden="true" />
          Sair
        </Button>
      </header>
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card px-5 py-7 lg:flex">
          <Brand />
          <div className="mb-7 mt-12 border-b border-border pb-5">
            <p className="font-semibold">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
                    "h-11 w-full justify-start rounded-none border-l-2 border-transparent px-3 text-muted-foreground",
                    active && "border-primary bg-transparent font-semibold text-primary",
                  )}
                >
                  <Link href={item.href} aria-current={active ? "page" : undefined}>
                    <Icon size={19} weight="regular" aria-hidden="true" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
          <Button
            variant="ghost"
            onClick={logout}
            className="h-11 justify-start rounded-none border-t border-border pt-4 text-muted-foreground hover:text-foreground"
          >
            <SignOut size={19} weight="regular" aria-hidden="true" />
            Sair da conta
          </Button>
        </aside>
        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 pb-28 pt-7 lg:ml-64 lg:px-10 lg:py-9 lg:pb-9"
        >
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <nav
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-card lg:hidden"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        aria-label="Navegação principal"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 border-t-2 border-transparent px-1 text-[0.68rem] font-medium text-muted-foreground",
                active && "border-primary text-primary",
              )}
            >
              <Icon size={20} weight={active ? "fill" : "regular"} aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
