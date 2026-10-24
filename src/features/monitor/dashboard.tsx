import { CaretRight, CheckCircle, Tray, TrendUp, Users } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { MonitorView, Question } from "@/lib/mock-data";
import { PageHeader, StatCard } from "@/components/shared-ui";

export function MonitorDashboard({
  setView,
  questions,
}: {
  setView: (view: MonitorView) => void;
  questions: Question[];
}) {
  const mine = questions.filter(
    (question) => question.monitor === "Carlos" && question.status !== "Respondida",
  );

  return (
    <>
      <PageHeader
        eyebrow="Área do monitor"
        title="Olá, Carlos!"
        text="Veja sua carga de atendimento e os itens que precisam de atenção."
        action={
          <Button onClick={() => setView("fila")}>
            <Tray aria-hidden="true" />
            Abrir fila
          </Button>
        }
      />
      <div className="mb-9 grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatCard label="Atribuídas a você" value={String(mine.length)} note="1 nova desde ontem" />
        <StatCard label="Respondidas" value="24" note="Neste semestre" />
        <StatCard
          label="Carga atual"
          value={mine.length <= 3 ? "Leve" : "Moderada"}
          note="Distribuição equilibrada"
        />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <section>
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-lg font-bold">Próximos atendimentos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sua fila por ordem de chegada</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("fila")}>
              Ver fila <CaretRight aria-hidden="true" />
            </Button>
          </div>
          {mine.length ? (
            <div className="divide-y divide-border">
              {mine.slice(0, 3).map((question) => (
                <div key={question.id} className="flex items-center gap-4 py-4">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-sm font-semibold"
                  >
                    {question.author?.[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{question.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {question.author} · {question.subject} · {question.time}
                    </p>
                  </div>
                  <CaretRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-5">
              <p className="font-semibold">Sua fila está em dia</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Novas dúvidas atribuídas a você aparecerão aqui.
              </p>
            </div>
          )}
        </section>
        <aside className="border-t-2 border-warning pt-4 lg:mt-1">
          <p className="text-sm font-medium text-warning">Tema recorrente</p>
          <h2 className="mt-2 font-display text-xl font-bold">Recursão</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Quatro alunos perguntaram sobre esse assunto nos últimos dias.
          </p>
          <Button
            variant="link"
            className="mt-3 h-auto justify-start px-0 py-2"
            onClick={() => setView("aulas")}
          >
            <Users aria-hidden="true" />
            Criar aula coletiva
          </Button>
          <p className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <CheckCircle aria-hidden="true" />
            Uma aula pode reunir dúvidas semelhantes
            <TrendUp className="ml-auto" aria-hidden="true" />
          </p>
        </aside>
      </div>
    </>
  );
}
