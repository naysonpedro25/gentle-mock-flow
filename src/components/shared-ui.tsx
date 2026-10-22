import { BookOpen, ChevronRight, GraduationCap, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Role, QuestionStatus } from "@/lib/mock-data";
export function StatusBadge({ status }: { status: QuestionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "Respondida" && "bg-success-soft text-success",
        status === "Em atendimento" && "bg-info-soft text-info",
        status === "Pendente" && "bg-warning-soft text-warning",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <Inbox className="mx-auto size-8 text-muted-foreground/60" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "ml-2")}>
      <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="size-5" />
      </div>
      <div>
        <p className="font-display text-lg font-bold leading-none">Monitora IC</p>
        {!compact && (
          <p className="mt-1 text-xs text-primary-foreground/80 ">Central de monitoria</p>
        )}
      </div>
    </div>
  );
}

export function LoginScreen({
  email,
  setEmail,
  selectedRole,
  setSelectedRole,
  error,
  onLogin,
}: {
  email: string;
  setEmail: (v: string) => void;
  selectedRole: Role;
  setSelectedRole: (v: Role) => void;
  error: string;
  onLogin: () => void;
}) {
  const selectDemoRole = (role: Role) => {
    setSelectedRole(role);
    setEmail(role === "aluno" ? "aluno@ic.ufal.br" : "monitor@ic.ufal.br");
  };
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-primary px-14 py-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-5xl font-bold leading-tight">
            Conhecimento compartilhado, dúvidas resolvidas.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Um espaço para aproximar alunos e monitores e transformar cada resposta em aprendizado
            para toda a comunidade.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-7"></div>
      </section>
      <section className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden">
            <Brand />
          </div>
          <p className="text-sm font-semibold text-primary">Bem-vindo de volta</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu e-mail institucional para continuar.
          </p>
          <div className="mt-8">
            <label className="mb-2 block text-sm font-semibold" htmlFor="email">
              E-mail institucional
            </label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.nome@ic.ufal.br"
              className="h-11 bg-card"
              onKeyDown={(e) => e.key === "Enter" && onLogin()}
            />
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold">Como você deseja entrar?</legend>
            <div className="grid grid-cols-2 gap-3">
              {(["aluno", "monitor"] as Role[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedRole(option)}
                  className={cn(
                    "flex h-20 items-center gap-3 rounded-md border bg-card px-4 text-left transition-all",
                    selectedRole === option
                      ? "border-primary ring-2 ring-primary/10"
                      : "hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-md",
                      selectedRole === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {option === "aluno" ? (
                      <GraduationCap className="size-5" />
                    ) : (
                      <BookOpen className="size-5" />
                    )}
                  </span>
                  <span>
                    <strong className="block capitalize">{option}</strong>
                    <small className="text-muted-foreground">
                      {option === "aluno" ? "Tirar dúvidas" : "Atender alunos"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <Button onClick={onLogin} className="mt-7 h-11 w-full">
            Entrar <ChevronRight />
          </Button>
          <div className="mt-8 rounded-md border bg-card p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Acesso de demonstração
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button variant="outline" size="sm" onClick={() => selectDemoRole("aluno")}>
                Usar conta de aluno
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectDemoRole("monitor")}>
                Usar conta de monitor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Inbox;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
