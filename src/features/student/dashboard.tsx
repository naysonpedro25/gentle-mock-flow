import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Lightbulb,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question, StudentView } from "@/lib/mock-data";
import { PageHeader, StatCard, StatusBadge } from "@/components/shared-ui";

export function StudentDashboard({
  setView,
  questions,
}: {
  setView: (v: StudentView) => void;
  questions: Question[];
}) {
  const mine = questions.filter((q) => q.author === "Você");
  return (
    <>
      <PageHeader
        eyebrow="Área do aluno"
        title="Olá, Gabriel!"
        text="Acompanhe suas dúvidas e encontre respostas rapidamente."
        action={
          <Button onClick={() => setView("nova")}>
            <CircleHelp />
            Nova dúvida
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Clock3}
          label="Dúvidas em aberto"
          value={String(mine.filter((q) => q.status !== "Respondida").length)}
          note="Acompanhamento em tempo real"
        />
        <StatCard
          icon={CheckCircle2}
          label="Respondidas"
          value={String(mine.filter((q) => q.status === "Respondida").length)}
          note="No semestre atual"
        />
        <StatCard
          icon={CalendarCheck}
          label="Próxima monitoria"
          value="Qua, 14h"
          note="Sala 12 • Bloco B"
        />
      </div>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-display text-lg font-bold">Suas dúvidas recentes</h2>
              <p className="text-sm text-muted-foreground">Últimas movimentações</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("duvidas")}>
              Ver todas <ChevronRight />
            </Button>
          </div>
          <div className="divide-y">
            {mine.map((q) => (
              <div
                key={q.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{q.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.subject} • {q.monitor ? `Monitor ${q.monitor}` : "Aguardando monitor"}
                  </p>
                </div>
                <StatusBadge status={q.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-primary-soft p-5">
          <Lightbulb className="size-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-bold">Antes de perguntar</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O acervo reúne respostas de semestres anteriores. Sua dúvida pode já estar resolvida por
            lá.
          </p>
          <Button
            variant="outline"
            className="mt-5 w-full bg-card"
            onClick={() => setView("acervo")}
          >
            <Search />
            Buscar no acervo
          </Button>
        </div>
      </section>
    </>
  );
}
