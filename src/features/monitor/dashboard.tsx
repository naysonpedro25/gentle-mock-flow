import { CheckCircle2, ChevronRight, Inbox, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonitorView, Question } from "@/lib/mock-data";
import { PageHeader, StatCard } from "@/components/shared-ui";

export function MonitorDashboard({
  setView,
  questions,
}: {
  setView: (v: MonitorView) => void;
  questions: Question[];
}) {
  const mine = questions.filter((q) => q.monitor === "Carlos" && q.status !== "Respondida");
  return (
    <>
      <PageHeader
        eyebrow="Área do monitor"
        title="Olá, Carlos!"
        text="Veja sua carga de atendimento e os itens que precisam de atenção."
        action={
          <Button onClick={() => setView("fila")}>
            <Inbox />
            Abrir fila
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Inbox}
          label="Atribuídas a você"
          value={String(mine.length)}
          note="1 nova desde ontem"
        />
        <StatCard icon={CheckCircle2} label="Respondidas" value="24" note="Neste semestre" />
        <StatCard
          icon={TrendingUp}
          label="Carga atual"
          value={mine.length <= 3 ? "Leve" : "Moderada"}
          note="Distribuição equilibrada"
        />
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-display text-lg font-bold">Próximos atendimentos</h2>
              <p className="text-sm text-muted-foreground">Sua fila por ordem de chegada</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("fila")}>
              Ver fila <ChevronRight />
            </Button>
          </div>
          <div className="divide-y">
            {mine.slice(0, 3).map((q) => (
              <div key={q.id} className="flex items-center gap-4 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-sm font-bold text-primary">
                  {q.author?.[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{q.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.author} • {q.subject} • {q.time}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-warning/25 bg-warning-soft p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-warning/15 text-warning">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase text-warning">Tópico frequente detectado</p>
              <h2 className="mt-1 font-display text-lg font-bold">Recursão</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            4 alunos enviaram dúvidas sobre o mesmo tema nos últimos dias.
          </p>
          <Button
            variant="outline"
            className="mt-5 w-full bg-card"
            onClick={() => setView("aulas")}
          >
            <Users />
            Criar aula coletiva
          </Button>
        </section>
      </div>
    </>
  );
}
