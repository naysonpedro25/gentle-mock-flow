import { CaretRight, Question, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Question as StudentQuestion, StudentView } from "@/lib/mock-data";
import { EmptyState, PageHeader, StatCard, StatusMarker } from "@/components/shared-ui";

export function StudentDashboard({
  setView,
  questions,
}: {
  setView: (view: StudentView) => void;
  questions: StudentQuestion[];
}) {
  const mine = questions.filter((question) => question.author === "Você");

  return (
    <>
      <PageHeader
        eyebrow="Área do aluno"
        title="Olá, Gabriel!"
        text="Acompanhe suas dúvidas e encontre respostas rapidamente."
        action={
          <Button onClick={() => setView("nova")}>
            <Question aria-hidden="true" />
            Nova dúvida
          </Button>
        }
      />
      <div className="mb-9 grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatCard
          label="Dúvidas em aberto"
          value={String(mine.filter((question) => question.status !== "Respondida").length)}
          note="Acompanhamento em tempo real"
        />
        <StatCard
          label="Respondidas"
          value={String(mine.filter((question) => question.status === "Respondida").length)}
          note="No semestre atual"
        />
        <StatCard label="Próxima monitoria" value="Qua, 14h" note="Sala 12 · Bloco B" />
      </div>
      <section className="grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <div>
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-lg font-bold">Suas dúvidas recentes</h2>
              <p className="mt-1 text-sm text-muted-foreground">Últimas movimentações</p>
            </div>
            {mine.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setView("duvidas")}>
                Ver todas <CaretRight aria-hidden="true" />
              </Button>
            )}
          </div>
          {mine.length > 0 ? (
            <div className="divide-y divide-border">
              {mine.slice(0, 4).map((question) => (
                <div
                  key={question.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{question.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {question.subject} ·{" "}
                      {question.monitor ? `Monitor ${question.monitor}` : "Aguardando monitor"}
                    </p>
                  </div>
                  <StatusMarker status={question.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-5">
              <EmptyState
                title="Ainda não há dúvidas enviadas"
                text="Descreva o ponto em que travou para receber ajuda da monitoria."
              />
              <Button className="mt-4" onClick={() => setView("nova")}>
                <Question aria-hidden="true" />
                Enviar primeira dúvida
              </Button>
            </div>
          )}
        </div>
        <aside className="border-t-2 border-primary pt-4 lg:mt-1">
          <h2 className="font-display text-lg font-bold">Já pesquisou no acervo?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Respostas de semestres anteriores podem resolver a dúvida sem esperar um atendimento.
          </p>
          <Button
            variant="link"
            className="mt-3 h-auto justify-start px-0 py-2"
            onClick={() => setView("acervo")}
          >
            Buscar no acervo
            <MagnifyingGlass aria-hidden="true" />
          </Button>
        </aside>
      </section>
    </>
  );
}
