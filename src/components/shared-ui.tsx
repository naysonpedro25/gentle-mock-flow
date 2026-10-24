import { BookOpen, CaretRight, GraduationCap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { QuestionStatus, Role } from "@/lib/mock-data";

export function StatusMarker({ status }: { status: QuestionStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          status === "Respondida" && "bg-success",
          status === "Em atendimento" && "bg-info",
          status === "Pendente" && "bg-warning",
        )}
      />
      <span>{status}</span>
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-y border-border py-8">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export function Brand({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className={cn("flex items-baseline gap-2", compact && "ml-2")}>
      <p className="font-display text-lg font-bold leading-none">Monitora</p>
      <span
        className={cn(
          "text-sm font-semibold tracking-wide",
          inverted ? "text-primary-foreground" : "text-primary",
        )}
      >
        IC
      </span>
      {!compact && (
        <p
          className={cn(
            "ml-1 text-xs",
            inverted ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          Monitoria acadêmica
        </p>
      )}
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
        <Brand inverted />
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-[-0.035em]">
            Aprender também é saber perguntar.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-primary-foreground/85">
            Um espaço comum para alunos e monitores transformarem dúvidas em respostas que ficam.
          </p>
          <div className="mt-16 border-t border-primary-foreground/25 pt-5">
            <p className="text-sm font-medium text-primary-foreground/75">
              Da dúvida ao próximo passo
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
              <span>Pergunta</span>
              <span aria-hidden="true" className="h-px flex-1 bg-primary-foreground/40" />
              <span>Monitoria</span>
              <span aria-hidden="true" className="h-px flex-1 bg-primary-foreground/40" />
              <span>Resposta</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-primary-foreground/65">Instituto de Computação · UFAL</p>
      </section>
      <section className="flex items-center justify-center bg-background px-5 py-10">
        <form
          className="w-full max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          <div className="mb-9 lg:hidden">
            <Brand />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em]">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu e-mail institucional para continuar.
          </p>
          <div className="mt-8">
            <label className="mb-2 block text-sm font-semibold" htmlFor="email">
              E-mail institucional
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu.nome@ic.ufal.br"
              className="h-12 bg-card"
            />
            {error && (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <fieldset className="mt-7">
            <legend className="mb-2 text-sm font-semibold">Como você deseja entrar?</legend>
            <div className="divide-y divide-border border-y border-border">
              {(["aluno", "monitor"] as Role[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedRole(option)}
                  className={cn(
                    "flex min-h-16 w-full items-center gap-3 px-2 text-left",
                    selectedRole === option ? "text-primary" : "text-foreground hover:text-primary",
                  )}
                  aria-pressed={selectedRole === option}
                >
                  <span className="w-6" aria-hidden="true">
                    {option === "aluno" ? (
                      <GraduationCap className="size-5" weight="regular" />
                    ) : (
                      <BookOpen className="size-5" weight="regular" />
                    )}
                  </span>
                  <span className="flex-1">
                    <strong className="block capitalize">{option}</strong>
                    <small className="text-muted-foreground">
                      {option === "aluno" ? "Tirar dúvidas" : "Atender alunos"}
                    </small>
                  </span>
                  <span className="text-xs font-semibold">
                    {selectedRole === option ? "Selecionado" : ""}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <Button type="submit" className="mt-7 h-12 w-full">
            Entrar como {selectedRole}
            <CaretRight aria-hidden="true" />
          </Button>
          <div className="mt-8 border-t border-border pt-4">
            <p className="text-sm font-semibold">Ou preencher uma conta de demonstração</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              <Button
                type="button"
                variant="link"
                className="h-auto justify-start px-0 py-1"
                onClick={() => selectDemoRole("aluno")}
              >
                Usar conta de aluno
              </Button>
              <Button
                type="button"
                variant="link"
                className="h-auto justify-start px-0 py-1"
                onClick={() => selectDemoRole("monitor")}
              >
                Usar conta de monitor
              </Button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export function PageHeader({
  title,
  text,
  action,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em]">{title}</h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="py-4 sm:px-5 sm:first:pl-0 sm:last:pr-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums tracking-[-0.03em]">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
